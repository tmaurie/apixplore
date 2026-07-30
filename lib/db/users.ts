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
