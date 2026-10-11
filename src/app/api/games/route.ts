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

  const userGames = await prisma.userGame.findMany({
    where: {
      userId: user.id,
    },
  })

  const response = userGames.map((userGame) => ({
    ...userGame,
    id: userGame.id.toString(),
    gameId: userGame.gameId.toString(),
  }))

  return NextResponse.json(response)
}
