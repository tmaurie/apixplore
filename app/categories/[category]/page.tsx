import React from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    <section className="container space-y-6 ">
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
                {categories.entries.map((category: any) => (
                  <DropdownMenuItem key={category.slug}>
                    <BreadcrumbLink href={`/categories/${category.slug}`}>
                      {category.name}
                    </BreadcrumbLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{categoryEntry.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="pt-10">
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
            index={resourcesByCategory.indexOf(resource)}
          />
        ))}
      </div>
    </section>
  )
}
