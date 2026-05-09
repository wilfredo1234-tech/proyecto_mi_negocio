import Sidebar from './layout/Sidebar'
import BottomNav from './layout/BottomNav'
import Header from './layout/Header'

export default function DashboardShell({
  children,
  companyName
}: {
  children: React.ReactNode
  companyName?: string
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header companyName={companyName} />

      <main className="
        pt-16 pb-20 md:pb-6
        md:ml-16 lg:ml-56
        transition-all duration-300
      ">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}