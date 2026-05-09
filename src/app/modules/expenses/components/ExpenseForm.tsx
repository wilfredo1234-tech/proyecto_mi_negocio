'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  onSubmit: (input: { description: string; amount: number }) => Promise<void>
  loading: boolean
}

export function ExpenseForm({ onSubmit, loading }: Props) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [errors, setErrors] = useState<{ description?: string; amount?: string }>({})

  const validate = () => {
    const newErrors: { description?: string; amount?: string } = {}
    if (!description.trim()) newErrors.description = 'La descripción es requerida'
    if (!amount || Number(amount) <= 0) newErrors.amount = 'El monto debe ser mayor a 0'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    await onSubmit({ description: description.trim(), amount: Number(amount) })
    setDescription('')
    setAmount('')
    setErrors({})
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Descripción */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-gray-500">
          Descripción <span className="text-red-400">*</span>
        </Label>
        <Input
          placeholder="Ej: Pago de arriendo"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="rounded-xl border-gray-200 text-sm focus-visible:ring-gray-900"
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Monto */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-gray-500">
          Monto <span className="text-red-400">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="pl-7 rounded-xl border-gray-200 text-sm focus-visible:ring-gray-900"
          />
        </div>
        {errors.amount && (
          <p className="text-xs text-red-500">{errors.amount}</p>
        )}
      </div>

      {/* Botón */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        {loading ? 'Guardando...' : 'Guardar gasto'}
      </button>

    </div>
  )
}