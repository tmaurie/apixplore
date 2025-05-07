import { getSession } from "next-auth/react"

export async function fetchIdeas(api: string, description: string) {
  const session = await getSession()

  console.log("Session:", session)
  try {
    const res = await fetch(`${process.env.APIXPLORE_WS_URL}/ideas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        api: api,
        description: description,
      }),
    })

    return await res.json()
  } catch (error) {
    console.error("Error fetching ideas:", error)
    return null
  }
}
