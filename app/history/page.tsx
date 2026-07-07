import { IdeasHistory } from "@/components/ideas-history"

export default function HistoryPage() {
  return (
    <div className="rounded-lg border-2 border-ink bg-ink px-6 py-12 text-paper sm:px-10 sm:py-16">
      <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.3em] text-amber-soft">
        Ledger 04
      </p>
      <h1 className="mb-3 text-[38px] font-bold">Your Collection</h1>
      <p className="mb-11 max-w-[60ch] text-paper/65">
        Every idea you generated, saved, or shared with the world — filed in
        order.
      </p>
      <IdeasHistory />
    </div>
  )
}
