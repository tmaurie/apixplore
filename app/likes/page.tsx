"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

import { Idea } from "@/types/idea"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { IdeaCard } from "@/components/idea-card"

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
    <div>
      <header className="mb-10 border-b border-ink/10 pb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
          Liked ideas
        </h1>
        <p className="max-w-[58ch] text-ink-soft">
          Concepts you saved from the feed to come back to.
        </p>
      </header>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-[190px] rounded-md" />
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-md border border-dashed border-ink/20 px-6 py-14">
          <div className="space-y-1.5">
            <p className="text-lg font-semibold">No liked ideas yet</p>
            <p className="max-w-[48ch] text-sm text-ink-soft">
              Anything you like in the shared feed gets kept here.
            </p>
          </div>
          <Link
            href="/public"
            className={cn(
              buttonVariants(),
              "bg-ink text-paper hover:bg-ink/90"
            )}
          >
            See shared ideas
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ideas.map((idea) => (
            <IdeaCard
              idea={idea}
              key={idea.id}
              onUnlike={() => handleUnlike(idea.id)}
              isRemoving={removingId === idea.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
