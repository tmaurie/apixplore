"use client"

import { useEffect, useState } from "react"

export function QuotaBar() {
  const [used, setUsed] = useState(0)
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuota = async () => {
      const res = await fetch("/api/quota")
      const data = await res.json()
      setUsed(data.used)
      setLimit(data.limit)
      setLoading(false)
    }

    fetchQuota()
  }, [])

  if (loading) return null

  const remaining = limit - used
  const percent = Math.round((remaining / limit) * 100)

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground flex items-center gap-2">
        💡 {remaining} idea{remaining > 1 ? "s" : ""} remaining
        {remaining > 1 ? "s" : ""} today
      </p>
      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
