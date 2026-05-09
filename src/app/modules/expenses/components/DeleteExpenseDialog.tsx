'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Expense } from '../types/expense.types'

type Props = {
  expense: Expense | null
  open: boolean
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
  loading: boolean
}

export function DeleteExpenseDialog({
  expense,
  open,
  onClose,
  onConfirm,
  loading,
}: Props) {
  if (!expense) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-900">
            Eliminar gasto
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            ¿Eliminar{' '}
            <span className="font-medium text-gray-900">
              {expense.description}
            </span>
            ? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(expense.id)}
            disabled={loading}
            className="flex-1 rounded-xl"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}