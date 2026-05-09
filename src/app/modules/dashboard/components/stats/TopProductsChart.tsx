'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { TopProduct } from '../../types/dashboard-stats.types'

interface TopProductsChartProps {
  data: TopProduct[]
}

const FILLS = ['#111827', '#374151', '#6b7280', '#9ca3af', '#d1d5db']

export function TopProductsChart({ data }: TopProductsChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Sin productos vendidos
      </div>
    )
  }

  const chartData = data.map(p => ({
    name: p.product_name.length > 15 ? p.product_name.slice(0, 15) + '…' : p.product_name,
    cantidad: p.total_quantity,
  }))

  return (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
      >
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          dataKey="name"
          type="category"
          width={110}
          tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          // ✅ fix: castear a any
          formatter={(value: any) => [
            `${typeof value === 'number' ? value : 0} uds`,
            'Cantidad',
          ]}
          contentStyle={{
            borderRadius: '14px',
            border: '1px solid #e5e7eb',
            fontSize: 13,
            padding: '8px 14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          }}
          cursor={{ fill: '#f9fafb' }}
        />
        <Bar dataKey="cantidad" radius={[0, 8, 8, 0]} maxBarSize={20}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={FILLS[i] ?? '#d1d5db'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}