import { describe, expect, it } from "vitest"

import {
  MAX_INPUT_LENGTH,
  buildPrompt,
  isValidIdea,
  pickValidOption,
  resolveFilters,
  sanitizeInput,
  stripMarkdownFences,
} from "./ideaGeneration"

describe("pickValidOption", () => {
  it("keeps the value when it is in the allowed list", () => {
    expect(pickValidOption("backend", ["frontend", "backend"] as const, "frontend")).toBe(
      "backend"
    )
  })

  it("falls back when the value is not in the allowed list", () => {
    expect(pickValidOption("nonsense", ["frontend", "backend"] as const, "frontend")).toBe(
      "frontend"
    )
  })

  it("falls back for non-string input", () => {
    expect(pickValidOption(42, ["frontend", "backend"] as const, "frontend")).toBe(
      "frontend"
    )
    expect(pickValidOption(undefined, ["frontend", "backend"] as const, "frontend")).toBe(
      "frontend"
    )
  })
})

describe("resolveFilters", () => {
  it("returns the defaults when no filters are given", () => {
    expect(resolveFilters(undefined)).toEqual({
      skillLevel: "beginner",
      stackFocus: "fullstack",
      tone: "serious",
      aiUsage: "optional",
    })
  })

  it("keeps only the valid fields and falls back on the rest", () => {
    expect(
      resolveFilters({ skillLevel: "experienced", tone: "not-a-tone" as any })
    ).toEqual({
      skillLevel: "experienced",
      stackFocus: "fullstack",
      tone: "serious",
      aiUsage: "optional",
    })
  })
})

describe("sanitizeInput", () => {
  it("trims and collapses whitespace", () => {
    expect(sanitizeInput("  hello   world  ", "fallback")).toBe("hello world")
  })

  it("falls back for non-string input", () => {
    expect(sanitizeInput(123, "fallback")).toBe("fallback")
    expect(sanitizeInput(null, "fallback")).toBe("fallback")
    expect(sanitizeInput(undefined, "fallback")).toBe("fallback")
  })

  it("falls back for empty/whitespace-only strings", () => {
    expect(sanitizeInput("   ", "fallback")).toBe("fallback")
    expect(sanitizeInput("", "fallback")).toBe("fallback")
  })

  it("truncates to MAX_INPUT_LENGTH", () => {
    const long = "a".repeat(MAX_INPUT_LENGTH + 100)
    const result = sanitizeInput(long, "fallback")
    expect(result).toHaveLength(MAX_INPUT_LENGTH)
  })
})

describe("stripMarkdownFences", () => {
  it("removes ```json and ``` fences", () => {
    expect(stripMarkdownFences('```json\n[{"a":1}]\n```')).toBe('[{"a":1}]')
  })

  it("leaves plain JSON untouched (aside from trimming)", () => {
    expect(stripMarkdownFences('  [{"a":1}]  ')).toBe('[{"a":1}]')
  })
})

describe("isValidIdea", () => {
  const validIdea = {
    title: "A great idea",
    description: "Does something useful.",
    feasibilityScore: 7,
    originalityScore: 5,
  }

  it("accepts a well-formed idea", () => {
    expect(isValidIdea(validIdea)).toBe(true)
  })

  it.each([
    ["missing title", { ...validIdea, title: "" }],
    ["missing description", { ...validIdea, description: undefined }],
    ["non-numeric feasibilityScore", { ...validIdea, feasibilityScore: "7" }],
    ["out-of-range feasibilityScore", { ...validIdea, feasibilityScore: 11 }],
    ["negative originalityScore", { ...validIdea, originalityScore: -1 }],
    ["null idea", null],
  ])("rejects %s", (_label, idea) => {
    expect(isValidIdea(idea)).toBeFalsy()
  })
})

describe("buildPrompt", () => {
  it("includes the sanitized API name/description and filter guidance", () => {
    const prompt = buildPrompt("Cat Facts", "Daily cat facts", {
      skillLevel: "experienced",
      stackFocus: "backend",
      tone: "playful",
      aiUsage: "required",
    })

    expect(prompt).toContain('API name: "Cat Facts"')
    expect(prompt).toContain('API description: "Daily cat facts"')
    expect(prompt).toContain("complex architecture")
    expect(prompt).toContain("Service-oriented ideas")
    expect(prompt).toContain("Casual, surprising")
    expect(prompt).toContain("Each idea must feature an AI-powered element.")
  })
})
