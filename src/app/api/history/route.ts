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
            updatedAt: "desc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    const response = userGames.map((userGame) => ({
      id: userGame.id.toString(),
      genre: userGame.genre,
      status: userGame.status,
      dateAdded: userGame.dateAdded,
      game: {
        id: userGame.game.id.toString(),
        title: userGame.game.title,
      },
      platforms: userGame.platforms.map((platform) => ({
        id: platform.id.toString(),
        platform: platform.platform,
      })),
      playthroughs: userGame.playThrough.map((playthrough) => ({
        id: playthrough.id.toString(),
        playthroughNumber: playthrough.playthroughNumber,
        platform: playthrough.platform,
        status: playthrough.status,
        dateStarted: playthrough.dateStarted,
        dateEnded: playthrough.dateEnded,
        hoursPlayed:
          playthrough.hoursPlayed === null
            ? null
            : playthrough.hoursPlayed.toString(),
        rating: playthrough.rating,
        achievementsSupported: playthrough.achievementsSupported,
        achievementsCompleted: playthrough.achievementsCompleted,
        achievementsTotal: playthrough.achievementsTotal,
        notes: playthrough.notes,
        createdAt: playthrough.createdAt,
        updatedAt: playthrough.updatedAt,
      })),
    }))

    return NextResponse.json(response)
  } catch (error) {
    console.error("GET /api/history failed:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load history.",
      },
      { status: 500 }
    )
  }
}
