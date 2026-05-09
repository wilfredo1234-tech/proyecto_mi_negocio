'use client'
import { useRouter } from 'next/navigation'


import { CreateProductPayload } from '@/src/app/modules/products/types/product.types'
import { useProducts } from '@/src/app/modules/products/hooks/useProducts'
import ProductForm from '@/src/app/modules/products/components/ProductForm'


export default function NuevoProductoPage() {
  const router = useRouter()
  const { create } = useProducts()

  const handleSubmit = async (payload: CreateProductPayload) => {
    await create(payload)
    router.push('/dashboard/productos')
  }

  return (
    <ProductForm
      onSubmit={handleSubmit}
      onCancel={() => router.push('/dashboard/productos')}
    />
  )
}