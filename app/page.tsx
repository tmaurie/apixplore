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

const firstRow = ideaItems.slice(0, ideaItems.length / 2)
const secondRow = ideaItems.slice(ideaItems.length / 2)

export default async function LandingPage() {
  const resources = await fetchResources("resources")
  const totalCount = resources.entries.length

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Explore. Get Inspired. <AuroraText>Build.</AuroraText>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          APIxplore is a platform designed to help developers discover public
          APIs, generate creative ideas, and kickstart their projects with ease.
          Whether you're looking for inspiration or a solid foundation for your
          next app, APIxplore has you covered.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/resources"
            className={cn(buttonVariants({ size: "lg" }), "shadow-md")}
          >
            <SparklesIcon className="mr-2 h-5 w-5" /> Get Started
          </Link>
          <Link
            href="https://github.com/tmaurie/apixplore"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "shadow-sm"
            )}
          >
            <RocketIcon className="mr-2 h-5 w-5" /> See on GitHub
          </Link>
        </div>
      </div>

      <NumberTicker
        value={totalCount}
        startValue={totalCount - 300}
        className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl"
      >
        {totalCount}
      </NumberTicker>
      <p className="text-lg text-muted-foreground">APIs listed</p>
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2
            className="text-3xl font-semibold
           mb-4"
          >
            Why APIxplore?
          </h2>
          <p className="text-slate-600">
            APIxplore is your go-to resource for discovering public APIs,
            generating innovative ideas, and building projects faster. Our
            platform simplifies the process of finding APIs and provides tools
            to help you create and share your projects with the community.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="rounded-2xl border bg-muted/50 p-6 shadow-xs">
            <SparklesIcon className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Generate your ideas</h3>
            <p className="text-sm text-slate-600">
              Let our AI-powered idea generator help you brainstorm and refine
              your app concepts.
            </p>
          </div>
          <div className="rounded-2xl border bg-muted/50 p-6 shadow-xs">
            <Settings2Icon className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Kickstart your project
            </h3>
            <p className="text-sm text-slate-600">
              Use our curated list of public APIs to quickly set up your project
              with real data.
            </p>
          </div>
          <div className="rounded-2xl border bg-muted/50 p-6 shadow-xs">
            <RocketIcon className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Share your creations</h3>
            <p className="text-sm text-slate-600">
              Share your projects with the community and get feedback to improve
              and grow.
            </p>
          </div>
        </div>
      </section>
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-semibold  mb-4">
            What you can create with APIxplore
          </h2>
          <p className="text-slate-600">
            Real-world ideas, ready to build, for every type of API.
          </p>
        </div>
        <Marquee className="[--duration:30s]" reverse>
          <div className="flex gap-6">
            {firstRow.map((item, index) => (
              <IdeaItem key={index} icon={item.icon} text={item.text} />
            ))}
          </div>
        </Marquee>
        <Marquee className="[--duration:30s]">
          <div className="flex gap-6">
            {secondRow.map((item, index) => (
              <IdeaItem key={index} icon={item.icon} text={item.text} />
            ))}
          </div>
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </section>
    </div>
  )
}

function IdeaItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 bg-muted border rounded-full px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
      {icon}
      <span>{text}</span>
    </div>
  )
}
