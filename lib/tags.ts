export const MAX_TAG_LENGTH = 30
export const MAX_TAGS_PER_IDEA = 10

export const normalizeTag = (tag: string) =>
  tag.trim().toLowerCase().replace(/\s+/g, " ").slice(0, MAX_TAG_LENGTH)

export const sanitizeTags = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []

  const cleaned = value
    .filter((tag): tag is string => typeof tag === "string")
    .map(normalizeTag)
    .filter(Boolean)

  return [...new Set(cleaned)].slice(0, MAX_TAGS_PER_IDEA)
}
