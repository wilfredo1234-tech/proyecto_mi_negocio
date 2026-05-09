'use client'
import { useState } from 'react'
import { useRegister } from '../hooks/useRegister'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { register, loading, error } = useRegister()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Crear cuenta
        </h1>

        <div className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <button
            onClick={() => register(email, password)}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Registrarse'}
          </button>

        </div>
      </div>
    </div>
  )
}