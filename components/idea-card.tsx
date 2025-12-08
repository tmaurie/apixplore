import Link from "next/link"

import { Idea } from "@/types/idea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { LikeButton } from "@/components/like-button"

export function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <Card className="w-full rounded-3xl border border-white/10 bg-white/5 text-white shadow-[0_20px_60px_rgba(9,10,44,0.35)] transition hover:border-white/40">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <h2 className="text-lg font-semibold text-white">
          {idea.generated_idea.title}
        </h2>
        <Link
          href={idea.api_link || "#"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Badge
            className="text-xs font-mono uppercase tracking-[0.2em] text-white/70"
            variant="outline"
          >
            {idea.api_name}
          </Badge>
        </Link>
      </CardHeader>
      <CardContent className="py-4">
        <p className="text-base text-white/80 whitespace-pre-wrap">
          {idea.generated_idea.description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-white/70">
        <span className="text-xs font-mono">
          Created {new Date(idea.created_at).toLocaleDateString()} at{" "}
          {new Date(idea.created_at).toLocaleTimeString()}
        </span>
        <LikeButton
          ideaId={idea.id}
          initialLiked={idea.likedByUser ?? false}
          initialCount={idea.likeCount ?? 0}
        />
      </CardFooter>
    </Card>
  )
}
