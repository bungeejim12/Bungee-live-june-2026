import { redirect } from "next/navigation"

export default function DashboardPage() {
  // Demo mode - default redirect to bungee dashboard
  redirect("/dashboard/bungee")
}
