import { NextResponse } from "next/server"

import { getPublicIdeas } from "@/lib/supabase/ideas"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get("limit") || "20", 10)
  const offset = parseInt(searchParams.get("offset") || "0", 10)

  try {
    const publicIdeas = await getPublicIdeas({ limit, offset })
    return NextResponse.json({ ideas: publicIdeas }, { status: 200 })
  } catch (error: any) {
    console.error("[/api/public-ideas] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch public ideas", details: error.message },
      { status: 500 }
    )
  }
}
