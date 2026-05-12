import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { getSaleDetail } from '../services/get-sale-detail.service'
import { InvoiceData } from '../types/invoice.types'

export function useInvoice() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<InvoiceData | null>(null)
  const templateRef = useRef<HTMLDivElement>(null)

  const download = async (saleId: string) => {
    setLoading(true)
    try {
      const invoice = await getSaleDetail(saleId)
      setData(invoice)

      await new Promise(resolve => setTimeout(resolve, 300))

      if (!templateRef.current) return

      const dataUrl = await toPng(templateRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      })

      const link = document.createElement('a')
      link.download = `factura-${invoice.date.replace(/\//g, '-')}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error generando factura:', err)
    } finally {
      setLoading(false)
      setData(null)
    }
  }

  return { download, loading, data, templateRef }
}