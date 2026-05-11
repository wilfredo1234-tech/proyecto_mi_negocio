import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { SaleItemInput } from '../types/sale.types'
import { NumpadModal } from './NumpadModal'

type Props = {
  item: SaleItemInput
  index: number
  onUpdateQuantity: (index: number, value: number) => void
  onUpdateTotal: (index: number, value: number) => void
  onRemove: (index: number) => void
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)

const fmtQty = (n: number) =>
  parseFloat(n.toFixed(3)).toString()

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

type NumpadTarget = 'quantity' | 'total' | null

export function SaleItemRow({ item, index, onUpdateQuantity, onUpdateTotal, onRemove }: Props) {
  const [numpadTarget, setNumpadTarget] = useState<NumpadTarget>(null)

  const cost   = Math.round(item.quantity * item.purchase_price * 1000) / 1000
  const profit = Math.round((item.total - cost) * 1000) / 1000

  const handleConfirm = (value: number) => {
    if (numpadTarget === 'quantity') onUpdateQuantity(index, value)
    if (numpadTarget === 'total')    onUpdateTotal(index, value)
  }

  const numpadLabel = numpadTarget === 'quantity'
    ? `Cantidad — ${item.product_name}`
    : `Total — ${item.product_name}`

  const numpadInitial = numpadTarget === 'quantity' ? item.quantity : item.total

  return (
    <>
      <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3 transition-all hover:border-gray-200 hover:shadow-md">

        {/* Avatar producto */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${getAvatarColor(item.product_name)}`}>
          {item.product_name.charAt(0).toUpperCase()}
        </div>

        {/* Info + controles */}
        <div className="flex-1 min-w-0">

          {/* Nombre + eliminar */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {item.product_name}
              </p>
              {item.variant_name && (
                <p className="text-xs text-gray-400 mt-0.5">{item.variant_name}</p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">
                {fmt(item.sale_price)} / {item.unit}
                {item.credit_price && item.sale_price === item.credit_price && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-orange-50 text-orange-500 text-xs rounded-md font-medium">
                    crédito
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => onRemove(index)}
              className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Botones cantidad y total */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setNumpadTarget('quantity')}
              className="flex flex-col items-start px-3 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all active:scale-[0.97] text-left"
            >
              <span className="text-xs text-gray-400 mb-0.5">Cantidad ({item.unit})</span>
              <span className="text-sm font-bold text-gray-900 tabular-nums">
                {fmtQty(item.quantity)} {item.unit}
              </span>
            </button>
            <button
              onClick={() => setNumpadTarget('total')}
              className="flex flex-col items-start px-3 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all active:scale-[0.97] text-left"
            >
              <span className="text-xs text-gray-400 mb-0.5">Total ($)</span>
              <span className="text-sm font-bold text-gray-900 tabular-nums">
                {fmt(item.total)}
              </span>
            </button>
          </div>

          {/* Ganancia */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-50">
            <span className="text-xs text-gray-400">Ganancia del item</span>
            <span className={`text-xs font-bold tabular-nums ${profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {profit >= 0 ? '↑' : '↓'} {fmt(profit)}
            </span>
          </div>

        </div>
      </div>

      {/* Numpad modal — mode y unit según target */}
      {numpadTarget && (
        <NumpadModal
          label={numpadLabel}
          initialValue={numpadInitial}
          mode={numpadTarget === 'quantity' ? 'quantity' : 'money'}
          unit={item.unit}
          onConfirm={handleConfirm}
          onClose={() => setNumpadTarget(null)}
        />
      )}
    </>
  )
}