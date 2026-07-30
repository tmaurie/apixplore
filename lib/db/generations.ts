import { sql } from "./client"

export async function logGeneration(userId: string) {
  await sql`
    INSERT INTO public.idea_generations (user_id) VALUES (${userId})
  `
}

export async function getDailyGenerationCount(userId: string): Promise<number> {
  const today = new Date().toISOString().split("T")[0]

  const [{ count }] = await sql`
    SELECT COUNT(*) AS count FROM public.idea_generations
    WHERE user_id = ${userId} AND created_at >= ${today}
  `

  return Number(count) || 0
}
