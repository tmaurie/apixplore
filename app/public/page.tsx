"use client"

import {useInfiniteQuery} from "@tanstack/react-query"
import {useInView} from "react-intersection-observer"
import {useEffect} from "react"
import {IdeaCard} from "@/components/idea-card"
import {Idea} from "@/types/idea"

const fetchPublicIdeas = async ({pageParam = 0}) => {
  const res = await fetch(`/api/public-ideas?limit=20&offset=${pageParam}`)
  const data = await res.json()
  return {ideas: data.ideas, nextOffset: pageParam + 20}
}

export default function PublicIdeasPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["public-ideas"],
    queryFn: fetchPublicIdeas,
    getNextPageParam: (lastPage: { ideas: Idea[]; nextOffset: any }) =>
      lastPage.ideas.length < 20 ? undefined : lastPage.nextOffset,
    initialPageParam: 0,
  })

  const {ref, inView} = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">🌍 Public Ideas Feed</h1>
      <div className="space-y-4">

        {data?.pages.map((page, i) => (
          <div key={i}>
            {page.ideas.map((idea: Idea) => (
              <IdeaCard key={idea.id} idea={idea}/>
            ))}
          </div>
        ))}

        <div ref={ref} className="h-8"/>

        {isFetchingNextPage && <p className="text-center">Loading more...</p>}
      </div>
    </div>
  )
}
