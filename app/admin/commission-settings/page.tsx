import { CommissionConfigDashboard } from "@/components/commission-config-dashboard"

export const metadata = {
  title: "Commission Engine Settings | Bungee",
  description: "Adjustable configuration for the automated 18-month commission decay engine.",
}

export default function CommissionSettingsPage() {
  return <CommissionConfigDashboard />
}
