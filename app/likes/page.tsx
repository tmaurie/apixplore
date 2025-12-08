"use client"

import { useEffect, useState } from "react"

import { PageSurface } from "@/components/page-surface"
import { IdeaCard } from "@/components/idea-card"
import { Idea } from "@/types/idea"

export default function LikedIdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch("/api/liked-ideas")
        const data = await res.json()
        setIdeas(data.ideas || [])
      } catch (err) {
        console.error("Failed to load liked ideas", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLikes()
  }, [])

  return (
    <PageSurface className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">
          Favorites
        </p>
        <h1 className="text-3xl font-semibold text-white">My Liked Ideas</h1>
        <p className="text-white/70">
          Save the sparks you want to build later and revisit them anytime.
        </p>
      </div>

      {loading && <p className="text-white/60">Loading...</p>}
      {!loading && ideas.length === 0 && (
        <p className="text-white/70">You haven&apos;t liked any ideas yet.</p>
      )}

      <div className="space-y-6">
        {ideas.map((idea) => (
          <IdeaCard idea={idea} key={idea.id} />
        ))}
      </div>
    </PageSurface>
  )
}
