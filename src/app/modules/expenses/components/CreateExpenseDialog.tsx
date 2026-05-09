'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ExpenseForm } from './ExpenseForm'
import { useCreateExpense } from '../hooks/use-create-expense'
import { CreateExpenseInput } from '../types/expense.types'

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateExpenseDialog({ open, onClose, onSuccess }: Props) {
  const { create, loading } = useCreateExpense(onSuccess)

  const handleSubmit = async (input: CreateExpenseInput) => {
    await create(input)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-900">
            Nuevo gasto
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            Registra un gasto de tu negocio
          </DialogDescription>
        </DialogHeader>

        <ExpenseForm onSubmit={handleSubmit} loading={loading} />
      </DialogContent>
    </Dialog>
  )
}