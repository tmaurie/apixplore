"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, UserCircle } from "lucide-react"
import { toast } from "sonner"

import { Idea } from "@/types/idea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IdeaCard } from "@/components/idea-card"
import { PublicToggle } from "@/components/public-toggle"

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
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1533] via-[#0f1c3f] to-[#142654] p-6 text-white shadow-[0_30px_80px_rgba(6,8,36,0.6)] sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
            <Avatar className="h-8 w-8 ring-2 ring-white/20">
              <AvatarImage src={user?.image ?? ""} alt="User Avatar" />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() ?? (
                  <UserCircle className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">
              Personal hub
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              {user.name || "Your workspace"}
            </h1>
            <p className="text-sm text-white/70">
              {user.email}
              {user.githubUsername ? ` · @${user.githubUsername}` : ""}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="min-w-[96px] rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-left"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                {stat.label}
              </p>
              <p className="text-xl font-semibold text-white">{stat.value}</p>
              <p className="text-[12px] text-white/60">{stat.helper}</p>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-white/60">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your data...
        </div>
      ) : (
        <>
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">
                  Favorites
                </p>
                <h2 className="text-xl font-semibold text-white">
                  Liked ideas
                </h2>
                <p className="text-sm text-white/70">
                  Inspirations you saved for later.
                </p>
              </div>
            </div>
            {likes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-sm text-white/70">
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
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">
                  My builds
                </p>
                <h2 className="text-xl font-semibold text-white">
                  Generated ideas
                </h2>
                <p className="text-sm text-white/70">
                  Latest sparks you created. Manage visibility or remove them.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Link href="/history">View all</Link>
              </Button>
            </div>

            {ideas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-sm text-white/70">
                No ideas generated yet. Use the explorer to spark your first
                one.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {ideas.slice(0, 4).map((idea) => (
                  <Card
                    key={idea.id}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f25] text-white shadow-[0_18px_48px_rgba(5,6,34,0.45)]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-500/10" />
                    <CardHeader className="relative space-y-2 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold leading-tight">
                          {idea.generated_idea.title}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="border-white/25 bg-white/5 text-[11px] uppercase tracking-[0.2em] text-white/70"
                        >
                          {idea.api_name}
                        </Badge>
                      </div>
                      <p className="text-[12px] text-white/60">
                        {new Date(idea.created_at).toLocaleDateString()} ·{" "}
                        {new Date(idea.created_at).toLocaleTimeString()}
                      </p>
                    </CardHeader>
                    <CardContent className="relative pb-2">
                      <p className="text-sm text-white/80">
                        {idea.generated_idea.description}
                      </p>
                    </CardContent>
                    <CardFooter className="relative flex items-center justify-between gap-2 border-t border-white/5 pt-3">
                      <PublicToggle
                        ideaId={idea.id}
                        initialValue={idea.is_public}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-300 hover:text-red-100"
                        onClick={() => handleDeleteIdea(idea.id)}
                        disabled={deletingId === idea.id}
                      >
                        {deletingId === idea.id ? "Deleting..." : "Delete"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
