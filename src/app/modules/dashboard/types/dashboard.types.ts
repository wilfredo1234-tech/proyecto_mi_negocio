export type NavItem = {
  label: string
  href: string
  icon: string
  children?: NavItem[]
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',     href: '/dashboard',                icon: 'home' },
  {
    label: 'Productos',     href: '/dashboard/productos',      icon: 'package',
    children: [
      { label: 'Categorías', href: '/dashboard/categorias',   icon: 'tag' },
      { label: 'Inventario', href: '/dashboard/inventario',   icon: 'bar-chart' },
    ]
  },
  { label: 'Ventas',        href: '/dashboard/ventas',         icon: 'dollar-sign' },
  { label: 'Clientes',      href: '/dashboard/clientes',       icon: 'users' },
  { label: 'Deudas',        href: '/dashboard/deudas',         icon: 'wallet' },
  { label: 'Pedidos',       href: '/dashboard/pedidos',        icon: 'file-text' },
  { label: 'Gastos',        href: '/dashboard/gastos',         icon: 'trending-down' },
  { label: 'Préstamos',     href: '/dashboard/prestamos',      icon: 'landmark' },
  { label: 'Configuración', href: '/dashboard/configuracion',  icon: 'settings' },
]