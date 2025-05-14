import { NextRequest, NextResponse } from "next/server"
import { Session, getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session: Session = (await getServerSession(authOptions)) as Session

  if (!session?.user?.email) {
    console.log()
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const quotaUsed = 2
  const quotaLimit = 10

  return NextResponse.json({ used: quotaUsed, limit: quotaLimit })
}
