"use client"

import { useEffect, useState } from "react"
import { Sparkles, TrashIcon } from "lucide-react"
import { toast } from "sonner"

import { Idea } from "@/types/idea"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { PublicToggle } from "@/components/public-toggle"

export function IdeasHistory() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const fetchIdeas = async () => {
      const res = await fetch("/api/ideas")
      const data = await res.json()
      setIdeas(data.ideas)
      setLoading(false)
    }

    fetchIdeas()
  }, [])

  const handleDelete = async () => {
    if (!confirmDeleteId) return
    setDeletingId(confirmDeleteId)

    const res = await fetch(`/api/ideas/${confirmDeleteId}`, {
      method: "DELETE",
    })

    if (res.ok) {
      setIdeas((prev) => prev.filter((idea) => idea.id !== confirmDeleteId))
      toast.success("Idea deleted successfully.")
    } else {
      toast.error("Error deleting idea. Please try again.")
    }

    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-lg font-semibold text-white">Idea history</p>
            <p className="text-sm text-white/60">Loading your saved sparks…</p>
          </div>
          <Badge variant="outline" className="border-white/20 text-white/80">
            ...
          </Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[180px] w-full rounded-2xl border border-white/10 bg-white/10"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-lg font-semibold text-white">Idea history</p>
          <p className="text-sm text-white/60">
            Everything you generated, ready to refine or publish.
          </p>
        </div>
        <Badge variant="outline" className="border-white/20 text-white/80">
          {ideas.length} idea{ideas.length === 1 ? "" : "s"}
        </Badge>
      </div>

      {ideas.length === 0 ? (
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-white/70">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">No ideas yet</p>
            <p className="text-sm text-white/60">
              Generate new ideas to see them appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {ideas.map((idea) => (
            <Card
              key={idea.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f25] text-white shadow-[0_18px_48px_rgba(5,6,34,0.45)] transition hover:-translate-y-1 hover:border-white/30"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-sky-500/10 opacity-80" />
              <CardHeader className="relative space-y-3 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold leading-tight sm:text-lg">
                      {idea.generated_idea.title}
                    </CardTitle>
                    <p className="text-xs text-white/60">
                      {new Date(idea.created_at).toLocaleDateString()} ·{" "}
                      {new Date(idea.created_at).toLocaleTimeString()} via{" "}
                      <span className="font-medium text-white">
                        {idea.api_name}
                      </span>
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-white/30 bg-white/5 text-[11px] uppercase tracking-[0.25em] text-white/80"
                  >
                    Saved
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="relative pb-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80">
                  {idea.generated_idea.description}
                </div>
              </CardContent>

              <CardFooter className="relative flex items-center justify-between gap-2 border-t border-white/5 pt-3">
                <PublicToggle ideaId={idea.id} initialValue={idea.is_public} />

                <Dialog
                  onOpenChange={(open) => !open && setConfirmDeleteId(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-300 hover:text-red-100"
                      onClick={() => setConfirmDeleteId(idea.id)}
                      disabled={deletingId === idea.id}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                      <DialogTitle>Delete idea</DialogTitle>
                      <DialogDescription>
                        This will remove the idea permanently. You can&apos;t
                        undo this action.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          disabled={deletingId === confirmDeleteId}
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deletingId === confirmDeleteId}
                      >
                        Yes, delete permanently
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
