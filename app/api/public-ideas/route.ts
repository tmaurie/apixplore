import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { getPublicIdeas } from "@/lib/db/ideas"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  const limit = parseInt(searchParams.get("limit") || "20", 10)
  const offset = parseInt(searchParams.get("offset") || "0", 10)

  try {
    const publicIdeas = await getPublicIdeas({ limit, offset })
    const enrichedIdeas = publicIdeas.map((idea) => ({
      ...idea,
      likeCount: idea.idea_like?.length ?? 0,
      likedByUser: idea.idea_like?.some(
        (like: { user_id: string }) => like.user_id === userId
      ),
    }))
    return NextResponse.json({ ideas: enrichedIdeas }, { status: 200 })
  } catch (error) {
    console.error("[/api/public-ideas] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to fetch public ideas", details: message },
      { status: 500 }
    )
  }
}
