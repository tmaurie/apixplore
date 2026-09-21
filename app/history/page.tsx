import { IdeasHistory } from "@/components/ideas-history"

export default function HistoryPage() {
  return (
    <div>
      <header className="mb-10 border-b border-ink/10 pb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
          Your collection
        </h1>
        <p className="max-w-[58ch] text-ink-soft">
          Every idea you generated, tagged or published, newest first.
        </p>
      </header>
      <IdeasHistory />
    </div>
  )
}
