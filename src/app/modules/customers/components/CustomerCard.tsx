import { Customer } from '../types/customer.types'
import { CustomerActions } from './CustomerActions'
import { Card, CardContent } from '@/components/ui/card'
import { Phone } from 'lucide-react'

type Props = {
  customer: Customer
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

export function CustomerCard({ customer, onEdit, onDelete }: Props) {
  return (
    <Card className="border border-gray-100 shadow-none rounded-2xl">
      <CardContent className="p-4 flex items-center justify-between gap-4">

        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-gray-500">
              {customer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {customer.name}
            </p>
            {customer.phone ? (
              <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                <Phone size={11} />
                {customer.phone}
              </div>
            ) : (
              <p className="text-xs text-gray-300 mt-0.5">Sin teléfono</p>
            )}
          </div>
        </div>

        <CustomerActions
          customer={customer}
          onEdit={onEdit}
          onDelete={onDelete}
        />

      </CardContent>
    </Card>
  )
}