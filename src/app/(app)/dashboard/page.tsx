import Link from "next/link"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

function formatStatus(status: string) {
  if (status === "ON_HOLD") {
    return "On Hold"
  }

  return status.charAt(0) + status.slice(1).toLowerCase()
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

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

  const totalGames = userGames.length

  const completedGames = userGames.filter(
    (game) => game.status === "COMPLETED"
  ).length

  const allPlaythroughs = userGames.flatMap((userGame) =>
    userGame.playThrough.map((playthrough) => ({
      ...playthrough,
      userGameId: userGame.id,
      title: userGame.game.title,
      platform:
        playthrough.platform ?? userGame.platforms[0]?.platform ?? "Unknown",
      genre: userGame.genre,
      gameStatus: userGame.status,
    }))
  )

  const totalHours = allPlaythroughs.reduce(
    (total, playthrough) => total + Number(playthrough.hoursPlayed ?? 0),
    0
  )

  const achievementsEarned = allPlaythroughs.reduce(
    (total, playthrough) => total + playthrough.achievementsCompleted,
    0
  )

  const achievementsTotal = allPlaythroughs.reduce(
    (total, playthrough) => total + playthrough.achievementsTotal,
    0
  )

  const achievementsRemaining = Math.max(
    achievementsTotal - achievementsEarned,
    0
  )

  const achievementPercentage =
    achievementsTotal > 0
      ? Math.round((achievementsEarned / achievementsTotal) * 100)
      : 0

  const recentlyPlayed = allPlaythroughs
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3)

  const libraryOverview = [
    {
      label: "Playing",
      status: "Playing",
      value: userGames.filter((game) => game.status === "PLAYING").length,
    },
    {
      label: "Backlog",
      status: "Backlog",
      value: userGames.filter((game) => game.status === "BACKLOG").length,
    },
    {
      label: "Completed",
      status: "Completed",
      value: userGames.filter((game) => game.status === "COMPLETED").length,
    },
    {
      label: "On Hold",
      status: "On Hold",
      value: userGames.filter((game) => game.status === "ON_HOLD").length,
    },
    {
      label: "Dropped",
      status: "Dropped",
      value: userGames.filter((game) => game.status === "DROPPED").length,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-text-secondary mt-2">
          Here&apos;s an overview of your gaming activity.
        </p>
      </div>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link href="/games">
          <Card className="hover:border-primary h-full transition">
            <CardHeader>
              <CardTitle className="text-text-secondary text-sm font-medium">
                Total Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalGames}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/games?status=Completed">
          <Card className="hover:border-primary h-full transition">
            <CardHeader>
              <CardTitle className="text-text-secondary text-sm font-medium">
                Completed Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{completedGames}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/history">
          <Card className="hover:border-primary h-full transition">
            <CardHeader>
              <CardTitle className="text-text-secondary text-sm font-medium">
                Total Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {Math.round(totalHours * 10) / 10}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/history">
          <Card className="hover:border-primary h-full transition">
            <CardHeader>
              <CardTitle className="text-text-secondary text-sm font-medium">
                Achievements Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{achievementsEarned}</p>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Recently Played */}
      <section className="mt-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recently Played</h2>

          <p className="text-text-secondary mt-1 text-sm">
            Games you&apos;ve been playing recently.
          </p>
        </div>

        {recentlyPlayed.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="text-text-secondary py-8 text-center">
              No playthrough activity yet.
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {recentlyPlayed.map((playthrough) => (
              <Link
                key={playthrough.id.toString()}
                href={`/games/${playthrough.userGameId.toString()}`}
              >
                <Card className="hover:border-primary h-full transition">
                  <CardHeader>
                    <CardTitle>{playthrough.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <p className="text-text-secondary text-sm">
                      {playthrough.platform}
                    </p>

                    <p className="text-text-secondary text-sm">
                      {formatStatus(playthrough.status)}
                    </p>

                    <p className="text-text-secondary text-sm">
                      {Number(playthrough.hoursPlayed ?? 0)} hours played
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Achievement Progress */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold tracking-tight">
          Achievement Progress
        </h2>

        <p className="text-text-secondary mt-1 text-sm">
          Overall achievement completion across your tracked games.
        </p>

        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Overall Completion</span>

              <span className="font-medium">{achievementPercentage}%</span>
            </div>

            <div className="bg-background mt-3 h-3 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full"
                style={{
                  width: `${achievementPercentage}%`,
                }}
              />
            </div>

            <div className="text-text-secondary mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span>{achievementsEarned} earned</span>
              <span>{achievementsTotal} total</span>
              <span>{achievementsRemaining} remaining</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Library Overview */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold tracking-tight">Library Overview</h2>

        <p className="text-text-secondary mt-1 text-sm">
          A quick look at your current game library.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {libraryOverview.map((item) => (
            <Link
              key={item.label}
              href={`/games?status=${encodeURIComponent(item.status)}`}
            >
              <Card className="hover:border-primary h-full transition">
                <CardContent className="pt-6">
                  <p className="text-text-secondary text-sm">{item.label}</p>

                  <p className="mt-2 text-2xl font-bold">{item.value}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
