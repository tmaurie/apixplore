"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, UserCircle } from "lucide-react"
import { toast } from "sonner"

import { Idea } from "@/types/idea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { IdeaCard } from "@/components/idea-card"
import { PublicToggle } from "@/components/public-toggle"
import { ShareIdeaButton } from "@/components/share-idea-button"

type UserSummary = {
  name?: string | null
  email?: string | null
  githubUsername?: string | null
  image?: string | null
}

type Quota = {
  used: number
  limit: number
}

export function UserHub({ user }: { user: UserSummary }) {
  const [likes, setLikes] = useState<Idea[]>([])
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [quota, setQuota] = useState<Quota | null>(null)
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [likesRes, ideasRes, quotaRes] = await Promise.all([
          fetch("/api/liked-ideas"),
          fetch("/api/ideas"),
          fetch("/api/quota"),
        ])

        if (likesRes.ok) {
          const data = await likesRes.json()
          setLikes(data.ideas || [])
        }

        if (ideasRes.ok) {
          const data = await ideasRes.json()
          setIdeas(data.ideas || [])
        }

        if (quotaRes.ok) {
          const data = await quotaRes.json()
          setQuota({ used: data.used, limit: data.limit })
        }
      } catch (err) {
        console.error("Failed to load user hub data", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleUnlike = async (ideaId: string) => {
    if (removingId) return
    setRemovingId(ideaId)
    try {
      const res = await fetch(`/api/ideas/${ideaId}/like`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to remove like")
      setLikes((prev) => prev.filter((idea) => idea.id !== ideaId))
      toast.success("Removed from likes")
    } catch (err: any) {
      toast.error(err?.message || "Unable to remove like")
    } finally {
      setRemovingId(null)
    }
  }

  const handleDeleteIdea = async (ideaId: string) => {
    if (deletingId) return
    setDeletingId(ideaId)
    try {
      const res = await fetch(`/api/ideas/${ideaId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete idea")
      setIdeas((prev) => prev.filter((idea) => idea.id !== ideaId))
      toast.success("Idea deleted")
    } catch (err: any) {
      toast.error(err?.message || "Unable to delete idea")
    } finally {
      setDeletingId(null)
    }
  }

  const handleVisibilityChange = (ideaId: string, isPublic: boolean) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId ? { ...idea, is_public: isPublic } : idea
      )
    )
  }

  const stats = [
    {
      label: "Quota",
      value:
        quota?.limit != null && quota?.used != null
          ? `${quota.limit - quota.used}/${quota.limit}`
          : "—",
      helper: "Ideas remaining today",
    },
    {
      label: "My ideas",
      value: ideas.length,
      helper: "Generated so far",
    },
    {
      label: "Likes",
      value: likes.length,
      helper: "Saved inspirations",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-6 rounded-lg border-2 border-ink bg-ink p-6 text-paper sm:p-8">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 ring-2 ring-amber/30">
            <AvatarImage src={user?.image ?? ""} alt="User Avatar" />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase() ?? (
                <UserCircle className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-soft">
              Personal Hub
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {user.name || "Your workspace"}
            </h1>
            <p className="text-sm text-paper/70">
              {user.email}
              {user.githubUsername ? ` · @${user.githubUsername}` : ""}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 font-mono sm:gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="min-w-24 rounded-md border border-paper/20 px-3 py-2 text-left"
            >
              <p className="text-[11px] uppercase tracking-[0.15em] text-paper/60">
                {stat.label}
              </p>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-[12px] text-paper/60">{stat.helper}</p>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 font-mono text-ink-soft">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your data...
        </div>
      ) : (
        <>
          <section className="space-y-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
                Favorites
              </p>
              <h2 className="text-xl font-bold">Liked ideas</h2>
              <p className="text-sm text-ink-soft">
                Inspirations you saved for later.
              </p>
            </div>
            {likes.length === 0 ? (
              <div className="rounded-md border border-dashed border-ink/25 px-4 py-6 text-sm text-ink-soft">
                Nothing liked yet. Browse the public feed and tap like to keep
                ideas here.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {likes.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onUnlike={() => handleUnlike(idea.id)}
                    isRemoving={removingId === idea.id}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
                  My Builds
                </p>
                <h2 className="text-xl font-bold">Generated ideas</h2>
                <p className="text-sm text-ink-soft">
                  Latest sparks you created. Manage visibility or remove them.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-md border-ink font-mono text-xs uppercase tracking-[0.06em] hover:bg-ink hover:text-paper"
              >
                <Link href="/history">View all</Link>
              </Button>
            </div>

            {ideas.length === 0 ? (
              <div className="rounded-md border border-dashed border-ink/25 px-4 py-6 text-sm text-ink-soft">
                No ideas generated yet. Use the explorer to spark your first
                one.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {ideas.slice(0, 4).map((idea) => (
                  <div
                    key={idea.id}
                    className="rounded-md border border-ink bg-ink p-4 text-paper"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <p className="text-base font-bold leading-tight">
                        {idea.generated_idea.title}
                      </p>
                      <span className="whitespace-nowrap rounded-full border border-paper/30 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-paper/70">
                        {idea.api_name}
                      </span>
                    </div>
                    <p className="mb-3 font-mono text-[12px] text-paper/60">
                      {new Date(idea.created_at).toLocaleDateString()} ·{" "}
                      {new Date(idea.created_at).toLocaleTimeString()}
                    </p>
                    <p className="mb-4 text-sm text-paper/80">
                      {idea.generated_idea.description}
                    </p>
                    <div className="flex items-center justify-between gap-2 border-t border-paper/15 pt-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <PublicToggle
                          ideaId={idea.id}
                          initialValue={idea.is_public}
                          onVisibilityChange={(value) =>
                            handleVisibilityChange(idea.id, value)
                          }
                        />
                        {idea.is_public ? (
                          <ShareIdeaButton
                            ideaId={idea.id}
                            title={idea.generated_idea.title}
                            source="user_hub"
                            size="sm"
                            variant="outline"
                            className="rounded-md border-paper/30 font-mono text-xs uppercase tracking-[0.06em] text-paper hover:bg-paper/10"
                          />
                        ) : null}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="font-mono text-xs uppercase tracking-[0.06em] text-red-300 hover:bg-paper/10 hover:text-red-200"
                        onClick={() => handleDeleteIdea(idea.id)}
                        disabled={deletingId === idea.id}
                      >
                        {deletingId === idea.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
