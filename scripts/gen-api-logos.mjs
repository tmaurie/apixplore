// Regenerates lib/apiLogos.ts from the `simple-icons` package (devDependency).
// Every name here must exist in the live public-apis catalog.
import { writeFileSync } from "node:fs"
import * as si from "simple-icons"

const picks = [
  ["Spotify", "siSpotify"],
  ["NASA", "siNasa"],
  ["GitHub", "siGithub"],
  ["Reddit", "siReddit"],
  ["Discord", "siDiscord"],
  ["Unsplash", "siUnsplash"],
  ["Giphy", "siGiphy"],
  ["OpenStreetMap", "siOpenstreetmap"],
  ["Wikipedia", "siWikipedia"],
  ["Twitch", "siTwitch"],
  ["Pexels", "siPexels"],
  ["Trello", "siTrello"],
  ["Stripe", "siStripe"],
  ["Dribbble", "siDribbble"],
  ["Notion", "siNotion"],
  ["YouTube", "siYoutube"],
]

let out = `// Official brand marks, sourced at build time from the \`simple-icons\` package
// (CC0-1.0). Every entry below is an API that exists in the live catalog.
// Regenerate with: node scripts/gen-api-logos.mjs

export type ApiLogo = { name: string; path: string }

export const apiLogos: ApiLogo[] = [
`
for (const [name, key] of picks) {
  const icon = si[key]
  if (!icon) throw new Error(`simple-icons has no export "${key}" for ${name}`)
  out += `  { name: ${JSON.stringify(name)}, path: ${JSON.stringify(icon.path)} },\n`
}
out += "]\n"

writeFileSync(new URL("../lib/apiLogos.ts", import.meta.url), out)
console.log(`wrote lib/apiLogos.ts with ${picks.length} marks`)
