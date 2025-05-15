"use client"

import { useEffect, useState } from "react"

type Idea = {
  id: string
  api_name: string
  description?: string
  generated_idea: {
    title: string
    description: string
  }
  created_at: string
}

export function IdeasHistory() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIdeas = async () => {
      const res = await fetch("/api/ideas")
      const data = await res.json()
      setIdeas(data.ideas)
      setLoading(false)
    }

    fetchIdeas()
  }, [])

  if (loading) return <p>Chargement des idées...</p>

  return (
    <div className="grid gap-4">
      {ideas.map((idea) => (
        <div key={idea.id} className="p-4 border rounded-xl bg-card shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">
            {new Date(idea.created_at).toLocaleString()} – via {idea.api_name}
          </p>
          <h3 className="text-lg font-bold">{idea.generated_idea.title}</h3>
          <p className="text-sm text-muted-foreground">
            {idea.generated_idea.description}
          </p>
        </div>
      ))}
    </div>
  )
}
