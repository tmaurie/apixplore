import Link from "next/link"
import {
  BookTextIcon,
  CalendarCheckIcon,
  Clapperboard,
  CodeIcon,
  GlobeIcon,
  LightbulbIcon,
  MessageCircleQuestion,
  MusicIcon,
  RocketIcon,
  Settings2Icon,
  SparklesIcon,
  SunSnow,
} from "lucide-react"

import { fetchResources } from "@/lib/fetchResources"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { AuroraText } from "@/components/magicui/aurora-text"
import { Marquee } from "@/components/magicui/marquee"
import { NumberTicker } from "@/components/magicui/number-ticker"

const ideaItems = [
  {
    icon: <LightbulbIcon className="h-5 w-5" />,
    text: "Voice weather assistant (OpenWeather)",
  },
  {
    icon: <CodeIcon className="h-5 w-5" />,
    text: "Fun avatar generator (DiceBear)",
  },
  {
    icon: <GlobeIcon className="h-5 w-5" />,
    text: "World culture quiz (REST Countries)",
  },
  {
    icon: <MusicIcon className="h-5 w-5" />,
    text: "Mood-based playlist (Spotify API)",
  },
  {
    icon: <CalendarCheckIcon className="h-5 w-5" />,
    text: "Smart scheduler (Google Calendar)",
  },
  {
    icon: <BookTextIcon className="h-5 w-5" />,
    text: "Article summarizer (New York Times)",
  },
  {
    icon: <Clapperboard className="h-5 w-5" />,
    text: "Movie recommendation engine (OMDb API)",
  },
  {
    icon: <MessageCircleQuestion className="h-5 w-5" />,
    text: "Interactive FAQ bot (Dialogflow)",
  },
  {
    icon: <SunSnow className="h-5 w-5" />,
    text: "Climate change visualizer (NASA APIs)",
  },
  {
    icon: <Settings2Icon className="h-5 w-5" />,
    text: "Personal finance tracker (Plaid API)",
  },
]

const featureCards = [
  {
    icon: SparklesIcon,
    title: "Curated API atlas",
    description:
      "Verified documentation, rate-limit notes, and sample calls so you can focus on experience instead of plumbing.",
    accent: "from-sky-500/40 via-cyan-500/10 to-transparent",
  },
  {
    icon: Settings2Icon,
    title: "Idea-to-prototype flow",
    description:
      "Guided prompts transform a vague spark into scoped features, user journeys, and integration plans.",
    accent: "from-fuchsia-500/30 via-indigo-500/10 to-transparent",
  },
  {
    icon: RocketIcon,
    title: "Launch-ready resources",
    description:
      "Collections, starter repos, and community benchmarks to validate faster and ship with confidence.",
    accent: "from-amber-400/30 via-orange-500/10 to-transparent",
  },
]

const workflow = [
  {
    title: "Discover",
    description:
      "Filter APIs by capability, licensing, latency, and ecosystem fit without leaving the page.",
  },
  {
    title: "Prototype",
    description:
      "Use ready-to-run snippets, mock servers, and design cues to assemble elegant demos in hours.",
  },
  {
    title: "Launch",
    description:
      "Track dependencies, security notes, and changelog alerts as your product matures.",
  },
]

const firstRow = ideaItems.slice(0, ideaItems.length / 2)
const secondRow = ideaItems.slice(ideaItems.length / 2)

