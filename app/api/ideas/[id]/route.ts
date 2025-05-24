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
