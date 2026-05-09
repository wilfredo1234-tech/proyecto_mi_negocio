type Props = {
  total: number
  cost: number
  profit: number
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)

export function SaleFormSummary({ total, cost, profit }: Props) {
  const margin = total > 0 ? Math.round((profit / total) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Total grande tipo ticket */}
      <div className="bg-gray-900 px-5 py-5">
        <p className="text-xs font-medium text-gray-400 mb-1">Total a cobrar</p>
        <p className="text-3xl font-bold text-white tabular-nums tracking-tight">
          {fmt(total)}
        </p>
      </div>

      {/* Desglose */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Costo</span>
          <span className="text-sm font-medium text-gray-500 tabular-nums">{fmt(cost)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Ganancia</span>
          <span className={`text-sm font-bold tabular-nums ${profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {profit >= 0 ? '+' : ''}{fmt(profit)}
          </span>
        </div>

        {/* Barra de margen */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-400">Margen</span>
            <span className={`text-xs font-bold tabular-nums ${margin >= 20 ? 'text-emerald-600' : margin >= 10 ? 'text-amber-500' : 'text-red-500'}`}>
              {margin}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                margin >= 20 ? 'bg-emerald-400' : margin >= 10 ? 'bg-amber-400' : 'bg-red-400'
              }`}
              style={{ width: `${Math.min(margin, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}