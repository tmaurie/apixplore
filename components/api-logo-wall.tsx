import Link from "next/link"

import { apiLogos } from "@/lib/apiLogos"

/**
 * Real brand marks for APIs that are actually in the catalog. Each one links
 * into the catalog search for that API, so the wall is navigation, not decor.
 * Logos only: no category labels underneath.
 */
export function ApiLogoWall() {
  return (
    <ul className="grid grid-cols-4 gap-x-4 gap-y-8 sm:grid-cols-6 lg:grid-cols-8">
      {apiLogos.map((logo) => (
        <li key={logo.name}>
          <Link
            href={`/resources?q=${encodeURIComponent(logo.name)}`}
            className="group flex items-center justify-center rounded-md py-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
          >
            <svg
              role="img"
              aria-label={logo.name}
              viewBox="0 0 24 24"
              width={26}
              height={26}
              className="fill-ink-soft/55 transition-colors duration-200 group-hover:fill-ink"
            >
              <path d={logo.path} />
            </svg>
          </Link>
        </li>
      ))}
    </ul>
  )
}
