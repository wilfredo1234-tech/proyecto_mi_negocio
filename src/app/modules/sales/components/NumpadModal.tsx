import { useState, useEffect } from 'react'

type Props = {
  label: string
  initialValue: number
  mode: 'quantity' | 'money'  // ← nuevo prop
  unit?: string                // ← nuevo prop
  onConfirm: (value: number) => void
  onClose: () => void
}

export function NumpadModal({ label, initialValue, mode, unit = '', onConfirm, onClose }: Props) {
  const [display, setDisplay] = useState(
    initialValue > 0 ? String(initialValue) : ''
  )

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Enter') handleConfirm()
      if (e.key === 'Backspace') handlePress('⌫')
      if (/^[0-9.]$/.test(e.key)) handlePress(e.key)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [display])

  const handlePress = (key: string) => {
    if (key === '⌫') {
      setDisplay(prev => prev.slice(0, -1))
      return
    }
    if (key === '.' && display.includes('.')) return
    if (display === '0' && key !== '.') {
      setDisplay(key)
      return
    }
    setDisplay(prev => prev + key)
  }

  const handleConfirm = () => {
    const val = parseFloat(display)
    if (!isNaN(val) && val > 0) {
      onConfirm(val)
      onClose()
    }
  }

  // ── Formato según modo ──────────────────────────────────────
  const formatDisplay = (str: string) => {
    const num = parseFloat(str)
    if (isNaN(num)) return str || '0'

    if (mode === 'money') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(num)
    }

    // Modo cantidad → muestra el número + unidad
    return `${parseFloat(num.toFixed(3))} ${unit}`
  }

  const placeholder = mode === 'money' ? '$0' : `0 ${unit}`

  const KEYS = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['.', '0', '⌫'],
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-sm bg-white md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle mobile */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Label + display */}
        <div className="px-6 pt-4 pb-5 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-400 mb-2">{label}</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
              {display
                ? formatDisplay(display)
                : <span className="text-gray-300">{placeholder}</span>
              }
            </p>
            {display && (
              <button
                onClick={() => setDisplay('')}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors pb-1"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Teclado */}
        <div className="p-4 grid grid-cols-3 gap-2.5">
          {KEYS.flat().map((key) => (
            <button
              key={key}
              onClick={() => handlePress(key)}
              className={`
                h-14 rounded-2xl text-lg font-semibold transition-all active:scale-95
                ${key === '⌫'
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : key === '.'
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Confirmar */}
        <div className="px-4 pb-6">
          <button
            onClick={handleConfirm}
            disabled={!display || parseFloat(display) <= 0}
            className="w-full h-13 py-3.5 rounded-2xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}