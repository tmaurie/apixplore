import Link from "next/link"
import { CompassIcon } from "lucide-react"

import { PageSurface } from "@/components/page-surface"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <PageSurface className="max-w-md space-y-4 text-center">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-ink/30">
            <CompassIcon className="h-6 w-6 text-amber" />
          </div>
        </div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-amber">
          404
        </p>
        <h1 className="text-2xl font-bold">Page introuvable</h1>
        <p className="text-sm text-ink-soft">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Button
          asChild
          className="rounded-md bg-ink font-mono text-xs uppercase tracking-[0.06em] text-paper hover:bg-ink/90"
        >
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </PageSurface>
    </div>
  )
}
