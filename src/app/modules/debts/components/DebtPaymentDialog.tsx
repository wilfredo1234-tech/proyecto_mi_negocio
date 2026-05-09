'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { DebtPaymentForm } from './DebtPaymentForm'
import { useAddPayment } from '../hooks/use-add-payment'

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  customerId: string
  customerName: string
  pendingAmount: number
}

export function DebtPaymentDialog({
  open,
  onClose,
  onSuccess,
  customerId,
  customerName,
  pendingAmount,
}: Props) {
  const { pay, loading } = useAddPayment(() => {
    onSuccess()
    onClose()
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-900">
            Registrar abono
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            El abono se aplicará a las deudas más antiguas primero
          </DialogDescription>
        </DialogHeader>

        <DebtPaymentForm
          customerName={customerName}
          pendingAmount={pendingAmount}
          onSubmit={(amount) => pay({ customer_id: customerId, amount })}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  )
}