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
  skillLevel: { value: IdeaFilters["skillLevel"]; label: string }[]
  stackFocus: { value: IdeaFilters["stackFocus"]; label: string }[]
  tone: { value: IdeaFilters["tone"]; label: string }[]
  aiUsage: { value: IdeaFilters["aiUsage"]; label: string }[]
} = {
  skillLevel: [
    { value: "beginner", label: "Beginner" },
    { value: "experienced", label: "Experienced" },
  ],
  stackFocus: [
    { value: "fullstack", label: "Fullstack" },
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
  ],
  tone: [
    { value: "serious", label: "Serious" },
    { value: "playful", label: "Playful" },
  ],
  aiUsage: [
    { value: "optional", label: "AI optional" },
    { value: "required", label: "AI required" },
    { value: "avoid", label: "AI-free" },
  ],
}

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="w-16 shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={cn(
              "rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.05em] transition-colors disabled:pointer-events-none disabled:opacity-50",
              value === option.value
                ? "border-ink bg-ink text-paper"
                : "border-ink/30 text-ink-soft hover:border-ink hover:text-ink"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
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
            Tune the brief, then generate ideas scored for feasibility and
            originality.
          </p>
        </DialogHeader>
        <ScrollArea className="h-[70vh]">
          <div className="space-y-4 pr-1 sm:pr-2">
            <div className="space-y-3 rounded-lg border border-ink/25 bg-paper-dim p-4 sm:p-5">
              <FilterGroup
                label="Level"
                options={filterOptions.skillLevel}
                value={filters.skillLevel}
                onChange={(v) => updateFilter("skillLevel", v)}
                disabled={loading}
              />
              <FilterGroup
                label="Focus"
                options={filterOptions.stackFocus}
                value={filters.stackFocus}
                onChange={(v) => updateFilter("stackFocus", v)}
                disabled={loading}
              />
              <FilterGroup
                label="Tone"
                options={filterOptions.tone}
                value={filters.tone}
                onChange={(v) => updateFilter("tone", v)}
                disabled={loading}
              />
              <FilterGroup
                label="AI"
                options={filterOptions.aiUsage}
                value={filters.aiUsage}
                onChange={(v) => updateFilter("aiUsage", v)}
                disabled={loading}
              />

              <div className="flex items-center justify-between gap-3 border-t border-ink/15 pt-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={loading}
                  className="font-mono text-xs uppercase tracking-[0.1em] text-ink-soft transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-50"
                >
                  Reset
                </button>
                <Button
                  onClick={generateIdeas}
                  disabled={loading}
                  className="rounded-md bg-ink px-5 py-2 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-paper hover:bg-ink/90"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Generating…
                    </span>
                  ) : ideas.length > 0 ? (
                    "Regenerate"
                  ) : (
                    "Generate ideas"
                  )}
                </Button>
              </div>
            </div>

            {ideas.length > 0 ? (
              <div className="space-y-3">
                <Carousel
                setApi={setCarouselApi}
                opts={{ align: "start", loop: false }}
                className="relative isolate rounded-lg border border-ink/25 bg-paper-dim px-2 py-2 sm:px-3 sm:py-3"
              >
                <CarouselContent className="ml-0">
                  {ideas.map((idea, i) => (
                    <CarouselItem
                      key={i}
                      className="flex justify-center px-1.5 py-3 sm:px-2 sm:py-4"
                    >
                      <Card className="relative flex h-[320px] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-ink bg-paper text-ink sm:h-[340px]">
                        <span className="absolute -top-px left-5 rounded-b-[5px] bg-amber px-2.5 py-0.5 font-mono text-[11px] font-bold tracking-[0.1em] text-paper">
                          №{String(i + 1).padStart(3, "0")}
                        </span>
                        <CardHeader className="relative space-y-3 pb-2 pt-8">
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
                          <div className="grid grid-cols-2 gap-2 rounded-md border border-dashed border-ink/30 p-3 font-mono">
                            <div>
                              <p className="mb-0.5 text-[10px] uppercase tracking-[0.1em] text-ink-soft">
                                Feasibility
                              </p>
                              <p className="text-[13px] font-semibold">
                                {idea.feasibilityScore}/10
                              </p>
                            </div>
                            <div>
                              <p className="mb-0.5 text-[10px] uppercase tracking-[0.1em] text-ink-soft">
                                Originality
                              </p>
                              <p className="text-[13px] font-semibold">
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
                      className={cn(
                        "h-2.5 w-2.5 rounded-full transition-colors",
                        index === currentIndex
                          ? "bg-ink"
                          : "bg-ink/25 hover:bg-ink/50"
                      )}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-ink-soft">
                    Idea {currentIndex + 1} of {ideas.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-md border-ink/40 text-ink hover:bg-ink hover:text-paper"
                      onClick={handlePrevious}
                      disabled={ideas.length <= 1}
                      aria-label="Previous idea"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-md border-ink/40 text-ink hover:bg-ink hover:text-paper"
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
                <div className="rounded-lg border border-dashed border-ink/30 bg-paper-dim px-4 py-6 text-sm text-ink-soft sm:px-6">
                  Pick your filters, generate, and we&#39;ll sort ideas by
                  feasibility and originality.
                </div>
              )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
