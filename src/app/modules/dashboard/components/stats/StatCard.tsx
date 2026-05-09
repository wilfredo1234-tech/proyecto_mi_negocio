import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: LucideIcon
  highlight?: boolean
}

export function StatCard({ label, value, sub, icon: Icon, highlight }: StatCardProps) {
  return (
    <div className={cn(
      'relative rounded-2xl border p-5 flex flex-col justify-between gap-4 overflow-hidden transition-all duration-200',
      highlight
        ? 'bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-900/20'
        : 'bg-white border-gray-100 text-gray-900 hover:border-gray-200 hover:shadow-sm'
    )}>
      {/* fondo decorativo sutil */}
      <div className={cn(
        'absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10',
        highlight ? 'bg-white' : 'bg-gray-900'
      )} />

      <div className="flex items-start justify-between relative">
        <p className={cn(
          'text-xs font-semibold uppercase tracking-widest',
          highlight ? 'text-gray-400' : 'text-gray-400'
        )}>
          {label}
        </p>
        <div className={cn(
          'p-2 rounded-xl',
          highlight ? 'bg-white/10' : 'bg-gray-50'
        )}>
          <Icon className={cn('w-4 h-4', highlight ? 'text-gray-300' : 'text-gray-500')} />
        </div>
      </div>

      <div className="relative">
        <p className="text-2xl font-bold tracking-tight leading-none">{value}</p>
        {sub && (
          <p className={cn(
            'text-xs mt-2 font-medium',
            highlight ? 'text-gray-500' : 'text-gray-400'
          )}>
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}