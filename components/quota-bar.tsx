import { useEffect, useState } from "react"

export function QuotaBar() {
  const [quota, setQuota] = useState({ used: 0, limit: 10 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuota = async () => {
      const res = await fetch("/api/quota")
      const data = await res.json()
      setQuota(data)
      setLoading(false)
    }
    fetchQuota()
  }, [])

  const percentage = ((quota.limit - quota.used) / quota.limit) * 100

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground flex items-center gap-2">
        <span>API Quota</span>
        {loading ? (
          <span className="animate-pulse">Loading...</span>
        ) : (
          <span>
            {quota.limit - quota.used} / {quota.limit}
          </span>
        )}
      </p>
      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
