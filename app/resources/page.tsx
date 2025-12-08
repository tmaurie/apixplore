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
import { ResourceCard } from "@/components/resource-card"
import { PageSurface } from "@/components/page-surface"

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

  const resetFilters = () => {
    setFilters({ https: "any", cors: "any", auth: "any" })
    setSearch("")
  }

  const paginatedResources = visibleResources.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "any"
  ).length

  return (
    <div className="space-y-8">
      <PageSurface>
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Library
            </p>
            <h1 className="text-3xl font-semibold md:text-4xl">
              All Public APIs
            </h1>
            <p className="text-white/70">
              Filter, search, and bookmark APIs without breaking your creative
              flow.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,280px)_1fr]">
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-white/20 bg-black/30 text-white placeholder:text-white/50"
            />
            <div className="grid gap-3 text-xs uppercase tracking-[0.25em] text-white/50 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                <p className="text-white/60">Catalog size</p>
                <p className="text-2xl font-semibold text-white">
                  {resources.length || "-"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                <p className="text-white/60">Filters applied</p>
                <p className="text-2xl font-semibold text-white">
                  {activeFilterCount}
                </p>
              </div>
              <div className="hidden rounded-2xl border border-white/5 bg-white/5 p-3 lg:block">
                <p className="text-white/60">Showing</p>
                <p className="text-2xl font-semibold text-white">
                  {visibleResources.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-white/80 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            {(["https", "cors", "auth"] as const).map((key) => (
              <div className="flex items-center gap-2" key={key}>
                <span className="text-xs uppercase tracking-[0.3em] text-white/60">
                  {key}
                </span>
                <Select
                  value={filters[key]}
                  onValueChange={(v) => setFilters((f) => ({ ...f, [key]: v }))}
                >
                  <SelectTrigger className="w-[110px] border-white/15 bg-transparent text-white">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050816] text-white">
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-white/80 hover:text-white"
            >
              Reset filters
            </Button>
            <span className="text-sm text-white/60">
              {visibleResources.length} API
              {visibleResources.length !== 1 && "s"} ready
            </span>
          </div>
        </div>
      </PageSurface>

      <PageSurface>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 12 }, (_, i) => (
              <Skeleton
                key={i}
                className="h-[220px] rounded-3xl border border-white/10 bg-white/10"
              />
            ))}
          </div>
        ) : visibleResources.length === 0 ? (
          <p className="text-white/70">
            No APIs match your search or filters.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {paginatedResources.map((r, i) => (
                <ResourceCard
                  key={r.API + r.Link}
                  resource={r}
                  index={(page - 1) * pageSize + i}
                  showCategory
                />
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-white">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-white/20 text-white/90 hover:text-white"
              >
                {"<-"} Prev
              </Button>
              <span className="px-2 text-sm text-white/70">
                Page {page} / {Math.ceil(visibleResources.length / pageSize)}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setPage((p) =>
                    p < Math.ceil(visibleResources.length / pageSize) ? p + 1 : p
                  )
                }
                disabled={page === Math.ceil(visibleResources.length / pageSize)}
                className="border-white/20 text-white/90 hover:text-white"
              >
                Next {"->"}
              </Button>
            </div>
          </>
        )}
      </PageSurface>
    </div>
  )
}

