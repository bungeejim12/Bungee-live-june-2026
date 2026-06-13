"use client"

import { TrendingUp, TrendingDown, DollarSign, Target, Users, ShoppingBag } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

interface BusinessAnalyticsProps {
  isDemo: boolean
}

// Demo data — only shown in demo mode; new businesses see an empty state.
const revenueData = [
  { month: "Jan", revenue: 4200, bounties: 1800 },
  { month: "Feb", revenue: 5100, bounties: 2100 },
  { month: "Mar", revenue: 4800, bounties: 1950 },
  { month: "Apr", revenue: 6300, bounties: 2600 },
  { month: "May", revenue: 7450, bounties: 3100 },
  { month: "Jun", revenue: 8900, bounties: 3650 },
]

const channelData = [
  { channel: "Hiring", referrals: 42 },
  { channel: "Services", referrals: 31 },
  { channel: "Products", referrals: 58 },
  { channel: "Veteran Pool", referrals: 19 },
]

const revenueConfig = {
  revenue: { label: "Revenue", color: "#FF8C00" },
  bounties: { label: "Bounties Paid", color: "#10b981" },
} satisfies ChartConfig

const channelConfig = {
  referrals: { label: "Referrals", color: "#FF8C00" },
} satisfies ChartConfig

function KpiCard({
  label,
  value,
  delta,
  positive,
  icon: Icon,
  iconClass,
}: {
  label: string
  value: string
  delta: string
  positive: boolean
  icon: React.ElementType
  iconClass: string
}) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`size-9 rounded-lg flex items-center justify-center ${iconClass}`}>
          <Icon className="size-[18px]" />
        </div>
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
            positive ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {positive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
          {delta}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}

export default function BusinessAnalytics({ isDemo }: BusinessAnalyticsProps) {
  if (!isDemo) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6">
        <div className="size-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-4">
          <BarChart3Icon />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No analytics yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs text-pretty">
          Launch your first campaign and your referral revenue, conversion, and channel performance will show up here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Total Revenue"
          value="$36.7k"
          delta="+19%"
          positive
          icon={DollarSign}
          iconClass="bg-orange-50 dark:bg-orange-900/20 text-[#FF8C00]"
        />
        <KpiCard
          label="Bounty Conversion"
          value="41%"
          delta="+6%"
          positive
          icon={Target}
          iconClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
        />
        <KpiCard
          label="Active Referrers"
          value="128"
          delta="+12"
          positive
          icon={Users}
          iconClass="bg-blue-50 dark:bg-blue-900/20 text-blue-600"
        />
        <KpiCard
          label="Avg. Order Value"
          value="$284"
          delta="-3%"
          positive={false}
          icon={ShoppingBag}
          iconClass="bg-purple-50 dark:bg-purple-900/20 text-purple-600"
        />
      </div>

      {/* Revenue Trend */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Revenue & Bounties</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Last 6 months</p>
        </div>
        <ChartContainer config={revenueConfig} className="h-[220px] w-full">
          <AreaChart data={revenueData} margin={{ left: 4, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.7} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillBounties" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-bounties)" stopOpacity={0.7} />
                <stop offset="95%" stopColor="var(--color-bounties)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} width={36} fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="revenue"
              type="monotone"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
            <Area
              dataKey="bounties"
              type="monotone"
              fill="url(#fillBounties)"
              stroke="var(--color-bounties)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
        <div className="flex items-center justify-center gap-5 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <span className="size-2.5 rounded-full bg-[#FF8C00]" /> Revenue
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <span className="size-2.5 rounded-full bg-emerald-500" /> Bounties Paid
          </span>
        </div>
      </div>

      {/* Referrals by Channel */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Referrals by Channel</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Where your conversions come from</p>
        </div>
        <ChartContainer config={channelConfig} className="h-[200px] w-full">
          <BarChart data={channelData} margin={{ left: 4, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="channel" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} width={28} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="referrals" fill="var(--color-referrals)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}

function BarChart3Icon() {
  return (
    <svg
      className="size-6 text-[#FF8C00]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  )
}
