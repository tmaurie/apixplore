"use client"

import { useState } from "react"
import { Grid3x3, List } from "lucide-react"

import { useCategoriesWithCount } from "@/lib/hooks/useCategoriesWithCount"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import CategoryCardItem from "@/components/cateogry-card-item"

export default function Page() {
  const { categories, categoryCounts, loading } = useCategoriesWithCount()

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const itemsPerPage = 12

  const filteredCategories = categories?.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = filteredCategories
    ? Math.ceil(filteredCategories.length / itemsPerPage)
    : 0

  const paginatedCategories = filteredCategories?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <section className="container space-y-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="max-w-sm"
        />

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
            {paginatedCategories?.length ? (
              paginatedCategories.map((entry) => (
                <CategoryCardItem
                  key={entry.slug}
                  name={entry.name}
                  slug={entry.slug}
                  count={categoryCounts[entry.name] || 0}
                  viewMode={viewMode}
                />
              ))
            ) : (
              <p className="text-muted-foreground">No categories found.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
                ← Prev
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} / {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
