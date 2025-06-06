"use client"

import { useEffect, useState } from "react"
import { Idea } from "@/types/idea"
import {IdeaCard} from "@/components/idea-card";

export default function LikedIdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch("/api/liked-ideas")
        const data = await res.json()
        setIdeas(data.ideas || [])
      } catch (err) {
        console.error("Failed to load liked ideas", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLikes()
  }, [])

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Liked Ideas ❤️</h1>

      {loading && <p>Loading...</p>}
      {!loading && ideas.length === 0 && (
        <p className="text-muted-foreground">You haven't liked any ideas yet.</p>
      )}

      <div className="space-y-6">
        {ideas.map((idea) => (
         <IdeaCard idea={idea} key={idea.id} />
        ))}
      </div>
    </div>
  )
}
