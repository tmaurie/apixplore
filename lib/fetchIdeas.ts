export async function fetchIdeas(api: string, description: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ideas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
