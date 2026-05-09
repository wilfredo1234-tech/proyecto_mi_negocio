import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal } from 'lucide-react'
import { InventoryItem } from '../types/inventory.types'
import { InventoryStockBadge } from './InventoryStockBadge'

type Props = {
  item: InventoryItem
  onAdjust: (item: InventoryItem) => void
}

export function InventoryTableRow({ item, onAdjust }: Props) {
  const unit = item.variant?.unit ?? item.product?.unit ?? 'und'

  return (
    <TableRow className="hover:bg-gray-50 transition-colors">

      {/* Producto */}
      <TableCell>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {item.product?.name ?? '—'}
          </p>
          {item.variant && (
            <p className="text-xs text-gray-400 mt-0.5">
              {item.variant.name}
            </p>
          )}
        </div>
      </TableCell>

      {/* Categoría */}
      <TableCell>
        {item.product?.category ? (
          <Badge variant="secondary" className="text-xs font-normal">
            {item.product.category.name}
          </Badge>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </TableCell>

      {/* Stock */}
      <TableCell>
        <InventoryStockBadge stock={item.stock} unit={unit} />
      </TableCell>

      {/* Costo promedio */}
      <TableCell>
        <span className="text-sm text-gray-500">
          {item.avg_cost > 0
            ? `$${Number(item.avg_cost).toLocaleString('es-CO')}`
            : '—'
          }
        </span>
      </TableCell>

      {/* Acciones */}
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAdjust(item)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 rounded-xl"
        >
          <SlidersHorizontal size={14} />
          Ajustar
        </Button>
      </TableCell>

    </TableRow>
  )
}