import { Wallet, Users, TrendingDown } from 'lucide-react'
import { CustomerDebtSummary } from '../types/debts.type'


type Props = {
  debts: CustomerDebtSummary[]
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)

export function DebtSummaryCards({ debts }: Props) {
  const totalPending  = debts.reduce((acc, d) => acc + d.pending_amount, 0)
  const totalDebt     = debts.reduce((acc, d) => acc + d.total_debt, 0)
  const activeClients = debts.length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

      <div className="bg-gray-900 rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">Saldo pendiente</span>
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
            <Wallet size={15} className="text-white" />
          </div>
        </div>
        <p className="text-2xl font-semibold text-white">{fmt(totalPending)}</p>
        <p className="text-xs text-gray-400">Total por cobrar</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">Total vendido a crédito</span>
          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
            <TrendingDown size={15} className="text-gray-500" />
          </div>
        </div>
        <p className="text-2xl font-semibold text-gray-900">{fmt(totalDebt)}</p>
        <p className="text-xs text-gray-400">Suma de todas las deudas</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">Clientes con deuda</span>
          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
            <Users size={15} className="text-gray-500" />
          </div>
        </div>
        <p className="text-2xl font-semibold text-gray-900">{activeClients}</p>
        <p className="text-xs text-gray-400">Clientes activos</p>
      </div>

    </div>
  )
}