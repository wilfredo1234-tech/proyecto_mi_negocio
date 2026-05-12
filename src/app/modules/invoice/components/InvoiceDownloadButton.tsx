'use client'
import { Download } from 'lucide-react'
import { useInvoice } from '../hooks/use-invoice'
import { InvoiceTemplate } from './InvoiceTemplate'

type Props = { saleId: string }

export function InvoiceDownloadButton({ saleId }: Props) {
  const { download, loading, data, templateRef } = useInvoice()

  return (
    <>
      <button
        onClick={() => download(saleId)}
        disabled={loading}
        title="Descargar factura"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-700 text-white text-xs font-semibold transition-all active:scale-95 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Generando...</span>
          </>
        ) : (
          <>
            <Download size={13} />
            <span>Factura</span>
          </>
        )}
      </button>

      <div style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        zIndex: -1,
        fontFamily: 'sans-serif',
        colorScheme: 'normal',
      }}>
        <div ref={templateRef} style={{ all: 'initial', display: 'block' }}>
          {data && <InvoiceTemplate data={data} />}
        </div>
      </div>
    </>
  )
}