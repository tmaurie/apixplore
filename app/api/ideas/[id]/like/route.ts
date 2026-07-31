import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { likeIdea, unlikeIdea } from "@/lib/db/likes"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user_id = session.user.id

  const idea_id = req.nextUrl.pathname.split("/")[3]

  console.log("Liking idea:", idea_id, "by user:", user_id)

  try {
    await likeIdea(idea_id, user_id)
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "23505") {
      return NextResponse.json({ message: "Already liked" }, { status: 200 })
    }
    const message = err instanceof Error ? err.message : "Failed to like idea"
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user_id = session.user.id

  const idea_id = req.nextUrl.pathname.split("/")[3]

  try {
    await unlikeIdea(idea_id, user_id)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to unlike idea"
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
