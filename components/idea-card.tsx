import Link from "next/link"

import { Idea } from "@/types/idea"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { LikeButton } from "@/components/like-button"

interface IdeaCardProps {
  idea: Idea
  onUnlike?: () => Promise<void> | void
  isRemoving?: boolean
}

export function IdeaCard({ idea, onUnlike, isRemoving }: IdeaCardProps) {
  const createdDate = new Date(idea.created_at)
  const formattedDate = createdDate.toLocaleDateString()
  const formattedTime = createdDate.toLocaleTimeString()

  return (
    <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f25] text-white shadow-[0_20px_60px_rgba(9,10,44,0.4)] transition hover:-translate-y-1 hover:border-white/40">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-sky-500/10 opacity-80 transition duration-300 group-hover:opacity-100" />
      <CardHeader className="relative space-y-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <Badge
              variant="outline"
              className="border-white/25 bg-white/5 text-[11px] uppercase tracking-[0.25em] text-white/70"
            >
              {idea.api_name}
            </Badge>
            <h2 className="text-lg font-semibold leading-tight sm:text-xl">
              {idea.generated_idea.title}
            </h2>
          </div>
          {idea.api_link && (
            <Link
              href={idea.api_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/70 underline-offset-4 hover:text-white hover:underline"
            >
              API docs
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-white/60">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono">
            {formattedDate} {formattedTime}
          </span>
        </div>
      </CardHeader>

      <CardContent className="relative pb-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/80">
          {idea.generated_idea.description}
        </div>
      </CardContent>

      <CardFooter className="relative flex items-center justify-between gap-3 border-t border-white/5 pt-3 text-white/80">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em]">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/70">
            Public
          </span>
          <span className="text-white/60">by community</span>
        </div>
        {onUnlike ? (
          <Button
            size="sm"
            variant="ghost"
            className="text-white/80 hover:text-white"
            onClick={onUnlike}
            disabled={isRemoving}
          >
            {isRemoving ? "Removing..." : "Remove from likes"}
          </Button>
        ) : (
          <LikeButton
            ideaId={idea.id}
            initialLiked={idea.likedByUser ?? false}
            initialCount={idea.likeCount ?? 0}
          />
        )}
      </CardFooter>
    </Card>
  )
}
