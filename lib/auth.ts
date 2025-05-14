import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { getOrCreateUser } from "@/lib/supabase/users"

declare module "next-auth" {
  interface User {
    id?: string
    name?: string
    email?: string
    image?: string
  }
  interface Session {
    accessToken?: string
    user?: User
  }
}


export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email) return false

        await getOrCreateUser(user.email, user.name || "")
        return true
      } catch (err) {
        console.error("Erreur dans signIn callback :", err)
        return false
      }
    },
    async session({ session }) {
      console.log("session callback", session)
      return session
    },
  },
}
