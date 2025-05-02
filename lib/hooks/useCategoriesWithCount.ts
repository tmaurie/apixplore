import { useEffect, useState } from "react"

import { fetchResources } from "@/lib/fetchResources"

interface Category {
  name: string
  id: string
}

interface Resource {
  Category: string
}

export function useCategoriesWithCount() {
  const [data, setData] = useState<Category[] | null>(null)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {}
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const categoriesRes = await fetchResources("categories")
        const resourcesRes = await fetchResources("resources")

        const categories: Category[] = categoriesRes.entries
        const resources: Resource[] = resourcesRes.entries

        setData(categories)

        const counts = categories.reduce(
          (acc: Record<string, number>, category) => {
            acc[category.name] = resources.filter(
              (r) => r.Category === category.name
            ).length
            return acc
          },
          {}
        )

        setCategoryCounts(counts)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { categories: data, categoryCounts, loading }
}
