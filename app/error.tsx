"use client"

import { useEffect } from "react"
import Link from "next/link"
import { TriangleAlertIcon } from "lucide-react"

import { PageSurface } from "@/components/page-surface"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <PageSurface className="max-w-md space-y-4 text-center">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-ink/30">
            <TriangleAlertIcon className="h-6 w-6 text-amber" />
          </div>
        </div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-amber">
          Erreur
        </p>
        <h1 className="text-2xl font-bold">Un problème est survenu</h1>
        <p className="text-sm text-ink-soft">
          Quelque chose s&apos;est mal passé. Tu peux réessayer ou revenir à
          l&apos;accueil.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={reset}
            className="rounded-md bg-ink font-mono text-xs uppercase tracking-[0.06em] text-paper hover:bg-ink/90"
          >
            Réessayer
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-md border-ink font-mono text-xs uppercase tracking-[0.06em] hover:bg-ink hover:text-paper"
          >
            <Link href="/">Accueil</Link>
          </Button>
        </div>
      </PageSurface>
    </div>
  )
}
