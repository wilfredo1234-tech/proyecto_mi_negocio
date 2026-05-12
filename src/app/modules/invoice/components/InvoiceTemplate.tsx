import { InvoiceData } from '../types/invoice.types'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)

const PAYMENT_LABEL = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  credito: 'Crédito',
}

type Props = { data: InvoiceData }

export function InvoiceTemplate({ data }: Props) {
  return (
    <div
      style={{
        width: '380px',
        backgroundColor: '#ffffff',
        fontFamily: "'Segoe UI', sans-serif",
        padding: '32px 28px',
        color: '#111',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '48px', height: '48px',
          backgroundColor: '#111',
          borderRadius: '14px',
          margin: '0 auto 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: '22px' }}>🧾</span>
        </div>
        <p style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Factura de venta</p>
        <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0' }}>
          {data.date} · {data.time}
        </p>
      </div>

      {/* Info */}
      <div style={{
        backgroundColor: '#f8f8f8',
        borderRadius: '12px',
        padding: '14px 16px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: '#888' }}>Cliente</span>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>
            {data.customer_name ?? 'Sin cliente'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: '#888' }}>Método de pago</span>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>
            {PAYMENT_LABEL[data.payment_method]}
          </span>
        </div>
      </div>

      {/* Tabla productos */}
      <div style={{ marginBottom: '20px' }}>
        {/* Header tabla */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          gap: '8px',
          paddingBottom: '8px',
          borderBottom: '1px solid #eee',
          marginBottom: '10px',
        }}>
          <span style={{ fontSize: '11px', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Producto</span>
          <span style={{ fontSize: '11px', color: '#888', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Cant.</span>
          <span style={{ fontSize: '11px', color: '#888', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Total</span>
        </div>

        {/* Items */}
        {data.items.map((item, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: '8px',
            paddingBottom: '10px',
            marginBottom: '10px',
            borderBottom: i < data.items.length - 1 ? '1px solid #f3f3f3' : 'none',
            alignItems: 'start',
          }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>{item.product_name}</p>
              {item.variant_name && (
                <p style={{ fontSize: '11px', color: '#888', margin: '2px 0 0' }}>{item.variant_name}</p>
              )}
              {item.show_unit_price && (
                <p style={{ fontSize: '11px', color: '#aaa', margin: '2px 0 0' }}>
                  {fmt(item.unit_price)}/{item.unit}
                </p>
              )}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, textAlign: 'right', paddingTop: '2px' }}>
              {item.quantity} {item.unit}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, textAlign: 'right', paddingTop: '2px' }}>
              {fmt(item.total)}
            </span>
          </div>
        ))}
      </div>

      {/* Línea separadora */}
      <div style={{ borderTop: '2px dashed #eee', marginBottom: '16px' }} />

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '15px', fontWeight: 700 }}>TOTAL</span>
        <span style={{ fontSize: '22px', fontWeight: 800 }}>{fmt(data.total)}</span>
      </div>

      {/* Saldo pendiente si es crédito */}
      {data.is_credit && data.pending_amount !== null && (
        <div style={{
          backgroundColor: '#fff7ed',
          borderRadius: '10px',
          padding: '12px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}>
          <span style={{ fontSize: '12px', color: '#c2410c', fontWeight: 600 }}>Saldo pendiente</span>
          <span style={{ fontSize: '14px', color: '#c2410c', fontWeight: 800 }}>{fmt(data.pending_amount)}</span>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ fontSize: '11px', color: '#ccc', margin: 0 }}>Gracias por tu compra</p>
      </div>
    </div>
  )
}