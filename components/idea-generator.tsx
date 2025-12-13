"use client"

import { useEffect, useState } from "react"
import {
  ArrowRightIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
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
  feasibilityScore: number
  originalityScore: number
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

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

      const ideasWithStatus: IdeaWithStatus[] = data.ideas
        .map((idea: Idea) => ({
          ...idea,
          isSaved: false,
        }))
        .sort((a: Idea, b: Idea) => {
          const aScore = (a.feasibilityScore + a.originalityScore) / 2
          const bScore = (b.feasibilityScore + b.originalityScore) / 2
          return bScore - aScore
        })

      setIdeas(ideasWithStatus)
      setCurrentIndex(0)
      carouselApi?.scrollTo(0)

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
      toast.info("Idea removed")
    } else {
      toast.error("Error removing idea: " + (await res.text()))
    }
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
      toast.success("Idea saved successfully !")
    } else {
      toast.error("Error: " + (data.error || "Failed to save idea"))
    }
  }

  const slideCount = ideas.length

  const handleNext = () => {
    if (!carouselApi) return
    carouselApi.scrollNext()
  }

  const handlePrevious = () => {
    if (!carouselApi) return
    carouselApi.scrollPrev()
  }

  const handleDotClick = (index: number) => {
    if (slideCount === 0) return
    setCurrentIndex(index)
    carouselApi?.scrollTo(index)
  }

  useEffect(() => {
    if (!carouselApi) return
    const update = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap())
    }
    carouselApi.on("select", update)
    carouselApi.on("reInit", update)
    update()
    return () => {
      carouselApi?.off("select", update)
      carouselApi?.off("reInit", update)
    }
  }, [carouselApi])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white/80 shadow-[0_10px_25px_rgba(6,7,45,0.45)] backdrop-blur transition hover:text-white"
          onClick={generateIdeas}
        >
          <AnimatedShinyText className="inline-flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            Ideate
            <ArrowRightIcon className="h-4 w-4" />
          </AnimatedShinyText>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[95vw] sm:max-w-3xl border-white/10 bg-[#050816] text-white p-4 sm:p-6 max-h-[90vh] flex flex-col overflow-hidden"
        aria-describedby="dialog-description"
      >
        <DialogHeader className="space-y-2 text-center sm:text-left">
          <DialogTitle className="text-xl font-semibold sm:text-2xl">
            Project ideas fueled by {api}
          </DialogTitle>
          <p className="text-sm text-white/60">
            Generate polished sparks, compare feasibility and originality, then
            save favorites.
          </p>
        </DialogHeader>
        <div className="space-y-3">
          <Button
            onClick={generateIdeas}
            disabled={loading}
            size="sm"
            className="rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </span>
            ) : (
              "Generate again"
            )}
          </Button>

          {ideas.length > 0 ? (
            <div className="space-y-3">
              <Carousel
                setApi={setCarouselApi}
                opts={{ align: "start", loop: false }}
                className="relative isolate rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-2 shadow-[0_20px_60px_rgba(5,8,45,0.55)] sm:rounded-3xl sm:px-3 sm:py-3"
              >
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/5" />
                <CarouselContent className="ml-0">
                  {ideas.map((idea, i) => (
                    <CarouselItem
                      key={i}
                      className="flex justify-center px-1.5 py-3 sm:px-2 sm:py-4"
                    >
                      <Card className="relative flex h-[320px] w-full max-w-lg flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#0b1026] text-white shadow-[0_12px_36px_rgba(5,8,45,0.5)] sm:h-[340px] sm:rounded-[22px]">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-500/10" />
                        <CardHeader className="relative space-y-3 pb-2">
                          <div className="flex items-start justify-between gap-3">
                            <CardTitle className="text-base font-semibold leading-tight sm:text-lg">
                              {idea.title}
                            </CardTitle>
                            <BookmarkToggle
                              isSaved={idea.isSaved}
                              idea={idea}
                              index={i}
                              onSave={() => handleSaveIdea(idea, i)}
                              onRemove={() => handleDeleteIdea(idea, i)}
                            />
                          </div>
                          <div className="grid gap-2 text-[11px] uppercase tracking-[0.2em] text-white/60 sm:grid-cols-2">
                            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                              <p>Feasibility</p>
                              <p className="text-sm font-semibold text-white sm:text-base">
                                {idea.feasibilityScore}/10
                              </p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                              <p>Originality</p>
                              <p className="text-sm font-semibold text-white sm:text-base">
                                {idea.originalityScore}/10
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="relative flex-1 overflow-y-auto text-sm text-white/80">
                          <TypingAnimation
                            duration={20}
                            className="text-sm leading-relaxed sm:text-base"
                          >
                            {idea.description}
                          </TypingAnimation>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  {ideas.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      aria-label={`Go to idea ${index + 1}`}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        index === currentIndex
                          ? "bg-white"
                          : "bg-white/30 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-[0.25em] text-white/60">
                    Idea {currentIndex + 1} of {ideas.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
                      onClick={handlePrevious}
                      disabled={ideas.length <= 1}
                      aria-label="Previous idea"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
                      onClick={handleNext}
                      disabled={ideas.length <= 1}
                      aria-label="Next idea"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-white/70 sm:px-6">
              Generate to see curated ideas. We&#39;ll rank them by feasibility
              and originality and keep them in this carousel for quick scanning.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
