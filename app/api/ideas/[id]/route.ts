import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase/server"

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = req.nextUrl.pathname.split("/").pop()

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 })
  }

  const { error } = await supabaseServer
    .from("ideas")
    .delete()
    .match({ id, user_id: session.user.id }) // Ensure the user can only delete their own ideas

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
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
  const { is_public } = body

  if (typeof is_public !== "boolean") {
    return NextResponse.json(
      { error: "Missing or invalid is_public" },
      { status: 400 }
    )
  }

  const { error } = await supabaseServer
    .from("ideas")
    .update({ is_public })
    .eq("id", ideaId)
    .eq("user_id", userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
