import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI()

export async function POST(req: NextRequest) {
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

    console.log("[/api/ideas] Generating ideas for API:", api)
    console.log("[/api/ideas] API description:", description)
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

    console.log("[/api/ideas] Generated ideas:", ideas)
    return NextResponse.json({ ideas })
  } catch (error) {
    console.error("[/api/ideas] Error:", error)
    return NextResponse.json(
      { error: "AI generation failed", details: error },
      { status: 500 }
    )
  }
}
