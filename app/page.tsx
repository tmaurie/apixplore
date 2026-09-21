import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Resource } from "@/types/resource"
import { fetchResources } from "@/lib/fetchResources"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ApiLogoWall } from "@/components/api-logo-wall"
import { CatalogPreview } from "@/components/catalog-preview"
import { HeroStagger, Reveal } from "@/components/reveal"

// No per-row CTA label: the whole row is the link and the arrow is the
// affordance. Inline labels here would give the catalog and the feed a second
// and third name, which the page already covers once each in the hero.
const moves = [
  {
    index: "01",
    title: "Find APIs worth building around",
    description:
      "Browse the catalog with the filters that actually matter: auth, HTTPS, CORS.",
    href: "/resources",
  },
  {
    index: "02",
    title: "Turn an API into a product angle",
    description:
      "Generate concepts, compare directions, keep the ones that deserve a second pass.",
    note: "Needs a GitHub sign-in.",
    href: "/resources",
  },
  {
    index: "03",
    title: "Give the best ideas their own page",
    description:
      "Published ideas get a shareable URL, so they travel further than your dashboard.",
    href: "/public",
  },
]

export default async function LandingPage() {
  const resources: { entries: Resource[] } = await fetchResources("resources")
  const entries = resources.entries

  // Every number on this page is computed from the live catalog.
  const totalCount = entries.length
  const categoryCount = new Set(entries.map((entry) => entry.Category)).size
  const noAuthCount = entries.filter((entry) => !entry.Auth).length

  return (
    <div className="pb-8">
      {/* 1. Hero: full-width headline over an asymmetric copy / product split.
          The headline spans the container so it sets in 2 lines at full scale. */}
      <section className="pb-20 pt-6 sm:pt-10 lg:pb-28">
        <HeroStagger index={0}>
          <h1 className="mb-9 text-[2.25rem] font-bold leading-[1.06] tracking-[-0.025em] sm:text-5xl lg:text-[3.5rem]">
            Find the API. Frame the idea.
            <br />
            <span className="text-amber">Ship the page.</span>
          </h1>
        </HeroStagger>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <HeroStagger index={1}>
              <p className="mb-8 max-w-[42ch] text-lg leading-relaxed text-ink-soft">
                Browse {totalCount.toLocaleString()} public APIs, turn one into
                a real product concept with AI, then publish what is worth
                sharing.
              </p>
            </HeroStagger>

            <HeroStagger index={2}>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/resources"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group gap-2 bg-ink px-6 text-paper hover:bg-ink/90"
                  )}
                >
                  Browse the catalog
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </Link>
                <Link
                  href="/public"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "border-ink/25 px-6 text-ink hover:bg-ink hover:text-paper"
                  )}
                >
                  See shared ideas
                </Link>
              </div>
            </HeroStagger>
          </div>

          <HeroStagger index={3} className="lg:col-span-7 xl:-mr-16">
            <CatalogPreview entries={entries} />
          </HeroStagger>
        </div>
      </section>

      {/* 2. Logo wall: real marks, real catalog entries, sits under the hero. */}
      <section className="border-t border-ink/10 py-16">
        <Reveal>
          <p className="mb-10 text-sm text-ink-soft">
            Including the APIs you already know.
          </p>
          <ApiLogoWall />
        </Reveal>
      </section>

      {/* 3. Ledger: the signature dotted-leader rows, inverted onto ink. */}
      <section className="py-4">
        <Reveal>
          <div className="rounded-md bg-ink px-6 py-10 text-paper sm:px-10 sm:py-12">
            <h2 className="mb-8 max-w-[18ch] text-2xl font-bold leading-tight sm:text-3xl">
              A catalog you can actually filter.
            </h2>
            <div className="grid gap-4">
              <LedgerRow
                label="APIs catalogued"
                value={totalCount.toLocaleString()}
              />
              <LedgerRow label="Categories" value={String(categoryCount)} />
              <LedgerRow
                label="Usable without an API key"
                value={noAuthCount.toLocaleString()}
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* 4. Three moves: sticky heading left, the loop's steps right. */}
      <section className="py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Reveal>
              <h2 className="text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl lg:sticky lg:top-28">
                Three moves,
                <br />
                one loop.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            {moves.map((move, i) => (
              <Reveal key={move.index} index={i}>
                <Link
                  href={move.href}
                  className={cn(
                    "group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-5 border-t border-ink/12 py-7 transition-colors duration-200 hover:bg-paper-dim/60 sm:grid-cols-[3.5rem_1fr_auto] sm:px-3",
                    i === moves.length - 1 && "border-b"
                  )}
                >
                  <span className="self-start font-mono text-lg font-bold text-amber-deep sm:text-xl">
                    {move.index}
                  </span>
                  <div>
                    <p className="mb-2 text-xl font-semibold sm:text-2xl">
                      {move.title}
                    </p>
                    <p className="max-w-[54ch] text-ink-soft">
                      {move.description}
                    </p>
                    {move.note ? (
                      <p className="mt-2 text-sm text-ink-soft">{move.note}</p>
                    ) : null}
                  </div>
                  <ArrowRight
                    className="h-5 w-5 shrink-0 text-ink-soft transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Close. */}
      <section className="pb-8">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-md border border-ink/12 bg-paper-dim px-6 py-14 text-center sm:py-16">
            <h2 className="max-w-[20ch] text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl">
              Pick an API and see where it goes.
            </h2>
            <p className="max-w-[48ch] text-ink-soft">
              Browsing is open to everyone. Sign in with GitHub when you want to
              generate and publish.
            </p>
            <Link
              href="/resources"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group gap-2 bg-ink px-6 text-paper hover:bg-ink/90"
              )}
            >
              Browse the catalog
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

function LedgerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="whitespace-nowrap text-sm text-paper/60 sm:text-base">
        {label}
      </span>
      <span className="-translate-y-1 flex-1 border-b border-dotted border-paper/25" />
      <span className="font-mono text-xl font-bold tabular-nums sm:text-2xl">
        {value}
      </span>
    </div>
  )
}
