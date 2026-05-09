'use client'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Customer } from '../types/customer.types'

type Props = {
  customer: Customer
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

export function CustomerActions({ customer, onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(customer)}
        className="h-8 w-8 text-gray-400 hover:text-gray-900"
      >
        <Pencil size={15} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(customer)}
        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
      >
        <Trash2 size={15} />
      </Button>
    </div>
  )
}