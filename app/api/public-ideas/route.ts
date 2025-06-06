import { NextResponse } from "next/server"

import { getPublicIdeas } from "@/lib/supabase/ideas"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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
      likedByUser: idea.idea_like?.some((like: any) => like.user_id === userId),
    }))
    return NextResponse.json({ ideas: enrichedIdeas }, { status: 200 })
  } catch (error: any) {
    console.error("[/api/public-ideas] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch public ideas", details: error.message },
      { status: 500 }
    )
  }
}
