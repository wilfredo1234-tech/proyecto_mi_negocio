'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '../../types/dashboard.types'
import {
  Home, Package, DollarSign, Users,
  FileText, TrendingDown, Landmark, Settings
} from 'lucide-react'

const ICONS: Record<string, React.ReactNode> = {
  'home':          <Home size={20} />,
  'package':       <Package size={20} />,
  'dollar-sign':   <DollarSign size={20} />,
  'users':         <Users size={20} />,
  'file-text':     <FileText size={20} />,
  'trending-down': <TrendingDown size={20} />,
  'landmark':      <Landmark size={20} />,
  'settings':      <Settings size={20} />,
}

// En móvil solo mostramos los 5 más importantes
const MOBILE_NAV = NAV_ITEMS.filter(item =>
  ['home', 'package', 'dollar-sign', 'users', 'settings'].includes(item.icon)
)

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100">
      <div className="flex items-center justify-around h-16 px-2">
        {MOBILE_NAV.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all
                ${isActive ? 'text-gray-900' : 'text-gray-400'}
              `}
            >
              {ICONS[item.icon]}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}