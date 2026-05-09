'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AdjustInventoryInput, AdjustType } from '../types/inventory.types'

type Props = {
  currentStock: number
  unit: string
  onSubmit: (input: AdjustInventoryInput) => Promise<void>
  loading: boolean
}

const ADJUST_TYPES: { value: AdjustType; label: string; description: string }[] = [
  { value: 'entrada',    label: 'Entrada',    description: 'Suma al stock actual' },
  { value: 'salida',     label: 'Salida',     description: 'Resta al stock actual' },
  { value: 'correccion', label: 'Corrección', description: 'Define el stock exacto' },
]

export function AdjustInventoryForm({ currentStock, unit, onSubmit, loading }: Props) {
  const [type, setType] = useState<AdjustType>('entrada')
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  const previewStock = () => {
    const qty = Number(quantity)
    if (!qty) return currentStock
    switch (type) {
      case 'entrada':    return currentStock + qty
      case 'salida':     return currentStock - qty
      case 'correccion': return qty
    }
  }

  const handleSubmit = async () => {
    const qty = Number(quantity)
    if (!qty || qty <= 0) {
      setError('La cantidad debe ser mayor a 0')
      return
    }
    setError(null)
    await onSubmit({ type, quantity: qty, note: note || undefined })
    setQuantity('')
    setNote('')
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Stock actual */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <span className="text-xs font-medium text-gray-500">Stock actual</span>
        <span className="text-sm font-semibold text-gray-900">
          {currentStock} {unit}
        </span>
      </div>

      {/* Tipo de ajuste */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-gray-500">Tipo de ajuste</Label>
        <div className="grid grid-cols-3 gap-2">
          {ADJUST_TYPES.map(option => (
            <button
              key={option.value}
              onClick={() => setType(option.value)}
              className={`
                flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-medium transition-all
                ${type === option.value
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }
              `}
            >
              <span>{option.label}</span>
              <span className={`text-[10px] font-normal ${type === option.value ? 'text-gray-400' : 'text-gray-400'}`}>
                {option.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Cantidad */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-gray-500">
          Cantidad ({unit}) <span className="text-red-400">*</span>
        </Label>
        <Input
          type="number"
          min={0}
          step="0.01"
          placeholder="0"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          className="rounded-xl border-gray-200 text-sm focus-visible:ring-gray-900"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* Preview nuevo stock */}
      {quantity && Number(quantity) > 0 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <span className="text-xs font-medium text-gray-500">Stock después del ajuste</span>
          <span className={`text-sm font-semibold ${previewStock() < 0 ? 'text-red-500' : 'text-green-600'}`}>
            {previewStock()} {unit}
          </span>
        </div>
      )}

      {/* Nota */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-gray-500">
          Nota <span className="text-gray-300">(opcional)</span>
        </Label>
        <Input
          placeholder="Ej: Compra de mercancía"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="rounded-xl border-gray-200 text-sm focus-visible:ring-gray-900"
        />
      </div>

      {/* Botón */}
      <button
        onClick={handleSubmit}
        disabled={loading || !quantity}
        className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        {loading ? 'Guardando...' : 'Guardar ajuste'}
      </button>

    </div>
  )
}