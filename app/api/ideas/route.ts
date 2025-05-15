import { NextRequest, NextResponse } from "next/server"
import { Session, getServerSession } from "next-auth"
import OpenAI from "openai"

import { authOptions } from "@/lib/auth"
import { getUserIdeas, saveIdea } from "@/lib/supabase/ideas"

const openai = new OpenAI()

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

    await Promise.all(
      ideas.map((idea: any) =>
        saveIdea({
          userId: session.user.id,
          api: api,
          description: description,
          idea: idea,
        })
      )
    )

    return NextResponse.json({ ideas })
  } catch (error) {
    console.error("[/api/ideas] Error:", error)
    return NextResponse.json(
      { error: "AI generation failed", details: error },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const ideas = await getUserIdeas(session.user.id)
    return NextResponse.json({ ideas })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
