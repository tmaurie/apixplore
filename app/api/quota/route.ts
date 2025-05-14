import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    console.log()
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const quotaUsed = 2
  const quotaLimit = 10

  return NextResponse.json({ used: quotaUsed, limit: quotaLimit })
}
