import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user_id = session.user.id

  const idea_id = req.nextUrl.pathname.split("/")[3]

  console.log("Liking idea:", idea_id, "by user:", user_id)

  const { error } = await supabaseServer
    .from("idea_like")
    .insert({ idea_id, user_id })

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "Already liked" }, { status: 200 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user_id = session.user.id

  const idea_id = req.nextUrl.pathname.split("/")[3]

  const { error } = await supabaseServer
    .from("idea_like")
    .delete()
    .eq("idea_id", idea_id)
    .eq("user_id", user_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
