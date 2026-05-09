'use client'

import {
  ShoppingCart, DollarSign, TrendingUp, Receipt
} from 'lucide-react'









import { useDashboardStats } from '../modules/dashboard/hooks/use-dashboard-stats'
import { MonthSummary } from '../modules/dashboard/components/stats/MonthSummary'
import { StockAlerts } from '../modules/dashboard/components/stats/StockAlerts'
import { PeriodSelector } from '../modules/dashboard/components/stats/PeriodSelector'
import { ProductProfitTable } from '../modules/dashboard/components/stats/ProductProfitTable'
import { TopProductsChart } from '../modules/dashboard/components/stats/TopProductsChart'
import { SalesChart } from '../modules/dashboard/components/stats/SalesChart'
import { StatCard } from '../modules/dashboard/components/stats/StatCard'



function cop(n: number) {
  return `$${Math.round(n).toLocaleString('es-CO')}`
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col gap-4">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{title}</h2>
      {children}
    </div>
  )
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-100 rounded-xl animate-pulse ${className}`} />
}

export default function DashboardPage() {
  const { stats, loading, error, period, changePeriod } = useDashboardStats()

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 max-w-5xl mx-auto pb-24">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Resumen de tu negocio</p>
        </div>
        <PeriodSelector value={period} onChange={changePeriod} />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Ventas"   value={loading ? '—' : stats?.cards.totalSales ?? 0}          icon={ShoppingCart} sub={period === 'today' ? 'hoy' : period === 'week' ? 'esta semana' : 'este mes'} />
        <StatCard label="Ingresos" value={loading ? '—' : cop(stats?.cards.totalRevenue ?? 0)}   icon={DollarSign}   highlight />
        <StatCard label="Ganancia" value={loading ? '—' : cop(stats?.cards.totalProfit ?? 0)}    icon={TrendingUp}   sub="después de costos" />
        <StatCard label="Gastos"   value={loading ? '—' : cop(stats?.cards.totalExpenses ?? 0)}  icon={Receipt} />
      </div>

      <Section title="Resumen del mes">
        {loading
          ? <Skeleton className="h-24" />
          : stats?.monthSummary
            ? <MonthSummary data={stats.monthSummary} />
            : null}
      </Section>

      <Section title="Ventas — últimos 7 días">
        {loading ? <Skeleton className="h-56" /> : <SalesChart data={stats?.dailySales ?? []} />}
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Section title="Top productos">
          {loading ? <Skeleton className="h-56" /> : <TopProductsChart data={stats?.topProducts ?? []} />}
        </Section>
        <Section title="Alertas de inventario">
          {loading ? <Skeleton className="h-56" /> : <StockAlerts data={stats?.stockAlerts ?? []} />}
        </Section>
      </div>

      <Section title="Rentabilidad por producto">
        {loading ? <Skeleton className="h-40" /> : <ProductProfitTable data={stats?.productProfits ?? []} />}
      </Section>

    </div>
  )
}