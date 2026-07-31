import { MetadataRoute } from "next"

import { getPublicIdeaIds } from "@/lib/db/ideas"
import { getPublicProfileUserIds } from "@/lib/db/users"
import { SITE_URL } from "@/lib/site"

// Rendered per-request (not at build time) so newly published ideas show up
// without a redeploy.
export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/resources`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/public`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.5 },
  ]

  const [publicIdeas, profileUserIds] = await Promise.all([
    getPublicIdeaIds(),
    getPublicProfileUserIds(),
  ])

  const ideaRoutes: MetadataRoute.Sitemap = publicIdeas.map((idea) => ({
    url: `${SITE_URL}/idea/${idea.id}`,
    lastModified: new Date(idea.created_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const profileRoutes: MetadataRoute.Sitemap = profileUserIds.map((user) => ({
    url: `${SITE_URL}/user/${user.id}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }))

  return [...staticRoutes, ...ideaRoutes, ...profileRoutes]
}
