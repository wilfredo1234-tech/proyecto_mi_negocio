'use client'
import { useState } from 'react'
import { Plus, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Expense } from '../types/expense.types'
import { ExpenseTableRow } from './ExpenseTableRow'
import { CreateExpenseDialog } from './CreateExpenseDialog'
import { DeleteExpenseDialog } from './DeleteExpenseDialog'
import { useExpenses } from '../hooks/use-expenses'
import { useDeleteExpense } from '../hooks/use-delete-expense'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)

export function ExpenseTable() {
  const { expenses, loading, reload } = useExpenses()
  const [createOpen, setCreateOpen] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)

  const { remove, loading: deleting } = useDeleteExpense(async () => {
    setExpenseToDelete(null)
    await reload()
  })

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0)

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Gastos</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {expenses.length} gastos registrados
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-700 text-sm font-medium active:scale-95 transition-all"
        >
          <Plus size={16} />
          Nuevo gasto
        </Button>
      </div>

      {/* Resumen total */}
      {expenses.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Total gastos</p>
            <p className="text-2xl font-semibold text-red-500 mt-0.5">
              {fmt(totalExpenses)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
            <Receipt size={20} className="text-red-400" />
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Cargando...
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-400">No hay gastos aún</p>
            <p className="text-xs text-gray-300 mt-1">Registra tu primer gasto</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-medium text-gray-400">Descripción</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Monto</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Fecha</TableHead>
                <TableHead className="text-xs font-medium text-gray-400 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map(expense => (
                <ExpenseTableRow
                  key={expense.id}
                  expense={expense}
                  onDelete={setExpenseToDelete}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialog crear */}
      <CreateExpenseDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={async () => {
          setCreateOpen(false)
          await reload()
        }}
      />

      {/* Dialog eliminar */}
      <DeleteExpenseDialog
        expense={expenseToDelete}
        open={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={remove}
        loading={deleting}
      />

    </div>
  )
}