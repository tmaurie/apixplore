import React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { AuroraText } from "@/components/magicui/aurora-text"

export default function IndexPage() {
  return (
    <section className="container space-y-10 py-16">
      {/* Hero */}
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
         <AuroraText>{siteConfig.name}</AuroraText>
        </h1>
        <p className="text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href={siteConfig.links.categories}
            className={buttonVariants({ size: "lg" })}
          >
            Start Browsing
          </Link>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            GitHub
          </Link>
        </div>
      </div>

      {/* Features (placeholder) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Curated Public APIs",
            desc: "Discover reliable, open, and free APIs organized by category.",
          },
          {
            title: "AI-powered Project Ideas",
            desc: "Get inspired with smart ideas tailored to each API.",
          },
          {
            title: "Community-driven",
            desc: "Contribute to the project by adding or updating APIs.",
          },
        ].map((feature, i) => (
          <div key={i} className="rounded-2xl border bg-muted/50 p-6 shadow-xs">
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
