"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Idea } from "@/types/idea"
import { IdeaCard } from "@/components/idea-card"
import { PageSurface } from "@/components/page-surface"

export default function LikedIdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

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

  const handleUnlike = async (ideaId: string) => {
    if (removingId) return
    setRemovingId(ideaId)
    try {
      const res = await fetch(`/api/ideas/${ideaId}/like`, { method: "DELETE" })
      if (!res.ok) {
        throw new Error("Failed to remove like")
      }
      setIdeas((prev) => prev.filter((idea) => idea.id !== ideaId))
      toast.success("Removed from likes")
    } catch (err: any) {
      toast.error(err?.message || "Unable to remove like")
    } finally {
      setRemovingId(null)
    }
  }

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
          <IdeaCard
            idea={idea}
            key={idea.id}
            onUnlike={() => handleUnlike(idea.id)}
            isRemoving={removingId === idea.id}
          />
        ))}
      </div>
    </PageSurface>
  )
}
