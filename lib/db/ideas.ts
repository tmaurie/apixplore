import { sql } from "./client"

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
  const [data] = await sql`
    INSERT INTO public.ideas (user_id, api_name, api_link, description, generated_idea)
    VALUES (${userId}, ${api}, ${apiLink ?? null}, ${description ?? null}, ${JSON.stringify(idea)}::jsonb)
    RETURNING *
  `

  return data
}

export async function getUserIdeas(userId: string) {
  return sql`
    SELECT * FROM public.ideas
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
}

export async function getDailyUsage(userId: string): Promise<number> {
  const today = new Date().toISOString().split("T")[0]

  const [{ count }] = await sql`
    SELECT COUNT(*) AS count FROM public.ideas
    WHERE user_id = ${userId} AND created_at >= ${today}
  `

  return Number(count) || 0
}

export async function getPublicIdeas({
  limit = 20,
  offset = 0,
}: {
  limit?: number
  offset?: number
}) {
  return sql`
    SELECT
      i.id, i.api_name, i.api_link, i.generated_idea, i.created_at,
      COALESCE(
        json_agg(json_build_object('idea_id', l.idea_id, 'user_id', l.user_id))
          FILTER (WHERE l.idea_id IS NOT NULL),
        '[]'
      ) AS idea_like
    FROM public.ideas i
    LEFT JOIN public.idea_like l ON l.idea_id = i.id
    WHERE i.is_public = true
    GROUP BY i.id
    ORDER BY i.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
}

export async function getPublicIdeaById(ideaId: string) {
  const [data] = await sql`
    SELECT
      i.id, i.api_name, i.api_link, i.generated_idea, i.created_at, i.description, i.is_public,
      COALESCE(
        json_agg(json_build_object('idea_id', l.idea_id, 'user_id', l.user_id))
          FILTER (WHERE l.idea_id IS NOT NULL),
        '[]'
      ) AS idea_like
    FROM public.ideas i
    LEFT JOIN public.idea_like l ON l.idea_id = i.id
    WHERE i.id = ${ideaId} AND i.is_public = true
    GROUP BY i.id
  `

  if (!data) {
    throw new Error("Error fetching public idea: not found")
  }

  return data
}

export async function deleteIdea(id: string, userId: string) {
  await sql`
    DELETE FROM public.ideas WHERE id = ${id} AND user_id = ${userId}
  `
}

export async function updateIdeaVisibility(
  id: string,
  userId: string,
  isPublic: boolean
) {
  await sql`
    UPDATE public.ideas SET is_public = ${isPublic}
    WHERE id = ${id} AND user_id = ${userId}
  `
}
