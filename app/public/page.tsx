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
    <PageSurface className="space-y-8">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1533] via-[#0f1c3f] to-[#142654] p-6 text-white shadow-[0_30px_80px_rgba(6,8,36,0.6)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">
              Community feed
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Public ideas
            </h1>
            <p className="max-w-3xl text-sm text-white/70 sm:text-base">
              Discover what everyone is building with your favorite APIs. Save,
              like, and draw inspiration from real projects in motion.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/80">
            <span className="text-2xl font-semibold text-white">{totalIdeas}</span>
            <div className="leading-tight text-white/60">
              <p className="text-xs uppercase tracking-[0.2em]">Ideas</p>
              <p className="text-[13px]">shared by the community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        {data?.pages.map((page, i) =>
          page.ideas.map((idea: Idea) => <IdeaCard key={`${idea.id}-${i}`} idea={idea} />)
        )}
      </div>

      <div ref={ref} className="h-10" />
      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 text-sm text-white/70">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white/80" />
          Loading more ideas...
        </div>
      )}
    </PageSurface>
  )
}
