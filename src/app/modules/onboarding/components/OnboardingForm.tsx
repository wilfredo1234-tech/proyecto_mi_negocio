'use client'
import { useState } from 'react'
import { useOnboarding } from '../hooks/useOnboarding'

export default function OnboardingForm() {
  const [companyName, setCompanyName] = useState('')
  const { submit, loading, error } = useOnboarding()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Registra tu negocio
        </h1>

        <p className="text-gray-500 text-sm text-center mb-6">
          Este será el nombre de tu empresa dentro del sistema
        </p>

        <div className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del negocio
            </label>
            <input
              type="text"
              placeholder="Ej: Ferretería El Tornillo"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <button
            onClick={() => submit(companyName)}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Continuar'}
          </button>

        </div>
      </div>
    </div>
  )
}