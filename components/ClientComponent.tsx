"use client"

import React, { useEffect, useState } from "react"

import { fetchResources } from "@/lib/fetchResources"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

    loadData().then((r) => console.log(r))
  }, [])

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-2">
        {data?.entries.map((entry: any, index: number) => (
          <div key={index} className={""}>
            <Card className="w-[320px] border border-input hover:bg-accent hover:text-accent-foreground">
              <CardHeader>
                <CardTitle>{entry.name}</CardTitle>
                <CardDescription>{entry.slug}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
