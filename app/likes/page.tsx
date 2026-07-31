"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

import { Idea } from "@/types/idea"
import { Button } from "@/components/ui/button"
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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to remove like")
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <PageSurface className="space-y-6">
      <div className="space-y-2">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-amber">
          Favorites
        </p>
        <h1 className="text-3xl font-bold">My Liked Ideas</h1>
        <p className="text-ink-soft">
          Save the sparks you want to build later and revisit them anytime.
        </p>
      </div>

      {loading && <p className="text-ink-soft">Loading...</p>}
      {!loading && ideas.length === 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-dashed border-ink/25 px-4 py-6">
          <p className="text-ink-soft">
            You haven&apos;t liked any ideas yet.
          </p>
          <Button
            asChild
            size="sm"
            className="rounded-md bg-ink font-mono text-xs uppercase tracking-[0.06em] text-paper hover:bg-ink/90"
          >
            <Link href="/public">Browse public feed</Link>
          </Button>
        </div>
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
