'use client'
import { Plus, Package, Trash2, Tag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { DeleteProductDialog } from './DeleteProductDialog'
import { Product } from '../types/product.types'

export default function ProductList() {
  const router = useRouter()
  const { products, loading, remove } = useProducts()

  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const getStock = (product: any) => {
    if (product.variants?.length) {
      return product.variants?.reduce((acc: number, v: any) => acc + (v.stock ?? 0), 0) ?? 0
    }
    return product.inventory?.[0]?.stock ?? 0
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500">Gestiona tu inventario de productos</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/productos/nuevo')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium 
                     rounded-xl hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
        >
          <Plus size={16} />
          Nuevo producto
        </button>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400 animate-pulse">
            Cargando productos...
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-100">
              <Package size={26} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">No hay productos aún</p>
            <p className="text-xs text-gray-400">Empieza creando tu primer producto</p>
          </div>
        ) : (
          <div>
            {/* Encabezado */}
            <div className="grid grid-cols-12 px-6 py-3 text-xs font-medium text-gray-400 bg-gray-50 border-b">
              <span className="col-span-5">Producto</span>
              <span className="col-span-2">Categoría</span>
              <span className="col-span-2 text-right">Precio</span>
              <span className="col-span-2 text-right">Stock</span>
              <span className="col-span-1 text-right"></span>
            </div>

            {/* Filas */}
            <div className="divide-y divide-gray-100">
              {products.map(product => {
                const stock = getStock(product)
                return (
                  <div
                    key={product.id}
                    className="group grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50 transition-all"
                  >
                    {/* Producto */}
                    <div className="col-span-5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition">
                        <Package size={18} className="text-gray-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                        {(product.variants?.length ?? 0) > 0 && (
                          <span className="text-xs text-gray-400">{product.variants?.length} variantes</span>
                        )}
                      </div>
                    </div>

                    {/* Categoría */}
                    <div className="col-span-2">
                      {product.category ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                          <Tag size={12} />
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">Sin categoría</span>
                      )}
                    </div>

                    {/* Precio */}
                    <div className="col-span-2 text-right">
                      {product.sale_price ? (
                        <span className="text-sm font-semibold text-gray-900">
                          ${Number(product.sale_price).toLocaleString('es-CO')}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">Variantes</span>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="col-span-2 text-right">
                      <span className={`text-sm font-semibold ${
                        stock <= 0 ? 'text-red-500' : stock < 10 ? 'text-yellow-500' : 'text-gray-900'
                      }`}>
                        {stock} {product.unit}
                      </span>
                    </div>

                    {/* Acción */}
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => setProductToDelete(product)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg 
                                   text-gray-400 hover:text-red-500 hover:bg-red-50 
                                   transition-all active:scale-95"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Dialog de confirmación */}
      <DeleteProductDialog
        product={productToDelete}
        open={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={remove}
      />

    </div>
  )
}