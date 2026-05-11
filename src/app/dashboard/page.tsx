'use client'

import { ShoppingCart, DollarSign, TrendingUp, Receipt, CreditCard, Package } from 'lucide-react'
import { useDashboardStats }  from '../modules/dashboard/hooks/use-dashboard-stats'
import { MonthSummary }       from '../modules/dashboard/components/stats/MonthSummary'
import { StockAlerts }        from '../modules/dashboard/components/stats/StockAlerts'
import { PeriodSelector }     from '../modules/dashboard/components/stats/PeriodSelector'
import { ProductProfitTable } from '../modules/dashboard/components/stats/ProductProfitTable'
import { TopProductsChart }   from '../modules/dashboard/components/stats/TopProductsChart'
import { SalesChart }         from '../modules/dashboard/components/stats/SalesChart'
import { StatCard }           from '../modules/dashboard/components/stats/StatCard'

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

// Card naranja para la sección crédito
function CreditStatCard({
  label, value, icon: Icon, sub
}: {
  label: string
  value: string | number
  icon: any
  sub?: string
}) {
  return (
    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
          {label}
        </span>
        <div className="p-1.5 rounded-lg bg-orange-100">
          <Icon className="w-3.5 h-3.5 text-orange-500" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-orange-600 leading-none">{value}</p>
        {sub && <p className="text-xs text-orange-400 mt-1.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { stats, loading, error, period, changePeriod } = useDashboardStats()

  const sub = period === 'today' ? 'hoy' : period === 'week' ? 'esta semana' : 'este mes'

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 max-w-5xl mx-auto pb-24">

      {/* Header */}
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

      {/* ── Contado — dinero real en mano ── */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">
          Contado — dinero en mano
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Ventas"
            value={loading ? '—' : stats?.cards.totalSales ?? 0}
            icon={ShoppingCart}
            sub={sub}
          />
          <StatCard
            label="Ingresos"
            value={loading ? '—' : cop(stats?.cards.totalRevenue ?? 0)}
            icon={DollarSign}
            highlight
          />
          <StatCard
            label="Ganancia"
            value={loading ? '—' : cop(stats?.cards.totalProfit ?? 0)}
            icon={TrendingUp}
            sub="después de costos"
          />
          <StatCard
            label="Gastos"
            value={loading ? '—' : cop(stats?.cards.totalExpenses ?? 0)}
            icon={Receipt}
          />
        </div>

        {/* fila 2 — costo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatCard
            label="Costo productos"
            value={loading ? '—' : cop(stats?.cards.totalCost ?? 0)}
            icon={Package}
            sub="lo que te costó vender"
          />
        </div>
      </div>

      {/* ── Crédito — pendiente de cobro ── */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest px-1">
          Crédito — pendiente de cobro
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <CreditStatCard
            label="Ventas"
            value={loading ? '—' : stats?.creditCards.totalSales ?? 0}
            icon={ShoppingCart}
            sub={sub}
          />
          <CreditStatCard
            label="Por cobrar"
            value={loading ? '—' : cop(stats?.creditCards.totalRevenue ?? 0)}
            icon={DollarSign}
            sub="pendiente"
          />
          <CreditStatCard
            label="Ganancia"
            value={loading ? '—' : cop(stats?.creditCards.totalProfit ?? 0)}
            icon={TrendingUp}
            sub="si se cobra todo"
          />
          <CreditStatCard
            label="Costo"
            value={loading ? '—' : cop(stats?.creditCards.totalCost ?? 0)}
            icon={Package}
            sub="ya invertido"
          />
        </div>
      </div>

      {/* Resumen del mes */}
      <Section title="Resumen del mes — solo contado">
        {loading
          ? <Skeleton className="h-24" />
          : stats?.monthSummary
            ? <MonthSummary data={stats.monthSummary} />
            : null}
      </Section>

      {/* Gráfica */}
      <Section title="Ventas contado — últimos 7 días">
        {loading ? <Skeleton className="h-56" /> : <SalesChart data={stats?.dailySales ?? []} />}
      </Section>

      {/* Top productos + Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Section title="Top productos">
          {loading ? <Skeleton className="h-56" /> : <TopProductsChart data={stats?.topProducts ?? []} />}
        </Section>
        <Section title="Alertas de inventario">
          {loading ? <Skeleton className="h-56" /> : <StockAlerts data={stats?.stockAlerts ?? []} />}
        </Section>
      </div>

      {/* Rentabilidad */}
      <Section title="Rentabilidad por producto">
        {loading ? <Skeleton className="h-40" /> : <ProductProfitTable data={stats?.productProfits ?? []} />}
      </Section>

    </div>
  )
}