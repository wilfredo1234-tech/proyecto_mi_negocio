import { useCustomers } from "../../customers/hooks/use-customers"


type Props = {
  value: string | null
  onChange: (value: string | null) => void
}

export function SaleCustomerSelector({ value, onChange }: Props) {
  const { customers, loading } = useCustomers()

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-gray-500">
        Cliente <span className="text-gray-300">(opcional)</span>
      </p>
      <select
        value={value ?? ''}
        onChange={e => onChange(e.target.value || null)}
        disabled={loading}
        className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
      >
        <option value="">Sin cliente</option>
        {customers.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  )
}