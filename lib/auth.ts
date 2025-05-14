import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"

import { getOrCreateUser } from "@/lib/supabase/users"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      githubUsername: string
      name: string
      email: string
      image?: string
    }
  }

  interface User {
    id: string
    githubUsername: string
  }

  interface JWT {
    id: string
    githubUsername: string
  }

  interface Profile {
    login: string
  }
}
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      await getOrCreateUser(user.email!, user.name ?? "", profile?.login)
      return true
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await getOrCreateUser(user.email)
        token.id = dbUser.id
        token.githubUsername = dbUser.github_username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.githubUsername = token.githubUsername as string
      }
      return session
    },
  },
}
