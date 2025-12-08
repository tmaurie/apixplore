import { IdeasHistory } from "@/components/ideas-history"
import { PageSurface } from "@/components/page-surface"

export default function HistoryPage() {
  return (
    <PageSurface className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">
          Personal log
        </p>
        <h1 className="text-3xl font-semibold text-white">My Ideas History</h1>
        <p className="text-white/70">
          Revisit and manage every concept you have generated so far.
        </p>
      </div>
      <IdeasHistory />
    </PageSurface>
  )
}
