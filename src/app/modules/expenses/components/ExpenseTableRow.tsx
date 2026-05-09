import { TableCell, TableRow } from '@/components/ui/table'
import { Expense } from '../types/expense.types'
import { ExpenseActions } from './ExpenseActions'

type Props = {
  expense: Expense
  onDelete: (expense: Expense) => void
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)

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

export function ExpenseTableRow({ expense, onDelete }: Props) {
  return (
    <TableRow className="hover:bg-gray-50 transition-colors">

      <TableCell>
        <span className="text-sm font-medium text-gray-900">
          {expense.description}
        </span>
      </TableCell>

      <TableCell>
        <span className="text-sm font-semibold text-red-500">
          {fmt(expense.amount)}
        </span>
      </TableCell>

      <TableCell>
        <span className="text-sm text-gray-400">
          {formatDate(expense.created_at)}
        </span>
      </TableCell>

      <TableCell>
        <ExpenseActions expense={expense} onDelete={onDelete} />
      </TableCell>

    </TableRow>
  )
}