import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { getDailyGenerationCount } from "@/lib/db/generations"

const QUOTA_LIMIT = 30

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const used = await getDailyGenerationCount(session.user.id)

  return NextResponse.json({ used, limit: QUOTA_LIMIT })
}
