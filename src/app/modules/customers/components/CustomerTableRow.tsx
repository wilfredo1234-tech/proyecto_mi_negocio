import { Customer } from '../types/customer.types'
import { CustomerActions } from './CustomerActions'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Phone } from 'lucide-react'

type Props = {
  customer: Customer
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr.replace(' ', 'T'))
    if (isNaN(date.getTime())) return '—'
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date)
  } catch {
    return '—'
  }
}

export function CustomerTableRow({ customer, onEdit, onDelete }: Props) {
  return (
    <TableRow className="hover:bg-gray-50 transition-colors">

      {/* Nombre */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-gray-500">
              {customer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {customer.name}
          </span>
        </div>
      </TableCell>

      {/* Teléfono */}
      <TableCell>
        {customer.phone ? (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Phone size={13} className="text-gray-400" />
            {customer.phone}
          </div>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </TableCell>

      {/* Fecha */}
      <TableCell>
        <Badge variant="secondary" className="text-xs font-normal">
          {formatDate(customer.created_at)}
        </Badge>
      </TableCell>

      {/* Acciones */}
      <TableCell>
        <CustomerActions
          customer={customer}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>

    </TableRow>
  )
}