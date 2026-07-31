export const MAX_INPUT_LENGTH = 500

export const skillLevels = ["beginner", "experienced"] as const
export const stackFocuses = ["fullstack", "backend", "frontend"] as const
export const tones = ["serious", "playful"] as const
export const aiUsages = ["optional", "required", "avoid"] as const

export type IdeaFilters = {
  skillLevel: (typeof skillLevels)[number]
  stackFocus: (typeof stackFocuses)[number]
  tone: (typeof tones)[number]
  aiUsage: (typeof aiUsages)[number]
}

export const defaultFilters: IdeaFilters = {
  skillLevel: "beginner",
  stackFocus: "fullstack",
  tone: "serious",
  aiUsage: "optional",
}

const skillLevelGuidance: Record<IdeaFilters["skillLevel"], string> = {
  beginner: "Beginner friendly scope with clear first steps and minimal setup.",
  experienced:
    "Assume comfort with complex architecture, performance tuning, and extensibility.",
}

const stackGuidance: Record<IdeaFilters["stackFocus"], string> = {
  fullstack: "End-to-end product ideas mixing UI polish and backend orchestration.",
  backend: "Service-oriented ideas, automation, APIs, or workflow engines.",
  frontend: "Interface-heavy ideas with visualization, interactivity, and UX polish.",
}

const toneGuidance: Record<IdeaFilters["tone"], string> = {
  serious: "Professional and outcome-driven tone.",
  playful: "Casual, surprising, and exploratory tone.",
}

const aiGuidance: Record<IdeaFilters["aiUsage"], string> = {
  optional: "AI is optional: include only if it clearly improves the experience.",
  required: "Each idea must feature an AI-powered element.",
  avoid: "Do not include AI features; stick to conventional engineering.",
}

export const pickValidOption = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T
): T =>
  typeof value === "string" && allowed.includes(value as T)
    ? (value as T)
    : fallback

export const resolveFilters = (filters?: Partial<IdeaFilters>): IdeaFilters => ({
  skillLevel: pickValidOption(filters?.skillLevel, skillLevels, defaultFilters.skillLevel),
  stackFocus: pickValidOption(filters?.stackFocus, stackFocuses, defaultFilters.stackFocus),
  tone: pickValidOption(filters?.tone, tones, defaultFilters.tone),
  aiUsage: pickValidOption(filters?.aiUsage, aiUsages, defaultFilters.aiUsage),
})

export const sanitizeInput = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback
  const cleaned = value.replace(/\s+/g, " ").trim()
  return cleaned ? cleaned.slice(0, MAX_INPUT_LENGTH) : fallback
}

export const stripMarkdownFences = (text: string) =>
  text.replace(/```json|```/gi, "").trim()

export const isValidIdea = (idea: any) =>
  idea &&
  typeof idea.title === "string" &&
  idea.title.trim() &&
  typeof idea.description === "string" &&
  idea.description.trim() &&
  typeof idea.feasibilityScore === "number" &&
  idea.feasibilityScore >= 0 &&
  idea.feasibilityScore <= 10 &&
  typeof idea.originalityScore === "number" &&
  idea.originalityScore >= 0 &&
  idea.originalityScore <= 10

export const buildPrompt = (
  apiName: string,
  apiDescription: string,
  filters: IdeaFilters
) =>
  `
Given the following public API and user preferences, return exactly 3 project ideas a developer could build with it.
- Output: a JSON array of 3 objects with keys "title", "description", "feasibilityScore", "originalityScore".
- Title <= 80 characters. Description 1-2 sentences, practical and technically feasible.
- feasibilityScore: integer 0-10 (10 = very easy to build). originalityScore: integer 0-10 (10 = most novel).
- Do not include markdown, code fences, or extra text. JSON only.

Audience preferences to reflect in the ideas:
- Developer level: ${skillLevelGuidance[filters.skillLevel]}
- Build focus: ${stackGuidance[filters.stackFocus]}
- Tone: ${toneGuidance[filters.tone]}
- AI usage: ${aiGuidance[filters.aiUsage]}
- Ensure the scope, feature emphasis, and tone honor these filters.

API name: "${apiName}"
API description: "${apiDescription}"
`.trim()
