import { AlertTriangle, CheckCircle2, PackageX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StockAlert } from '../../types/dashboard-stats.types'

interface StockAlertsProps {
  data: StockAlert[]
}

export function StockAlerts({ data }: StockAlertsProps) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-44 gap-3 text-gray-400">
        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
        <p className="text-sm font-medium text-gray-500">Todo en stock</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
      {data.map(item => {
        const agotado = item.stock === 0
        return (
          <li
            key={item.id}
            className={cn(
              'flex items-center justify-between px-4 py-3 rounded-xl border transition-colors',
              agotado
                ? 'bg-red-50/60 border-red-100'
                : 'bg-yellow-50/60 border-yellow-100'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0',
                agotado ? 'bg-red-100' : 'bg-yellow-100'
              )}>
                {agotado
                  ? <PackageX   className="w-4 h-4 text-red-500" />
                  : <AlertTriangle className="w-4 h-4 text-yellow-600" />
                }
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-tight">{item.product_name}</p>
                {item.variant_name && (
                  <p className="text-xs text-gray-400 mt-0.5">{item.variant_name}</p>
                )}
              </div>
            </div>
            <span className={cn(
              'text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap',
              agotado
                ? 'bg-red-100 text-red-600'
                : 'bg-yellow-100 text-yellow-700'
            )}>
              {agotado ? 'Agotado' : `${item.stock} ${item.unit}`}
            </span>
          </li>
        )
      })}
    </ul>
  )
}