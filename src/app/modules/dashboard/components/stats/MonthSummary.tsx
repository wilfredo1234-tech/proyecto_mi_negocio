import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MonthSummary as MonthSummaryType } from '../../types/dashboard-stats.types'

interface MonthSummaryProps {
  data: MonthSummaryType
}

function cop(n: number) {
  return `$${Math.round(n).toLocaleString('es-CO')}`
}

export function MonthSummary({ data }: MonthSummaryProps) {
  const cards = [
    {
      label:   'Ingresos',
      value:   cop(data.totalRevenue),
      icon:    TrendingUp,
      color:   'text-emerald-600',
      iconBg:  'bg-emerald-100',
      bg:      'bg-emerald-50',
      border:  'border-emerald-100',
    },
    {
      label:   'Gastos',
      value:   cop(data.totalExpenses),
      icon:    TrendingDown,
      color:   'text-red-500',
      iconBg:  'bg-red-100',
      bg:      'bg-red-50',
      border:  'border-red-100',
    },
    {
      label:   'Ganancia neta',
      value:   cop(data.netProfit),
      icon:    Wallet,
      color:   data.netProfit >= 0 ? 'text-gray-900' : 'text-red-500',
      iconBg:  'bg-gray-100',
      bg:      'bg-gray-50',
      border:  'border-gray-100',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map(card => (
        <div key={card.label} className={cn(
          'rounded-2xl border p-4 flex flex-col gap-3',
          card.bg, card.border
        )}>
          <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', card.iconBg)}>
            <card.icon className={cn('w-4 h-4', card.color)} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium leading-none">{card.label}</p>
            <p className={cn('text-base font-bold mt-1.5 leading-none', card.color)}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}