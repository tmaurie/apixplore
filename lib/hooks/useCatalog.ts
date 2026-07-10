import { useEffect, useState } from "react"

import { fetchResources } from "@/lib/fetchResources"
import { Resource } from "@/types/resource"

export interface CatalogCategory {
  name: string
  slug: string
  count: number
}

export function useCatalog() {
  const [resources, setResources] = useState<Resource[]>([])
  const [categories, setCategories] = useState<CatalogCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [categoriesRes, resourcesRes] = await Promise.all([
          fetchResources("categories"),
          fetchResources("resources"),
        ])
        if (cancelled) return

        const rawResources: Resource[] = resourcesRes.entries
        const rawCategories: { name: string; slug: string }[] =
          categoriesRes.entries

        const catalogCategories = rawCategories
          .map((c) => ({
            ...c,
            count: rawResources.filter((r) => r.Category === c.name).length,
          }))
          .sort((a, b) => a.name.localeCompare(b.name))

        setResources(rawResources)
        setCategories(catalogCategories)
      } catch (error) {
        console.error("Error loading catalog:", error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { resources, categories, loading }
}
