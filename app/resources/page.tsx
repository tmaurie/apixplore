"use client"

import { useEffect, useState } from "react"

import { fetchResources } from "@/lib/fetchResources"
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
import { PageSurface } from "@/components/page-surface"
import { ResourceCard } from "@/components/resource-card"

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({
    https: "any",
    cors: "any",
    auth: "any",
  })
  const [page, setPage] = useState(1)
  const pageSize = 30

  useEffect(() => {
    const load = async () => {
      const all = await fetchResources("resources")
      setResources(all.entries)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [filters, search])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [page])

  const visibleResources = resources
    .filter((r) => {
      if (filters.https === "yes" && !r.HTTPS) return false
      if (filters.https === "no" && r.HTTPS) return false
      if (filters.cors === "yes" && r.Cors !== "yes") return false
      if (filters.cors === "no" && r.Cors === "yes") return false
      if (filters.auth === "yes" && !r.Auth) return false
      if (filters.auth === "no" && r.Auth) return false
      return true
    })
    .filter((r) => r.API.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.API.localeCompare(b.API))

  const paginatedResources = visibleResources.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  const pageCount = Math.max(1, Math.ceil(visibleResources.length / pageSize))

  return (
    <div className="rounded-lg border-2 border-ink bg-paper-dim px-6 py-12 sm:px-10 sm:py-16">
      <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.3em] text-amber">
        Catalog Drawer 02
      </p>
      <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="mb-3 text-[38px] font-bold">All Public APIs</h1>
          <p className="max-w-[50ch] text-ink-soft">
            Search, filter, and bookmark without breaking your flow.
          </p>
        </div>
        <div className="flex gap-5 font-mono">
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-soft">
              Total
            </p>
            <p className="text-[26px] font-bold">{resources.length || "-"}</p>
          </div>
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-soft">
              Showing
            </p>
            <p className="text-[26px] font-bold">{visibleResources.length}</p>
          </div>
        </div>
      </div>

      <div className="mb-10 flex flex-wrap items-center gap-3 border-b border-ink/25 pb-6">
        <Input
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[220px] flex-1 rounded-md border-ink bg-paper font-mono text-sm"
        />
        <div className="flex gap-2 font-mono text-xs uppercase tracking-[0.08em]">
          {(["auth", "https", "cors"] as const).map((key) => (
            <Select
              key={key}
              value={filters[key]}
              onValueChange={(v) => setFilters((f) => ({ ...f, [key]: v }))}
            >
              <SelectTrigger
                className="h-auto rounded-md border-ink/40 bg-paper px-4 py-2.5 font-mono text-xs uppercase tracking-[0.08em] data-[state=open]:border-ink"
              >
                <SelectValue placeholder={`${key}: Any`}>
                  {key}: {filters[key] === "any" ? "Any" : filters[key] === "yes" ? "Yes" : "No"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-ink bg-paper font-mono text-xs">
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-lg border border-ink/20" />
          ))}
        </div>
      ) : visibleResources.length === 0 ? (
        <p className="mb-10 text-ink-soft">No APIs match your search or filters.</p>
      ) : (
        <>
          <div className="mb-10 grid grid-cols-1 gap-6 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
            {paginatedResources.map((r, i) => (
              <ResourceCard
                key={r.API + r.Link}
                resource={r}
                index={(page - 1) * pageSize + i}
                showCategory
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 font-mono text-[13px] uppercase tracking-[0.08em]">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border-ink px-4 py-2.5 font-mono text-[13px] uppercase tracking-[0.08em] hover:bg-ink hover:text-paper"
            >
              ← Prev
            </Button>
            <span className="text-ink-soft">
              Page {String(page).padStart(2, "0")} / {pageCount}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => (p < pageCount ? p + 1 : p))}
              disabled={page === pageCount}
              className="rounded-md border-ink px-4 py-2.5 font-mono text-[13px] uppercase tracking-[0.08em] hover:bg-ink hover:text-paper"
            >
              Next →
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
