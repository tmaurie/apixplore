"use client"

import { useState } from "react"
import { ArrowRightIcon } from "lucide-react"
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
import { BookmarkToggle } from "@/components/bookmark-toggle"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"
import { TypingAnimation } from "@/components/magicui/typing-animation"

interface Idea {
  title: string
  description: string
}

type IdeaWithStatus = Idea & { isSaved: boolean; id?: string }

export default function IdeaGenerator({
  api,
  apiLink,
  description,
}: {
  api: string
  apiLink?: string
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
        "Ideas generated successfully! Click on the bookmark icon to save them."
      )
    } catch (err: any) {
      toast.error("Network error : " + (err?.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteIdea = async (idea: IdeaWithStatus, index: number) => {
    const res = await fetch(`/api/ideas/${idea.id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      const updated = [...ideas]
      updated[index].isSaved = false
      delete updated[index].id
      setIdeas(updated)
      toast.info("Idea removed 💨")
    } else {
      toast.error("Error removing idea: " + (await res.text()))
    }

    return
  }

  const handleSaveIdea = async (idea: IdeaWithStatus, index: number) => {
    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api, apiLink, description, idea }),
    })

    const data = await res.json()

    if (res.ok) {
      const updated = [...ideas]
      updated[index] = {
        ...updated[index],
        isSaved: true,
        id: data.idea.id,
      }
      setIdeas(updated)
      toast.success("Idea saved successfully ! 🧠💾")
    } else {
      toast.error("Error: " + (data.error || "Failed to save idea"))
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
                    <TypingAnimation
                      duration={20}
                      className=" animate-fade-in transition-all duration-500 text-base font-normal"
                    >
                      {idea.description}
                    </TypingAnimation>
                  </CardContent>
                  <BookmarkToggle
                    isSaved={idea.isSaved}
                    idea={idea}
                    index={i}
                    onSave={() => handleSaveIdea(idea, i)}
                    onRemove={() => handleDeleteIdea(idea, i)}
                  />
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
