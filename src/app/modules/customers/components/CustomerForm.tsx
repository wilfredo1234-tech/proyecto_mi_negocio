'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCustomerForm } from '../hooks/use-customer-form'
import { CreateCustomerInput } from '../types/customer.types'

type Props = {
  onSubmit: (input: CreateCustomerInput) => Promise<void>
  loading: boolean
}

export function CustomerForm({ onSubmit, loading }: Props) {
  const { form, errors, isValid, updateField, validate, reset } = useCustomerForm()

  const handleSubmit = async () => {
    if (!validate()) return
    await onSubmit(form)
    reset()
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Nombre */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name" className="text-xs font-medium text-gray-500">
          Nombre <span className="text-red-400">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ej: Juan Pérez"
          value={form.name}
          onChange={e => updateField('name', e.target.value)}
          className="rounded-xl border-gray-200 text-sm focus-visible:ring-gray-900"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Teléfono */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone" className="text-xs font-medium text-gray-500">
          Teléfono
        </Label>
        <Input
          id="phone"
          placeholder="Ej: 3001234567"
          value={form.phone}
          onChange={e => updateField('phone', e.target.value)}
          className="rounded-xl border-gray-200 text-sm focus-visible:ring-gray-900"
        />
      </div>

      {/* Botón submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !isValid}
        className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        {loading ? 'Guardando...' : 'Guardar cliente'}
      </button>

    </div>
  )
}