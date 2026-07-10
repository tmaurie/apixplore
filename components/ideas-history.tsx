"use client"

import { useEffect, useState } from "react"
import { Sparkles, TrashIcon } from "lucide-react"
import { toast } from "sonner"

import { Idea } from "@/types/idea"
import { Button } from "@/components/ui/button"
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
import { ShareIdeaButton } from "@/components/share-idea-button"

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

  const handleVisibilityChange = (ideaId: string, isPublic: boolean) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId ? { ...idea, is_public: isPublic } : idea
      )
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-[110px] w-full rounded-md border border-paper/15 bg-paper/5"
          />
        ))}
      </div>
    )
  }

  if (ideas.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-dashed border-paper/20 px-4 py-6 text-paper/70">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-paper/15 text-paper">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-paper">No ideas yet</p>
          <p className="text-sm text-paper/60">
            Generate new ideas to see them appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {ideas.map((idea, index) => (
        <div
          key={idea.id}
          className="grid grid-cols-[40px_1fr] gap-4 border-t border-paper/15 py-6 first:border-t-0 sm:grid-cols-[56px_1fr_auto] sm:items-start sm:gap-6"
        >
          <span className="font-mono text-xl font-bold text-amber-soft">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <span className="rounded-full border border-paper/30 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/75">
                {idea.api_name}
              </span>
              <span className="font-mono text-xs text-paper/50">
                {new Date(idea.created_at).toLocaleDateString()}
              </span>
            </div>
            <h3 className="mb-2 text-lg font-bold leading-tight">
              {idea.generated_idea.title}
            </h3>
            <p className="max-w-[60ch] text-sm leading-[1.55] text-paper/65">
              {idea.generated_idea.description}
            </p>
          </div>
          <div className="col-span-2 mt-1 flex flex-wrap items-center gap-2.5 sm:col-span-1 sm:mt-0 sm:flex-col sm:items-end">
            <PublicToggle
              ideaId={idea.id}
              initialValue={idea.is_public}
              onVisibilityChange={(value) =>
                handleVisibilityChange(idea.id, value)
              }
            />
            <div className="flex items-center gap-2">
              {idea.is_public ? (
                <ShareIdeaButton
                  ideaId={idea.id}
                  title={idea.generated_idea.title}
                  source="history"
                  size="sm"
                  variant="outline"
                  className="rounded-md border-paper/30 font-mono text-xs uppercase tracking-[0.06em] text-paper hover:bg-paper/10"
                />
              ) : null}
              <Dialog
                onOpenChange={(open) => !open && setConfirmDeleteId(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md font-mono text-xs uppercase tracking-[0.06em] text-red-300 hover:bg-paper/10 hover:text-red-200"
                    onClick={() => setConfirmDeleteId(idea.id)}
                    disabled={deletingId === idea.id}
                  >
                    <TrashIcon className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-ink sm:max-w-[420px]">
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
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
