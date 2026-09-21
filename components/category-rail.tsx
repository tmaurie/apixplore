"use client"

import { CatalogCategory } from "@/lib/hooks/useCatalog"
import { cn } from "@/lib/utils"

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
      <nav
        aria-label="Categories"
        className="hidden shrink-0 lg:sticky lg:top-24 lg:block lg:h-fit lg:max-h-[calc(100vh-8rem)] lg:w-[210px] lg:overflow-y-auto lg:pr-1"
      >
        <p className="mb-3 px-3 text-xs font-semibold text-ink-soft">
          Categories
        </p>
        <ul className="space-y-0.5">
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
        aria-current={isActive ? "true" : undefined}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors duration-150",
          isActive
            ? "bg-ink font-medium text-paper"
            : "text-ink-soft hover:bg-paper-dim hover:text-ink"
        )}
      >
        <span className="truncate">{label}</span>
        <span
          className={cn(
            "shrink-0 font-mono text-[11px] tabular-nums",
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
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-150",
        isActive
          ? "border-ink bg-ink text-paper"
          : "border-ink/20 text-ink-soft hover:border-ink hover:text-ink"
      )}
    >
      {label}{" "}
      <span className="font-mono text-[11px] tabular-nums opacity-60">
        {count}
      </span>
    </button>
  )
}
