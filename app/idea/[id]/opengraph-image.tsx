import { ImageResponse } from "next/og"

import { getPublicIdeaById } from "@/lib/db/ideas"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "APIxplore — Shared project idea"

const paper = "#fbf4ea"
const ink = "#221812"
const inkSoft = "#5e534b"
const amber = "#e65812"

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let title = "A project idea worth building"
  let apiName = "APIxplore"

  try {
    const idea = await getPublicIdeaById(id)
    title = idea.generated_idea?.title ?? title
    apiName = idea.api_name ?? apiName
  } catch {
    // fall back to generic branding below
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: paper,
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 10,
              border: `2px solid ${ink}`,
              backgroundColor: amber,
              color: paper,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {"{}"}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              color: ink,
              letterSpacing: -0.5,
            }}
          >
            APIxplore
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              color: amber,
              textTransform: "uppercase",
              letterSpacing: 6,
            }}
          >
            Shared idea · {apiName}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 700,
              color: ink,
              lineHeight: 1.15,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: inkSoft,
          }}
        >
          github.com/tmaurie/apixplore
        </div>
      </div>
    ),
    { ...size }
  )
}
