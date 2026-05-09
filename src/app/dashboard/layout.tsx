'use client'

import { useRequireAuth } from '../modules/auth/hooks/useRequireAuth'
import DashboardShell from '../modules/dashboard/components/DashboardShell'


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useRequireAuth()

  return (
    <DashboardShell companyName="Mi Negocio">
      {children}
    </DashboardShell>
  )
}