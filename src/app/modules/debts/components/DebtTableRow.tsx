import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CustomerDebtSummary } from '../types/debts.type'


type Props = {
  debt: CustomerDebtSummary
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)

export function DebtTableRow({ debt }: Props) {
  const router = useRouter()
  const percent = debt.total_debt > 0
    ? Math.round((debt.paid_amount / debt.total_debt) * 100)
    : 0

  return (
    <TableRow className="hover:bg-gray-50 transition-colors">

      {/* Cliente */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-gray-500">
              {debt.customer_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{debt.customer_name}</p>
            {debt.customer_phone && (
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <Phone size={11} />
                {debt.customer_phone}
              </div>
            )}
          </div>
        </div>
      </TableCell>

      {/* Deuda total */}
      <TableCell>
        <span className="text-sm font-medium text-gray-900">
          {fmt(debt.total_debt)}
        </span>
      </TableCell>

      {/* Abonado */}
      <TableCell>
        <span className="text-sm text-gray-500">
          {fmt(debt.paid_amount)}
        </span>
      </TableCell>

      {/* Saldo pendiente */}
      <TableCell>
        <span className="text-sm font-semibold text-red-500">
          {fmt(debt.pending_amount)}
        </span>
      </TableCell>

      {/* Progreso */}
      <TableCell>
        <div className="flex items-center gap-2 min-w-[100px]">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 shrink-0">{percent}%</span>
        </div>
      </TableCell>

      {/* Deudas activas */}
      <TableCell>
        <Badge variant="secondary" className="text-xs font-normal">
          {debt.active_debts} {debt.active_debts === 1 ? 'deuda' : 'deudas'}
        </Badge>
      </TableCell>

      {/* Acciones */}
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/dashboard/deudas/${debt.customer_id}`)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 rounded-xl"
        >
          <Eye size={14} />
          Ver detalle
        </Button>
      </TableCell>

    </TableRow>
  )
}