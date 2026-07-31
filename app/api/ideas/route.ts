import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { getUserIdeas, saveIdea } from "@/lib/db/ideas"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { api, apiLink, description, idea } = body

  if (!api || !idea?.title || !idea?.description) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  try {
    const saved = await saveIdea({
      userId: session.user.id,
      api,
      apiLink,
      description,
      idea,
    })

    return NextResponse.json({ idea: saved })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save idea"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const ideas = await getUserIdeas(session.user.id)
    return NextResponse.json({ ideas })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load ideas"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
