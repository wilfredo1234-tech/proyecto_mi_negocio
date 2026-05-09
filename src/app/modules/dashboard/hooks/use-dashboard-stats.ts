import { useEffect, useState } from 'react'
import { DashboardStats, Period } from '../types/dashboard-stats.types'
import { getDashboardStats } from '../services/get-stats.service'

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [period, setPeriod] = useState<Period>('today')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async (p: Period) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getDashboardStats(p)
      setStats(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(period) }, [period])

  const changePeriod = (p: Period) => setPeriod(p)

  return { stats, period, loading, error, changePeriod }
}