'use client'
import { useState } from 'react'
import { Package } from 'lucide-react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { InventoryItem } from '../types/inventory.types'
import { InventoryTableRow } from './InventoryTableRow'
import { AdjustInventoryDialog } from './AdjustInventoryDialog'
import { useInventory } from '../hooks/use-inventory'

export function InventoryTable() {
  const { inventory, loading, reload } = useInventory()
  const [itemToAdjust, setItemToAdjust] = useState<InventoryItem | null>(null)

  const outOfStock  = inventory.filter(i => i.stock <= 0).length
  const lowStock    = inventory.filter(i => i.stock > 0 && i.stock <= 5).length

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Inventario</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {inventory.length} productos en inventario
        </p>
      </div>

      {/* Resumen rápido */}
      {inventory.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400">Total productos</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {inventory.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-yellow-100 shadow-sm p-4">
            <p className="text-xs text-yellow-500">Stock bajo</p>
            <p className="text-2xl font-semibold text-yellow-500 mt-1">
              {lowStock}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-4">
            <p className="text-xs text-red-400">Agotados</p>
            <p className="text-2xl font-semibold text-red-500 mt-1">
              {outOfStock}
            </p>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Cargando...
          </div>
        ) : inventory.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-400">
              No hay productos en inventario
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Crea productos para verlos aquí
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-medium text-gray-400">Producto</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Categoría</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Stock</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Costo prom.</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map(item => (
                <InventoryTableRow
                  key={item.id}
                  item={item}
                  onAdjust={setItemToAdjust}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialog ajustar */}
      <AdjustInventoryDialog
        item={itemToAdjust}
        open={!!itemToAdjust}
        onClose={() => setItemToAdjust(null)}
        onSuccess={reload}
      />

    </div>
  )
}