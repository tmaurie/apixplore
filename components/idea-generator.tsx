"use client"

import { useState } from "react"
import { ArrowRightIcon, BookmarkIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"

interface Idea {
  title: string
  description: string
  isSaved?: boolean
}

type IdeaWithStatus = Idea & { isSaved?: boolean }

export default function IdeaGenerator({
  api,
  description,
}: {
  api: string
  description: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<IdeaWithStatus[]>([])

  const generateIdeas = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ api, description }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error("Error generating ideas: " + data.message)
        return
      }

      setIdeas(
        data.ideas.map((idea: Idea) => ({
          ...idea,
          isSaved: false,
        }))
      )

      toast.success(
        "Ideas generated successfully! Click on the cards to copy them."
      )
    } catch (err: any) {
      toast.error("Network error : " + (err?.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSave = async (idea: Idea, index: number) => {
    if (idea.isSaved) {
      toast.info("Suppression à venir 😄")
      return
    }

    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api, description, idea }),
    })

    const data = await res.json()

    if (res.ok) {
      const updated = [...ideas]
      updated[index].isSaved = true
      setIdeas(updated)
      toast.success("Idea saved successfully ! 🧠💾")
    } else {
      toast.error("Error : " + (data.error || "Failed to save idea"))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <Button variant="ghost" onClick={generateIdeas}>
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>✨ Generate Ideas</span>
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </AnimatedShinyText>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle>Project Ideas for {api}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button onClick={generateIdeas} disabled={loading} size="sm">
            {loading ? "Generating..." : "Generate again"}
          </Button>

          {ideas.length > 0 && (
            <div className="grid gap-4">
              {ideas.map((idea, i) => (
                <Card key={i} className="bg-muted relative">
                  <CardHeader>
                    <CardTitle className="text-base">{idea.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {idea.description}
                  </CardContent>
                  <button
                    onClick={() => handleToggleSave(idea, i)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                    title={idea.isSaved ? "Retirer" : "Sauvegarder"}
                  >
                    {idea.isSaved ? (
                      <BookmarkIcon className="h-5 w-5 fill-current" />
                    ) : (
                      <BookmarkIcon className="h-5 w-5" />
                    )}
                  </button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
