import { useState } from 'react'
import { CreateCustomerInput } from '../types/customer.types'

export function useCustomerForm() {
  const [form, setForm] = useState<CreateCustomerInput>({
    name: '',
    phone: '',
  })

  const [errors, setErrors] = useState<Partial<CreateCustomerInput>>({})

  const updateField = (key: keyof CreateCustomerInput, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const validate = (): boolean => {
    const newErrors: Partial<CreateCustomerInput> = {}
    if (!form.name.trim()) newErrors.name = 'El nombre es requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const reset = () => {
    setForm({ name: '', phone: '' })
    setErrors({})
  }

  const isValid = form.name.trim().length > 0

  return { form, errors, isValid, updateField, validate, reset }
}