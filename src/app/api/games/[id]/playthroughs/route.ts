import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let userGameId: bigint

  try {
    userGameId = BigInt(id)
  } catch {
    return NextResponse.json({ error: "Invalid game ID" }, { status: 400 })
  }

  try {
    const body = await request.json()

    const {
      status,
      dateStarted,
      dateEnded,
      hoursPlayed,
      rating,
      achievementsSupported,
      achievementsCompleted,
      achievementsTotal,
      notes,
    } = body

    const userGame = await prisma.userGame.findFirst({
      where: {
        id: userGameId,
        userId: user.id,
      },
      include: {
        platforms: true,
        playThrough: {
          orderBy: {
            playthroughNumber: "desc",
          },
          take: 1,
        },
      },
    })

    if (!userGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    const platform = userGame.platforms[0]?.platform

    if (!platform) {
      return NextResponse.json(
        { error: "This game does not have a platform." },
        { status: 400 }
      )
    }

    const nextPlaythroughNumber =
      (userGame.playThrough[0]?.playthroughNumber ?? 0) + 1

    const completed = achievementsSupported
      ? Number(achievementsCompleted || 0)
      : 0

    const total = achievementsSupported ? Number(achievementsTotal || 0) : 0

    if (completed > total) {
      return NextResponse.json(
        {
          error:
            "Achievements completed cannot be greater than achievements total.",
        },
        { status: 400 }
      )
    }

    const playthrough = await prisma.playthrough.create({
      data: {
        userGameId,
        platform,
        playthroughNumber: nextPlaythroughNumber,
        status,
        dateStarted: dateStarted ? new Date(dateStarted) : null,
        dateEnded: dateEnded ? new Date(dateEnded) : null,
        hoursPlayed: hoursPlayed !== "" ? Number(hoursPlayed) : null,
        rating: rating && Number(rating) > 0 ? Number(rating) : null,
        achievementsSupported,
        achievementsCompleted: completed,
        achievementsTotal: total,
        notes: notes || null,
      },
    })

    const response = JSON.parse(
      JSON.stringify(playthrough, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    )

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("POST /api/games/[id]/playthroughs failed:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create playthrough.",
      },
      { status: 500 }
    )
  }
}
