"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

import { fetchResources } from "@/lib/fetchResources"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DynamicIcon } from "@/components/icons"

const CategoryCard = () => {
  const [categoryCounts, setCategoryCounts] = React.useState<
    Record<string, number>
  >({})
  const [data, setData] = useState<any>(null)
  useEffect(() => {
    async function loadCategoriesAndResources() {
      try {
        const categories = await fetchResources("categories")
        const resources = await fetchResources("resources")
        setData(categories)
        const resourceCountByCategory = categories.entries.reduce(
          (acc: Record<string, number>, category: any) => {
            acc[category.name] = resources.entries.filter(
              (resource: any) => resource.Category === category.name
            ).length
            return acc
          },
          {}
        )
        setCategoryCounts(resourceCountByCategory)
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    loadCategoriesAndResources()
      .then(() => {})
      .catch((error) => console.error("Error loading data:", error))
  }, [])

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {data
          ? data.entries.map((entry: any, index: number) => (
              <div key={index}>
                <Link href={`/categories/${entry.slug}`}>
                  <Card className="w-[320px] border border-input transition-all duration-300 ease-in-out hover:border-accent-foreground hover:bg-accent hover:text-accent-foreground">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-xl font-extrabold leading-tight">
                        {entry.name}
                      </CardTitle>
                      <CardDescription>
                        <DynamicIcon name={entry.slug} className="size-10" />
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <p className="text-sm text-muted-foreground">
                        Browse all {categoryCounts[entry.name]} resources
                      </p>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            ))
          : Array.from({ length: 40 }).map((_, index) => (
              <div key={index}>
                <div className="flex flex-col">
                  <Skeleton className="h-24 w-[320px] rounded-xl" />
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}

export default CategoryCard
