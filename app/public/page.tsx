"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"

import { Idea } from "@/types/idea"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { IdeaCard } from "@/components/idea-card"
import { Reveal } from "@/components/reveal"
import { Skeleton } from "@/components/ui/skeleton"

const fetchPublicIdeas = async ({ pageParam = 0 }) => {
  const res = await fetch(`/api/public-ideas?limit=20&offset=${pageParam}`)
  if (!res.ok) throw new Error("Could not load the public feed")
  const data = await res.json()
  return { ideas: (data.ideas ?? []) as Idea[], nextOffset: pageParam + 20 }
}

export default function PublicIdeasPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["public-ideas"],
    queryFn: fetchPublicIdeas,
    getNextPageParam: (lastPage) =>
      lastPage.ideas.length < 20 ? undefined : lastPage.nextOffset,
    initialPageParam: 0,
  })

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const ideas = data?.pages.flatMap((page) => page.ideas) ?? []
  const isEmpty = !isPending && !isError && ideas.length === 0

  return (
    <div>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-ink/10 pb-8">
        <div className="max-w-[56ch] space-y-2">
          <h1 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            Shared ideas
          </h1>
          <p className="text-ink-soft">
            Concepts other builders generated from the catalog and chose to
            publish.
          </p>
        </div>
        {ideas.length > 0 ? (
          <div>
            <p className="mb-1 text-xs text-ink-soft">Published</p>
            <p className="font-mono text-2xl font-bold tabular-nums">
              {ideas.length}
            </p>
          </div>
        ) : null}
      </header>

      {isPending ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-[190px] rounded-md" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-start gap-4 rounded-md border border-dashed border-ink/20 px-6 py-12">
          <div className="space-y-1.5">
            <p className="text-lg font-semibold">The feed did not load</p>
            <p className="max-w-[46ch] text-sm text-ink-soft">
              Something went wrong fetching published ideas.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className={cn(buttonVariants(), "bg-ink text-paper hover:bg-ink/90")}
          >
            Try again
          </button>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-start gap-4 rounded-md border border-dashed border-ink/20 px-6 py-14">
          <div className="space-y-1.5">
            <p className="text-lg font-semibold">Nothing published yet</p>
            <p className="max-w-[50ch] text-sm text-ink-soft">
              Ideas show up here once someone marks one public. Generate one
              from the catalog and it can be the first.
            </p>
          </div>
          <Link
            href="/resources"
            className={cn(buttonVariants(), "bg-ink text-paper hover:bg-ink/90")}
          >
            Browse the catalog
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {ideas.map((idea, i) => (
              <Reveal key={idea.id} index={i % 4}>
                <IdeaCard idea={idea} />
              </Reveal>
            ))}
          </div>

          <div ref={ref} className="h-10" />
          {isFetchingNextPage ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }, (_, i) => (
                <Skeleton key={i} className="h-[190px] rounded-md" />
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
