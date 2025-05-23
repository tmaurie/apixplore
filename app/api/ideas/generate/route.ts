import { NextRequest, NextResponse } from "next/server"
import { Session, getServerSession } from "next-auth"
import OpenAI from "openai"

import { authOptions } from "@/lib/auth"
import { getDailyUsage } from "@/lib/supabase/ideas"

const openai = new OpenAI()
const QUOTA_LIMIT = 30

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session

  const { api, description } = await req.json()

  const prompt = `
You are a product ideation assistant.
Given the name and description of a public API, generate 3 side project ideas a developer could build using this API.
Each idea should include a title and a short description (1–2 sentences). Keep it creative and technically feasible.

API Name: ${api}
API Description: ${description || "No description provided"}

Respond in JSON format of ideas described as: title and description.
`

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
        { role: "system", content: "You are a product ideation assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    })

    const content = chatCompletion.choices[0].message.content || ""
    const cleaned = content.replace(/```json|```/g, "").trim()

    const ideas = JSON.parse(cleaned)

    return NextResponse.json({ ideas })
  } catch (error) {
    console.error("[/api/ideas] Error:", error)
    return NextResponse.json(
      { error: "AI generation failed", details: error },
      { status: 500 }
    )
  }
}
