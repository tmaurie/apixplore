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
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"

interface Idea {
  title: string
  description: string
}

export default function IdeaGenerator({
  api,
  description,
}: {
  api: string
  description: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<Idea[]>([])

  const generateIdeas = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/ideas", {
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

      setIdeas(data.ideas)

      toast.success(
        "Ideas generated successfully! Click on the cards to copy them."
      )
    } catch (err: any) {
      toast.error("Network error : " + (err?.message || "Unknown error"))
    } finally {
      setLoading(false)
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
                <Card key={i} className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-base">{idea.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {idea.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
