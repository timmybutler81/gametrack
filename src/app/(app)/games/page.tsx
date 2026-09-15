"use client"

import { useState } from "react"
import { games } from "@/data/games"
import { Button } from "@/components/ui/button"

import {
  Gamepad2,
  MoreVertical,
  ChartNoAxesColumnIncreasing,
  ListFilter,
} from "lucide-react"

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

  const filteredGames =
    selectedStatus === "All"
      ? games
      : games.filter((game) => game.status === selectedStatus)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          My Games
        </h1>

        <p className="mt-2 text-text-secondary">
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
            All (24)
          </Button>

          <Button
            variant={selectedStatus === "Playing" ? "default" : "outline"}
            onClick={() => setSelectedStatus("Playing")}
          >
            Playing (6)
          </Button>

          <Button
            variant={selectedStatus === "Backlog" ? "default" : "outline"}
            onClick={() => setSelectedStatus("Backlog")}
          >
            Backlog (7)
          </Button>

          <Button
            variant={selectedStatus === "Completed" ? "default" : "outline"}
            onClick={() => setSelectedStatus("Completed")}
          >
            Completed (8)
          </Button>

          <Button
            variant={selectedStatus === "On Hold" ? "default" : "outline"}
            onClick={() => setSelectedStatus("On Hold")}
          >
            On Hold (2)
          </Button>

          <Button
            variant={selectedStatus === "Dropped" ? "default" : "outline"}
            onClick={() => setSelectedStatus("Dropped")}
          >
            Dropped (1)
          </Button>
        </div>

        <Button variant="outline" className="w-full md:w-auto">
          <ListFilter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full border-separate border-spacing-y-1">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-4 text-left text-sm font-medium text-text-secondary">
                  Game
                </th>

                <th className="px-4 py-4 text-left text-sm font-medium text-text-secondary">
                  Platform
                </th>

                <th className="px-4 py-4 text-left text-sm font-medium text-text-secondary">
                  Genre
                </th>

                <th className="px-4 py-4 text-left text-sm font-medium text-text-secondary">
                  Status
                </th>

                <th className="px-4 py-4 text-left text-sm font-medium text-text-secondary">
                  Playthrough
                </th>

                <th className="px-4 py-4 text-left text-sm font-medium text-text-secondary">
                  Date Added
                </th>

                <th className="px-4 py-4 text-left text-sm font-medium text-text-secondary">
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
                          alt={`${game.title} cover`}
                          className="h-16 w-12 rounded-md border border-border object-cover"
                        />
                      ) : (
                        <div className="h-16 w-12 rounded-md border border-border bg-surface-light" />
                      )}

                      <div>
                        <p className="font-medium">
                          {game.title}
                        </p>

                        <p className="text-sm text-text-secondary">
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
                  <td className="px-4 py-3">
                    {game.genre}
                  </td>

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
                        <p className="font-medium">
                          #{game.playthroughNumber}
                        </p>

                        <p className="text-sm text-text-secondary">
                          {game.hoursPlayed} hrs
                        </p>
                      </div>
                    ) : (
                      <span className="text-text-secondary">
                        —
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-text-secondary">
                    {game.dateAdded}
                  </td>

                  {/* Actions */}
                  <td className="rounded-r-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button size="icon">
                        <ChartNoAxesColumnIncreasing className="h-4 w-4" />
                      </Button>

                      <Button size="icon" variant="outline">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Desktop Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-4">
            <p className="text-sm text-text-secondary">
              Showing 1 to 8 of 24 games
            </p>

            <div className="flex items-center gap-2">
              <Button size="sm">
                1
              </Button>

              <Button size="sm" variant="outline">
                2
              </Button>

              <Button size="sm" variant="outline">
                3
              </Button>

              <Button size="sm" variant="outline">
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Game Cards */}
      <div className="space-y-3 md:hidden">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="rounded-lg border border-border bg-surface p-4"
          >
            {/* Top Section */}
            <div className="flex gap-3">
              {game.image ? (
                <img
                  src={game.image}
                  alt={`${game.title} cover`}
                  className="h-20 w-14 shrink-0 rounded-md border border-border object-cover"
                />
              ) : (
                <div className="h-20 w-14 shrink-0 rounded-md border border-border bg-surface-light" />
              )}

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">
                  {game.title}
                </h3>

                <p className="text-sm text-text-secondary">
                  {game.developer}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Gamepad2 className="h-4 w-4" />
                    <span>{game.platform}</span>
                  </div>

                  <span className="text-text-secondary">
                    •
                  </span>

                  <span>
                    {game.genre}
                  </span>
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
                    <p className="font-medium">
                      #{game.playthroughNumber}
                    </p>

                    <p className="text-text-secondary">
                      {game.hoursPlayed} hrs
                    </p>
                  </>
                ) : (
                  <span className="text-text-secondary">
                    —
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm text-text-secondary">
                {game.dateAdded}
              </span>

              <div className="flex gap-2">
                <Button size="icon">
                  <ChartNoAxesColumnIncreasing className="h-4 w-4" />
                </Button>

                <Button size="icon" variant="outline">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Mobile Pagination */}
        <div className="flex flex-col gap-3 pt-2">
          <p className="text-center text-sm text-text-secondary">
            Showing 1 to 8 of 24 games
          </p>

          <div className="flex justify-center gap-2">
            <Button size="sm">
              1
            </Button>

            <Button size="sm" variant="outline">
              2
            </Button>

            <Button size="sm" variant="outline">
              3
            </Button>

            <Button size="sm" variant="outline">
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}