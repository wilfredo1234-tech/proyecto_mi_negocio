'use client'

import { cn } from '@/lib/utils'
import { Period } from '../../types/dashboard-stats.types'

interface PeriodSelectorProps {
  value: Period
  onChange: (p: Period) => void
}

const OPTIONS: { label: string; value: Period }[] = [
  { label: 'Hoy',    value: 'today' },
  { label: 'Semana', value: 'week'  },
  { label: 'Mes',    value: 'month' },
]

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="inline-flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 select-none',
            value === opt.value
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}