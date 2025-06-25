import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = session.user.id

  const { data, error } = await supabaseServer
    .from("idea_like")
    .select(
      `
    idea_id,
    ideas (
      id,
      api_name,
      api_link,
      description,
      generated_idea,
      created_at
    )
  `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const ideas = data.map((row: any) => ({
    ...row.ideas,
    likedByUser: true,
  }))

  return NextResponse.json({ ideas })
}
