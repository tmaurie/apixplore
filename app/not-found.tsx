import Link from "next/link"
import { CompassIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-ink/15 bg-paper-dim">
        <CompassIcon className="h-5 w-5 text-amber-deep" strokeWidth={1.75} />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">This page does not exist</h1>
        <p className="max-w-[44ch] text-ink-soft">
          The link may be broken, or the page may have moved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className={cn(buttonVariants(), "bg-ink text-paper hover:bg-ink/90")}
        >
          Back to home
        </Link>
        <Link
          href="/resources"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-ink/25 hover:bg-ink hover:text-paper"
          )}
        >
          Browse the catalog
        </Link>
      </div>
    </div>
  )
}
