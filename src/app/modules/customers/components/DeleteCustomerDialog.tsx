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
import { Customer } from '../types/customer.types'

type Props = {
  customer: Customer | null
  open: boolean
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
  loading: boolean
}

export function DeleteCustomerDialog({
  customer,
  open,
  onClose,
  onConfirm,
  loading,
}: Props) {
  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-900">
            Eliminar cliente
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            ¿Estás seguro que deseas eliminar a{' '}
            <span className="font-medium text-gray-900">{customer.name}</span>?
            Esta acción no se puede deshacer.
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
            onClick={() => onConfirm(customer.id)}
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