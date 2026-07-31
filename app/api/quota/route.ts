import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { QUOTA_LIMIT } from "@/lib/constants"
import { getDailyGenerationCount } from "@/lib/db/generations"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const used = await getDailyGenerationCount(session.user.id)

  return NextResponse.json({ used, limit: QUOTA_LIMIT })
}
