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
    <article className="flex h-full flex-col rounded-md border border-ink/12 bg-paper p-5 transition-colors duration-200 hover:border-ink/30">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <span className="inline-block rounded-full border border-ink/15 bg-paper-dim px-2.5 py-0.5 font-mono text-[11px] text-ink-soft">
            {idea.api_name}
          </span>
          <h2 className="text-lg font-bold leading-snug sm:text-xl">
            {idea.generated_idea.title}
          </h2>
        </div>
        {idea.api_link && (
          <Link
            href={idea.api_link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 whitespace-nowrap text-xs text-ink-soft underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline"
          >
            API docs
          </Link>
        )}
      </div>

      <p className="mb-4 text-sm leading-relaxed text-ink-soft">
        {idea.generated_idea.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-3.5">
        <p className="text-xs text-ink-soft">
          {idea.author_id ? (
            <Link
              href={`/user/${idea.author_id}`}
              className="underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline"
            >
              {idea.author_name || idea.author_github_username || "A builder"}
            </Link>
          ) : (
            "Community"
          )}
          <span className="mx-1.5 opacity-40">/</span>
          <time
            dateTime={createdDate.toISOString()}
            className="font-mono tabular-nums"
          >
            {createdDate.toLocaleDateString()}
          </time>
        </p>

        {onUnlike ? (
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-ink-soft hover:text-ink"
            onClick={onUnlike}
            disabled={isRemoving}
          >
            {isRemoving ? "Removing" : "Remove from likes"}
          </Button>
        ) : (
          <div className="flex items-center gap-1">
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="text-xs text-ink-soft hover:text-ink"
            >
              <Link href={`/idea/${idea.id}`}>Open</Link>
            </Button>
            <ShareIdeaButton
              ideaId={idea.id}
              title={idea.generated_idea.title}
              source="public_feed"
              variant="ghost"
              className="text-xs text-ink-soft hover:text-ink"
            />
            <LikeButton
              ideaId={idea.id}
              initialLiked={idea.likedByUser ?? false}
              initialCount={idea.likeCount ?? 0}
            />
          </div>
        )}
      </div>
    </article>
  )
}
