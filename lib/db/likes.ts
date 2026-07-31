import { sql } from "./client"

export async function likeIdea(ideaId: string, userId: string) {
  await sql`
    INSERT INTO public.idea_like (idea_id, user_id) VALUES (${ideaId}, ${userId})
  `
}

export async function unlikeIdea(ideaId: string, userId: string) {
  await sql`
    DELETE FROM public.idea_like WHERE idea_id = ${ideaId} AND user_id = ${userId}
  `
}

type LikedIdeaRow = {
  idea_id: string
  ideas: {
    id: string
    api_name: string
    api_link: string | null
    description: string | null
    generated_idea: unknown
    created_at: string
  }
}

export async function getLikedIdeas(userId: string) {
  const rows = (await sql`
    SELECT
      l.idea_id,
      json_build_object(
        'id', i.id,
        'api_name', i.api_name,
        'api_link', i.api_link,
        'description', i.description,
        'generated_idea', i.generated_idea,
        'created_at', i.created_at
      ) AS ideas
    FROM public.idea_like l
    JOIN public.ideas i ON i.id = l.idea_id
    WHERE l.user_id = ${userId}
    ORDER BY l.created_at DESC
  `) as LikedIdeaRow[]

  return rows.map((row) => ({
    ...row.ideas,
    likedByUser: true,
  }))
}
