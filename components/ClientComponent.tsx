"use client"

import React, { useEffect, useState } from "react"

import { fetchResources } from "@/lib/fetchResources"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DynamicIcon } from "@/components/icons"

export default function ClientComponent() {
  const [data, setData] = useState<{ entries: any[] } | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchResources("categories")
        setData(result)
      } catch (error) {
        console.error(error)
      }
    }

    loadData().then()
  }, [])

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-2">
        {data
          ? data.entries.map((entry: any, index: number) => (
              <div key={index}>
                <Card className="w-[300px] border border-input hover:bg-accent hover:text-accent-foreground">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{entry.name}</CardTitle>
                    <CardDescription>
                      <DynamicIcon name={entry.slug} className="size-10" />
                    </CardDescription>
                  </CardHeader>
                </Card>
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
