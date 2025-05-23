"use client"

export function QuotaBar(
  props: {
    limit?: number
    used?: number
  } = {
    limit: 10,
    used: 0,
  }
) {
  const limit = props.limit || 10
  const used = props.used || 0

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
