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
    <section className="container space-y-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
            }}
            className="max-w-sm"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alpha">A → Z</SelectItem>
              <SelectItem value="resources">Most entries</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 className="size-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
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
              <p className="text-muted-foreground">No categories found.</p>
            )}
          </div>
        </>
      )}
    </section>
  )
}
