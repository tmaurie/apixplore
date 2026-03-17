import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ExternalLinkIcon, HeartIcon, SparklesIcon } from "lucide-react"

import { getPublicIdeaById } from "@/lib/supabase/ideas"
import { PublicIdeaViewTracker } from "@/components/public-idea-view-tracker"
import { ShareIdeaButton } from "@/components/share-idea-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
    <PageSurface className="space-y-6">
      <PublicIdeaViewTracker ideaId={idea.id} />

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-[#0b1533] via-[#0f1c3f] to-[#142654] p-6 text-white shadow-[0_30px_80px_rgba(6,8,36,0.6)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-4">
            <Badge
              variant="outline"
              className="border-white/25 bg-white/5 text-[11px] uppercase tracking-[0.25em] text-white/75"
            >
              {idea.api_name}
            </Badge>
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">
                Shared idea
              </p>
              <h1 className="text-3xl font-semibold sm:text-4xl">
                {idea.generated_idea.title}
              </h1>
              <p className="text-base text-white/75 sm:text-lg">
                {idea.generated_idea.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <ShareIdeaButton
              ideaId={idea.id}
              title={idea.generated_idea.title}
              source="public_page"
              className="border-white/20 text-white hover:bg-white/10"
            />
            <Button
              asChild
              variant="ghost"
              className="justify-start text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Link href="/public">Browse more ideas</Link>
            </Button>
          </div>
        </div>
      </div>

      <Card className="rounded-3xl border border-white/10 bg-[#0a0f25] text-white shadow-[0_20px_60px_rgba(9,10,44,0.4)]">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/65">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {new Date(idea.created_at).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <HeartIcon className="h-4 w-4" />
              {likeCount} like{likeCount === 1 ? "" : "s"}
            </span>
          </div>
          {idea.api_link ? (
            <Button
              asChild
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Link href={idea.api_link} target="_blank" rel="noreferrer">
                API docs
                <ExternalLinkIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/80">
            <p className="text-sm uppercase tracking-[0.28em] text-white/55">
              Build angle
            </p>
            <p className="mt-3 text-base leading-7">
              {idea.description ||
                "A focused product concept generated from this API, ready to refine into a prototype or launch plan."}
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-white/75">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">
                  Want more ideas like this?
                </p>
                <p className="text-sm text-white/65">
                  Explore public builds or open the API catalog to generate your
                  own variations.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-white/15 text-white hover:bg-white/10"
                  >
                    <Link href="/public">Community feed</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-white text-slate-950 hover:bg-slate-100"
                  >
                    <Link href="/resources">Generate from APIs</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageSurface>
  )
}
