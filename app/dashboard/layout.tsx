export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Demo mode - no auth check, allow everyone
  return <>{children}</>
}
