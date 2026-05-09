import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { Product } from '../types/product.types'

interface DeleteProductDialogProps {
  product: Product | null
  open: boolean
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export function DeleteProductDialog({
  product,
  open,
  onClose,
  onConfirm,
}: DeleteProductDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!product?.id) return
    setLoading(true)
    try {
      await onConfirm(product.id)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <DialogTitle className="text-gray-900 text-base">
              Eliminar producto
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-500 leading-relaxed">
            ¿Estás seguro de que quieres eliminar{' '}
            <span className="font-semibold text-gray-700">
              {product?.name}
            </span>
            ? Esta acción no se puede deshacer y eliminará también su inventario.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white border-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Eliminando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Eliminar
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}