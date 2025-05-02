import React from "react"

import { fetchResources } from "@/lib/fetchResources"
import ResourceCard from "@/components/resource-card"

export default async function Page({ params }: any) {
  const { category } = await params
  const categories = await fetchResources("categories")
  const resources = await fetchResources("resources")

  const categoryEntry = categories.entries.find(
    (entry: any) => entry.slug === category
  )
  if (!categoryEntry) {
    throw new Error(`Category not found for : ${category}`)
  }

  const resourcesByCategory = resources.entries.filter(
    (resource: any) => resource.Category === categoryEntry.name
  )

  return (
    <section className="container space-y-6 py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {categoryEntry.name}
        </h1>
        <p className="text-muted-foreground">
          {resourcesByCategory.length} APIs found in this category
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {resourcesByCategory.map((resource: any) => (
          <ResourceCard
            key={resource.API + resource.Link}
            resource={resource}
          />
        ))}
      </div>
    </section>
  )
}
