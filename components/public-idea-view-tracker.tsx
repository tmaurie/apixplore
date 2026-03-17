"use client"

import { useEffect } from "react"

import { trackEvent } from "@/lib/analytics"

export function PublicIdeaViewTracker({ ideaId }: { ideaId: string }) {
  useEffect(() => {
    void trackEvent("public_idea_viewed", { ideaId })
  }, [ideaId])

  return null
}
