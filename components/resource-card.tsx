"use client"

import React from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { useSession } from "next-auth/react"

import { Resource } from "@/types/resource"
import { Badge } from "@/components/ui/badge"
import IdeaGenerator from "@/components/idea-generator"

export function ResourceCard({
  resource,
  index,
  showCategory,
}: {
  resource: Resource
  index: number
  showCategory?: boolean
}) {
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  return (
    <div className="relative rounded-lg border border-ink bg-paper px-[22px] pb-[22px] pt-[26px]">
      <span className="absolute -top-px left-[22px] rounded-b-[5px] bg-amber px-2.5 py-0.5 font-mono text-[11px] font-bold tracking-[0.1em] text-paper">
        №{String(index + 1).padStart(3, "0")}
      </span>

      <div className="mb-1.5 mt-2.5 flex items-start justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft">
          {resource.Category}
        </p>
        {showCategory && (
          <Badge
            variant="outline"
            className="rounded-full border-ink/30 font-mono text-[11px] font-normal text-ink-soft"
          >
            {resource.Category}
          </Badge>
        )}
      </div>
      <h3 className="mb-2.5 text-xl font-bold">{resource.API}</h3>
      <p className="mb-[18px] min-h-[42px] text-sm leading-[1.55] text-ink-soft">
        {resource.Description}
      </p>

      <div className="mb-[18px] grid grid-cols-3 gap-2 rounded-md border border-dashed border-ink/30 p-3.5 font-mono">
        <div>
          <p className="mb-0.5 text-[10px] uppercase tracking-[0.1em] text-ink-soft">
            Auth
          </p>
          <p className="text-[13px] font-semibold">{resource.Auth || "None"}</p>
        </div>
        <div>
          <p className="mb-0.5 text-[10px] uppercase tracking-[0.1em] text-ink-soft">
            HTTPS
          </p>
          <p className="text-[13px] font-semibold">
            {resource.HTTPS ? "Yes" : "No"}
          </p>
        </div>
        <div>
          <p className="mb-0.5 text-[10px] uppercase tracking-[0.1em] text-ink-soft">
            CORS
          </p>
          <p className="text-[13px] font-semibold">
            {resource.Cors === "yes" ? "Yes" : "No"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-ink/15 pt-3.5">
        <Link
          href={resource.Link}
          target="_blank"
          className="inline-flex items-center gap-1 font-mono text-[13px] font-semibold hover:text-amber"
        >
          View API <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        {isLoggedIn && (
          <IdeaGenerator
            api={resource.API}
            apiLink={resource.Link}
            description={resource.Description}
          />
        )}
      </div>
    </div>
  )
}
