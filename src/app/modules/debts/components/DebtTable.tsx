'use client'
import { useState } from 'react'
import { Wallet } from 'lucide-react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDebts } from '../hooks/use-debts'
import { DebtTableRow } from './DebtTableRow'
import { DebtSummaryCards } from './DebtSummaryCards'

export function DebtTable() {
  const { debts, loading } = useDebts()

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Deudas</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Control de clientes que deben
        </p>
      </div>

      {/* Summary cards */}
      {!loading && debts.length > 0 && (
        <DebtSummaryCards debts={debts} />
      )}

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Cargando...
          </div>
        ) : debts.length === 0 ? (
          <div className="p-12 text-center">
            <Wallet size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-400">
              No hay deudas pendientes
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Las ventas a crédito aparecerán aquí
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-medium text-gray-400">Cliente</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Deuda total</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Abonado</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Saldo</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Progreso</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Deudas</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debts.map(debt => (
                <DebtTableRow key={debt.customer_id} debt={debt} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>

    </div>
  )
}