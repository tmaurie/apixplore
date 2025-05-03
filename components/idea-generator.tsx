"use client"

import { useState } from "react"
import { ArrowRightIcon } from "lucide-react"

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

export default function IdeaGenerator({ seed }: { seed: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<Idea[]>([])

  const handleGenerate = () => {
    setLoading(true)
    setTimeout(() => {
      setIdeas([
        {
          title: `Explore ${seed} stats`,
          description: "Build a dashboard using charts and data from the API.",
        },
        {
          title: `${seed} Companion App`,
          description:
            "Create a mobile app that surfaces the most relevant endpoints.",
        },
        {
          title: `AI + ${seed}`,
          description:
            "Use AI to summarize or enrich the data returned by this API.",
        },
      ])
      setLoading(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <Button
            variant="ghost"
            onClick={handleGenerate}
            className="cursor-pointer"
          >
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>✨ Generate Ideas</span>
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </AnimatedShinyText>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Project Ideas for {seed}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button onClick={handleGenerate} disabled={loading} size="sm">
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
