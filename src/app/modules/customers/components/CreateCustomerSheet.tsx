'use client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { CustomerForm } from './CustomerForm'
import { useCreateCustomer } from '../hooks/use-create-customer'
import { CreateCustomerInput } from '../types/customer.types'

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateCustomerSheet({ open, onClose, onSuccess }: Props) {
  const { create, loading } = useCreateCustomer(onSuccess)

  const handleSubmit = async (input: CreateCustomerInput) => {
    await create(input)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-base font-semibold text-gray-900">
            Nuevo cliente
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-400">
            Agrega un cliente a tu negocio
          </SheetDescription>
        </SheetHeader>

        <CustomerForm onSubmit={handleSubmit} loading={loading} />
      </SheetContent>
    </Sheet>
  )
}