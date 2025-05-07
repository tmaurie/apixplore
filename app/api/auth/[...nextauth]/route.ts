import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}
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

const handler = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      console.log("jwt", token)
      return token
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken
      console.log("session", session)
      return session
    },
  },
})

export { handler as GET, handler as POST }
