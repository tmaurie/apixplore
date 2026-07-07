import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ExternalLinkIcon, HeartIcon, SparklesIcon } from "lucide-react"

import { getPublicIdeaById } from "@/lib/supabase/ideas"
import { PublicIdeaViewTracker } from "@/components/public-idea-view-tracker"
import { ShareIdeaButton } from "@/components/share-idea-button"
import { Button } from "@/components/ui/button"
import { PageSurface } from "@/components/page-surface"

type IdeaPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: IdeaPageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const idea = await getPublicIdeaById(id)
    return {
      title: idea.generated_idea.title,
      description: idea.generated_idea.description,
    }
  } catch {
    return {
      title: "Shared idea",
    }
  }
}

export default async function PublicIdeaDetailPage({ params }: IdeaPageProps) {
  const { id } = await params

  let idea

  try {
    idea = await getPublicIdeaById(id)
  } catch {
    notFound()
  }

  const likeCount = idea.idea_like?.length ?? 0

  return (
    <div className="space-y-6">
      <PublicIdeaViewTracker ideaId={idea.id} />

      <PageSurface>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <span className="inline-block rounded-full border border-ink/30 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
              {idea.api_name}
            </span>
            <div className="space-y-3">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-amber">
                Shared Idea
              </p>
              <h1 className="text-3xl font-bold sm:text-4xl">
                {idea.generated_idea.title}
              </h1>
              <p className="text-base text-ink-soft sm:text-lg">
                {idea.generated_idea.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <ShareIdeaButton
              ideaId={idea.id}
              title={idea.generated_idea.title}
              source="public_page"
              className="rounded-md border-ink font-mono text-xs uppercase tracking-[0.06em] hover:bg-ink hover:text-paper"
            />
            <Button
              asChild
              variant="ghost"
              className="justify-start font-mono text-xs uppercase tracking-[0.06em] text-ink-soft hover:text-ink"
            >
              <Link href="/public">Browse more ideas</Link>
            </Button>
          </div>
        </div>
      </PageSurface>

      <div className="rounded-md border border-ink bg-paper p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-ink/15 pb-4 font-mono text-sm text-ink-soft">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-ink/30 px-3 py-1">
              {new Date(idea.created_at).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-ink/30 px-3 py-1">
              <HeartIcon className="h-4 w-4" />
              {likeCount} like{likeCount === 1 ? "" : "s"}
            </span>
          </div>
          {idea.api_link ? (
            <Button
              asChild
              variant="outline"
              className="rounded-md border-ink font-mono text-xs uppercase tracking-[0.06em] hover:bg-ink hover:text-paper"
            >
              <Link href={idea.api_link} target="_blank" rel="noreferrer">
                API docs
                <ExternalLinkIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-md border border-dashed border-ink/30 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-soft">
              Build angle
            </p>
            <p className="mt-3 text-base leading-7">
              {idea.description ||
                "A focused product concept generated from this API, ready to refine into a prototype or launch plan."}
            </p>
          </div>

          <div className="rounded-md border border-ink/20 bg-paper-dim p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-ink/30">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">
                  Want more ideas like this?
                </p>
                <p className="text-sm text-ink-soft">
                  Explore public builds or open the API catalog to generate
                  your own variations.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-md border-ink font-mono text-xs uppercase tracking-[0.06em] hover:bg-ink hover:text-paper"
                  >
                    <Link href="/public">Community feed</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-md bg-ink font-mono text-xs uppercase tracking-[0.06em] text-paper hover:bg-ink/90"
                  >
                    <Link href="/resources">Generate from APIs</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
