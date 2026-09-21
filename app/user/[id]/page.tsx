"use server"

import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"

import { Idea } from "@/types/idea"
import { authOptions } from "@/lib/auth"
import { getPublicIdeasByUser } from "@/lib/db/ideas"
import { getPublicUserProfile } from "@/lib/db/users"
import { PageSurface } from "@/components/page-surface"
import { PublicProfile } from "@/components/public-profile"
import { UserHub } from "@/components/user-hub"

export default async function UserPage({
  params,
}: {
  params: Promise<{ id?: string }>
}) {
  const resolvedParams = await params
  const session = await getServerSession(authOptions)

  if (!resolvedParams?.id) {
    notFound()
  }

  const isOwnProfile = session?.user?.id === resolvedParams.id

  if (isOwnProfile) {
    return (
      <PageSurface className="space-y-8">
        <UserHub
          user={{
            name: session!.user.name,
            email: session!.user.email,
            githubUsername: session!.user.githubUsername,
            image: session!.user.image,
          }}
        />
      </PageSurface>
    )
  }

  const profile = await getPublicUserProfile(resolvedParams.id)

  if (!profile) {
    notFound()
  }

  const publicIdeas = await getPublicIdeasByUser(profile.id)
  const viewerId = session?.user?.id

  const ideas: Idea[] = publicIdeas.map((idea) => ({
    ...idea,
    is_public: true,
    likeCount: idea.idea_like?.length ?? 0,
    likedByUser: idea.idea_like?.some(
      (like: { user_id: string }) => like.user_id === viewerId
    ),
  }))

  return (
    <PageSurface className="space-y-8">
      <PublicProfile
        user={{ name: profile.name, githubUsername: profile.github_username }}
        ideas={ideas}
      />
    </PageSurface>
  )
}
