import Link from "next/link"

import { fetchResources } from "@/lib/fetchResources"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const contents = [
  {
    index: "01",
    title: "Discover — find APIs worth building around",
    description:
      "Browse a curated catalog with the filters that matter: auth, HTTPS, CORS.",
    href: "/resources",
  },
  {
    index: "02",
    title: "Prototype — turn an API into a product angle",
    description:
      "Generate sharper concepts, compare directions, keep what deserves a second pass.",
    href: "/history",
  },
  {
    index: "03",
    title: "Share — give the strongest ideas a page of their own",
    description:
      "Public ideas travel beyond your dashboard — easier to discuss, easier to amplify.",
    href: "/public",
  },
]

const specimens = [
  "№12 Voice weather assistant · OpenWeather",
  "№47 Avatar generator · DiceBear",
  "№03 World culture quiz · REST Countries",
  "№91 Mood playlist · Spotify",
  "№22 Movie recommender · OMDb",
  "№58 Climate visualizer · NASA",
]

export default async function LandingPage() {
  const resources = await fetchResources("resources")
  const totalCount = resources.entries.length

  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="pb-24 pt-16">
        <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.3em] text-amber">
          Field Guide No. 001 — Public APIs
        </p>
        <h1 className="mb-7 max-w-[15ch] text-[40px] font-bold leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[76px]">
          Find the API.
          <br />
          Frame the idea.
          <br />
          <span className="text-amber">Ship the page.</span>
        </h1>
        <p className="mb-9 max-w-[46ch] text-lg leading-relaxed text-ink-soft sm:text-xl">
          A working catalog for makers — browse {totalCount.toLocaleString()}+
          public APIs, generate a real product angle with AI, and publish the
          concepts worth sharing.
        </p>
        <div className="mb-16 flex flex-wrap gap-3.5">
          <Link
            href="/resources"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-md bg-ink px-7 py-6 font-mono text-sm font-semibold tracking-[0.05em] text-paper hover:bg-ink/90"
            )}
          >
            Browse the catalog →
          </Link>
          <Link
            href="/public"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-md border-ink px-7 py-6 font-mono text-sm font-semibold tracking-[0.05em] text-ink hover:bg-ink hover:text-paper"
            )}
          >
            See shared ideas
          </Link>
        </div>

        {/* ledger stats */}
        <div className="mb-16 grid gap-3.5 border-y border-ink/20 py-5">
          <LedgerRow label="APIs catalogued" value={totalCount.toLocaleString()} />
          <LedgerRow label="Idea sparks to remix" value="150+" />
          <LedgerRow
            label="Public sharing loop"
            value="● Live"
            valueClassName="text-live"
          />
        </div>

        {/* contents / three moves */}
        <div className="mb-16">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-ink-soft">
            Contents
          </p>
          <h2 className="mb-8 text-[28px] font-bold">Three moves, one loop.</h2>

          {contents.map((item, i) => (
            <Link
              key={item.index}
              href={item.href}
              className={cn(
                "grid grid-cols-[40px_1fr_auto] items-center gap-6 border-t border-ink/20 py-6 sm:grid-cols-[60px_1fr_auto]",
                i === contents.length - 1 && "border-b"
              )}
            >
              <span className="font-mono text-xl font-bold text-amber sm:text-2xl">
                {item.index}
              </span>
              <div>
                <p className="mb-1.5 text-lg font-semibold sm:text-xl">
                  {item.title}
                </p>
                <p className="max-w-[60ch] text-sm text-ink-soft">
                  {item.description}
                </p>
              </div>
              <span className="hidden font-mono text-sm sm:inline">→</span>
            </Link>
          ))}
        </div>

        {/* specimen chips */}
        <div>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-ink-soft">
            Specimens — ideas in the wild
          </p>
          <div className="flex flex-wrap gap-2.5">
            {specimens.map((text) => (
              <span
                key={text}
                className="rounded-full border border-ink/30 px-3.5 py-2 font-mono text-[13px]"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function LedgerRow({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-baseline gap-3 font-mono text-sm">
      <span className="whitespace-nowrap uppercase tracking-[0.1em] text-ink-soft">
        {label}
      </span>
      <span className="-translate-y-1 flex-1 border-b border-dotted border-ink/35" />
      <span className={cn("text-xl font-bold", valueClassName)}>{value}</span>
    </div>
  )
}
