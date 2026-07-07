import * as React from "react"

import { cn } from "@/lib/utils"

interface PageSurfaceProps {
  children: React.ReactNode
  className?: string
}

export function PageSurface({ children, className }: PageSurfaceProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-ink bg-paper-dim p-6 text-ink sm:p-8",
        className
      )}
    >
      {children}
    </section>
  )
}
