import Link from "next/link"
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className?: string
  background: ReactNode
  Icon: ElementType
  description: string
  href: string
  cta: string
}

export function BentoGrid({
  children,
  className,
  ...props
}: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-4 md:grid-cols-6 xl:grid-cols-12",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative min-h-[250px] overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(9,10,44,0.28)] backdrop-blur",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-80" />
      <div className="pointer-events-none absolute inset-0 transition duration-500 group-hover:bg-white/[0.03]" />
      <div className="absolute inset-0 overflow-hidden">{background}</div>
      <div className="relative z-10 flex h-full flex-col justify-end space-y-4 p-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-black/25 text-white">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="text-xl font-semibold text-white">{name}</h3>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-300">
          {description}
        </p>
        <Link
          href={href}
          className="inline-flex items-center text-sm font-semibold text-sky-300 transition hover:text-sky-200"
        >
          {cta}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
