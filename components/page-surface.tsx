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
        "rounded-[32px] border border-white/10 bg-white/5 p-6 text-white shadow-[0_25px_60px_rgba(8,7,45,0.35)] backdrop-blur sm:p-8",
        className
      )}
    >
      {children}
    </section>
  )
}
