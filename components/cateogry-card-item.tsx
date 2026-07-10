import Link from "next/link"

import { cn } from "@/lib/utils"

interface Props {
  name: string
  slug: string
  count: number
  viewMode: "grid" | "list"
  index?: number
}

export function CategoryCardItem({
  name,
  slug,
  count,
  viewMode,
  index = 0,
}: Props) {
  const code = String(index + 1).padStart(2, "0")

  return (
    <Link
      href={`/categories/${slug}`}
      className={cn(
        "relative block overflow-hidden rounded-md border border-ink bg-paper-dim px-5 pb-5 pt-[22px]",
        viewMode === "list" && "w-full"
      )}
    >
      <span
        className="absolute right-0 top-0 h-[34px] w-[34px] bg-ink"
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
      />
      <p className="mb-2.5 font-mono text-xl font-bold text-amber">{code}</p>
      <h3 className="mb-2 text-lg font-bold leading-tight">{name}</h3>
      <p className="mb-[18px] text-[13px] text-ink-soft">
        Discover APIs related to {name.toLowerCase()}.
      </p>
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="rounded-full border border-ink/40 px-2.5 py-1">
          {count} entries
        </span>
        <span className="font-semibold">Browse →</span>
      </div>
    </Link>
  )
}
