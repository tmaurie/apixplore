import { supabaseServer } from "./server"

export async function getOrCreateUser(
  email: string,
  name?: string,
  github_username?: string
) {
  const { data: user, error } = await supabaseServer
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle()

  if (error && error.code !== "PGRST116") {
    throw new Error("Supabase error: " + error.message)
  }

  if (!user) {
    const { data: newUser, error: insertError } = await supabaseServer
      .from("users")
      .insert({ email, name, github_username })
      .select()
      .single()

    if (insertError) {
      throw new Error("Insert error: " + insertError.message)
    }

    return newUser
  }

  return user
}
