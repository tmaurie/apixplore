import { UserCircle } from "lucide-react"

import { Idea } from "@/types/idea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IdeaCard } from "@/components/idea-card"

type PublicProfileUser = {
  name: string | null
  githubUsername: string | null
}

export function PublicProfile({
  user,
  ideas,
}: {
  user: PublicProfileUser
  ideas: Idea[]
}) {
  const avatarUrl = user.githubUsername
    ? `https://github.com/${user.githubUsername}.png`
    : undefined
  const displayName = user.name || user.githubUsername || "Anonymous builder"

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4 rounded-lg border-2 border-ink bg-ink p-6 text-paper sm:p-8">
        <Avatar className="h-12 w-12 ring-2 ring-amber/30">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback>
            {displayName.charAt(0).toUpperCase() || (
              <UserCircle className="h-4 w-4" />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-soft">
            Builder Profile
          </p>
          <h1 className="text-2xl font-bold sm:text-3xl">{displayName}</h1>
          {user.githubUsername && (
            <p className="text-sm text-paper/70">@{user.githubUsername}</p>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
            Public Builds
          </p>
          <h2 className="text-xl font-bold">
            {ideas.length} shared idea{ideas.length === 1 ? "" : "s"}
          </h2>
        </div>

        {ideas.length === 0 ? (
          <div className="rounded-md border border-dashed border-ink/25 px-4 py-6 text-sm text-ink-soft">
            {displayName} hasn&apos;t shared any public ideas yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
