'use client'
import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { Trash2, Plus, Tag } from 'lucide-react'

export default function CategoryList() {
  const { categories, loading, create, remove } = useCategories()
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      await create(newName.trim())
      setNewName('')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Categorías
        </h1>
        <p className="text-sm text-gray-500">
          Organiza tus productos de forma clara y eficiente
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all hover:shadow-md">
        <p className="text-sm font-medium text-gray-800 mb-4">
          Nueva categoría
        </p>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ej: Bebidas, Carnes, Lácteos..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            className="flex-1 px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-gray-50 
                       focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 
                       transition-all placeholder:text-gray-400"
          />

          <button
            onClick={handleCreate}
            disabled={creating || !newName.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium 
                       rounded-xl hover:bg-gray-800 active:scale-95 disabled:opacity-50 
                       transition-all shadow-sm"
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400 animate-pulse">
            Cargando categorías...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100">
              <Tag size={22} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-500">
              Aún no has creado categorías
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="group flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition">
                    <Tag size={16} className="text-gray-500" />
                  </div>

                  <span className="text-sm font-medium text-gray-800">
                    {cat.name}
                  </span>
                </div>

                <button
                  onClick={() => remove(cat.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg 
                             text-gray-400 hover:text-red-500 hover:bg-red-50 
                             transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}