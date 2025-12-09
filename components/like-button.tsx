"use client"

import { useState, useTransition } from "react"
import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"

interface LikeButtonProps {
  ideaId: string
  initialLiked: boolean
  initialCount: number
}

export function LikeButton({
  ideaId,
  initialLiked,
  initialCount,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()

  const toggleLike = () => {
    startTransition(async () => {
      const method = liked ? "DELETE" : "POST"
      const res = await fetch(`/api/ideas/${ideaId}/like`, { method })

      if (res.ok) {
        setLiked(!liked)
        setCount((c) => c + (liked ? -1 : 1))
      }
    })
  }

  return (
    <button
      onClick={toggleLike}
      disabled={isPending}
      className={cn(
        "flex items-center gap-1 text-sm transition-colors cursor-pointer",
        liked ? "text-rose-500" : "text-muted-foreground hover:text-rose-500",
        isPending && "opacity-50 animate-pulse"
      )}
    >
      <Heart className={cn("w-4 h-4", liked && "fill-rose-500")} />
      {count}
    </button>
  )
}
