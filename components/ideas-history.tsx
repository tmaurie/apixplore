"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Sparkles, TrashIcon, X } from "lucide-react"
import { toast } from "sonner"

import { Idea } from "@/types/idea"
import { cn } from "@/lib/utils"
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
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ExportBriefButton } from "@/components/export-brief-button"
import { PublicToggle } from "@/components/public-toggle"
import { ShareIdeaButton } from "@/components/share-idea-button"

export function IdeasHistory() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [addingTagFor, setAddingTagFor] = useState<string | null>(null)
  const [newTagValue, setNewTagValue] = useState("")

  useEffect(() => {
    const fetchIdeas = async () => {
      const res = await fetch("/api/ideas")
      const data = await res.json()
      setIdeas(data.ideas || [])
      setLoading(false)
    }

    fetchIdeas()
  }, [])

  const updateTags = async (ideaId: string, tags: string[]) => {
    const res = await fetch(`/api/ideas/${ideaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags }),
    })

    if (!res.ok) {
      toast.error("Failed to update tags")
      return
    }

    setIdeas((prev) =>
      prev.map((idea) => (idea.id === ideaId ? { ...idea, tags } : idea))
    )
  }

  const handleAddTag = (ideaId: string) => {
    const tag = newTagValue.trim().toLowerCase()
    if (!tag) return

    const idea = ideas.find((i) => i.id === ideaId)
    const existing = idea?.tags || []
    if (!existing.includes(tag)) {
      updateTags(ideaId, [...existing, tag])
    }

    setNewTagValue("")
    setAddingTagFor(null)
  }

  const handleRemoveTag = (ideaId: string, tag: string) => {
    const idea = ideas.find((i) => i.id === ideaId)
    const existing = idea?.tags || []
    updateTags(
      ideaId,
      existing.filter((t) => t !== tag)
    )
  }

  const allTags = [...new Set(ideas.flatMap((idea) => idea.tags || []))].sort()
  const visibleIdeas = activeTag
    ? ideas.filter((idea) => idea.tags?.includes(activeTag))
    : ideas

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
      <div className="flex flex-wrap items-center gap-4 rounded-md border border-dashed border-paper/20 px-4 py-6 text-paper/70">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-paper/15 text-paper">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-paper">No ideas yet</p>
          <p className="text-sm text-paper/60">
            Generate new ideas to see them appear here.
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="rounded-md border-paper/30 font-mono text-xs text-paper hover:bg-paper/10"
          variant="outline"
        >
          <Link href="/resources">Browse the catalog</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      {allTags.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-paper/50">Filter</span>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={cn(
                "rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors",
                activeTag === tag
                  ? "border-amber-soft bg-amber-soft/20 text-amber-soft"
                  : "border-paper/25 text-paper/60 hover:border-paper/50 hover:text-paper"
              )}
            >
              {tag}
            </button>
          ))}
          {activeTag && (
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className="font-mono text-[11px] text-paper/50 underline-offset-2 hover:text-paper hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {visibleIdeas.length === 0 && (
        <p className="py-6 text-sm text-paper/60">
          No ideas tagged &ldquo;{activeTag}&rdquo;.
        </p>
      )}

      {visibleIdeas.map((idea, index) => (
        <div
          key={idea.id}
          className="grid grid-cols-[40px_1fr] gap-4 border-t border-paper/15 py-6 first:border-t-0 sm:grid-cols-[56px_1fr_auto] sm:items-start sm:gap-6"
        >
          <span className="font-mono text-xl font-bold text-amber-soft">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <span className="rounded-full border border-paper/30 px-2.5 py-1 font-mono text-[11px] text-paper/75">
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
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {(idea.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-amber-soft/40 bg-amber-soft/10 px-2 py-0.5 font-mono text-[10px] text-amber-soft"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(idea.id, tag)}
                    aria-label={`Remove tag ${tag}`}
                    className="hover:text-paper"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
              {addingTagFor === idea.id ? (
                <div className="flex items-center gap-1">
                  <Input
                    autoFocus
                    value={newTagValue}
                    onChange={(e) => setNewTagValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTag(idea.id)
                      if (e.key === "Escape") {
                        setAddingTagFor(null)
                        setNewTagValue("")
                      }
                    }}
                    onBlur={() => {
                      if (!newTagValue.trim()) setAddingTagFor(null)
                    }}
                    placeholder="tag name"
                    className="h-6 w-24 border-paper/30 bg-transparent px-2 py-0 text-[10px] text-paper placeholder:text-paper/40 focus-visible:ring-0"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingTagFor(idea.id)}
                  className="inline-flex items-center gap-0.5 rounded-full border border-dashed border-paper/25 px-2 py-0.5 font-mono text-[10px] text-paper/50 hover:border-paper/50 hover:text-paper"
                >
                  <Plus className="h-2.5 w-2.5" />
                  Tag
                </button>
              )}
            </div>
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
              <ExportBriefButton
                ideaId={idea.id}
                source="history"
                title={idea.generated_idea.title}
                description={idea.generated_idea.description}
                apiName={idea.api_name}
                apiLink={idea.api_link?.toString()}
                createdAt={idea.created_at}
                variant="outline"
                size="sm"
                className="rounded-md border-paper/30 font-mono text-xs text-paper hover:bg-paper/10"
              />
              {idea.is_public ? (
                <ShareIdeaButton
                  ideaId={idea.id}
                  title={idea.generated_idea.title}
                  source="history"
                  size="sm"
                  variant="outline"
                  className="rounded-md border-paper/30 font-mono text-xs text-paper hover:bg-paper/10"
                />
              ) : null}
              <Dialog
                onOpenChange={(open) => !open && setConfirmDeleteId(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md font-mono text-xs text-red-300 hover:bg-paper/10 hover:text-red-200"
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
                      This will remove the idea permanently. You can&apos;t undo
                      this action.
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
