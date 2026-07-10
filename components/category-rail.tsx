"use client"

import { cn } from "@/lib/utils"
import { CatalogCategory } from "@/lib/hooks/useCatalog"

interface CategoryRailProps {
  categories: CatalogCategory[]
  total: number
  active: string | null
  onSelect: (slug: string | null) => void
}

export function CategoryRail({
  categories,
  total,
  active,
  onSelect,
}: CategoryRailProps) {
  return (
    <>
      <nav className="hidden shrink-0 lg:sticky lg:top-[104px] lg:block lg:h-fit lg:max-h-[calc(100vh-128px)] lg:w-[220px] lg:overflow-y-auto lg:pr-1">
        <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-ink-soft">
          Index
        </p>
        <ul className="space-y-1">
          <RailItem
            label="All APIs"
            count={total}
            isActive={active === null}
            onClick={() => onSelect(null)}
          />
          {categories.map((c) => (
            <RailItem
              key={c.slug}
              label={c.name}
              count={c.count}
              isActive={active === c.slug}
              onClick={() => onSelect(c.slug)}
            />
          ))}
        </ul>
      </nav>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
        <CategoryChip
          label="All"
          count={total}
          isActive={active === null}
          onClick={() => onSelect(null)}
        />
        {categories.map((c) => (
          <CategoryChip
            key={c.slug}
            label={c.name}
            count={c.count}
            isActive={active === c.slug}
            onClick={() => onSelect(c.slug)}
          />
        ))}
      </div>
    </>
  )
}

function RailItem({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md border border-transparent px-3 py-2 text-left font-mono text-[13px] transition-colors",
          isActive
            ? "border-ink bg-ink text-paper"
            : "text-ink-soft hover:border-ink/30 hover:text-ink"
        )}
      >
        <span className="truncate">{label}</span>
        <span
          className={cn(
            "shrink-0 text-[11px]",
            isActive ? "text-paper/70" : "text-ink-soft/70"
          )}
        >
          {count}
        </span>
      </button>
    </li>
  )
}

function CategoryChip({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.06em] transition-colors",
        isActive
          ? "border-ink bg-ink text-paper"
          : "border-ink/30 text-ink-soft hover:border-ink hover:text-ink"
      )}
    >
      {label} <span className="opacity-60">· {count}</span>
    </button>
  )
}
