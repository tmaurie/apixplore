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
    VALUES (${userId}, ${api}, ${apiLink ?? null}, ${
    description ?? null
  }, ${JSON.stringify(idea)}::jsonb)
    RETURNING *
  `

  return data
}

export async function getUserIdeas(userId: string) {
  return sql`
    SELECT
      i.*,
      COALESCE(
        json_agg(t.tag ORDER BY t.tag) FILTER (WHERE t.tag IS NOT NULL),
        '[]'
      ) AS tags
    FROM public.ideas i
    LEFT JOIN public.idea_tags t ON t.idea_id = i.id
    WHERE i.user_id = ${userId}
    GROUP BY i.id
    ORDER BY i.created_at DESC
  `
}

export async function setIdeaTags(id: string, userId: string, tags: string[]) {
  const [idea] = await sql`
    SELECT id FROM public.ideas WHERE id = ${id} AND user_id = ${userId}
  `

  if (!idea) {
    throw new Error("Idea not found")
  }

  await sql`DELETE FROM public.idea_tags WHERE idea_id = ${id}`

  const uniqueTags = [...new Set(tags)]

  if (uniqueTags.length > 0) {
    await sql`
      INSERT INTO public.idea_tags (idea_id, tag)
      SELECT ${id}, tag FROM unnest(${uniqueTags}::text[]) AS tag
    `
  }
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
      i.user_id AS author_id, u.name AS author_name, u.github_username AS author_github_username,
      COALESCE(
        json_agg(json_build_object('idea_id', l.idea_id, 'user_id', l.user_id))
          FILTER (WHERE l.idea_id IS NOT NULL),
        '[]'
      ) AS idea_like
    FROM public.ideas i
    LEFT JOIN public.idea_like l ON l.idea_id = i.id
    LEFT JOIN public.users u ON u.id = i.user_id
    WHERE i.is_public = true
    GROUP BY i.id, u.name, u.github_username
    ORDER BY i.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
}

export type PublicIdeaRow = {
  id: string
  api_name: string
  api_link: string | null
  generated_idea: { title: string; description: string }
  created_at: string
  idea_like: { idea_id: string; user_id: string }[]
}

export async function getPublicIdeasByUser(userId: string) {
  const rows = await sql`
    SELECT
      i.id, i.api_name, i.api_link, i.generated_idea, i.created_at,
      COALESCE(
        json_agg(json_build_object('idea_id', l.idea_id, 'user_id', l.user_id))
          FILTER (WHERE l.idea_id IS NOT NULL),
        '[]'
      ) AS idea_like
    FROM public.ideas i
    LEFT JOIN public.idea_like l ON l.idea_id = i.id
    WHERE i.is_public = true AND i.user_id = ${userId}
    GROUP BY i.id
    ORDER BY i.created_at DESC
  `

  return rows as PublicIdeaRow[]
}

export async function getPublicIdeaIds() {
  const rows = await sql`
    SELECT id, created_at FROM public.ideas
    WHERE is_public = true
    ORDER BY created_at DESC
  `

  return rows as { id: string; created_at: string }[]
}

export async function getPublicIdeaById(ideaId: string) {
  const [data] = await sql`
    SELECT
      i.id, i.api_name, i.api_link, i.generated_idea, i.created_at, i.description, i.is_public,
      i.user_id AS author_id, u.name AS author_name, u.github_username AS author_github_username,
      COALESCE(
        json_agg(json_build_object('idea_id', l.idea_id, 'user_id', l.user_id))
          FILTER (WHERE l.idea_id IS NOT NULL),
        '[]'
      ) AS idea_like
    FROM public.ideas i
    LEFT JOIN public.idea_like l ON l.idea_id = i.id
    LEFT JOIN public.users u ON u.id = i.user_id
    WHERE i.id = ${ideaId} AND i.is_public = true
    GROUP BY i.id, u.name, u.github_username
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
