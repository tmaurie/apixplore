import { NextRequest, NextResponse } from "next/server"
import { Session, getServerSession } from "next-auth"
import OpenAI from "openai"

import { authOptions } from "@/lib/auth"
import { getDailyUsage } from "@/lib/supabase/ideas"

const openai = new OpenAI()
const QUOTA_LIMIT = 30
const MAX_INPUT_LENGTH = 500
const skillLevels = ["beginner", "experienced"] as const
const stackFocuses = ["fullstack", "backend", "frontend"] as const
const tones = ["serious", "playful"] as const
const aiUsages = ["optional", "required", "avoid"] as const

type IdeaFilters = {
  skillLevel: (typeof skillLevels)[number]
  stackFocus: (typeof stackFocuses)[number]
  tone: (typeof tones)[number]
  aiUsage: (typeof aiUsages)[number]
}

const defaultFilters: IdeaFilters = {
  skillLevel: "beginner",
  stackFocus: "fullstack",
  tone: "serious",
  aiUsage: "optional",
}

const skillLevelGuidance: Record<IdeaFilters["skillLevel"], string> = {
  beginner: "Beginner friendly scope with clear first steps and minimal setup.",
  experienced:
    "Assume comfort with complex architecture, performance tuning, and extensibility.",
}

const stackGuidance: Record<IdeaFilters["stackFocus"], string> = {
  fullstack: "End-to-end product ideas mixing UI polish and backend orchestration.",
  backend: "Service-oriented ideas, automation, APIs, or workflow engines.",
  frontend: "Interface-heavy ideas with visualization, interactivity, and UX polish.",
}

const toneGuidance: Record<IdeaFilters["tone"], string> = {
  serious: "Professional and outcome-driven tone.",
  playful: "Casual, surprising, and exploratory tone.",
}

const aiGuidance: Record<IdeaFilters["aiUsage"], string> = {
  optional: "AI is optional: include only if it clearly improves the experience.",
  required: "Each idea must feature an AI-powered element.",
  avoid: "Do not include AI features; stick to conventional engineering.",
}

const pickValidOption = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T
): T =>
  typeof value === "string" && allowed.includes(value as T)
    ? (value as T)
    : fallback

const sanitizeInput = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback
  const cleaned = value.replace(/\s+/g, " ").trim()
  return cleaned ? cleaned.slice(0, MAX_INPUT_LENGTH) : fallback
}

const stripMarkdownFences = (text: string) =>
  text.replace(/```json|```/gi, "").trim()

const isValidIdea = (idea: any) =>
  idea &&
  typeof idea.title === "string" &&
  idea.title.trim() &&
  typeof idea.description === "string" &&
  idea.description.trim() &&
  typeof idea.feasibilityScore === "number" &&
  idea.feasibilityScore >= 0 &&
  idea.feasibilityScore <= 10 &&
  typeof idea.originalityScore === "number" &&
  idea.originalityScore >= 0 &&
  idea.originalityScore <= 10

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session

  const { api, description, filters } = (await req.json()) as {
    api?: unknown
    description?: unknown
    filters?: Partial<IdeaFilters>
  }

  const apiName = sanitizeInput(api, "Unknown API")
  const apiDescription = sanitizeInput(description, "No description provided")
  const selectedSkillLevel = pickValidOption(
    filters?.skillLevel,
    skillLevels,
    defaultFilters.skillLevel
  )
  const selectedStackFocus = pickValidOption(
    filters?.stackFocus,
    stackFocuses,
    defaultFilters.stackFocus
  )
  const selectedTone = pickValidOption(
    filters?.tone,
    tones,
    defaultFilters.tone
  )
  const selectedAiUsage = pickValidOption(
    filters?.aiUsage,
    aiUsages,
    defaultFilters.aiUsage
  )

  const prompt = `
Given the following public API and user preferences, return exactly 3 project ideas a developer could build with it.
- Output: a JSON array of 3 objects with keys "title", "description", "feasibilityScore", "originalityScore".
- Title <= 80 characters. Description 1-2 sentences, practical and technically feasible.
- feasibilityScore: integer 0-10 (10 = very easy to build). originalityScore: integer 0-10 (10 = most novel).
- Do not include markdown, code fences, or extra text. JSON only.

Audience preferences to reflect in the ideas:
- Developer level: ${skillLevelGuidance[selectedSkillLevel]}
- Build focus: ${stackGuidance[selectedStackFocus]}
- Tone: ${toneGuidance[selectedTone]}
- AI usage: ${aiGuidance[selectedAiUsage]}
- Ensure the scope, feature emphasis, and tone honor these filters.

API name: "${apiName}"
API description: "${apiDescription}"
`.trim()

  const usageToday = await getDailyUsage(session.user.id)

  if (usageToday >= QUOTA_LIMIT) {
    return NextResponse.json(
      {
        error: `Quota exceeded: ${QUOTA_LIMIT} ideas per day`,
      },
      { status: 429 }
    )
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a concise product ideation assistant.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    })

    const content = chatCompletion.choices[0].message?.content || ""
    const cleaned = stripMarkdownFences(content)

    const ideas = JSON.parse(cleaned)

    if (
      !Array.isArray(ideas) ||
      ideas.length !== 3 ||
      !ideas.every(isValidIdea)
    ) {
      return NextResponse.json(
        { error: "Invalid AI response format" },
        { status: 502 }
      )
    }

    return NextResponse.json({ ideas })
  } catch (error) {
    console.error("[/api/ideas] Error:", error)
    return NextResponse.json(
      { error: "AI generation failed", details: error },
      { status: 500 }
    )
  }
}
