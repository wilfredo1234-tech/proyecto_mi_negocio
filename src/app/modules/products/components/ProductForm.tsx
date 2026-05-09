'use client'
import { X, Package, DollarSign, Layers } from 'lucide-react'

import { useProductForm } from '../hooks/useProductForm'
import { CreateProductPayload } from '../types/product.types'
import VariantFields from './VariantFields'
import { useCategories } from '../../categories/hooks/useCategories'

const UNITS = ['kg', 'g', 'lb', 'lt', 'ml', 'und', 'caja', 'bolsa', 'par']

type Props = {
  onSubmit: (payload: CreateProductPayload) => Promise<void>
  onCancel: () => void
}

function SectionHeader({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
  )
}

export default function ProductForm({ onSubmit, onCancel }: Props) {
  const { categories } = useCategories()
  const {
    form, variants, hasVariants, saving, isValid,
    updateForm, updateVariant, addVariant, removeVariant,
    toggleVariants, handleSubmit,
  } = useProductForm(onSubmit)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Volver a productos
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">Nuevo producto</p>
            <p className="text-xs text-gray-400">Crea y gestiona tu inventario</p>
          </div>
          <div className="w-32" />
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-3xl mx-auto w-full px-6 py-8 flex flex-col gap-5 pb-32">

        {/* Sección — Información básica */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader
            icon={<Package size={15} className="text-gray-500" />}
            title="Información básica"
            description="Nombre, categoría y unidad de medida"
          />

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                Nombre del producto <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Arroz Diana"
                value={form.name}
                onChange={e => updateForm('name', e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Categoría</label>
                <select
                  value={form.category_id}
                  onChange={e => updateForm('category_id', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                >
                  <option value="">Sin categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Unidad de medida</label>
                <select
                  value={form.unit}
                  onChange={e => updateForm('unit', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sección — Variantes toggle */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader
            icon={<Layers size={15} className="text-gray-500" />}
            title="Variantes"
            description="Activa si el producto tiene diferentes presentaciones"
          />

          <div
            onClick={toggleVariants}
            className={`
              flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
              ${hasVariants
                ? 'border-gray-900 bg-gray-900'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }
            `}
          >
            <div>
              <p className={`text-sm font-medium ${hasVariants ? 'text-white' : 'text-gray-900'}`}>
                {hasVariants ? 'Con variantes activado' : 'Sin variantes'}
              </p>
              <p className={`text-xs mt-0.5 ${hasVariants ? 'text-gray-400' : 'text-gray-400'}`}>
                {hasVariants ? 'Ej: Arroz 1kg, Arroz 5kg' : 'Un solo precio y stock'}
              </p>
            </div>
            <div className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${hasVariants ? 'bg-white/20' : 'bg-gray-300'}`}>
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${hasVariants ? 'translate-x-5' : ''}`} />
            </div>
          </div>

          {/* Variantes */}
          {hasVariants && (
            <div className="mt-5">
              <VariantFields
                variants={variants}
                onUpdate={updateVariant}
                onAdd={addVariant}
                onRemove={removeVariant}
              />
            </div>
          )}
        </div>

        {/* Sección — Precios e inventario (solo sin variantes) */}
        {!hasVariants && (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <SectionHeader
      icon={<DollarSign size={15} className="text-gray-500" />}
      title="Precios e inventario"
      description="Define el precio de compra, venta, crédito y stock inicial"
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-medium text-gray-500 mb-1.5 block">Precio compra</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
          <input
            type="number" min={0}
            value={form.purchase_price}
            onChange={e => updateForm('purchase_price', Number(e.target.value))}
            className="w-full pl-7 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 mb-1.5 block">Precio venta (contado)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
          <input
            type="number" min={0}
            value={form.sale_price}
            onChange={e => updateForm('sale_price', Number(e.target.value))}
            className="w-full pl-7 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 mb-1.5 block">
          Precio crédito
          <span className="ml-1.5 text-gray-300 font-normal">(opcional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
          <input
            type="number" min={0}
            value={form.credit_price ?? ''}
            placeholder="Ej: 20000"
            onChange={e => updateForm('credit_price', e.target.value ? Number(e.target.value) : null)}
            className="w-full pl-7 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 mb-1.5 block">Stock inicial</label>
        <input
          type="number" min={0}
          value={form.stock}
          onChange={e => updateForm('stock', Number(e.target.value))}
          className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
        />
      </div>
    </div>

    {/* Márgenes calculados */}
    {form.purchase_price > 0 && (form.sale_price > 0 || form.credit_price) && (
      <div className="mt-4 p-3 bg-gray-50 rounded-xl flex flex-col gap-2">
        {form.sale_price > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Margen contado</span>
            <span className={`text-xs font-semibold ${form.sale_price > form.purchase_price ? 'text-green-600' : 'text-red-500'}`}>
              {(((form.sale_price - form.purchase_price) / form.purchase_price) * 100).toFixed(1)}%
            </span>
          </div>
        )}
        {form.credit_price && form.credit_price > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Margen crédito</span>
            <span className={`text-xs font-semibold ${form.credit_price > form.purchase_price ? 'text-green-600' : 'text-red-500'}`}>
              {(((form.credit_price - form.purchase_price) / form.purchase_price) * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    )}
  </div>
)}
      </div>

      {/* Footer sticky */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-10 md:left-16 lg:left-56">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !isValid}
            className="px-6 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
          >
            {saving ? 'Guardando...' : 'Guardar producto'}
          </button>
        </div>
      </div>
    </div>
  )
}