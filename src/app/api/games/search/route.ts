import { NextRequest, NextResponse } from "next/server"
import { searchRawgGames } from "@/lib/rawg"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    )
  }

  try {
    const data = await searchRawgGames(query)

    const games = data.results.map((game: any) => ({
      id: game.id,
      name: game.name,
      image: game.background_image,
      released: game.released,
      platforms: game.platforms?.map(
        (item: any) => item.platform.name
      ) ?? []
    }))

    return NextResponse.json(games)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Unable to search games" },
      { status: 500 }
    )
  }
}