import DashboardShell from "./components/DashboardShell";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell companyName="Mi Negocio">
      {children}
    </DashboardShell>
  )
}