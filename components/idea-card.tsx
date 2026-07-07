import Link from "next/link"

import { Idea } from "@/types/idea"
import { Button } from "@/components/ui/button"
import { LikeButton } from "@/components/like-button"
import { ShareIdeaButton } from "@/components/share-idea-button"

interface IdeaCardProps {
  idea: Idea
  onUnlike?: () => Promise<void> | void
  isRemoving?: boolean
}

export function IdeaCard({ idea, onUnlike, isRemoving }: IdeaCardProps) {
  const createdDate = new Date(idea.created_at)

  return (
    <div className="rounded-md border border-ink bg-paper p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <span className="inline-block rounded-full border border-ink/30 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
            {idea.api_name}
          </span>
          <h2 className="text-lg font-bold leading-tight sm:text-xl">
            {idea.generated_idea.title}
          </h2>
        </div>
        {idea.api_link && (
          <Link
            href={idea.api_link}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap font-mono text-xs text-ink-soft underline-offset-4 hover:text-amber hover:underline"
          >
            API docs
          </Link>
        )}
      </div>

      <p className="mb-3 font-mono text-xs text-ink-soft">
        {createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString()}
      </p>

      <div className="mb-4 rounded-md border border-dashed border-ink/30 p-3 text-sm text-ink-soft">
        {idea.generated_idea.description}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-ink/15 pt-3.5">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft">
          <span className="rounded-full border border-ink/30 px-2 py-1">
            Public
          </span>
          by community
        </div>
        {onUnlike ? (
          <Button
            size="sm"
            variant="ghost"
            className="font-mono text-xs uppercase tracking-[0.06em] text-ink-soft hover:text-ink"
            onClick={onUnlike}
            disabled={isRemoving}
          >
            {isRemoving ? "Removing..." : "Remove from likes"}
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="font-mono text-xs uppercase tracking-[0.06em] text-ink-soft hover:text-ink"
            >
              <Link href={`/idea/${idea.id}`}>Open idea</Link>
            </Button>
            <ShareIdeaButton
              ideaId={idea.id}
              title={idea.generated_idea.title}
              source="public_feed"
              variant="ghost"
              className="font-mono text-xs uppercase tracking-[0.06em] text-ink-soft hover:text-ink"
            />
            <LikeButton
              ideaId={idea.id}
              initialLiked={idea.likedByUser ?? false}
              initialCount={idea.likeCount ?? 0}
            />
          </div>
        )}
      </div>
    </div>
  )
}
