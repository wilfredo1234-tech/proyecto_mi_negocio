'use client'
import { useState } from 'react'
import { UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Customer } from '../types/customer.types'
import { CustomerTableRow } from './CustomerTableRow'
import { CustomerCard } from './CustomerCard'
import { CreateCustomerSheet } from './CreateCustomerSheet'
import { DeleteCustomerDialog } from './DeleteCustomerDialog'
import { useCustomers } from '../hooks/use-customers'
import { useDeleteCustomer } from '../hooks/use-delete-customer'

export function CustomerTable() {
  const { customers, loading, reload } = useCustomers()

  const [createOpen, setCreateOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null)

  const { remove, loading: deleting } = useDeleteCustomer(async () => {
    setCustomerToDelete(null)
    await reload()
  })

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {customers.length} clientes registrados
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-700 text-sm font-medium active:scale-95 transition-all"
        >
          <UserPlus size={16} />
          Nuevo cliente
        </Button>
      </div>

      {/* Desktop — Tabla */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Cargando...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-400">
              No hay clientes aún
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Crea tu primer cliente
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-medium text-gray-400">
                  Cliente
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-400">
                  Teléfono
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-400">
                  Registrado
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-400 text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map(customer => (
                <CustomerTableRow
                  key={customer.id}
                  customer={customer}
                  onEdit={setCustomerToEdit}
                  onDelete={setCustomerToDelete}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Móvil — Cards */}
      <div className="flex md:hidden flex-col gap-3">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Cargando...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-400">
              No hay clientes aún
            </p>
          </div>
        ) : (
          customers.map(customer => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={setCustomerToEdit}
              onDelete={setCustomerToDelete}
            />
          ))
        )}
      </div>

      {/* Sheet crear */}
      <CreateCustomerSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={async () => {
          setCreateOpen(false)
          await reload()
        }}
      />

      {/* Dialog eliminar */}
      <DeleteCustomerDialog
        customer={customerToDelete}
        open={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={remove}
        loading={deleting}
      />

    </div>
  )
}