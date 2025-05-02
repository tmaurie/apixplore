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
import ResourceCard from "@/components/resource-card"

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

  const [categoriesName, setCategoriesName] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const categories = await fetchResources("categories")
      const allResources = await fetchResources("resources")

      setCategoriesName(categories.entries.map((c: any) => c.name))
      const cat = categories.entries.find((c: any) => c.slug === categorySlug)
      if (!cat) return
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
    <section className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1">
                Categories
                <ChevronDownIcon className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 max-h-96 overflow-y-auto"
              >
                {categoriesName.map((cat) => (
                  <DropdownMenuItem key={cat}>
                    <BreadcrumbLink
                      href={`/categories/${cat.toLowerCase()}`}
                      className="w-full"
                    >
                      {cat}
                    </BreadcrumbLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{categoryName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{categoryName || "Loading..."}</h1>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">HTTPS</span>
            <Select
              value={filters.https}
              onValueChange={(v) => setFilters((f) => ({ ...f, https: v }))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">CORS</span>
            <Select
              value={filters.cors}
              onValueChange={(v) => setFilters((f) => ({ ...f, cors: v }))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Auth</span>
            <Select
              value={filters.auth}
              onValueChange={(v) => setFilters((f) => ({ ...f, auth: v }))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset filters
          </Button>

          <span className="text-sm text-muted-foreground">
            {visibleResources.length} API{visibleResources.length !== 1 && "s"}{" "}
            found
          </span>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading APIs...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {visibleResources.map((r, i) => (
            <ResourceCard key={r.API + r.Link} resource={r} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
