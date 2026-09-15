export async function searchRawgGames(searchTerm: string) {
  const apiKey = process.env.RAWG_API_KEY

  if (!apiKey) {
    throw new Error("RAWG_API_KEY is not configured")
  }

  const url = new URL("https://api.rawg.io/api/games")

  url.searchParams.set("key", apiKey)
  url.searchParams.set("search", searchTerm)
  url.searchParams.set("page_size", "5")

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`RAWG request failed: ${response.status}`)
  }

  return response.json()
}