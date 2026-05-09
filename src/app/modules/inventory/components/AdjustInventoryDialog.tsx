'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { AdjustInventoryForm } from './AdjustInventoryForm'
import { useAdjustInventory } from '../hooks/use-adjust-inventory'
import { InventoryItem } from '../types/inventory.types'

type Props = {
  item: InventoryItem | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AdjustInventoryDialog({ item, open, onClose, onSuccess }: Props) {
  const { adjust, loading } = useAdjustInventory(() => {
    onSuccess()
    onClose()
  })

  if (!item) return null

  const unit = item.variant?.unit ?? item.product?.unit ?? 'und'
  const productName = item.variant
    ? `${item.product?.name} — ${item.variant.name}`
    : item.product?.name ?? 'Producto'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-900">
            Ajustar stock
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            {productName}
          </DialogDescription>
        </DialogHeader>

        <AdjustInventoryForm
          currentStock={item.stock}
          unit={unit}
          onSubmit={(input) => adjust(item.id, input)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  )
}