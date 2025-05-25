import Link from "next/link"
import {
  Clapperboard,
  MessageCircleQuestion,
  RocketIcon,
  Settings2Icon,
  SparklesIcon,
  SunSnow,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { AuroraText } from "@/components/magicui/aurora-text"

import "@/styles/aurora.css"
import { fetchResources } from "@/lib/fetchResources"
import { NumberTicker } from "@/components/magicui/number-ticker"

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
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">
            API Ideas to Get You Started
          </h2>
          <p className="text-slate-600">
            Here are some fun and creative project ideas using public APIs to
            inspire your next app development journey.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="rounded-2xl border bg-muted/50 p-6 shadow-xs">
            <Clapperboard className="h-6 w-6 text-yellow-500 mb-3" />
            <p className="text-sm font-medium">
              An application to track your favorite movies with The Movie
              Database (TMDB)
            </p>
          </div>
          <div className="rounded-2xl border bg-muted/50 p-6 shadow-xs">
            <SunSnow className="h-6 w-6 text-green-500 mb-3" />
            <p className="text-sm font-medium">
              A weather dashboard using OpenWeatherMap API
            </p>
          </div>
          <div className="rounded-2xl border bg-muted/50 p-6 shadow-xs">
            <MessageCircleQuestion className="h-6 w-6 text-blue-500 mb-3" />
            <p className="text-sm font-medium">
              A trivia quiz app using the Open Trivia Database API
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
