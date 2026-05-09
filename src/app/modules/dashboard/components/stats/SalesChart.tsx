'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { DailySale } from '../../types/dashboard-stats.types'

interface SalesChartProps {
  data: DailySale[]
}

function formatDay(dateStr: string) {
  const [,, day] = dateStr.split('-')
  return parseInt(day).toString()
}

function cop(n: number) {
  return `$${n.toLocaleString('es-CO')}`
}

export function SalesChart({ data }: SalesChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Sin ventas en este período
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={230}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDay}
          tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          // ✅ fix: castear a any evita el conflicto con readonly
          formatter={(value: any, name: any) => [
            cop(typeof value === 'number' ? value : 0),
            name === 'total' ? 'Ventas' : 'Ganancia',
          ]}
          labelFormatter={label => `Día ${String(label).split('-')[2]}`}
          contentStyle={{
            borderRadius: '14px',
            border: '1px solid #e5e7eb',
            fontSize: 13,
            padding: '8px 14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          }}
          cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
        />
        <Legend
          formatter={v => (
            <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>
              {v === 'total' ? 'Ventas' : 'Ganancia'}
            </span>
          )}
          iconType="circle"
          iconSize={7}
          wrapperStyle={{ paddingTop: 12 }}
        />
        <Line type="monotone" dataKey="total"  stroke="#111827" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#111827', strokeWidth: 0 }} />
        <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#22c55e', strokeWidth: 0 }} strokeDasharray="5 3" />
      </LineChart>
    </ResponsiveContainer>
  )
}