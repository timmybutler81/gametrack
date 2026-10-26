import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userGames = await prisma.userGame.findMany({
      where: {
        userId: user.id,
      },
      include: {
        game: true,
        platforms: true,
        playThrough: {
          orderBy: {
            playthroughNumber: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        dateAdded: "desc",
      },
    })

    const response = userGames.map((userGame) => {
      const { playThrough, ...rest } = userGame

      return {
        ...rest,
        playthroughs: playThrough,
      }
    })

    const serializedResponse = JSON.parse(
      JSON.stringify(response, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    )

    return NextResponse.json(serializedResponse)
  } catch (error) {
    console.error("GET /api/games failed:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load games.",
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    const {
      rawgId,
      title,
      developer,
      imageUrl,
      releaseDate,
      genre,
      status,
      dateAdded,
      platforms,
    } = body

    if (!rawgId || !title || !status || !dateAdded) {
      return NextResponse.json(
        { error: "Missing required game information." },
        { status: 400 }
      )
    }

    const game = await prisma.game.upsert({
      where: {
        rawgId,
      },
      update: {
        title,
        developer: developer ?? null,
        imageUrl: imageUrl ?? null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
      },
      create: {
        rawgId,
        title,
        developer: developer ?? null,
        imageUrl: imageUrl ?? null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
      },
    })

    const userGame = await prisma.userGame.upsert({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: game.id,
        },
      },
      update: {
        genre: genre ?? null,
        status,
        dateAdded: new Date(dateAdded),
      },
      create: {
        userId: user.id,
        gameId: game.id,
        genre: genre ?? null,
        status,
        dateAdded: new Date(dateAdded),
      },
    })

    if (Array.isArray(platforms) && platforms.length > 0) {
      await prisma.userGamePlatform.createMany({
        data: platforms.map((platform: string) => ({
          userGameId: userGame.id,
          platform,
        })),
        skipDuplicates: true,
      })
    }

    const savedUserGame = await prisma.userGame.findUnique({
      where: {
        id: userGame.id,
      },
      include: {
        game: true,
        platforms: true,
      },
    })

    if (!savedUserGame) {
      return NextResponse.json(
        { error: "Unable to retrieve saved game." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ...savedUserGame,
      id: savedUserGame.id.toString(),
      gameId: savedUserGame.gameId.toString(),

      game: {
        ...savedUserGame.game,
        id: savedUserGame.game.id.toString(),
      },

      platforms: savedUserGame.platforms.map((platform) => ({
        ...platform,
        id: platform.id.toString(),
        userGameId: platform.userGameId.toString(),
      })),
    })
  } catch (error) {
    console.error("POST /api/games failed:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save game.",
      },
      { status: 500 }
    )
  }
}
