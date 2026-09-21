"use client"

import React from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { useSession } from "next-auth/react"

import { Resource } from "@/types/resource"
import IdeaGenerator from "@/components/idea-generator"

export function ResourceCard({
  resource,
  showCategory,
}: {
  resource: Resource
  index?: number
  showCategory?: boolean
}) {
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  const capabilities = [
    { label: "Auth", value: resource.Auth || "None" },
    { label: "HTTPS", value: resource.HTTPS ? "Yes" : "No" },
    { label: "CORS", value: resource.Cors === "yes" ? "Yes" : "No" },
  ]

  return (
    <div className="flex flex-col rounded-md border border-ink/12 bg-paper p-5 transition-colors duration-200 hover:border-ink/30">
      {showCategory ? (
        <p className="mb-2 font-mono text-[11px] text-ink-soft">
          {resource.Category}
        </p>
      ) : null}

      <h3 className="mb-2 text-lg font-bold leading-snug">{resource.API}</h3>

      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-ink-soft">
        {resource.Description}
      </p>

      <dl className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {capabilities.map((capability) => (
          <div key={capability.label} className="flex items-baseline gap-1.5">
            <dt className="text-[11px] text-ink-soft">{capability.label}</dt>
            <dd className="font-mono text-[12px] font-semibold">
              {capability.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-ink/10 pt-3.5">
        <Link
          href={resource.Link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 hover:text-amber-deep"
        >
          View API
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
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
