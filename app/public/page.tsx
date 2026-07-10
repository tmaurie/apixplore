"use client"

import { useEffect } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"

import { PageSurface } from "@/components/page-surface"
import { IdeaCard } from "@/components/idea-card"
import { Idea } from "@/types/idea"

const fetchPublicIdeas = async ({ pageParam = 0 }) => {
  const res = await fetch(`/api/public-ideas?limit=20&offset=${pageParam}`)
  const data = await res.json()
  return { ideas: data.ideas, nextOffset: pageParam + 20 }
}

export default function PublicIdeasPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["public-ideas"],
      queryFn: fetchPublicIdeas,
      getNextPageParam: (lastPage: { ideas: Idea[]; nextOffset: number }) =>
        lastPage.ideas.length < 20 ? undefined : lastPage.nextOffset,
      initialPageParam: 0,
    })

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const totalIdeas =
    data?.pages.reduce((acc: number, page: { ideas: Idea[] }) => {
      return acc + (page.ideas?.length || 0)
    }, 0) ?? 0

  return (
    <div className="space-y-8">
      <PageSurface>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-amber">
              Community Feed
            </p>
            <h1 className="text-[38px] font-bold">Public Ideas</h1>
            <p className="max-w-[60ch] text-ink-soft">
              Discover what everyone is building with your favorite APIs. Save,
              like, and draw inspiration from real projects in motion.
            </p>
          </div>
          <div className="font-mono">
            <p className="mb-1 text-[11px] uppercase tracking-[0.15em] text-ink-soft">
              Ideas shared
            </p>
            <p className="text-[26px] font-bold">{totalIdeas}</p>
          </div>
        </div>
      </PageSurface>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        {data?.pages.map((page, i) =>
          page.ideas.map((idea: Idea) => <IdeaCard key={`${idea.id}-${i}`} idea={idea} />)
        )}
      </div>

      <div ref={ref} className="h-10" />
      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 font-mono text-sm text-ink-soft">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber" />
          Loading more ideas...
        </div>
      )}
    </div>
  )
}
