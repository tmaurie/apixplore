import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const event = typeof body?.event === "string" ? body.event : null
    const payload = typeof body?.payload === "object" ? body.payload : {}

    if (!event) {
      return NextResponse.json({ error: "Missing event name" }, { status: 400 })
    }

    console.info("[analytics]", {
      event,
      payload,
      path: req.headers.get("referer"),
      userAgent: req.headers.get("user-agent"),
      at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Invalid event payload" }, { status: 400 })
  }
}
