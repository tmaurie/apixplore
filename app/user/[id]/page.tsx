"use server"

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { PageSurface } from "@/components/page-surface"
import { UserHub } from "@/components/user-hub"
import { authOptions } from "@/lib/auth"

export default async function UserPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  if (session.user.id !== params.id) {
    redirect("/")
  }

  return (
    <PageSurface className="space-y-8">
      <UserHub
        user={{
          name: session.user.name,
          email: session.user.email,
          githubUsername: session.user.githubUsername,
          image: session.user.image,
        }}
      />
    </PageSurface>
  )
}
