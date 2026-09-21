import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt =
  "Apixplore: browse public APIs, frame a product idea, publish it."

const paper = "#fafaf9"
const ink = "#11110f"
const inkSoft = "#696966"
const amber = "#e65812"

export default function OpengraphImage() {
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
              borderRadius: 8,
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
            Apixplore
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 68,
            fontWeight: 700,
            color: ink,
            lineHeight: 1.1,
            letterSpacing: -2,
          }}
        >
          <div style={{ display: "flex" }}>Find the API. Frame the idea.</div>
          <div style={{ display: "flex", color: amber }}>Ship the page.</div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: inkSoft }}>
          A catalog of public APIs, with an AI step that turns one into a
          product concept.
        </div>
      </div>
    ),
    { ...size }
  )
}
