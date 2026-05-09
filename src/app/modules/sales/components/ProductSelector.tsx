import { useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useProducts } from '../../products/hooks/useProducts'

type Props = {
  onAdd: (product: {
    product_id: string
    variant_id: string | null
    product_name: string
    variant_name: string | null
    unit: string
    sale_price: number
    credit_price: number | null
    purchase_price: number
  }) => void
}

export function ProductSelector({ onAdd }: Props) {
  const { products } = useProducts()
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedVariantId, setSelectedVariantId] = useState('')

  const selectedProduct = products.find(p => p.id === selectedProductId)
  const hasVariants = (selectedProduct?.variants?.length ?? 0) > 0

  const handleAdd = () => {
    if (!selectedProduct) return

    if (hasVariants) {
      const variant = selectedProduct.variants?.find(v => v.id === selectedVariantId)
      if (!variant) return
      console.log('credit_price variante:', variant.credit_price)
      onAdd({
        product_id:     selectedProduct.id,
        variant_id:     variant.id ?? null,
        product_name:   selectedProduct.name,
        variant_name:   variant.name,
        unit:           variant.unit,
        sale_price:     variant.sale_price,
        credit_price:   variant.credit_price ?? null,
        purchase_price: variant.purchase_price,
      })
    } else {
      console.log('credit_price producto:', selectedProduct.credit_price)
      onAdd({
        product_id:     selectedProduct.id,
        variant_id:     null,
        product_name:   selectedProduct.name,
        variant_name:   null,
        unit:           selectedProduct.unit,
        sale_price:     selectedProduct.sale_price ?? 0,
        credit_price:   selectedProduct.credit_price ?? null,
        purchase_price: selectedProduct.purchase_price ?? 0,
      })
    }

    setSelectedProductId('')
    setSelectedVariantId('')
  }

  const canAdd = selectedProductId && (!hasVariants || selectedVariantId)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium text-gray-500">Agregar producto</p>

      <div className="flex flex-col gap-2 md:flex-row">
        <select
          value={selectedProductId}
          onChange={e => {
            setSelectedProductId(e.target.value)
            setSelectedVariantId('')
          }}
          className="w-full px-3 py-3 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all md:flex-1"
        >
          <option value="">Seleccionar producto</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {hasVariants && (
          <select
            value={selectedVariantId}
            onChange={e => setSelectedVariantId(e.target.value)}
            className="w-full px-3 py-3 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all md:flex-1"
          >
            <option value="">Seleccionar variante</option>
            {selectedProduct?.variants?.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        )}

        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] hover:bg-gray-700 transition-all"
        >
          <Plus size={16} />
          <span className="md:hidden">Agregar</span>
        </button>
      </div>
    </div>
  )
}