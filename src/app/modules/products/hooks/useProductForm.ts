import { useState } from 'react'
import { CreateProductPayload, ProductVariant } from '../types/product.types'

const EMPTY_VARIANT = (): Omit<ProductVariant, 'id' | 'product_id'> => ({
  name: '',
  unit: 'und',
  purchase_price: 0,
  sale_price: 0,
  credit_price: null,
  stock: 0,
  is_active: true,
})

export function useProductForm(onSubmit: (payload: CreateProductPayload) => Promise<void>) {
  const [saving, setSaving] = useState(false)
  const [hasVariants, setHasVariants] = useState(false)

  const [form, setForm] = useState({
    name: '',
    category_id: '',
    unit: 'kg',
    purchase_price: 0,
    sale_price: 0,
    credit_price: null as number | null, 
    stock: 0,
  })

  const [variants, setVariants] = useState([EMPTY_VARIANT()])

  const updateForm = (key: string, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const updateVariant = (index: number, key: string, value: any) =>
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [key]: value } : v))

  const addVariant = () =>
    setVariants(prev => [...prev, EMPTY_VARIANT()])

  const removeVariant = (index: number) =>
    setVariants(prev => prev.filter((_, i) => i !== index))

  const toggleVariants = () => setHasVariants(prev => !prev)

  const isValid = form.name.trim().length > 0

  const handleSubmit = async () => {
    if (!isValid) return
    setSaving(true)
    try {
      await onSubmit({
        name: form.name,
        category_id: form.category_id || null,
        unit: form.unit,
        has_variants: hasVariants,
        purchase_price: hasVariants ? undefined : form.purchase_price,
        sale_price:     hasVariants ? undefined : form.sale_price,
        credit_price:   hasVariants ? undefined : form.credit_price,
        stock:          hasVariants ? undefined : form.stock,
        variants:       hasVariants ? variants : undefined,
      })
    } finally {
      setSaving(false)
    }
  }

  return {
    form,
    variants,
    hasVariants,
    saving,
    isValid,
    updateForm,
    updateVariant,
    addVariant,
    removeVariant,
    toggleVariants,
    handleSubmit,
  }
}