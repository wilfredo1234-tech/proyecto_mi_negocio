type Props = {
  stock: number
  unit: string
}

export function InventoryStockBadge({ stock, unit }: Props) {
  const getStyle = () => {
    if (stock <= 0) return 'bg-red-50 text-red-600 border-red-200'
    if (stock <= 5) return 'bg-yellow-50 text-yellow-600 border-yellow-200'
    return 'bg-green-50 text-green-600 border-green-200'
  }

  const getLabel = () => {
    if (stock <= 0) return 'Agotado'
    if (stock <= 5) return 'Stock bajo'
    return 'En stock'
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`
        inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-medium
        ${getStyle()}
      `}>
        {stock} {unit}
      </span>
      <span className="text-xs text-gray-400">{getLabel()}</span>
    </div>
  )
}