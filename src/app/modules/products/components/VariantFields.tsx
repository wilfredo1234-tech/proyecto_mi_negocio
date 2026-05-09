import { Plus, Trash2 } from 'lucide-react'
import { ProductVariant } from '../types/product.types'

type Props = {
  variants: Omit<ProductVariant, 'id' | 'product_id'>[]
  onUpdate: (index: number, key: string, value: any) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

export default function VariantFields({ variants, onUpdate, onAdd, onRemove }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {variants.map((variant, index) => (
        <div
          key={index}
          className="relative bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 transition-all hover:border-gray-300"
        >
          {/* Badge + eliminar */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-500">
              Variante {index + 1}
            </span>
            {variants.length > 1 && (
              <button
                onClick={() => onRemove(index)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
  <div className="col-span-2 sm:col-span-1">
    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Nombre</label>
    <input
      type="text"
      placeholder="Ej: 1kg"
      value={variant.name}
      onChange={e => onUpdate(index, 'name', e.target.value)}
      className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
    />
  </div>
  <div>
    <label className="text-xs font-medium text-gray-500 mb-1.5 block">P. compra</label>
    <input
      type="number" min={0}
      value={variant.purchase_price}
      onChange={e => onUpdate(index, 'purchase_price', Number(e.target.value))}
      className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
    />
  </div>
  <div>
    <label className="text-xs font-medium text-gray-500 mb-1.5 block">P. contado</label>
    <input
      type="number" min={0}
      value={variant.sale_price}
      onChange={e => onUpdate(index, 'sale_price', Number(e.target.value))}
      className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
    />
  </div>
  <div>
    <label className="text-xs font-medium text-gray-500 mb-1.5 block">
      P. crédito
    </label>
    <input
      type="number" min={0}
      placeholder="—"
      value={variant.credit_price ?? ''}
      onChange={e => onUpdate(index, 'credit_price', e.target.value ? Number(e.target.value) : null)}
      className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
    />
  </div>
  <div>
    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Stock</label>
    <input
      type="number" min={0}
      value={variant.stock}
      onChange={e => onUpdate(index, 'stock', Number(e.target.value))}
      className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
    />
  </div>
</div>
        </div>
      ))}

      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-medium text-gray-400 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.99]"
      >
        <Plus size={16} />
        Agregar variante
      </button>
    </div>
  )
}