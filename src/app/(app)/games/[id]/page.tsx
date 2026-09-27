import Link from "next/link"

import { Button } from "@/components/ui/button"

import {
  CalendarDays,
  ChevronLeft,
  Gamepad2,
  Pencil,
  Trash2,
} from "lucide-react"

export default async function GameDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const playthroughs = [
    {
      id: 2,
      number: 2,
      status: "Playing",
      dateStarted: "Apr 12, 2025",
      dateEnded: null,
      hoursPlayed: 42,
      rating: 5,
    },
    {
      id: 1,
      number: 1,
      status: "Completed",
      dateStarted: "Jan 5, 2025",
      dateEnded: "Mar 30, 2025",
      hoursPlayed: 85,
      rating: 5,
    },
  ]
  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/games"
        className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Games
      </Link>

      {/* Game Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Game Info */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <img
            src="https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg"
            alt="Elden Ring cover"
            className="border-border h-64 w-44 rounded-lg border object-cover"
          />

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Elden Ring</h1>

              <span className="rounded-md bg-green-900/50 px-3 py-1 text-sm text-green-300">
                Playing
              </span>
            </div>

            <div className="text-text-secondary flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                <span>PS5</span>
              </div>

              <span>Action RPG</span>
            </div>

            <div className="text-text-secondary flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Added: May 10, 2025</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/games/${id}/edit`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium whitespace-nowrap"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Game</span>
          </Link>

          <Button variant="destructive" className="px-4 whitespace-nowrap">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Game
          </Button>
        </div>
      </div>

      {/* Game Content */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Playthrough History */}
        <section className="border-border bg-surface rounded-lg border p-4 md:p-6 xl:col-span-2">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Playthrough History</h2>

              <p className="text-text-secondary mt-1 text-sm">
                Track each time you play through this game.
              </p>
            </div>

            <Link
              href={`/games/${id}/playthroughs/new`}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
            >
              + New Playthrough
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-border text-text-secondary border-b text-left text-sm">
                  <th className="px-3 py-3 font-medium">#</th>

                  <th className="px-3 py-3 font-medium">Status</th>

                  <th className="px-3 py-3 font-medium">Started</th>

                  <th className="px-3 py-3 font-medium">Ended</th>

                  <th className="px-3 py-3 font-medium">Hours</th>

                  <th className="px-3 py-3 font-medium">Rating</th>

                  <th className="px-3 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {playthroughs.map((playthrough) => (
                  <tr
                    key={playthrough.id}
                    className="border-border border-b last:border-b-0"
                  >
                    <td className="px-3 py-4">
                      <span className="bg-primary text-primary-foreground rounded-md px-2 py-1 text-sm font-medium">
                        #{playthrough.number}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`rounded-md px-2 py-1 text-sm ${
                          playthrough.status === "Playing"
                            ? "bg-green-900/50 text-green-300"
                            : "bg-blue-900/50 text-blue-300"
                        }`}
                      >
                        {playthrough.status}
                      </span>
                    </td>

                    <td className="px-3 py-4 text-sm">
                      {playthrough.dateStarted}
                    </td>

                    <td className="px-3 py-4 text-sm">
                      {playthrough.dateEnded ?? "—"}
                    </td>

                    <td className="px-3 py-4 text-sm">
                      {playthrough.hoursPlayed} hrs
                    </td>

                    <td className="px-3 py-4 text-sm">
                      <span>{"★".repeat(playthrough.rating)}</span>
                      <span className="text-text-secondary">
                        {"☆".repeat(5 - playthrough.rating)}
                      </span>
                    </td>

                    <td className="px-3 py-4 text-right">
                      <Link
                        href={`/games/${id}/playthroughs/${playthrough.id}/edit`}
                        className="border-border hover:bg-surface-light inline-flex rounded-md border px-3 py-1.5 text-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {playthroughs.map((playthrough) => (
              <div
                key={playthrough.id}
                className="border-border bg-background rounded-lg border p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-md px-2 py-1 text-sm font-medium">
                      #{playthrough.number}
                    </span>

                    <span
                      className={`rounded-md px-2 py-1 text-sm ${
                        playthrough.status === "Playing"
                          ? "bg-green-900/50 text-green-300"
                          : "bg-blue-900/50 text-blue-300"
                      }`}
                    >
                      {playthrough.status}
                    </span>
                  </div>

                  <Link
                    href={`/games/${id}/playthroughs/${playthrough.id}/edit`}
                    className="border-border hover:bg-surface-light rounded-md border px-3 py-1.5 text-sm"
                  >
                    Edit
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-text-secondary">Started</p>

                    <p>{playthrough.dateStarted}</p>
                  </div>

                  <div>
                    <p className="text-text-secondary">Ended</p>

                    <p>{playthrough.dateEnded ?? "—"}</p>
                  </div>

                  <div>
                    <p className="text-text-secondary">Hours</p>

                    <p>{playthrough.hoursPlayed} hrs</p>
                  </div>

                  <div>
                    <p className="text-text-secondary">Rating</p>

                    <p>
                      <span>{"★".repeat(playthrough.rating)}</span>
                      <span className="text-text-secondary">
                        {"☆".repeat(5 - playthrough.rating)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Game Details */}
        <section className="border-border bg-surface rounded-lg border p-4 md:p-6">
          <h2 className="text-lg font-semibold">Game Details</h2>

          <div className="mt-4 space-y-4">
            <div className="border-border flex items-center justify-between border-b pb-3">
              <span className="text-text-secondary">Platform</span>

              <span>PS5</span>
            </div>

            <div className="border-border flex items-center justify-between border-b pb-3">
              <span className="text-text-secondary">Genre</span>

              <span>Action RPG</span>
            </div>

            <div className="border-border flex items-center justify-between border-b pb-3">
              <span className="text-text-secondary">Status</span>

              <span className="rounded-md bg-green-900/50 px-2 py-1 text-sm text-green-300">
                Playing
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Date Added</span>

              <span>May 10, 2025</span>
            </div>
          </div>
        </section>
      </div>

      {/* Notes */}
      <div className="border-border bg-background rounded-lg border p-4">
        <h3 className="font-medium">Notes</h3>

        <p className="text-text-secondary mt-2">
          Exploring Limgrave and just defeated Godrick!
        </p>
      </div>
    </div>
  )
}
