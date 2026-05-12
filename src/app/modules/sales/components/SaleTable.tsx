'use client'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { Plus, ShoppingBag, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSales } from '../hooks/use-sales'
import { SaleTableRow } from './SaleTableRow'
import { Sale } from '../types/sale.types'
import { SaleMobileCard } from './SaleMobileCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)

type FilterPeriod = 'today' | 'week' | 'month'

function filterByPeriod(sales: Sale[], period: FilterPeriod): Sale[] {
  const now = new Date()
  return sales.filter(sale => {
    const date = new Date(sale.created_at.replace(' ', 'T'))
    if (period === 'today') return date.toDateString() === now.toDateString()
    if (period === 'week') {
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 7)
      return date >= weekAgo
    }
    if (period === 'month') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }
    return true
  })
}

const FILTER_LABELS: Record<FilterPeriod, string> = {
  today: 'Hoy',
  week: 'Semana',
  month: 'Mes',
}

function SkeletonRow() {
  return (
    <TableRow className="hover:bg-transparent">
      {[1,2,3,4,5,6].map(i => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${[60,80,70,50,50,30][i-1]}%` }} />
        </td>
      ))}
    </TableRow>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 bg-gray-100 rounded-full" />
        <div className="h-4 w-16 bg-gray-100 rounded-lg" />
      </div>
      <div className="h-5 w-32 bg-gray-100 rounded-lg" />
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="h-4 w-20 bg-gray-100 rounded-lg" />
        <div className="h-4 w-16 bg-gray-100 rounded-lg" />
      </div>
    </div>
  )
}

type MetricCardProps = {
  label: string
  value: string
  icon: React.ReactNode
  accent: string
  iconBg: string
}

function MetricCard({ label, value, icon, accent, iconBg }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`h-0.5 w-full ${accent}`} />
      <div className="p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
          <p className="text-lg font-bold text-gray-900 tabular-nums">{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

const TABLE_HEADERS = ['Cliente', 'Fecha', 'Pago', 'Total', 'Ganancia', 'Factura']

export function SaleTable() {
  const router = useRouter()
  const { sales, loading } = useSales()
  const [period, setPeriod] = useState<FilterPeriod>('today')

  const filtered = useMemo(() => filterByPeriod(sales, period), [sales, period])

  const metrics = useMemo(() => ({
    count:  filtered.length,
    total:  filtered.reduce((s, x) => s + x.total, 0),
    profit: filtered.reduce((s, x) => s + x.total_profit, 0),
  }), [filtered])

  const periodLabel = FILTER_LABELS[period].toLowerCase()

  const TableHeaders = (
    <TableHeader>
      <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-100">
        {TABLE_HEADERS.map((h, i) => (
          <TableHead
            key={h}
            className={`text-xs font-semibold text-gray-400 uppercase tracking-wide ${
              i === 0 ? 'pl-5' : ''
            } ${i === TABLE_HEADERS.length - 1 ? 'pr-5 text-right' : ''}`}
          >
            {h}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  )

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Ventas</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Mostrando resultados de {periodLabel}
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/ventas/nueva')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium active:scale-95 transition-all shadow-sm"
        >
          <Plus size={15} />
          Nueva venta
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          label="Ventas"
          value={String(metrics.count)}
          icon={<ShoppingCart size={16} className="text-blue-500" />}
          accent="bg-blue-400"
          iconBg="bg-blue-50"
        />
        <MetricCard
          label="Total"
          value={fmt(metrics.total)}
          icon={<DollarSign size={16} className="text-violet-500" />}
          accent="bg-violet-400"
          iconBg="bg-violet-50"
        />
        <MetricCard
          label="Ganancia"
          value={fmt(metrics.profit)}
          icon={<TrendingUp size={16} className="text-emerald-500" />}
          accent="bg-emerald-400"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        {(['today', 'week', 'month'] as FilterPeriod[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              period === p
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {FILTER_LABELS[p]}
          </button>
        ))}
      </div>

      {/* MOBILE: Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {loading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : filtered.length === 0 ? (
          <EmptyState period={periodLabel} />
        ) : (
          filtered.map(sale => (
            <SaleMobileCard key={sale.id} sale={sale} />
          ))
        )}
      </div>

      {/* DESKTOP: Tabla */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <Table>
            {TableHeaders}
            <TableBody>
              {[1,2,3,4,5].map(i => <SkeletonRow key={i} />)}
            </TableBody>
          </Table>
        ) : filtered.length === 0 ? (
          <EmptyState period={periodLabel} />
        ) : (
          <Table>
            {TableHeaders}
            <TableBody>
              {filtered.map(sale => (
                <SaleTableRow key={sale.id} sale={sale} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>

    </div>
  )
}

function EmptyState({ period }: { period: string }) {
  return (
    <div className="p-14 text-center">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <ShoppingBag size={24} className="text-gray-300" />
      </div>
      <p className="text-sm font-semibold text-gray-500">Sin ventas {period}</p>
      <p className="text-xs text-gray-300 mt-1">Las ventas que registres aparecerán aquí</p>
    </div>
  )
}