import { useEffect, useState } from 'react'
import { fetchCategories, createCategory, deleteCategory } from '../services/categoryService'
import { Category } from '../types/category.types'


export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchCategories()
      setCategories(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const create = async (name: string) => {
    const newCat = await createCategory(name)
    setCategories(prev => [...prev, newCat])
    return newCat
  }

  const remove = async (id: string) => {
    await deleteCategory(id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  return { categories, loading, error, create, remove, reload: load }
}