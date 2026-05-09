import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ProductProfit } from '../../types/dashboard-stats.types'

interface ProductProfitTableProps {
  data: ProductProfit[]
}

function cop(n: number) {
  return `$${Math.round(n).toLocaleString('es-CO')}`
}

function margin(revenue: number, profit: number) {
  if (!revenue) return 0
  return Math.round((profit / revenue) * 100)
}

export function ProductProfitTable({ data }: ProductProfitTableProps) {
  if (!data.length) {
    return (
      <div className="text-center py-10 text-sm text-gray-400">
        Sin datos en este período
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <Table>
        <TableHeader>
          <TableRow className="border-0">
            <TableHead className="bg-gray-50 rounded-l-xl text-xs font-semibold text-gray-500 uppercase tracking-wide">Producto</TableHead>
            <TableHead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Uds</TableHead>
            <TableHead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Ingresos</TableHead>
            <TableHead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Costo</TableHead>
            <TableHead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Ganancia</TableHead>
            <TableHead className="bg-gray-50 rounded-r-xl text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Margen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => {
            const m = margin(row.total_revenue, row.total_profit)
            return (
              <TableRow key={row.product_id} className="border-gray-50 hover:bg-gray-50/60 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                      {i + 1}
                    </span>
                    <span className="font-medium text-gray-900 text-sm">{row.product_name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm text-gray-500">{row.total_quantity}</TableCell>
                <TableCell className="text-right text-sm text-gray-600 font-medium">{cop(row.total_revenue)}</TableCell>
                <TableCell className="text-right text-sm text-gray-500">{cop(row.total_cost)}</TableCell>
                <TableCell className="text-right text-sm font-semibold text-emerald-600">{cop(row.total_profit)}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="secondary"
                    className={
                      m >= 40 ? 'bg-emerald-50 text-emerald-700 border-0' :
                      m >= 20 ? 'bg-yellow-50 text-yellow-700 border-0' :
                                'bg-red-50 text-red-600 border-0'
                    }
                  >
                    {m}%
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}