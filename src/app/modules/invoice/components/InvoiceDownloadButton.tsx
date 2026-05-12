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
        className="p-1.5 rounded-lg text-gray-300 hover:text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-40"
      >
        {loading
          ? <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin block" />
          : <Download size={15} />
        }
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