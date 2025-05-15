import { supabaseServer } from "./server"

export async function saveIdea({
  userId,
  api,
  description,
  idea,
}: {
  userId: string
  api: string
  description?: string
  idea: string
}) {
  const { data, error } = await supabaseServer
    .from("ideas")
    .insert({
      user_id: userId,
      api_name: api,
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
