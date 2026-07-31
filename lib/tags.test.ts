import { describe, expect, it } from "vitest"

import { MAX_TAG_LENGTH, MAX_TAGS_PER_IDEA, normalizeTag, sanitizeTags } from "./tags"

describe("normalizeTag", () => {
  it("trims, lowercases, and collapses whitespace", () => {
    expect(normalizeTag("  React   Native  ")).toBe("react native")
  })

  it("truncates to MAX_TAG_LENGTH", () => {
    const long = "a".repeat(MAX_TAG_LENGTH + 10)
    expect(normalizeTag(long)).toHaveLength(MAX_TAG_LENGTH)
  })
})

describe("sanitizeTags", () => {
  it("returns an empty array for non-array input", () => {
    expect(sanitizeTags(undefined)).toEqual([])
    expect(sanitizeTags("react")).toEqual([])
    expect(sanitizeTags(null)).toEqual([])
  })

  it("normalizes, dedupes, and drops empty/non-string entries", () => {
    expect(sanitizeTags(["React", " react ", "", "  ", 42, "AI"])).toEqual([
      "react",
      "ai",
    ])
  })

  it("caps the number of tags at MAX_TAGS_PER_IDEA", () => {
    const many = Array.from({ length: MAX_TAGS_PER_IDEA + 5 }, (_, i) => `tag${i}`)
    expect(sanitizeTags(many)).toHaveLength(MAX_TAGS_PER_IDEA)
  })
})
