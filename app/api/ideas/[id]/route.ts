import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { deleteIdea, setIdeaTags, updateIdeaVisibility } from "@/lib/db/ideas"
import { sanitizeTags } from "@/lib/tags"

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = req.nextUrl.pathname.split("/").pop()

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 })
  }

  try {
    // Ensure the user can only delete their own ideas
    await deleteIdea(id, session.user.id)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete idea"
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const ideaId = req.nextUrl.pathname.split("/").pop()

  const userId = session.user.id

  const body = await req.json()
  const { is_public, tags } = body

  if (is_public === undefined && tags === undefined) {
    return NextResponse.json(
      { error: "Nothing to update" },
      { status: 400 }
    )
  }

  if (is_public !== undefined && typeof is_public !== "boolean") {
    return NextResponse.json(
      { error: "Invalid is_public" },
      { status: 400 }
    )
  }

  try {
    if (is_public !== undefined) {
      await updateIdeaVisibility(ideaId!, userId, is_public)
    }

    if (tags !== undefined) {
      await setIdeaTags(ideaId!, userId, sanitizeTags(tags))
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update idea"
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
