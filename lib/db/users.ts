import { sql } from "./client"

export async function getOrCreateUser(
  email: string,
  name?: string,
  github_username?: string
) {
  const [existing] = await sql`
    SELECT * FROM public.users WHERE email = ${email} LIMIT 1
  `

  if (existing) {
    return existing
  }

  const [newUser] = await sql`
    INSERT INTO public.users (email, name, github_username)
    VALUES (${email}, ${name ?? null}, ${github_username ?? null})
    RETURNING *
  `

  return newUser
}

export async function getPublicProfileUserIds() {
  const rows = await sql`
    SELECT DISTINCT user_id AS id FROM public.ideas WHERE is_public = true
  `

  return rows as { id: string }[]
}

export async function getPublicUserProfile(userId: string) {
  const [user] = await sql`
    SELECT id, name, github_username FROM public.users WHERE id = ${userId} LIMIT 1
  `

  return user as { id: string; name: string | null; github_username: string | null } | undefined
}
