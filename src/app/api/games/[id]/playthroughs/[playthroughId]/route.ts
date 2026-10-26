import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

function serialize(data: unknown) {
  return JSON.parse(
    JSON.stringify(data, (_key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  )
}

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string
      playthroughId: string
    }>
  }
) {
  const { id, playthroughId } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let userGameId: bigint
  let playthroughRecordId: bigint

  try {
    userGameId = BigInt(id)
    playthroughRecordId = BigInt(playthroughId)
  } catch {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  try {
    const playthrough = await prisma.playthrough.findFirst({
      where: {
        id: playthroughRecordId,
        userGameId,
        userGame: {
          userId: user.id,
        },
      },
      include: {
        userGame: {
          include: {
            game: true,
            platforms: true,
          },
        },
      },
    })

    if (!playthrough) {
      return NextResponse.json(
        { error: "Playthrough not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(serialize(playthrough))
  } catch (error) {
    console.error("GET playthrough failed:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load playthrough.",
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string
      playthroughId: string
    }>
  }
) {
  const { id, playthroughId } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let userGameId: bigint
  let playthroughRecordId: bigint

  try {
    userGameId = BigInt(id)
    playthroughRecordId = BigInt(playthroughId)
  } catch {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  try {
    const existingPlaythrough = await prisma.playthrough.findFirst({
      where: {
        id: playthroughRecordId,
        userGameId,
        userGame: {
          userId: user.id,
        },
      },
    })

    if (!existingPlaythrough) {
      return NextResponse.json(
        { error: "Playthrough not found" },
        { status: 404 }
      )
    }

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

    const updatedPlaythrough = await prisma.playthrough.update({
      where: {
        id: playthroughRecordId,
      },
      data: {
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

    return NextResponse.json(serialize(updatedPlaythrough))
  } catch (error) {
    console.error("PATCH playthrough failed:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update playthrough.",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string
      playthroughId: string
    }>
  }
) {
  const { id, playthroughId } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let userGameId: bigint
  let playthroughRecordId: bigint

  try {
    userGameId = BigInt(id)
    playthroughRecordId = BigInt(playthroughId)
  } catch {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  try {
    const existingPlaythrough = await prisma.playthrough.findFirst({
      where: {
        id: playthroughRecordId,
        userGameId,
        userGame: {
          userId: user.id,
        },
      },
    })

    if (!existingPlaythrough) {
      return NextResponse.json(
        { error: "Playthrough not found" },
        { status: 404 }
      )
    }

    await prisma.playthrough.delete({
      where: {
        id: playthroughRecordId,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("DELETE playthrough failed:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete playthrough.",
      },
      { status: 500 }
    )
  }
}
