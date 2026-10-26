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
    const userGame = await prisma.userGame.findFirst({
      where: {
        id: userGameId,
        userId: user.id,
      },
      include: {
        game: true,
        platforms: true,
      },
    })

    if (!userGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    return NextResponse.json(serialize(userGame))
  } catch (error) {
    console.error("GET /api/games/[id] failed:", error)

    return NextResponse.json({ error: "Failed to load game" }, { status: 500 })
  }
}

export async function PATCH(
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

    const { platform, genre, status, dateAdded } = body

    const existingUserGame = await prisma.userGame.findFirst({
      where: {
        id: userGameId,
        userId: user.id,
      },
    })

    if (!existingUserGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.userGame.update({
        where: {
          id: userGameId,
        },
        data: {
          genre: genre || null,
          status,
          dateAdded: new Date(dateAdded),
        },
      })

      await tx.userGamePlatform.deleteMany({
        where: {
          userGameId,
        },
      })

      await tx.userGamePlatform.create({
        data: {
          userGameId,
          platform,
        },
      })
    })

    const updatedUserGame = await prisma.userGame.findFirst({
      where: {
        id: userGameId,
        userId: user.id,
      },
      include: {
        game: true,
        platforms: true,
      },
    })

    return NextResponse.json(serialize(updatedUserGame))
  } catch (error) {
    console.error("PATCH /api/games/[id] failed:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update game",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
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
    const existingUserGame = await prisma.userGame.findFirst({
      where: {
        id: userGameId,
        userId: user.id,
      },
    })

    if (!existingUserGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    await prisma.userGame.delete({
      where: {
        id: userGameId,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("DELETE /api/games/[id] failed:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete game",
      },
      { status: 500 }
    )
  }
}
