import { useState } from 'react'
import { SaleItemInput, PaymentMethod } from '../types/sale.types'

export function useSaleForm() {
  const [items, setItems] = useState<SaleItemInput[]>([])
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo')

  const getEffectivePrice = (
    original_sale_price: number,
    credit_price: number | null,
    method: PaymentMethod
  ) => {
    if (method === 'credito' && credit_price) return credit_price
    return original_sale_price
  }

  const addItem = (product: {
    product_id: string
    variant_id: string | null
    product_name: string
    variant_name: string | null
    unit: string
    sale_price: number
    credit_price: number | null
    purchase_price: number
  }) => {
    const exists = items.some(
      i => i.product_id === product.product_id && i.variant_id === product.variant_id
    )
    if (exists) return

    const effectivePrice = getEffectivePrice(product.sale_price, product.credit_price, paymentMethod)

    setItems(prev => [...prev, {
      ...product,
      original_sale_price: product.sale_price,  // ← guarda el original
      sale_price:          effectivePrice,        // ← activo según método actual
      quantity:            1,
      total:               effectivePrice,
      input_mode:          'quantity',
    }])
  }

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateQuantity = (index: number, quantity: number) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== index) return item
      return { ...item, quantity, total: quantity * item.sale_price, input_mode: 'quantity' }
    }))
  }

  const updateTotal = (index: number, total: number) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== index) return item
      const quantity = item.sale_price > 0 ? total / item.sale_price : 0
      return { ...item, total, quantity, input_mode: 'money' }
    }))
  }

  const handleSetPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method)
    setItems(prev => prev.map(item => {
      // ← ahora usa original_sale_price, nunca el sale_price mutado
      const effectivePrice = getEffectivePrice(item.original_sale_price, item.credit_price, method)
      return {
        ...item,
        sale_price: effectivePrice,
        total:      item.quantity * effectivePrice,
      }
    }))
  }

  const totals = items.reduce((acc, item) => {
    const cost   = item.quantity * item.purchase_price
    const profit = item.total - cost
    return { total: acc.total + item.total, cost: acc.cost + cost, profit: acc.profit + profit }
  }, { total: 0, cost: 0, profit: 0 })

  const isValid = items.length > 0 && paymentMethod !== null

  const reset = () => {
    setItems([])
    setCustomerId(null)
    setPaymentMethod('efectivo')
  }

  return {
    items, customerId, paymentMethod, totals, isValid,
    addItem, removeItem, updateQuantity, updateTotal,
    setCustomerId,
    setPaymentMethod: handleSetPaymentMethod,
    reset,
  }
}