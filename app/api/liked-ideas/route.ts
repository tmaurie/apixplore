import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { getLikedIdeas } from "@/lib/db/likes"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = session.user.id

  try {
    const ideas = await getLikedIdeas(userId)
    return NextResponse.json({ ideas })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load liked ideas"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
