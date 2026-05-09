'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  customerName: string
  pendingAmount: number
  onSubmit: (amount: number) => Promise<void>
  loading: boolean
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)

export function DebtPaymentForm({ customerName, pendingAmount, onSubmit, loading }: Props) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    const value = Number(amount)
    if (!value || value <= 0) {
      setError('El monto debe ser mayor a 0')
      return
    }
    if (value > pendingAmount) {
      setError(`El monto no puede superar el saldo pendiente (${fmt(pendingAmount)})`)
      return
    }
    setError(null)
    await onSubmit(value)
    setAmount('')
  }

  const quickAmounts = [
    pendingAmount * 0.25,
    pendingAmount * 0.50,
    pendingAmount * 0.75,
    pendingAmount,
  ].filter(n => n > 0)

  return (
    <div className="flex flex-col gap-5">

      {/* Info cliente */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <p className="text-xs text-gray-400">Cliente</p>
          <p className="text-sm font-semibold text-gray-900 mt-0.5">{customerName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Saldo pendiente</p>
          <p className="text-sm font-semibold text-red-500 mt-0.5">{fmt(pendingAmount)}</p>
        </div>
      </div>

      {/* Montos rápidos */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-500">Monto rápido</p>
        <div className="grid grid-cols-2 gap-2">
          {quickAmounts.map((qa, i) => (
            <button
              key={i}
              onClick={() => setAmount(qa.toString())}
              className={`
                py-2 px-3 rounded-xl border text-xs font-medium transition-all
                ${Number(amount) === qa
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 text-gray-500 hover:border-gray-400'
                }
              `}
            >
              {i === 0 ? '25%' : i === 1 ? '50%' : i === 2 ? '75%' : 'Total'}
              {' — '}{fmt(qa)}
            </button>
          ))}
        </div>
      </div>

      {/* Monto manual */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-gray-500">
          O ingresa un monto <span className="text-red-400">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
          <Input
            type="number"
            min={0}
            max={pendingAmount}
            placeholder="0"
            value={amount}
            onChange={e => {
              setAmount(e.target.value)
              setError(null)
            }}
            className="pl-7 rounded-xl border-gray-200 text-sm focus-visible:ring-gray-900"
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* Preview */}
      {Number(amount) > 0 && Number(amount) <= pendingAmount && (
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
          <span className="text-xs font-medium text-green-700">Saldo después del abono</span>
          <span className="text-sm font-semibold text-green-700">
            {fmt(pendingAmount - Number(amount))}
          </span>
        </div>
      )}

      {/* Botón */}
      <button
        onClick={handleSubmit}
        disabled={loading || !amount}
        className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        {loading ? 'Registrando...' : 'Registrar abono'}
      </button>

    </div>
  )
}