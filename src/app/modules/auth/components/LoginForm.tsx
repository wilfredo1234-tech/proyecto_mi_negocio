'use client'
import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'
import { useRedirectIfAuth } from '../hooks/useRedirectIfAuth'

export default function LoginForm() {
  useRedirectIfAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useLogin()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar sesión
        </h1>

        <div className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

        </div>

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        <button
          onClick={() => login(email, password)}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 text-white py-2.5 rounded-lg font-medium
          hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Iniciar sesión'}
        </button>

        <p className="text-sm text-center text-gray-600 mt-6">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Regístrate
          </a>
        </p>

      </div>
    </div>
  )
}