'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ShoppingCart, ChevronRight } from 'lucide-react'
import { useSaleForm } from '../hooks/use-sale-form'
import { useCreateSale } from '../hooks/use-create-sale'
import { ProductSelector } from './ProductSelector'
import { SaleItemRow } from './SaleItemRow'
import { SaleFormSummary } from './SaleFormSummary'
import { SaleCustomerSelector } from './SaleCustomerSelector'
import { SalePaymentMethod } from './SalePaymentMethod'

type MobileStep = 1 | 2

export function SaleForm() {
  const router = useRouter()
  const [mobileStep, setMobileStep] = useState<MobileStep>(1)

  const {
    items, customerId, paymentMethod, totals, isValid,
    addItem, removeItem, updateQuantity, updateTotal,
    setCustomerId, setPaymentMethod, reset,
  } = useSaleForm()

  const { create, loading } = useCreateSale(() => {
    reset()
    router.push('/dashboard/ventas')
  })

  const handleSubmit = async () => {
    if (!isValid) return
    await create({ customer_id: customerId, payment_method: paymentMethod, items })
  }

  const ProductsColumn = (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <ProductSelector onAdd={addItem} />
      </div>

      {items.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">
            Productos agregados ({items.length})
          </p>
          {items.map((item, index) => {
            console.log(`[SaleForm] item "${item.product_name}": sale_price=${item.sale_price}, credit_price=${item.credit_price}, original_sale_price=${item.original_sale_price}`)
            return (
              <SaleItemRow
                key={`${item.product_id}-${item.variant_id}-${index}`}
                item={item}
                index={index}
                onUpdateQuantity={updateQuantity}
                onUpdateTotal={updateTotal}
                onRemove={removeItem}
              />
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShoppingCart size={20} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-400 font-medium">Sin productos</p>
          <p className="text-xs text-gray-300 mt-1">Selecciona un producto arriba</p>
        </div>
      )}

      {items.length > 0 && (
        <button
          onClick={() => setMobileStep(2)}
          className="md:hidden flex items-center justify-center gap-2 w-full py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-2xl active:scale-[0.98] transition-all"
        >
          Continuar al resumen
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )

  const SummaryColumn = (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5">
        <SaleCustomerSelector value={customerId} onChange={setCustomerId} />
        <SalePaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
      </div>

      {items.length > 0 && (
        <SaleFormSummary
          total={totals.total}
          cost={totals.cost}
          profit={totals.profit}
        />
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !isValid}
        className="hidden md:flex items-center justify-center w-full py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-2xl hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-sm"
      >
        {loading ? 'Guardando...' : 'Guardar venta'}
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => {
              if (mobileStep === 2) { setMobileStep(1); return }
              router.push('/dashboard/ventas')
            }}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            {mobileStep === 2 ? 'Productos' : 'Volver'}
          </button>

          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">Nueva venta</p>
          </div>

          <div className="flex items-center gap-1.5 md:hidden">
            <div className={`w-6 h-1.5 rounded-full transition-all ${mobileStep === 1 ? 'bg-gray-900' : 'bg-gray-200'}`} />
            <div className={`w-6 h-1.5 rounded-full transition-all ${mobileStep === 2 ? 'bg-gray-900' : 'bg-gray-200'}`} />
          </div>

          <div className="hidden md:block w-16" />
        </div>
      </div>

      <div className="hidden md:grid md:grid-cols-[1fr_380px] gap-6 max-w-5xl mx-auto px-6 py-8">
        <div>{ProductsColumn}</div>
        <div className="sticky top-20 self-start">
          {SummaryColumn}
        </div>
      </div>

      <div className="md:hidden px-4 py-5 pb-28">
        {mobileStep === 1 ? ProductsColumn : SummaryColumn}
      </div>

      {mobileStep === 2 && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-100 px-4 py-4 z-40">
          <button
            onClick={handleSubmit}
            disabled={loading || !isValid}
            className="w-full py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {loading ? 'Guardando...' : 'Guardar venta'}
          </button>
        </div>
      )}
    </div>
  )
}