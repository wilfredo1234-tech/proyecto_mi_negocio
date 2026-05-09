'use client'
import { Bell, LogOut } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ChevronRight } from 'lucide-react'

const LABELS: Record<string, string> = {
  'dashboard':     'Dashboard',
  'productos':     'Productos',
  'categorias':    'Categorías',
  'inventario':    'Inventario',
  'ventas':        'Ventas',
  'clientes':      'Clientes',
  'deudas':        'Deudas',
  'pedidos':       'Pedidos',
  'gastos':        'Gastos',
  'prestamos':     'Préstamos',
  'configuracion': 'Configuración',
  'nueva':         'Nueva',
  'nuevo':         'Nuevo',
}

function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const crumbs = segments.slice(1).map(seg => LABELS[seg] ?? seg)

  if (crumbs.length === 0) {
    return <span className="text-sm font-semibold text-gray-900">Dashboard</span>
  }

  return (
    <div className="flex items-center gap-1.5">
      {crumbs.map((crumb, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={14} className="text-gray-300" />}
          <span className={`text-sm ${
            i === crumbs.length - 1
              ? 'font-semibold text-gray-900'
              : 'font-medium text-gray-400'
          }`}>
            {crumb}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Header({ companyName = 'Mi Negocio' }: { companyName?: string }) {
  const router = useRouter()

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.refresh()
  router.push('/login')
}

  return (
    <header className="
      fixed top-0 right-0 z-20 h-16
      left-0 md:left-16 lg:left-56
      bg-white border-b border-gray-100
      flex items-center justify-between
      px-4 lg:px-8
      transition-all duration-300
    ">
      <Breadcrumbs />

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Bell size={18} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-medium">A</span>
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-medium text-gray-900">{companyName}</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}