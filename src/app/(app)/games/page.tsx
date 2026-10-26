"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import {
  Gamepad2,
  MoreVertical,
  ChartNoAxesColumnIncreasing,
  ListFilter,
  Pencil,
} from "lucide-react"

type GameRow = {
  id: string
  title: string
  developer: string | null
  image: string | null
  platform: string
  genre: string | null
  status: string
  playthroughNumber: number | null
  hoursPlayed: string | null
  dateAdded: string
}

function getStatusClasses(status: string) {
  switch (status) {
    case "Playing":
      return "bg-green-900/50 text-green-300"

    case "Completed":
      return "bg-blue-900/50 text-blue-300"

    case "Backlog":
      return "bg-orange-900/50 text-orange-300"

    case "On Hold":
      return "bg-purple-900/50 text-purple-300"

    case "Dropped":
      return "bg-red-900/50 text-red-300"

    default:
      return "bg-surface-light text-text-secondary"
  }
}

export default function GamesPage() {
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [games, setGames] = useState<GameRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadGames() {
      try {
        const response = await fetch("/api/games")

        if (!response.ok) {
          throw new Error("Failed to load games")
        }

        const data = await response.json()

        const mappedGames: GameRow[] = data.map((userGame: any) => ({
          id: userGame.id,
          title: userGame.game.title,
          developer: userGame.game.developer,
          image: userGame.game.imageUrl,
          platform: userGame.platforms?.[0]?.platform ?? "Unknown",
          genre: userGame.genre,
          status:
            userGame.status === "ON_HOLD"
              ? "On Hold"
              : userGame.status.charAt(0) +
                userGame.status.slice(1).toLowerCase(),
          playthroughNumber:
            userGame.playthroughs?.[0]?.playthroughNumber ?? null,
          hoursPlayed: userGame.playthroughs?.[0]?.hoursPlayed ?? null,
          dateAdded: new Date(userGame.dateAdded).toLocaleDateString(),
        }))

        setGames(mappedGames)
      } catch (error) {
        console.error("Failed to load games:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadGames()
  }, [])

  const filteredGames =
    selectedStatus === "All"
      ? games
      : games.filter((game) => game.status === selectedStatus)

  const counts = {
    all: games.length,
    playing: games.filter((game) => game.status === "Playing").length,
    backlog: games.filter((game) => game.status === "Backlog").length,
    completed: games.filter((game) => game.status === "Completed").length,
    onHold: games.filter((game) => game.status === "On Hold").length,
    dropped: games.filter((game) => game.status === "Dropped").length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          My Games
        </h1>

        <p className="text-text-secondary mt-2">
          Track your games, playthroughs and achievements.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedStatus === "All" ? "default" : "outline"}
            onClick={() => setSelectedStatus("All")}
          >
            All ({counts.all})
          </Button>

          <Button
            variant={selectedStatus === "Playing" ? "default" : "outline"}
            onClick={() => setSelectedStatus("Playing")}
          >
            Playing ({counts.playing})
          </Button>

          <Button
            variant={selectedStatus === "Backlog" ? "default" : "outline"}
            onClick={() => setSelectedStatus("Backlog")}
          >
            Backlog ({counts.backlog})
          </Button>

          <Button
            variant={selectedStatus === "Completed" ? "default" : "outline"}
            onClick={() => setSelectedStatus("Completed")}
          >
            Completed ({counts.completed})
          </Button>

          <Button
            variant={selectedStatus === "On Hold" ? "default" : "outline"}
            onClick={() => setSelectedStatus("On Hold")}
          >
            On Hold ({counts.onHold})
          </Button>

          <Button
            variant={selectedStatus === "Dropped" ? "default" : "outline"}
            onClick={() => setSelectedStatus("Dropped")}
          >
            Dropped ({counts.dropped})
          </Button>
        </div>

        <Button variant="outline" className="w-full md:w-auto">
          <ListFilter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="border-border overflow-hidden rounded-lg border">
          <table className="w-full border-separate border-spacing-y-1">
            <thead>
              <tr className="border-border border-b">
                <th className="text-text-secondary px-4 py-4 text-left text-sm font-medium">
                  Game
                </th>

                <th className="text-text-secondary px-4 py-4 text-left text-sm font-medium">
                  Platform
                </th>

                <th className="text-text-secondary px-4 py-4 text-left text-sm font-medium">
                  Genre
                </th>

                <th className="text-text-secondary px-4 py-4 text-left text-sm font-medium">
                  Status
                </th>

                <th className="text-text-secondary px-4 py-4 text-left text-sm font-medium">
                  Playthrough
                </th>

                <th className="text-text-secondary px-4 py-4 text-left text-sm font-medium">
                  Date Added
                </th>

                <th className="text-text-secondary px-4 py-4 text-left text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredGames.map((game) => (
                <tr key={game.id} className="bg-surface">
                  {/* Game */}
                  <td className="rounded-l-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      {game.image ? (
                        <img
                          src={game.image}
                          alt={game.title}
                          className="h-12 w-9 rounded object-cover"
                        />
                      ) : (
                        <div className="border-border bg-surface-light h-12 w-9 rounded border" />
                      )}

                      <div>
                        <Link
                          href={`/games/${game.id}`}
                          className="hover:text-primary font-medium hover:underline"
                        >
                          {game.title}
                        </Link>

                        <p className="text-text-secondary text-sm">
                          {game.developer}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Platform */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4" />
                      <span>{game.platform}</span>
                    </div>
                  </td>

                  {/* Genre */}
                  <td className="px-4 py-3">{game.genre}</td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md px-3 py-1 text-sm ${getStatusClasses(
                        game.status
                      )}`}
                    >
                      {game.status}
                    </span>
                  </td>

                  {/* Playthrough */}
                  <td className="px-4 py-3">
                    {game.playthroughNumber ? (
                      <div>
                        <p className="font-medium">#{game.playthroughNumber}</p>

                        <p className="text-text-secondary text-sm">
                          {game.hoursPlayed} hrs
                        </p>
                      </div>
                    ) : (
                      <span className="text-text-secondary">—</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="text-text-secondary px-4 py-3">
                    {game.dateAdded}
                  </td>

                  {/* Actions */}
                  <td className="rounded-r-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Button size="icon">
                          <Link
                            href={`/games/${game.id}`}
                            aria-label={`Open ${game.title}`}
                            title={`Open ${game.title}`}
                          >
                            <ChartNoAxesColumnIncreasing className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button size="icon">
                          <Link
                            href={`/games/${game.id}/edit`}
                            aria-label={`Edit ${game.title}`}
                            title={`Edit ${game.title}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Desktop Pagination */}
          <div className="border-border flex items-center justify-between border-t px-4 py-4">
            <p className="text-text-secondary text-sm">
              Showing {filteredGames.length} of {games.length} games
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Game Cards */}
      <div className="space-y-3 md:hidden">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="border-border bg-surface rounded-lg border p-4"
          >
            {/* Top Section */}
            <div className="flex gap-3">
              {game.image ? (
                <img
                  src={game.image}
                  alt={`${game.title} cover`}
                  className="border-border h-20 w-14 shrink-0 rounded-md border object-cover"
                />
              ) : (
                <div className="border-border bg-surface-light h-20 w-14 shrink-0 rounded-md border" />
              )}

              <div className="min-w-0 flex-1">
                <Link
                  href={`/games/${game.id}`}
                  className="hover:text-primary font-medium hover:underline"
                >
                  {game.title}
                </Link>

                <p className="text-text-secondary text-sm">{game.developer}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Gamepad2 className="h-4 w-4" />
                    <span>{game.platform}</span>
                  </div>

                  <span className="text-text-secondary">•</span>

                  <span>{game.genre}</span>
                </div>
              </div>
            </div>

            {/* Status / Playthrough */}
            <div className="mt-4 flex items-center justify-between">
              <span
                className={`rounded-md px-3 py-1 text-sm ${getStatusClasses(
                  game.status
                )}`}
              >
                {game.status}
              </span>

              <div className="text-right text-sm">
                {game.playthroughNumber ? (
                  <>
                    <p className="font-medium">#{game.playthroughNumber}</p>

                    <p className="text-text-secondary">
                      {game.hoursPlayed} hrs
                    </p>
                  </>
                ) : (
                  <span className="text-text-secondary">—</span>
                )}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-border mt-4 flex items-center justify-between border-t pt-3">
              <span className="text-text-secondary text-sm">
                {game.dateAdded}
              </span>

              <div className="flex gap-2">
                <Button size="icon">
                  <Link
                    href={`/games/${game.id}`}
                    aria-label={`Open ${game.title}`}
                    title={`Open ${game.title}`}
                  >
                    <ChartNoAxesColumnIncreasing className="h-4 w-4" />
                  </Link>
                </Button>

                <Button size="icon">
                  <Link
                    href={`/games/${game.id}/edit`}
                    aria-label={`Edit ${game.title}`}
                    title={`Edit ${game.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Mobile Pagination */}
        <div className="pt-2">
          <p className="text-text-secondary text-center text-sm">
            Showing {filteredGames.length} of {games.length} games
          </p>
        </div>
      </div>
    </div>
  )
}