export default async function LandingPage() {
  const resources = await fetchResources("resources")
  const totalCount = resources.entries.length

  return (
    <div className="relative min-h-screen overflow-hidden  text-slate-100">

      <main className="relative z-10 flex flex-col gap-20 pb-20 pt-16 lg:gap-28 lg:pb-32 lg:pt-24">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.35em] text-slate-200/80">
              curated - APIs
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Design elegant, modern experiences with{" "}
              <AuroraText>APIxplore</AuroraText>
            </h1>
            <p className="text-lg text-slate-300 md:text-xl">
              One thoughtful destination to discover inspiring APIs, turn ideas
              into prototypes, and launch products that feel polished from day
              one.
            </p>
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
                href="https://github.com/tmaurie/apixplore"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/30 text-white hover:bg-white/10"
                )}
              >
                <RocketIcon className="mr-2 h-5 w-5" />
                View the code
              </Link>
            </div>
            <div className="grid gap-6 text-left text-white/80 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  APIs cataloged
                </p>
                <div className="mt-2 text-4xl font-semibold">
                  <NumberTicker
                    value={totalCount}
                    startValue={totalCount - 250}
                    className="text-4xl font-semibold text-white sm:text-5xl"
                  >
                    {totalCount}
                  </NumberTicker>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Actionable ideas
                </p>
                <p className="mt-2 text-4xl font-semibold">
                  +150
                  <span className="ml-2 text-base font-normal text-white/60">
                    mapped use cases
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 rounded-[32px] border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-transparent p-8 shadow-2xl shadow-black/40 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">
              Idea spotlight
            </p>
            <div className="mt-6 space-y-4">
              {ideaItems.slice(0, 5).map((item, index) => (
                <IdeaItem key={index} icon={item.icon} text={item.text} />
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">
                Studio mode
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Jump from spark to prototype in just a few clicks.
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Creative briefs, suggested APIs, and ready-to-run snippets
                &mdash; all in one elegant view.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
              Tailored workflow
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
              A journey conceived for creators who love precision.
            </h2>
            <p className="mt-4 text-base text-slate-300">
              Each stage supports you with clarity: inspiration, technical
              curation, and launch unite inside one subtle, modern interface.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 lg:flex-row">
          <div className="flex-1 space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
              Your flight plan
            </p>
            <h3 className="text-3xl font-semibold text-white">
              From inspiration boards to products that wow your users.
            </h3>
            <p className="text-base text-slate-300">
              APIxplore guides you with a simple narrative: audit APIs, test
              scenarios, and ship graceful journeys.
            </p>
            <Link
              href="/resources"
              className="inline-flex items-center text-sm font-semibold text-sky-300 hover:text-sky-200"
            >
              Explore the resources {"->"}
            </Link>
          </div>
          <div className="flex-1 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            {workflow.map((step, index) => (
              <WorkflowItem
                key={step.title}
                index={index + 1}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-16">
          <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-sky-400/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-6 h-44 w-44 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
                Living library
              </p>
              <h3 className="text-3xl font-semibold text-white md:text-4xl">
                Ideas on parade, a style that inspires.
              </h3>
              <p className="text-base text-slate-200">
                Keep your teams in flow with concepts that are ready to explore,
                handpicked for high product potential.
              </p>
            </div>
            <Link
              href="/resources"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white text-slate-900 hover:bg-white/90"
              )}
            >
              Start now
            </Link>
          </div>
          <div className="mt-12 flex w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/20">
            <Marquee className="[--duration:32s]" reverse>
              <div className="flex gap-6 px-6 py-6">
                {firstRow.map((item, index) => (
                  <IdeaItem key={index} icon={item.icon} text={item.text} />
                ))}
              </div>
            </Marquee>
            <Marquee className="[--duration:32s]">
              <div className="flex gap-6 px-6 pb-6">
                {secondRow.map((item, index) => (
                  <IdeaItem key={index} icon={item.icon} text={item.text} />
                ))}
              </div>
            </Marquee>
          </div>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({
  feature,
}: {
  feature: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    title: string
    description: string
    accent: string
  }
}) {
  const Icon = feature.icon

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-white/30">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100",
          `bg-gradient-to-br ${feature.accent}`
        )}
      />
      <div className="relative z-10 space-y-4">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black/30 text-white">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
        <p className="text-sm text-slate-200">{feature.description}</p>
      </div>
    </div>
  )
}

function WorkflowItem({
  index,
  title,
  description,
}: {
  index: number
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-black/30 p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-base font-semibold text-white/80">
        {index}
      </span>
      <div>
        <p className="text-lg font-semibold text-white">{title}</p>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  )
}

function IdeaItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur">
      {icon}
      <span>{text}</span>
    </div>
  )
}
