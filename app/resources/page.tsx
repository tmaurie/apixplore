"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Fuse from "fuse.js"
import { SearchIcon } from "lucide-react"

import { useCatalog } from "@/lib/hooks/useCatalog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryRail } from "@/components/category-rail"
import { ResourceCard } from "@/components/resource-card"

const filterLabels = {
  auth: "Auth",
  https: "HTTPS",
  cors: "CORS",
} as const

function ResourcesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { resources, categories, loading } = useCatalog()

  const [search, setSearch] = useState(searchParams.get("q") ?? "")
  const [activeCategory, setActiveCategory] = useState<string | null>(
    searchParams.get("category")
  )
  const [filters, setFilters] = useState({
    https: "any",
    cors: "any",
    auth: "any",
  })
  const [page, setPage] = useState(1)
  const pageSize = 30

  useEffect(() => {
    const params = new URLSearchParams()
    if (activeCategory) params.set("category", activeCategory)
    if (search) params.set("q", search)
    const query = params.toString()
    router.replace(query ? `/resources?${query}` : "/resources", {
      scroll: false,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, search])

  useEffect(() => {
    setPage(1)
  }, [activeCategory, search, filters])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [page])

  const activeCategoryName = useMemo(
    () => categories.find((c) => c.slug === activeCategory)?.name ?? null,
    [categories, activeCategory]
  )

  const fuse = useMemo(
    () =>
      new Fuse(resources, {
        keys: [
          { name: "API", weight: 0.7 },
          { name: "Description", weight: 0.3 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [resources]
  )

  const searchedResources = useMemo(
    () => (search.trim() ? fuse.search(search).map((r) => r.item) : resources),
    [fuse, search, resources]
  )

  const visibleResources = searchedResources
    .filter((r) =>
      activeCategoryName ? r.Category === activeCategoryName : true
    )
    .filter((r) => {
      if (filters.https === "yes" && !r.HTTPS) return false
      if (filters.https === "no" && r.HTTPS) return false
      if (filters.cors === "yes" && r.Cors !== "yes") return false
      if (filters.cors === "no" && r.Cors === "yes") return false
      if (filters.auth === "yes" && !r.Auth) return false
      return !(filters.auth === "no" && r.Auth);

    })

  // Preserve fuzzy relevance order while searching; alphabetize for plain browsing.
  if (!search.trim()) {
    visibleResources.sort((a, b) => a.API.localeCompare(b.API))
  }

  const paginatedResources = visibleResources.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  const pageCount = Math.max(1, Math.ceil(visibleResources.length / pageSize))
  const hasActiveFilters =
    Object.values(filters).some((v) => v !== "any") ||
    !!search.trim() ||
    !!activeCategory

  const resetAll = () => {
    setSearch("")
    setActiveCategory(null)
    setFilters({ https: "any", cors: "any", auth: "any" })
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
      <CategoryRail
        categories={categories}
        total={resources.length}
        active={activeCategory}
        onSelect={setActiveCategory}
      />

      <div className="min-w-0 flex-1">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
              {activeCategoryName ?? "All public APIs"}
            </h1>
            <p className="max-w-[52ch] text-ink-soft">
              Search, filter and bookmark without breaking your flow.
            </p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="mb-1 text-xs text-ink-soft">Total</p>
              <p className="font-mono text-2xl font-bold tabular-nums">
                {resources.length || "0"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs text-ink-soft">Showing</p>
              <p className="font-mono text-2xl font-bold tabular-nums">
                {visibleResources.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-2.5 border-b border-ink/10 pb-6">
          <div className="relative min-w-[220px] flex-1">
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <Input
              id="q"
              name="q"
              aria-label="Search APIs by name or description"
              placeholder="Search by name or what it does"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-md border-ink/20 bg-paper pl-9 text-sm placeholder:text-ink-soft"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["auth", "https", "cors"] as const).map((key) => (
              <Select
                key={key}
                name={key}
                value={filters[key]}
                onValueChange={(v) => setFilters((f) => ({ ...f, [key]: v }))}
              >
                <SelectTrigger
                  aria-label={`Filter by ${filterLabels[key]}`}
                  className="h-10 rounded-md border-ink/20 bg-paper px-3.5 text-sm data-[state=open]:border-ink"
                >
                  <SelectValue>
                    {filterLabels[key]}
                    {filters[key] === "any"
                      ? ""
                      : filters[key] === "yes"
                      ? ": Yes"
                      : ": No"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="border-ink/15 bg-paper text-sm">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            ))}
            {hasActiveFilters ? (
              <Button
                variant="ghost"
                onClick={resetAll}
                className="h-10 px-3 text-sm text-ink-soft hover:text-ink"
              >
                Reset
              </Button>
            ) : null}
          </div>
        </div>

        {loading ? (
          <div className="mb-10 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(310px,1fr))]">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-[210px] rounded-md" />
            ))}
          </div>
        ) : visibleResources.length === 0 ? (
          <div className="mb-10 flex flex-col items-start gap-4 rounded-md border border-dashed border-ink/20 px-6 py-12">
            <div className="space-y-1.5">
              <p className="text-lg font-semibold">No APIs match that</p>
              <p className="max-w-[46ch] text-sm text-ink-soft">
                Try a broader search term, or clear the filters to see all{" "}
                {resources.length.toLocaleString()} entries.
              </p>
            </div>
            <Button
              onClick={resetAll}
              className="bg-ink text-paper hover:bg-ink/90"
            >
              Clear search and filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-10 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(310px,1fr))]">
              {paginatedResources.map((r, i) => (
                <ResourceCard
                  key={r.API + r.Link}
                  resource={r}
                  index={(page - 1) * pageSize + i}
                  showCategory={!activeCategoryName}
                />
              ))}
            </div>
            {pageCount > 1 ? (
              <div className="flex items-center justify-center gap-4 text-sm">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-10 border-ink/25 px-4 hover:bg-ink hover:text-paper"
                >
                  Previous
                </Button>
                <span className="font-mono tabular-nums text-ink-soft">
                  {page} / {pageCount}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => (p < pageCount ? p + 1 : p))}
                  disabled={page === pageCount}
                  className="h-10 border-ink/25 px-4 hover:bg-ink hover:text-paper"
                >
                  Next
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={null}>
      <ResourcesPageContent />
    </Suspense>
  )
}
