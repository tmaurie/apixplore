"use client"

import { useState } from "react"
import { Grid3x3, List } from "lucide-react"

import { useCategoriesWithCount } from "@/lib/hooks/useCategoriesWithCount"
import { cn } from "@/lib/utils"
import { PageSurface } from "@/components/page-surface"
import { CategoryCardItem } from "@/components/cateogry-card-item"
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

export default function Page() {
  const { categories, categoryCounts, loading } = useCategoriesWithCount()

  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("alpha")
  const filteredCategories = categories
    ?.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "alpha") return a.name.localeCompare(b.name)
      if (sortBy === "resources")
        return (categoryCounts[b.name] || 0) - (categoryCounts[a.name] || 0)
      return 0
    })

  return (
    <div className="space-y-8">
      <PageSurface>
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Catalog
            </p>
            <h1 className="text-3xl font-semibold md:text-4xl">
              Explore by Category
            </h1>
            <p className="text-white/70">
              Scan the entire API universe, sort by popularity, and jump into
              the collections that excite you.
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm border-white/20 bg-black/30 text-white placeholder:text-white/50"
              />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[170px] border-white/20 bg-transparent text-white/80">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-[#050816] text-white">
                  <SelectItem value="alpha">A - Z</SelectItem>
                  <SelectItem value="resources">Most entries</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className={cn(
                  viewMode === "grid"
                    ? "bg-white text-slate-900"
                    : "text-white/70 hover:text-white"
                )}
              >
                <Grid3x3 className="size-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={cn(
                  viewMode === "list"
                    ? "bg-white text-slate-900"
                    : "text-white/70 hover:text-white"
                )}
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </PageSurface>

      <PageSurface>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-28 w-full rounded-3xl border border-white/10 bg-white/10"
              />
            ))}
          </div>
        ) : (
          <>
            <div
              className={cn(
                "gap-6",
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col"
              )}
            >
              {filteredCategories?.length ? (
                filteredCategories.map((entry, i) => (
                  <CategoryCardItem
                    key={entry.slug}
                    name={entry.name}
                    slug={entry.slug}
                    count={categoryCounts[entry.name] || 0}
                    viewMode={viewMode}
                    index={i}
                  />
                ))
              ) : (
                <p className="text-white/70">No categories found.</p>
              )}
            </div>
          </>
        )}
      </PageSurface>
    </div>
  )
}
