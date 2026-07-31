import { NextRequest, NextResponse } from "next/server"
import { Session, getServerSession } from "next-auth"
import OpenAI from "openai"

import { authOptions } from "@/lib/auth"
import { QUOTA_LIMIT } from "@/lib/constants"
import { getDailyGenerationCount, logGeneration } from "@/lib/db/generations"
import {
  IdeaFilters,
  buildPrompt,
  isValidIdea,
  resolveFilters,
  sanitizeInput,
  stripMarkdownFences,
} from "@/lib/ideaGeneration"

const openai = new OpenAI()

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { api, description, filters } = (await req.json()) as {
    api?: unknown
    description?: unknown
    filters?: Partial<IdeaFilters>
  }

  const apiName = sanitizeInput(api, "Unknown API")
  const apiDescription = sanitizeInput(description, "No description provided")
  const resolvedFilters = resolveFilters(filters)
  const prompt = buildPrompt(apiName, apiDescription, resolvedFilters)

  const usageToday = await getDailyGenerationCount(session.user.id)

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
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a concise product ideation assistant.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    })

    await logGeneration(session.user.id)

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
