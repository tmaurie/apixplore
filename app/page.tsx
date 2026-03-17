import Link from "next/link"
import type { ReactNode } from "react"
import {
  BookTextIcon,
  CalendarCheckIcon,
  ChevronRightIcon,
  Clapperboard,
  CodeIcon,
  GlobeIcon,
  LightbulbIcon,
  MessageCircleQuestion,
  MusicIcon,
  RocketIcon,
  Settings2Icon,
  Share2Icon,
  SparklesIcon,
  SunSnow,
} from "lucide-react"

import { fetchResources } from "@/lib/fetchResources"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"
import { AuroraText } from "@/components/magicui/aurora-text"
import { MagicCard } from "@/components/magicui/magic-card"
import { Marquee } from "@/components/magicui/marquee"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { TypingAnimation } from "@/components/magicui/typing-animation"

const ideaItems = [
  {
    icon: <LightbulbIcon className="h-4 w-4" />,
    text: "Voice weather assistant (OpenWeather)",
  },
  {
    icon: <CodeIcon className="h-4 w-4" />,
    text: "Fun avatar generator (DiceBear)",
  },
  {
    icon: <GlobeIcon className="h-4 w-4" />,
    text: "World culture quiz (REST Countries)",
  },
  {
    icon: <MusicIcon className="h-4 w-4" />,
    text: "Mood-based playlist (Spotify API)",
  },
  {
    icon: <CalendarCheckIcon className="h-4 w-4" />,
    text: "Smart scheduler (Google Calendar)",
  },
  {
    icon: <BookTextIcon className="h-4 w-4" />,
    text: "Article summarizer (New York Times)",
  },
  {
    icon: <Clapperboard className="h-4 w-4" />,
    text: "Movie recommendation engine (OMDb API)",
  },
  {
    icon: <MessageCircleQuestion className="h-4 w-4" />,
    text: "Interactive FAQ bot (Dialogflow)",
  },
  {
    icon: <SunSnow className="h-4 w-4" />,
    text: "Climate change visualizer (NASA APIs)",
  },
  {
    icon: <Settings2Icon className="h-4 w-4" />,
    text: "Personal finance tracker (Plaid API)",
  },
]

const productPillars = [
  {
    icon: SparklesIcon,
    eyebrow: "Discover",
    title: "Find APIs worth building around",
    description:
      "Browse a curated catalog with the filters that matter when you need to go from vague curiosity to shortlist.",
    href: "/resources",
    cta: "Explore the library",
  },
  {
    icon: RocketIcon,
    eyebrow: "Prototype",
    title: "Turn an API into an actual product angle",
    description:
      "Generate sharper concepts, compare directions, and keep the ideas that deserve a second pass.",
    href: "/history",
    cta: "Open your history",
  },
  {
    icon: Share2Icon,
    eyebrow: "Share",
    title: "Give the strongest concepts a page of their own",
    description:
      "Public ideas now travel beyond your dashboard, which makes the best sparks easier to discuss and amplify.",
    href: "/public",
    cta: "See shared ideas",
  },
]

const heroSteps = [
  {
    label: "01",
    title: "Pick an API",
    body: "Start from the catalog instead of a blank page.",
  },
  {
    label: "02",
    title: "Shape the idea",
    body: "Turn a raw capability into something people would actually use.",
  },
  {
    label: "03",
    title: "Make it travel",
    body: "Publish the best direction and share the page.",
  },
]

const firstRow = ideaItems.slice(0, ideaItems.length / 2)
const secondRow = ideaItems.slice(ideaItems.length / 2)

