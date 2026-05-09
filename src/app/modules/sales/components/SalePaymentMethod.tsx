import { PaymentMethod } from '../types/sale.types'
import { Banknote, CreditCard, Smartphone } from 'lucide-react'

type Props = {
  value: PaymentMethod
  onChange: (value: PaymentMethod) => void
}

const OPTIONS: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { value: 'efectivo',      label: 'Efectivo',      icon: <Banknote size={16} /> },
  { value: 'transferencia', label: 'Transferencia', icon: <Smartphone size={16} /> },
  { value: 'credito',       label: 'Crédito',       icon: <CreditCard size={16} /> },
]

export function SalePaymentMethod({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-gray-500">Método de pago</p>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all
              ${value === option.value
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }
            `}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}