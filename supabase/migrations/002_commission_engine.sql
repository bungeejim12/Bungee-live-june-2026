-- Bungee Automated Commission Decay Engine
-- ------------------------------------------------------------------
-- Backend financial infrastructure that sits on top of Stripe Connect.
-- Stripe only moves money; THIS schema + the app engine own the 18-month
-- timeline, the tiered decay math, the immutable ledger, and clawbacks.

-- ---- Referral relationship ---------------------------------------
-- Created here (idempotently) so the commission engine is self-contained even
-- if the base referral migration has not been applied to this database.
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_user_id uuid not null references public.profiles(id) on delete cascade,
  referral_code text not null,
  channel text not null default 'link' check (channel in ('link', 'sms', 'email')),
  created_at timestamptz default now(),
  unique (referred_user_id)
);

-- ---- Referral commission fields ----------------------------------
-- Per spec: referrals must track when the residual clock starts and whether
-- the relationship is still earning.
alter table public.referrals
  add column if not exists referral_start_date timestamptz default now();
alter table public.referrals
  add column if not exists status text not null default 'active'
    check (status in ('active', 'paused', 'terminated'));

-- Backfill the residual clock from the original signup time.
update public.referrals
  set referral_start_date = coalesce(referral_start_date, created_at, now())
  where referral_start_date is null;

-- Destination account for Stripe Connect residual transfers.
alter table public.profiles
  add column if not exists stripe_connect_account_id text;

-- ---- Adjustable engine configuration -----------------------------
-- Single source of truth for the decay schedule. The Configuration settings
-- page edits this row; the engine reads it on every calculation. Nothing is
-- hardcoded in the money path.
create table if not exists public.commission_config (
  id integer primary key default 1,
  service_fee_rate numeric(6, 4) not null default 0.3000, -- 30% corporate fee
  window_months integer not null default 18,
  tiers jsonb not null default '[
    {"label": "Months 1-6",   "startMonth": 1,  "endMonth": 6,  "rate": 0.1},
    {"label": "Months 7-12",  "startMonth": 7,  "endMonth": 12, "rate": 0.065},
    {"label": "Months 13-18", "startMonth": 13, "endMonth": 18, "rate": 0.03}
  ]'::jsonb,
  updated_at timestamptz default now(),
  constraint commission_config_singleton check (id = 1)
);

insert into public.commission_config (id) values (1)
  on conflict (id) do nothing;

-- ---- Immutable commission ledger ---------------------------------
-- Every fee-bearing transaction and every clawback writes a permanent row.
-- This is the financial paper trail used for disputes and reconciliation.
create table if not exists public.commission_ledger (
  id uuid primary key default gen_random_uuid(),
  transaction_id text not null,
  referral_id uuid references public.referrals(id) on delete set null,
  recipient_id uuid references public.profiles(id) on delete set null, -- Bungee receiving the residual
  referred_id uuid references public.profiles(id) on delete set null,  -- account whose activity generated the fee
  gross_payout_amount numeric(12, 2) not null,   -- worker payout (gross)
  service_fee_collected numeric(12, 2) not null, -- 30% of gross
  commission_rate numeric(6, 4) not null,        -- tier rate applied to the service fee
  tier_label text,
  referral_month integer,                        -- 1-based account tenure at txn time
  commission_applied numeric(12, 2) not null,    -- residual amount (negative on clawback)
  entry_type text not null default 'commission'
    check (entry_type in ('commission', 'clawback')),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'reversed', 'failed', 'skipped')),
  stripe_transfer_id text,
  reverses_entry_id uuid references public.commission_ledger(id) on delete set null,
  notes text,
  created_at timestamptz default now()
);

create index if not exists commission_ledger_txn_idx on public.commission_ledger(transaction_id);
create index if not exists commission_ledger_recipient_idx on public.commission_ledger(recipient_id);
create index if not exists commission_ledger_referred_idx on public.commission_ledger(referred_id);

-- Ensure the shared updated_at helper exists (idempotent).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Keep config.updated_at fresh.
drop trigger if exists commission_config_updated_at on public.commission_config;
create trigger commission_config_updated_at
  before update on public.commission_config
  for each row execute function public.set_updated_at();

-- ---- RLS ---------------------------------------------------------
alter table public.referrals enable row level security;
alter table public.commission_config enable row level security;
alter table public.commission_ledger enable row level security;

drop policy if exists "Users can read own referrals" on public.referrals;
create policy "Users can read own referrals"
  on public.referrals for select
  using (auth.uid() = referrer_id or auth.uid() = referred_user_id);

drop policy if exists "Users can insert referrals as referrer" on public.referrals;
create policy "Users can insert referrals as referrer"
  on public.referrals for insert
  with check (auth.uid() = referrer_id);

-- Config is read-only to authenticated users (so dashboards can show the
-- live schedule); writes happen via the service role only.
drop policy if exists "Anyone authed can read commission config" on public.commission_config;
create policy "Anyone authed can read commission config"
  on public.commission_config for select
  using (true);

-- A Bungee can read the ledger entries where they are the residual recipient.
drop policy if exists "Recipients can read own commission ledger" on public.commission_ledger;
create policy "Recipients can read own commission ledger"
  on public.commission_ledger for select
  using (auth.uid() = recipient_id);

-- All inserts/updates to the ledger and config flow through the service role,
-- which bypasses RLS. No client-side write policies are defined on purpose.
