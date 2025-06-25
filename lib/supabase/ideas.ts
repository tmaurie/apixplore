import { supabaseServer } from "./server"

export async function saveIdea({
  userId,
  api,
  apiLink,
  description,
  idea,
}: {
  userId: string
  api: string
  apiLink?: string
  description?: string
  idea: string
}) {
  const { data, error } = await supabaseServer
    .from("ideas")
    .insert({
      user_id: userId,
      api_name: api,
      api_link: apiLink,
      description: description,
      generated_idea: idea,
    })
    .select()
    .single()

  if (error) {
    throw new Error("Error saving idea: " + error.message)
  }

  return data
}

export async function getUserIdeas(userId: string) {
  const { data, error } = await supabaseServer
    .from("ideas")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error("Error fetching ideas: " + error.message)
  }

  return data
}

export async function getDailyUsage(userId: string): Promise<number> {
  const { count, error } = await supabaseServer
    .from("ideas")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", new Date().toISOString().split("T")[0])

  if (error) {
    throw new Error("Erreur quota : " + error.message)
  }

  return count || 0
}

export async function getPublicIdeas({
  limit = 20,
  offset = 0,
}: {
  limit?: number
  offset?: number
}) {
  const { data, error } = await supabaseServer
    .from("ideas")
    .select(
      `id, api_name, api_link, generated_idea, created_at, idea_like (idea_id, user_id)`
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    throw new Error("Error fetching public ideas: " + error.message)
  }

  return data
}
