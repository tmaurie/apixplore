import { NextRequest, NextResponse } from "next/server"
import { Session, getServerSession } from "next-auth"
import OpenAI from "openai"

import { authOptions } from "@/lib/auth"
import { getDailyUsage } from "@/lib/supabase/ideas"

const openai = new OpenAI()
const QUOTA_LIMIT = 30
const MAX_INPUT_LENGTH = 500

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

  const { api, description } = await req.json()

  const apiName = sanitizeInput(api, "Unknown API")
  const apiDescription = sanitizeInput(description, "No description provided")

  const prompt = `
Given the following public API, return exactly 3 project ideas a developer could build with it.
- Output: a JSON array of 3 objects with keys "title", "description", "feasibilityScore", "originalityScore".
- Title <= 80 characters. Description 1-2 sentences, practical and technically feasible.
- feasibilityScore: integer 0-10 (10 = very easy to build). originalityScore: integer 0-10 (10 = most novel).
- Do not include markdown, code fences, or extra text. JSON only.

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
        { role: "system", content: "You are a concise product ideation assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    })

    const content = chatCompletion.choices[0].message?.content || ""
    const cleaned = stripMarkdownFences(content)

    const ideas = JSON.parse(cleaned)

    if (!Array.isArray(ideas) || ideas.length !== 3 || !ideas.every(isValidIdea)) {
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
