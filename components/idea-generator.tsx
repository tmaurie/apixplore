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
import { TypingAnimation } from "@/components/magicui/typing-animation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Idea {
  title: string
  description: string
  feasibilityScore: number
  originalityScore: number
}

type IdeaWithStatus = Idea & { isSaved: boolean; id?: string }

type IdeaFilters = {
  skillLevel: "beginner" | "experienced"
  stackFocus: "fullstack" | "backend" | "frontend"
  tone: "serious" | "playful"
  aiUsage: "optional" | "required" | "avoid"
}

const defaultFilters: IdeaFilters = {
  skillLevel: "beginner",
  stackFocus: "fullstack",
  tone: "serious",
  aiUsage: "optional",
}

const filterOptions: {
  skillLevel: { value: IdeaFilters["skillLevel"]; label: string; description: string }[]
  stackFocus: { value: IdeaFilters["stackFocus"]; label: string; description: string }[]
  tone: { value: IdeaFilters["tone"]; label: string; description: string }[]
  aiUsage: { value: IdeaFilters["aiUsage"]; label: string; description: string }[]
} = {
  skillLevel: [
    {
      value: "beginner",
      label: "Beginner",
      description: "Keep scope small, reduce setup, and suggest clear starting steps.",
    },
    {
      value: "experienced",
      label: "Experienced",
      description: "Lean into architecture choices, performance, and extensibility.",
    },
  ],
  stackFocus: [
    {
      value: "fullstack",
      label: "Fullstack",
      description: "End-to-end flows that mix UI polish with backend orchestration.",
    },
    {
      value: "frontend",
      label: "Frontend",
      description: "Data-driven visuals, dashboards, and UX-heavy experiences.",
    },
    {
      value: "backend",
      label: "Backend",
      description: "APIs, automation, services, or CLI-first workflows.",
    },
  ],
  tone: [
    {
      value: "serious",
      label: "Serious",
      description: "Professional, outcome-focused, and delivery-oriented.",
    },
    {
      value: "playful",
      label: "Playful",
      description: "Casual, surprising, and geared toward exploration or fun.",
    },
  ],
  aiUsage: [
    {
      value: "optional",
      label: "AI optional",
      description: "Include AI only if it clearly helps, otherwise keep it lean.",
    },
    {
      value: "required",
      label: "AI required",
      description: "Each idea should feature an AI-powered element.",
    },
    {
      value: "avoid",
      label: "AI-free",
      description: "No AI features; focus on conventional engineering.",
    },
  ],
}

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
  const [filters, setFilters] = useState<IdeaFilters>(defaultFilters)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filtersCollapsed, setFiltersCollapsed] = useState(false)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

  const updateFilter = <K extends keyof IdeaFilters>(
    key: K,
    value: IdeaFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => setFilters(defaultFilters)

  const generateIdeas = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ api, description, filters }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error("Error generating ideas: " + (data.error || data.message))
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
      setFiltersCollapsed(true)

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

  useEffect(() => {
    if (open) setFiltersCollapsed(false)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-md bg-ink px-5 py-2 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-paper transition hover:bg-ink/90 hover:text-paper"
        >
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            Ideate
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex max-h-[90vh] max-w-[95vw] flex-col overflow-hidden border-ink bg-paper p-4 text-ink sm:max-w-3xl sm:p-6"
        aria-describedby="dialog-description"
      >
        <DialogHeader className="space-y-2 text-center sm:text-left">
          <DialogTitle className="text-xl font-bold sm:text-2xl">
            Project ideas fueled by {api}
          </DialogTitle>
          <p className="text-sm text-ink-soft">
            Set the brief first, then generate sparks that match scope, tone,
            and stack focus. You can reopen filters anytime.
          </p>
        </DialogHeader>
        <ScrollArea className="h-[70vh]">
          <div className="space-y-4 pr-1 sm:pr-2">
            <div className="space-y-4 rounded-2xl border border-ink/15 bg-paper-dim p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-ink-soft">
                    Filters before generation
                </p>
                <p className="text-sm text-ink-soft">
                  Choose experience level, stack focus, tone, and AI stance to
                  steer the ideas.
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink">
                  <span className="rounded-full border border-ink/25 bg-paper-dim px-3 py-1">
                    {filters.skillLevel} · level
                  </span>
                  <span className="rounded-full border border-ink/25 bg-paper-dim px-3 py-1">
                    {filters.stackFocus} · focus
                  </span>
                  <span className="rounded-full border border-ink/25 bg-paper-dim px-3 py-1">
                    {filters.tone} · tone
                  </span>
                  <span className="rounded-full border border-ink/25 bg-paper-dim px-3 py-1">
                    {filters.aiUsage} · AI
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full border border-ink/25 bg-paper-dim text-ink hover:bg-ink/5"
                  onClick={() => resetFilters()}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full border border-ink/25 bg-paper-dim text-ink hover:bg-ink/5"
                  onClick={() => setFiltersCollapsed((prev) => !prev)}
                  disabled={loading}
                >
                  {filtersCollapsed ? "Show filters" : "Hide filters"}
                </Button>
                <Button
                  onClick={generateIdeas}
                  disabled={loading}
                  size="sm"
                  className="rounded-full border border-ink/30 bg-ink/5 text-ink hover:bg-ink/10"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </span>
                  ) : (
                    "Generate with these filters"
                  )}
                </Button>
              </div>
            </div>

            {!filtersCollapsed && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-ink-soft">
                    Developer level
                  </p>
                  <div className="grid gap-2">
                    {filterOptions.skillLevel.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateFilter("skillLevel", option.value)}
                        className={cn(
                          "w-full rounded-xl border px-3 py-3 text-left transition",
                          filters.skillLevel === option.value
                            ? "border-ink bg-ink/5"
                            : "border-ink/15 bg-paper-dim hover:border-ink/40"
                        )}
                      >
                        <p className="text-xs uppercase tracking-[0.25em] text-ink-soft">
                          {option.label}
                        </p>
                        <p className="mt-1 text-sm text-ink">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-ink-soft">
                    Stack focus
                  </p>
                  <div className="grid gap-2">
                    {filterOptions.stackFocus.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateFilter("stackFocus", option.value)}
                        className={cn(
                          "w-full rounded-xl border px-3 py-3 text-left transition",
                          filters.stackFocus === option.value
                            ? "border-ink bg-ink/5"
                            : "border-ink/15 bg-paper-dim hover:border-ink/40"
                        )}
                      >
                        <p className="text-xs uppercase tracking-[0.25em] text-ink-soft">
                          {option.label}
                        </p>
                        <p className="mt-1 text-sm text-ink">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-ink-soft">
                    Tone
                  </p>
                  <div className="grid gap-2">
                    {filterOptions.tone.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateFilter("tone", option.value)}
                        className={cn(
                          "w-full rounded-xl border px-3 py-3 text-left transition",
                          filters.tone === option.value
                            ? "border-ink bg-ink/5"
                            : "border-ink/15 bg-paper-dim hover:border-ink/40"
                        )}
                      >
                        <p className="text-xs uppercase tracking-[0.25em] text-ink-soft">
                          {option.label}
                        </p>
                        <p className="mt-1 text-sm text-ink">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-ink-soft">
                    AI usage
                  </p>
                  <div className="grid gap-2">
                    {filterOptions.aiUsage.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateFilter("aiUsage", option.value)}
                        className={cn(
                          "w-full rounded-xl border px-3 py-3 text-left transition",
                          filters.aiUsage === option.value
                            ? "border-ink bg-ink/5"
                            : "border-ink/15 bg-paper-dim hover:border-ink/40"
                        )}
                      >
                        <p className="text-xs uppercase tracking-[0.25em] text-ink-soft">
                          {option.label}
                        </p>
                        <p className="mt-1 text-sm text-ink">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            </div>

            {ideas.length > 0 ? (
              <div className="space-y-3">
                <Carousel
                setApi={setCarouselApi}
                opts={{ align: "start", loop: false }}
                className="relative isolate rounded-2xl border border-ink/15 bg-paper-dim px-2 py-2 sm:rounded-3xl sm:px-3 sm:py-3"
              >
                <CarouselContent className="ml-0">
                  {ideas.map((idea, i) => (
                    <CarouselItem
                      key={i}
                      className="flex justify-center px-1.5 py-3 sm:px-2 sm:py-4"
                    >
                      <Card className="relative flex h-[320px] w-full max-w-lg flex-col overflow-hidden rounded-[18px] border border-ink bg-paper text-ink sm:h-[340px] sm:rounded-[22px]">
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
                          <div className="grid gap-2 text-[11px] uppercase tracking-[0.2em] text-ink-soft sm:grid-cols-2">
                            <div className="rounded-xl border border-ink/15 bg-paper-dim px-3 py-2">
                              <p>Feasibility</p>
                              <p className="text-sm font-semibold text-ink sm:text-base">
                                {idea.feasibilityScore}/10
                              </p>
                            </div>
                            <div className="rounded-xl border border-ink/15 bg-paper-dim px-3 py-2">
                              <p>Originality</p>
                              <p className="text-sm font-semibold text-ink sm:text-base">
                                {idea.originalityScore}/10
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="relative flex-1 overflow-y-auto text-sm text-ink">
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
                          ? "bg-ink"
                          : "bg-ink/25 hover:bg-ink/50"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-[0.25em] text-ink-soft">
                    Idea {currentIndex + 1} of {ideas.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full border border-ink/15 bg-paper-dim text-ink hover:bg-ink/5"
                      onClick={handlePrevious}
                      disabled={ideas.length <= 1}
                      aria-label="Previous idea"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full border border-ink/15 bg-paper-dim text-ink hover:bg-ink/5"
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
                <div className="rounded-2xl border border-dashed border-ink/15 bg-paper-dim px-4 py-6 text-sm text-ink-soft sm:px-6">
                  Pick your filters, generate, and we&#39;ll sort ideas by
                  feasibility and originality in this carousel.
                </div>
              )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
