import { TableCell, TableRow } from '@/components/ui/table'
import { Sale, PaymentMethod } from '../types/sale.types'
import { Banknote, CreditCard, Smartphone } from 'lucide-react'
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
    if (diff < 86400) {
      const h = Math.floor(diff / 3600)
      return `hace ${h}h`
    }
    if (diff < 172800) return `ayer ${date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`
    return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short' }).format(date)
  } catch {
    return '—'
  }
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-violet-100 text-violet-600',
    'bg-emerald-100 text-emerald-600',
    'bg-orange-100 text-orange-600',
    'bg-pink-100 text-pink-600',
    'bg-cyan-100 text-cyan-600',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

const PAYMENT_CONFIG: Record<PaymentMethod, {
  label: string
  icon: React.ReactNode
  dot: string
  bg: string
  text: string
}> = {
  efectivo: {
    label: 'Efectivo',
    icon: <Banknote size={11} />,
    dot: 'bg-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  transferencia: {
    label: 'Transferencia',
    icon: <Smartphone size={11} />,
    dot: 'bg-blue-400',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
  credito: {
    label: 'Crédito',
    icon: <CreditCard size={11} />,
    dot: 'bg-orange-400',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
  },
}

export function PaymentBadge({ method }: { method: PaymentMethod }) {
  const cfg = PAYMENT_CONFIG[method]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

type Props = { sale: Sale }

export function SaleTableRow({ sale }: Props) {
  const name = sale.customer?.name ?? null

  return (
    <TableRow className="group border-b border-gray-50 hover:bg-gray-50/70 transition-colors cursor-default">

      {/* Cliente */}
      <TableCell className="pl-5 py-4">
        <div className="flex items-center gap-3">
          {name ? (
            <>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(name)}`}>
                {name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-gray-900">{name}</span>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-gray-400">—</span>
              </div>
              <span className="text-sm text-gray-400">Sin cliente</span>
            </>
          )}
        </div>
      </TableCell>

      {/* Fecha */}
      <TableCell className="py-4">
        <span className="text-sm text-gray-400 tabular-nums">
          {relativeDate(sale.created_at)}
        </span>
      </TableCell>

      {/* Pago */}
      <TableCell className="py-4">
        <PaymentBadge method={sale.payment_method} />
      </TableCell>

      {/* Total */}
      <TableCell className="py-4">
        <span className="text-sm font-bold text-gray-900 tabular-nums">
          {fmt(sale.total)}
        </span>
      </TableCell>

      {/* Ganancia */}
      <TableCell className="py-4">
        <span className={`inline-flex items-center gap-1 text-sm font-semibold tabular-nums px-2.5 py-1 rounded-full ${
          sale.total_profit >= 0
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-red-50 text-red-600'
        }`}>
          {sale.total_profit >= 0 ? '↑' : '↓'}
          {fmt(sale.total_profit)}
        </span>
      </TableCell>

      {/* Factura */}
      <TableCell className="py-4 pr-4">
        <InvoiceDownloadButton saleId={sale.id} />
      </TableCell>

    </TableRow>
  )
}