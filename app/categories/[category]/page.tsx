"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ChevronDownIcon } from "lucide-react"

import { fetchResources } from "@/lib/fetchResources"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params?.category as string

  const [resources, setResources] = useState<any[]>([])
  const [categoryName, setCategoryName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    https: "any",
    cors: "any",
    auth: "any",
  })

  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const categories = await fetchResources("categories")
      const allResources = await fetchResources("resources")

      setCategories(categories.entries)
      const cat = categories.entries.find((c: any) => c.slug === categorySlug)
      if (!cat) {
        setLoading(false)
        return
      }
      setCategoryName(cat.name)

      const filtered = allResources.entries.filter(
        (r: any) => r.Category === cat.name
      )
      setResources(filtered)
      setLoading(false)
    }
    if (categorySlug) load()
  }, [categorySlug])

  const visibleResources = resources.filter((r) => {
    if (filters.https === "yes" && !r.HTTPS) return false
    if (filters.https === "no" && r.HTTPS) return false

    if (filters.cors === "yes" && r.Cors !== "yes") return false
    if (filters.cors === "no" && r.Cors === "yes") return false

    if (filters.auth === "yes" && !r.Auth) return false
    if (filters.auth === "no" && r.Auth) return false

    return true
  })

  const resetFilters = () => {
    setFilters({ https: "any", cors: "any", auth: "any" })
  }

  return (
    <div className="space-y-8">
      <PageSurface className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-white">
                  Categories
                  <ChevronDownIcon className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="max-h-96 w-56 overflow-y-auto border border-white/10 bg-[#050816] text-white"
                >
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.slug}>
                      <BreadcrumbLink
                        href={`/categories/${cat.slug}`}
                        className="w-full"
                      >
                        {cat.name}
                      </BreadcrumbLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">
                {categoryName || "Loading..."}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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
            {visibleResources.length !== 1 && "s"} listed
          </span>
        </div>
      </PageSurface>

      <PageSurface>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[200px] w-full rounded-3xl border border-white/10 bg-white/10"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleResources.map((r, i) => (
              <ResourceCard key={r.API + r.Link} resource={r} index={i} />
            ))}
          </div>
        )}
      </PageSurface>
    </div>
  )
}
