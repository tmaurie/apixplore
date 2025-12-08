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

  return (
    <PageSurface className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">
          Community feed
        </p>
        <h1 className="text-3xl font-semibold text-white">Public Ideas</h1>
        <p className="text-white/70">
          Discover what the community is building with your favorite APIs in
          real time.
        </p>
      </div>
      <div className="space-y-4">
        {data?.pages.map((page, i) => (
          <div key={i} className="space-y-4">
            {page.ideas.map((idea: Idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ))}
        <div ref={ref} className="h-8" />
        {isFetchingNextPage && (
          <p className="text-center text-white/60">Loading more...</p>
        )}
      </div>
    </PageSurface>
  )
}
