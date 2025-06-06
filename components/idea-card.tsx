import { Idea } from "@/types/idea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { LikeButton } from "@/components/like-button"

export function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <Card className="w-full mb-4 bg-muted/50 border border-border rounded-2xl transition-all hover:border-muted-foreground hover:shadow-xs">
      <CardHeader className="flex flex-row justify-between items-start space-y-0">
        <h2 className="text-lg font-semibold">{idea.generated_idea.title}</h2>
        <Badge
          className="text-sm font-mono text-muted-foreground"
          variant="secondary"
        >
          {idea.api_name}
        </Badge>
      </CardHeader>
      <CardContent className="py-4">
        <p className="text-base text-muted-foreground whitespace-pre-wrap">
          {idea.generated_idea.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">
            Created {new Date(idea.created_at).toLocaleDateString()} at{" "}
            {new Date(idea.created_at).toLocaleTimeString()}
          </span>
        </div>
        <LikeButton
          ideaId={idea.id}
          initialLiked={idea.likedByUser ?? false}
          initialCount={idea.likeCount ?? 0}
        />
      </CardFooter>
    </Card>
  )
}
