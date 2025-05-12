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

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({
    https: "any",
    cors: "any",
    auth: "any",
  })

  useEffect(() => {
    const load = async () => {
      const all = await fetchResources("resources")
      setResources(all.entries)
      setLoading(false)
    }
    load()
  }, [])

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

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">All Public APIs</h1>
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex flex-wrap gap-4 items-center">
          {(["https", "cors", "auth"] as const).map((key) => (
            <div className="flex items-center gap-2" key={key}>
              <span className="text-sm uppercase font-medium">{key}</span>
              <Select
                value={filters[key]}
                onValueChange={(v) => setFilters((f) => ({ ...f, [key]: v }))}
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
          ))}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 12 }, (_, i) => (
            <Skeleton
              key={i}
              className="animate-pulse bg-muted rounded-md h-[200px]"
            />
          ))}
        </div>
      ) : visibleResources.length === 0 ? (
        <p className="text-muted-foreground">
          No APIs match your search or filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {visibleResources.map((r, i) => (
            <ResourceCard
              key={r.API + r.Link}
              resource={r}
              index={i}
              showCategory
            />
          ))}
        </div>
      )}
    </section>
  )
}
