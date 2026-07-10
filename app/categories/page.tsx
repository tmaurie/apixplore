"use client"

import { useState } from "react"
import { Grid3x3, List } from "lucide-react"

import { useCategoriesWithCount } from "@/lib/hooks/useCategoriesWithCount"
import { cn } from "@/lib/utils"
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
import { CategoryCardItem } from "@/components/cateogry-card-item"
import { PageSurface } from "@/components/page-surface"

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
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-amber">
              Index 03
            </p>
            <h1 className="text-[38px] font-bold">Explore by Category</h1>
            <p className="max-w-[60ch] text-ink-soft">
              Scan the full API universe, sorted by popularity, filed by
              subject.
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm rounded-md border-ink bg-paper font-mono text-sm"
              />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-auto w-[170px] rounded-md border-ink/40 bg-paper px-4 py-2.5 font-mono text-xs uppercase tracking-[0.08em]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="border-ink bg-paper font-mono text-xs">
                  <SelectItem value="alpha">A - Z</SelectItem>
                  <SelectItem value="resources">Most entries</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-md border-ink/40",
                  viewMode === "grid"
                    ? "border-ink bg-ink text-paper"
                    : "text-ink-soft hover:border-ink"
                )}
              >
                <Grid3x3 className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-md border-ink/40",
                  viewMode === "list"
                    ? "border-ink bg-ink text-paper"
                    : "text-ink-soft hover:border-ink"
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
                className="h-28 w-full rounded-md border border-ink/20"
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
                <p className="text-ink-soft">No categories found.</p>
              )}
            </div>
          </>
        )}
      </PageSurface>
    </div>
  )
}
