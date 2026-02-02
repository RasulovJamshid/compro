import RoleGuard from '@/components/auth/RoleGuard'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={['admin', 'moderator']}>
      <div className="flex h-screen overflow-hidden bg-secondary-50">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </RoleGuard>
  )
}
