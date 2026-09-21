"use client"

import { useEffect } from "react"
import Link from "next/link"
import { TriangleAlertIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

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
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-ink/15 bg-paper-dim">
        <TriangleAlertIcon
          className="h-5 w-5 text-amber-deep"
          strokeWidth={1.75}
        />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="max-w-[44ch] text-ink-soft">
          This page failed to load. Try again, or head back to the catalog.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset} className="bg-ink text-paper hover:bg-ink/90">
          Try again
        </Button>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-ink/25 hover:bg-ink hover:text-paper"
          )}
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
