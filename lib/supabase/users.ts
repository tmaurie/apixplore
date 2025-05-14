import { supabaseServer } from "./server"

export async function getOrCreateUser(email: string, name?: string) {
  console.log("getOrCreateUser", email, name)
  const { data: user, error } = await supabaseServer
    .from("users")
    .select("*")
    .eq("email", email)
    .single()

  if (error && error.code !== "PGRST116") {
    throw new Error("Erreur Supabase : " + error.message)
  }

  if (!user) {
    const { data: newUser, error: insertError } = await supabaseServer
      .from("users")
      .insert({ email, name })
      .select()
      .single()

    if (insertError) {
      throw new Error("Erreur à l'insertion : " + insertError.message)
    }

    return newUser
  }

  return user
}
