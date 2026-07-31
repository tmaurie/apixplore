import { NextRequest, NextResponse } from "next/server"

import { checkRateLimit } from "@/lib/rateLimit"

const limits: Record<string, { windowSeconds: number; max: number }> = {
  "/api/ideas/generate": { windowSeconds: 60, max: 5 },
  "/api/ideas/refine": { windowSeconds: 60, max: 5 },
  "/api/events": { windowSeconds: 60, max: 20 },
}

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for")
  if (forwardedFor) return forwardedFor.split(",")[0].trim()
  return req.headers.get("x-real-ip") ?? "unknown"
}

export async function proxy(req: NextRequest) {
  const limit = limits[req.nextUrl.pathname]

  if (!limit) return NextResponse.next()

  const key = `${req.nextUrl.pathname}:${getClientIp(req)}`
  const allowed = await checkRateLimit(key, limit)

  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/ideas/generate", "/api/ideas/refine", "/api/events"],
}
