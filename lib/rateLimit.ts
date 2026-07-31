import { sql } from "@/lib/db/client"

export async function checkRateLimit(
  key: string,
  { windowSeconds, max }: { windowSeconds: number; max: number }
): Promise<boolean> {
  await sql`INSERT INTO public.rate_limit_hits (key) VALUES (${key})`

  const [{ count }] = await sql`
    SELECT COUNT(*) AS count FROM public.rate_limit_hits
    WHERE key = ${key} AND created_at >= now() - make_interval(secs => ${windowSeconds})
  `

  return Number(count) <= max
}
