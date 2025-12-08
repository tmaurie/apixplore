"use client"

import { useEffect, useState } from "react"
import { TrashIcon } from "lucide-react"
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

  if (loading)
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-[200px] w-full rounded-3xl border border-white/10 bg-white/10"
          />
        ))}
      </div>
    )

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

  return (
    <div className="grid gap-4">
      {ideas.map((idea) => (
        <Card
          key={idea.id}
          className="w-full rounded-3xl border border-white/10 bg-white/5 text-white shadow-[0_20px_60px_rgba(9,10,44,0.35)] transition hover:border-white/40"
        >
          <CardHeader>
            <CardTitle className="text-base font-semibold text-white">
              {idea.generated_idea.title}
            </CardTitle>
            <div className="text-xs text-white/60">
              {new Date(idea.created_at).toLocaleString()} via {" "}
              <Badge variant="outline" className="font-medium text-white">
                {idea.api_name}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-white/80">
              {idea.generated_idea.description}
            </p>
          </CardContent>

          <CardFooter className="flex items-center justify-between gap-2">
            <PublicToggle ideaId={idea.id} initialValue={idea.is_public} />

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  onClick={() => setConfirmDeleteId(idea.id)}
                  disabled={deletingId === idea.id}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Idea</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this idea? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
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
  )
}
