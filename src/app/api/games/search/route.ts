import { NextRequest, NextResponse } from "next/server"
import { searchRawgGames } from "@/lib/rawg"

function createManualGameId(title: string) {
  const normalizedTitle = title.trim().toLowerCase()

  let hash = 0

  for (let index = 0; index < normalizedTitle.length; index++) {
    hash = Math.imul(31, hash) + normalizedTitle.charCodeAt(index)

    hash |= 0
  }

  const unsignedHash = hash >>> 0

  // RAWG IDs are positive.
  // Manual GameTrack fallback IDs are negative.
  return -((unsignedHash % 2_000_000_000) + 1)
}

function createManualFallback(title: string) {
  return {
    id: createManualGameId(title),

    name: title.trim(),

    developer: null,

    image: null,

    released: null,

    platforms: [
      "PC",
      "PS5",
      "PS4",
      "Xbox Series X|S",
      "Xbox One",
      "Nintendo Switch",
    ],

    genres: [
      "Action",
      "Adventure",
      "RPG",
      "Shooter",
      "Strategy",
      "Simulation",
      "Sports",
      "Racing",
      "Platformer",
      "Puzzle",
      "Fighting",
      "Roguelike",
      "Other",
    ],

    manual: true,
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const query = searchParams.get("q")?.trim()

  if (!query) {
    return NextResponse.json(
      {
        error: "Search query is required.",
      },
      {
        status: 400,
      }
    )
  }

  try {
    const games = await searchRawgGames(query)

    return NextResponse.json(games)
  } catch (error) {
    console.error("RAWG search unavailable. Using manual fallback:", error)

    const manualGame = createManualFallback(query)

    return NextResponse.json([manualGame])
  }
}
