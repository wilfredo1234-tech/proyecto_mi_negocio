'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { NAV_ITEMS, NavItem } from '../../types/dashboard.types'
import {
  Home, Package, DollarSign, Users, FileText,
  TrendingDown, Landmark, Settings, Tag, BarChart2,
  ChevronDown, ChevronRight, Wallet
} from 'lucide-react'

const ICONS: Record<string, React.ReactNode> = {
  'home':          <Home size={18} />,
  'package':       <Package size={18} />,
  'dollar-sign':   <DollarSign size={18} />,
  'users':         <Users size={18} />,
  'file-text':     <FileText size={18} />,
  'trending-down': <TrendingDown size={18} />,
  'landmark':      <Landmark size={18} />,
  'settings':      <Settings size={18} />,
  'tag':           <Tag size={18} />,
  'bar-chart':     <BarChart2 size={18} />,
  'wallet':        <Wallet size={18} />,
}

function NavItemComponent({ item, collapsed }: { item: NavItem, collapsed: boolean }) {
  const pathname = usePathname()
  const hasChildren = item.children && item.children.length > 0
  const isChildActive = item.children?.some(c => pathname.startsWith(c.href)) ?? false
  const isActive = pathname === item.href || isChildActive
  const [open, setOpen] = useState(isChildActive)

  if (hasChildren) {
    return (
      <div>
        <div className={`
          flex items-center rounded-lg transition-all duration-150
          ${isActive ? 'text-gray-900 bg-gray-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
        `}>
          <Link
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 flex-1 min-w-0"
          >
            <span className="flex-shrink-0">{ICONS[item.icon]}</span>
            {!collapsed && (
              <span className="text-sm font-medium truncate">{item.label}</span>
            )}
          </Link>

          {!collapsed && (
            <button
              onClick={() => setOpen(!open)}
              className="px-2 py-2.5 flex-shrink-0"
            >
              {open
                ? <ChevronDown size={14} />
                : <ChevronRight size={14} />
              }
            </button>
          )}
        </div>

        {open && !collapsed && (
          <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-gray-100 pl-3">
            {item.children!.map(child => (
              <Link
                key={child.href}
                href={child.href}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                  ${pathname === child.href
                    ? 'bg-gray-900 text-white font-medium'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span className="flex-shrink-0">{ICONS[child.icon]}</span>
                <span className="truncate">{child.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
        ${isActive
          ? 'bg-gray-900 text-white'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }
      `}
    >
      <span className="flex-shrink-0">{ICONS[item.icon]}</span>
      {!collapsed && (
        <span className="text-sm font-medium truncate">{item.label}</span>
      )}
    </Link>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`
      hidden md:flex flex-col h-screen bg-white border-r border-gray-100
      fixed left-0 top-0 z-30 transition-all duration-300
      ${collapsed ? 'w-16' : 'w-56'}
    `}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-3 h-16 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">MN</span>
        </div>
        {!collapsed && (
          <span className="font-semibold text-sm text-gray-900 truncate">
            Mi Negocio
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <NavItemComponent key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Collapse toggle + user */}
      <div className="p-3 border-t border-gray-100 flex flex-col gap-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all w-full"
        >
          <ChevronRight size={16} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          {!collapsed && <span className="text-xs">Colapsar</span>}
        </button>

        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-gray-600">A</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">Admin</p>
              <p className="text-xs text-gray-400 truncate">admin@negocio.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}