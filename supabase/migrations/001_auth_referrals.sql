-- Bungee auth + referral schema

-- Referral code generator
create or replace function public.generate_referral_code()
returns text
language plpgsql
as $$
declare
  new_code text;
  code_exists boolean;
begin
  loop
    new_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    select exists(select 1 from public.profiles where referral_code = new_code) into code_exists;
    exit when not code_exists;
  end loop;
  return new_code;
end;
$$;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  first_name text,
  last_name text,
  business_name text,
  user_type text check (user_type in ('bungee', 'business')),
  referral_code text unique,
  referred_by uuid references public.profiles(id) on delete set null,
  phone_verified boolean default false,
  tax_verified boolean default false,
  business_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles add column if not exists referral_code text;
alter table public.profiles add column if not exists referred_by uuid references public.profiles(id) on delete set null;
alter table public.profiles add column if not exists phone_verified boolean default false;
alter table public.profiles add column if not exists tax_verified boolean default false;
alter table public.profiles add column if not exists business_verified boolean default false;
alter table public.profiles add column if not exists created_at timestamptz default now();
alter table public.profiles add column if not exists updated_at timestamptz default now();

create unique index if not exists profiles_referral_code_idx on public.profiles(referral_code);

-- Referral tracking (user-to-user invites)
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_user_id uuid not null references public.profiles(id) on delete cascade,
  referral_code text not null,
  channel text not null default 'link' check (channel in ('link', 'sms', 'email')),
  created_at timestamptz default now(),
  unique (referred_user_id)
);

-- Campaign referral landing tables (referenced by app/refer/[id])
create table if not exists public.referral_visits (
  id uuid primary key default gen_random_uuid(),
  campaign_id text not null,
  visitor_id text,
  originator_id text,
  referrer_id text,
  visited_at timestamptz default now(),
  user_agent text,
  chain_depth integer default 0
);

create table if not exists public.referral_shares (
  id uuid primary key default gen_random_uuid(),
  campaign_id text not null,
  sharer_id text,
  originator_id text,
  share_url text,
  shared_at timestamptz default now()
);

create table if not exists public.campaign_applicants (
  id uuid primary key default gen_random_uuid(),
  campaign_id text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  visitor_id text,
  originator_id text,
  referrer_id text,
  applied_at timestamptz default now(),
  status text default 'pending'
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    phone,
    first_name,
    last_name,
    business_name,
    user_type,
    referral_code,
    phone_verified
  )
  values (
    new.id,
    new.email,
    new.phone,
    coalesce(new.raw_user_meta_data->>'first_name', null),
    coalesce(new.raw_user_meta_data->>'last_name', null),
    coalesce(new.raw_user_meta_data->>'business_name', null),
    coalesce(new.raw_user_meta_data->>'user_type', 'bungee'),
    public.generate_referral_code(),
    coalesce((new.phone_confirmed_at is not null), false)
  )
  on conflict (id) do update set
    email = excluded.email,
    phone = excluded.phone,
    first_name = coalesce(excluded.first_name, public.profiles.first_name),
    last_name = coalesce(excluded.last_name, public.profiles.last_name),
    business_name = coalesce(excluded.business_name, public.profiles.business_name),
    user_type = coalesce(excluded.user_type, public.profiles.user_type),
    phone_verified = excluded.phone_verified,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.referrals enable row level security;
alter table public.referral_visits enable row level security;
alter table public.referral_shares enable row level security;
alter table public.campaign_applicants enable row level security;

-- Profiles: users manage own row; public can read referrer display fields by code
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Public can read referrer by code" on public.profiles;
create policy "Public can read referrer by code"
  on public.profiles for select
  using (referral_code is not null);

-- Referrals
drop policy if exists "Users can read own referrals" on public.referrals;
create policy "Users can read own referrals"
  on public.referrals for select
  using (auth.uid() = referrer_id or auth.uid() = referred_user_id);

drop policy if exists "Users can insert referrals as referrer" on public.referrals;
create policy "Users can insert referrals as referrer"
  on public.referrals for insert
  with check (auth.uid() = referrer_id);

-- Campaign tracking: anon insert
drop policy if exists "Anyone can log referral visits" on public.referral_visits;
create policy "Anyone can log referral visits"
  on public.referral_visits for insert
  with check (true);

drop policy if exists "Anyone can log referral shares" on public.referral_shares;
create policy "Anyone can log referral shares"
  on public.referral_shares for insert
  with check (true);

drop policy if exists "Anyone can submit campaign applications" on public.campaign_applicants;
create policy "Anyone can submit campaign applications"
  on public.campaign_applicants for insert
  with check (true);

-- Lookup referrer by code (for invite landing)
create or replace function public.get_referrer_by_code(code text)
returns table (
  id uuid,
  first_name text,
  last_name text,
  user_type text,
  referral_code text
)
language sql
security definer
set search_path = public
stable
as $$
  select p.id, p.first_name, p.last_name, p.user_type, p.referral_code
  from public.profiles p
  where p.referral_code = upper(trim(code))
  limit 1;
$$;

grant execute on function public.get_referrer_by_code(text) to anon, authenticated;
grant execute on function public.generate_referral_code() to service_role, authenticated;
