import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { getUserIdeas, saveIdea } from "@/lib/supabase/ideas"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { api, description, idea } = body

  if (!api || !idea?.title || !idea?.description) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  try {
    const saved = await saveIdea({
      userId: session.user.id,
      api,
      description,
      idea,
    })

    return NextResponse.json({ idea: saved })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const ideas = await getUserIdeas(session.user.id)
    return NextResponse.json({ ideas })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
