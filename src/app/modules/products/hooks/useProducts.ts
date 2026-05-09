import { useEffect, useState } from 'react'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/productService'
import { Product, CreateProductPayload } from '../types/product.types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const create = async (payload: CreateProductPayload) => {
    const newProduct = await createProduct(payload)
    setProducts(prev => [newProduct, ...prev])
    return newProduct
  }

  const update = async (id: string, payload: Partial<CreateProductPayload>) => {
    const updated = await updateProduct(id, payload)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p))
    return updated
  }

  const remove = async (id: string) => {
    await deleteProduct(id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return { products, loading, error, create, update, remove, reload: load }
}