'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Phone, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { useCustomerDebt } from '../hooks/use-customer-debt'
import { DebtPaymentDialog } from './DebtPaymentDialog'

type Props = {
  customerId: string
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr.replace(' ', 'T'))
    if (isNaN(date.getTime())) return '—'
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date)
  } catch {
    return '—'
  }
}

export function CustomerDebtDetail({ customerId }: Props) {
  const router = useRouter()
  const { detail, loading, reload } = useCustomerDebt(customerId)
  const [paymentOpen, setPaymentOpen] = useState(false)

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        Cargando...
      </div>
    )
  }

  if (!detail) return null

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/deudas')}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Volver
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {detail.customer.name}
            </h1>
            {detail.customer.phone && (
              <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-0.5">
                <Phone size={13} />
                {detail.customer.phone}
              </div>
            )}
          </div>
        </div>

        {detail.summary.pending_amount > 0 && (
          <Button
            onClick={() => setPaymentOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-700 active:scale-95 transition-all"
          >
            <Wallet size={16} />
            Registrar abono
          </Button>
        )}
      </div>

      {/* Resumen financiero */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="col-span-2 sm:col-span-1 bg-gray-900 rounded-2xl p-4">
          <p className="text-xs text-gray-400">Saldo pendiente</p>
          <p className="text-xl font-semibold text-white mt-1">
            {fmt(detail.summary.pending_amount)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-400">Deuda total</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {fmt(detail.summary.total_amount)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-400">Abonado</p>
          <p className="text-lg font-semibold text-green-600 mt-1">
            {fmt(detail.summary.paid_amount)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-400">Total vendido</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {fmt(detail.summary.total_revenue)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-400">Costo total</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {fmt(detail.summary.total_cost)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-4">
          <p className="text-xs text-green-500">Ganancia</p>
          <p className="text-lg font-semibold text-green-600 mt-1">
            {fmt(detail.summary.total_profit)}
          </p>
        </div>
      </div>

      {/* Productos comprados a crédito */}
      {detail.products.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-900">Productos comprados a crédito</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-medium text-gray-400">Producto</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Cantidad</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Ingresos</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Costo</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Ganancia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.products.map(product => (
                <TableRow key={product.product_id} className="hover:bg-gray-50">
                  <TableCell>
                    <span className="text-sm font-medium text-gray-900">
                      {product.product_name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {product.total_quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-gray-900">
                      {fmt(product.total_revenue)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {fmt(product.total_cost)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-green-600">
                      {fmt(product.total_profit)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Ventas a crédito */}
      {detail.debts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-900">Ventas a crédito</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-medium text-gray-400">Fecha</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Total</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Abonado</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Pendiente</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.debts.map(debt => (
                <TableRow key={debt.id} className="hover:bg-gray-50">
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {formatDate(debt.created_at)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-gray-900">
                      {fmt(debt.total_amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-green-600">
                      {fmt(debt.paid_amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-red-500">
                      {fmt(debt.pending_amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-xs font-medium ${
                        debt.status === 'pagado'
                          ? 'bg-green-50 text-green-600 border-green-200'
                          : debt.status === 'vencido'
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                      }`}
                    >
                      {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Abonos realizados */}
      {detail.payments.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-900">Abonos realizados</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-medium text-gray-400">Fecha</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.payments.map(payment => (
                <TableRow key={payment.id} className="hover:bg-gray-50">
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {formatDate(payment.created_at)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-green-600">
                      {fmt(payment.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog abono */}
      <DebtPaymentDialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSuccess={reload}
        customerId={customerId}
        customerName={detail.customer.name}
        pendingAmount={detail.summary.pending_amount}
      />

    </div>
  )
}