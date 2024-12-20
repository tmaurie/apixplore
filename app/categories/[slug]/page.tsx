import React from "react"

import { fetchResources } from "@/lib/fetchResources"
import ResourceCard from "@/components/resource-card"

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const categories = await fetchResources("categories")
  const resources = await fetchResources("resources")

  const category = categories.entries.find((entry: any) => entry.slug === slug)
  if (!category) {
    throw new Error(`Category not found for slug: ${slug}`)
  }

  const resourcesByCategory = resources.entries.filter(
    (resource: any) => resource.Category === category.name
  )

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        Browse {category.name} category
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resourcesByCategory.map((resource: any, index: number) => (
          <ResourceCard key={index} resource={resource} />
        ))}
      </div>
    </section>
  )
}
