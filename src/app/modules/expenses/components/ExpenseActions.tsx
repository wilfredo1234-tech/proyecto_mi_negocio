'use client'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Expense } from '../types/expense.types'

type Props = {
  expense: Expense
  onDelete: (expense: Expense) => void
}

export function ExpenseActions({ expense, onDelete }: Props) {
  return (
    <div className="flex items-center justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(expense)}
        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
      >
        <Trash2 size={15} />
      </Button>
    </div>
  )
}