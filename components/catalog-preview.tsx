import { Resource } from "@/types/resource"
import { ResourceCard } from "@/components/resource-card"

/**
 * The hero visual. Not a mock: this renders the real ResourceCard component
 * with real entries from the same catalog fetch the rest of the page uses,
 * so it cannot drift out of sync with the actual product.
 */
export function CatalogPreview({ entries }: { entries: Resource[] }) {
  // Recognisable entries first, then whatever the catalog gives us.
  const preferred = ["Spotify", "NASA"]
  const picked: Resource[] = []

  for (const name of preferred) {
    const match = entries.find(
      (entry) => entry.API.toLowerCase() === name.toLowerCase()
    )
    if (match) picked.push(match)
  }
  for (const entry of entries) {
    if (picked.length >= 2) break
    if (!picked.includes(entry)) picked.push(entry)
  }

  return (
    <div className="rounded-md border border-ink/12 bg-paper-dim p-4 shadow-[0_18px_50px_-24px_oklch(0.175_0.004_100/0.3)] sm:p-5">
      <div className="mb-3.5 flex items-center gap-3 px-1">
        <span className="text-xs font-semibold text-ink-soft">
          All public APIs
        </span>
        <span className="h-px flex-1 bg-ink/10" />
        <span className="font-mono text-[11px] tabular-nums text-ink-soft">
          {entries.length.toLocaleString()}
        </span>
      </div>
      <div className="grid gap-3">
        {picked.map((resource) => (
          <ResourceCard
            key={resource.API + resource.Link}
            resource={resource}
            showCategory
          />
        ))}
      </div>
    </div>
  )
}
