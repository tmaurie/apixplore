"use client"

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>

export async function trackEvent(
  event: string,
  payload: AnalyticsPayload = {}
) {
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event, payload }),
      keepalive: true,
    })
  } catch {
    // Analytics should never block the user flow.
  }
}
