import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function IdeaCard({ idea }: any) {

  return (
    <Card className="w-full mb-4 bg-muted/50 border border-border rounded-2xl transition-all hover:border-muted-foreground hover:shadow-xs">
      <CardHeader className="flex flex-row justify-between items-start space-y-0">
        <h2 className="text-lg font-semibold">{idea.generated_idea.title}</h2>
        <Badge className="text-sm font-mono text-muted-foreground" variant="secondary">
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
        <button
          className={cn(
            "flex items-center gap-1 text-sm text-muted-foreground hover:text-rose-500 transition duration-200 cursor-pointer",
            idea.likes ? "font-medium" : ""
          )}
        >
          <Heart className="w-4 h-4" />
          {idea.likes ?? 0}
        </button>
      </CardFooter>
    </Card>
  )
}
