import { Sale } from '../types/sale.types'
import { PaymentBadge } from './SaleTableRow'
import { InvoiceDownloadButton } from '../../invoice/components/InvoiceDownloadButton'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)

function relativeDate(dateStr: string): string {
  try {
    const date = new Date(dateStr.replace(' ', 'T'))
    if (isNaN(date.getTime())) return '—'
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 60) return 'ahora'
    if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
    if (diff < 172800) return 'ayer'
    return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short' }).format(date)
  } catch { return '—' }
}

type Props = { sale: Sale }

export function SaleMobileCard({ sale }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">

      {/* Top: badge + fecha + botón factura */}
      <div className="flex items-center justify-between">
        <PaymentBadge method={sale.payment_method} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 tabular-nums">
            {relativeDate(sale.created_at)}
          </span>
          <InvoiceDownloadButton saleId={sale.id} />
        </div>
      </div>

      {/* Cliente */}
      <p className="text-sm font-semibold text-gray-900">
        {sale.customer?.name ?? (
          <span className="text-gray-400 font-normal">Sin cliente</span>
        )}
      </p>

      {/* Bottom: total + ganancia */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span className="text-xs text-gray-400">Ganancia</span>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold tabular-nums ${
            sale.total_profit >= 0 ? 'text-emerald-600' : 'text-red-500'
          }`}>
            {sale.total_profit >= 0 ? '↑' : '↓'} {fmt(sale.total_profit)}
          </span>
          <span className="text-sm font-bold text-gray-900 tabular-nums">
            {fmt(sale.total)}
          </span>
        </div>
      </div>

    </div>
  )
}