export default async function LandingPage() {
  const resources = await fetchResources("resources")
  const totalCount = resources.entries.length

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-100">
      <main className="relative z-10 flex flex-col gap-24 pb-24 pt-10 lg:gap-32 lg:pb-32">
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] uppercase tracking-[0.35em] text-white/70">
              Curated - APIs
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                From API discovery to shareable product ideas with{" "}
                <AuroraText>APIxplore</AuroraText>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                A cleaner loop for makers: discover strong APIs, generate useful
                concepts, and publish the ideas worth showing around.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/resources"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-slate-900 hover:bg-white/90 shadow-lg shadow-sky-500/20"
                )}
              >
                <SparklesIcon className="mr-2 h-5 w-5" />
                Browse the library
              </Link>
              <Link
                href="/public"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/20 text-white hover:bg-white/10"
                )}
              >
                Explore shared ideas
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <HeroStat
                label="APIs cataloged"
                value={
                  <NumberTicker
                    value={totalCount}
                    startValue={Math.max(totalCount - 250, 0)}
                    className="text-4xl font-semibold text-white"
                  />
                }
                helper="ready to filter"
              />
              <HeroStat label="Idea sparks" value="+150" helper="to remix" />
              <HeroStat label="Public loop" value="Live" helper="publish + share" />
            </div>
          </div>

          <MagicCard
            className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-0"
            gradientFrom="#38bdf8"
            gradientTo="#fb7185"
            gradientColor="rgba(15,23,42,0.8)"
          >
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,26,55,0.96)_0%,rgba(10,18,40,0.98)_100%)] p-7 shadow-[0_30px_80px_rgba(4,8,30,0.45)] sm:p-8">
              <AnimatedGridPattern
                numSquares={26}
                maxOpacity={0.16}
                duration={4}
                repeatDelay={0.8}
                className="text-sky-300/35 [mask-image:radial-gradient(circle_at_top,white,transparent_80%)]"
              />

              <div className="relative z-10 flex items-center justify-between gap-4">
                <AnimatedShinyText className="text-[11px] uppercase tracking-[0.35em] text-white/70">
                  Idea engine
                </AnimatedShinyText>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                  share-ready
                </span>
              </div>

              <div className="relative z-10 mt-8 space-y-6">
                <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                    Live sequence
                  </p>
                  <TypingAnimation
                    as="p"
                    duration={28}
                    className="mt-3 text-2xl font-semibold leading-tight text-white"
                  >
                    Pick an API. Shape the concept. Share the page.
                  </TypingAnimation>
                </div>

                <div className="grid gap-3">
                  {heroSteps.map((step) => (
                    <div
                      key={step.label}
                      className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold text-white/80">
                        {step.label}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {step.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[28px] border border-white/10 bg-gradient-to-r from-white/8 to-transparent px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                    Why it works
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    The homepage now reflects the real product loop instead of
                    stacking disconnected surfaces.
                  </p>
                </div>
              </div>
            </div>
          </MagicCard>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
              Product Loop
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
              Three clear surfaces, one calmer story.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Instead of cramming the homepage with mini-dashboards, the new
              layout gives each job one strong card and enough room to breathe.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {productPillars.map((pillar) => (
              <FeaturePanel key={pillar.title} pillar={pillar} />
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6">
          <div className="overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#111b3c] via-[#101933] to-[#1a1945] px-6 py-10 shadow-[0_30px_80px_rgba(8,10,38,0.35)] sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-white/55">
                  Inspiration rail
                </p>
                <h3 className="text-3xl font-semibold text-white md:text-4xl">
                  A stream of ideas ready to become your next prototype.
                </h3>
                <p className="text-base leading-7 text-slate-300">
                  APIxplore is strongest when it helps you move from “that looks
                  interesting” to “that’s a concept we should ship.”
                </p>
              </div>
              <Link
                href="/resources"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/20 text-white hover:bg-white/10"
                )}
              >
                Start exploring
              </Link>
            </div>

            <div className="mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
              <Marquee className="[--duration:34s]" reverse>
                <div className="flex gap-4 px-5 py-5">
                  {firstRow.map((item, index) => (
                    <IdeaChip key={index} icon={item.icon} text={item.text} />
                  ))}
                </div>
              </Marquee>
              <Marquee className="[--duration:34s]">
                <div className="flex gap-4 px-5 pb-5">
                  {secondRow.map((item, index) => (
                    <IdeaChip key={index} icon={item.icon} text={item.text} />
                  ))}
                </div>
              </Marquee>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6">
          <div className="grid gap-8 rounded-[36px] border border-white/10 bg-white/[0.04] px-6 py-8 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-white/55">
                Ready to start
              </p>
              <h3 className="max-w-2xl text-3xl font-semibold text-white md:text-4xl">
                Build your next concept from a stronger starting point.
              </h3>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                Browse the catalog, save the promising ideas, and share the ones
                that deserve momentum.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/resources"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-slate-900 hover:bg-white/90"
                )}
              >
                Open resources
              </Link>
              <Link
                href="/public"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "text-white hover:bg-white/10"
                )}
              >
                Browse the feed
                <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function HeroStat({
  label,
  value,
  helper,
}: {
  label: string
  value: ReactNode
  helper: string
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/5 px-5 py-5">
      <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
        {label}
      </p>
      <div className="mt-2 text-4xl font-semibold text-white">{value}</div>
      <p className="mt-2 text-sm text-slate-300">{helper}</p>
    </div>
  )
}

function FeaturePanel({
  pillar,
}: {
  pillar: {
    icon: React.ElementType
    eyebrow: string
    title: string
    description: string
    href: string
    cta: string
  }
}) {
  const Icon = pillar.icon

  return (
    <MagicCard
      className="group h-full rounded-[30px] border border-white/10 bg-white/[0.04] p-0 transition-transform duration-300 hover:-translate-y-1"
      gradientFrom="#38bdf8"
      gradientTo="#a855f7"
      gradientColor="rgba(15,23,42,0.65)"
      gradientSize={180}
    >
      <div className="relative h-full min-h-[360px] overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.92)_0%,rgba(15,23,42,0.96)_100%)] p-6 shadow-[0_18px_50px_rgba(3,7,26,0.28)] transition duration-300 group-hover:border-white/20 group-hover:shadow-[0_28px_70px_rgba(56,189,248,0.14)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_38%)] opacity-0 transition duration-500 group-hover:opacity-100" />
        <div className="flex h-full flex-col justify-between gap-8">
          <div className="flex min-h-[244px] flex-col space-y-5">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition duration-300 group-hover:scale-105 group-hover:border-white/20 group-hover:bg-white/14">
              <Icon className="h-5 w-5" />
            </span>
            <div className="flex flex-1 flex-col space-y-3">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                {pillar.eyebrow}
              </p>
              <h3 className="min-h-[96px] text-2xl font-semibold leading-tight text-white transition duration-300 group-hover:text-sky-50">
                {pillar.title}
              </h3>
              <p className="flex-1 text-sm leading-7 text-slate-300">
                {pillar.description}
              </p>
            </div>
          </div>

          <Link
            href={pillar.href}
            className="inline-flex items-center text-sm font-semibold text-sky-300 transition duration-300 hover:text-sky-200 group-hover:translate-x-1"
          >
            {pillar.cta}
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </MagicCard>
  )
}

function IdeaChip({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur">
      {icon}
      <span>{text}</span>
    </div>
  )
}
