import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import DeleteGameDialog from "@/components/delete-game-dialog"

import { CalendarDays, ChevronLeft, Gamepad2, Pencil } from "lucide-react"

function formatStatus(status: string) {
  if (status === "ON_HOLD") {
    return "On Hold"
  }

  return status.charAt(0) + status.slice(1).toLowerCase()
}

function formatDate(date: Date | null) {
  if (!date) {
    return "—"
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getStatusClasses(status: string) {
  switch (status) {
    case "PLAYING":
      return "bg-green-900/50 text-green-300"

    case "COMPLETED":
      return "bg-blue-900/50 text-blue-300"

    case "BACKLOG":
      return "bg-orange-900/50 text-orange-300"

    case "ON_HOLD":
      return "bg-purple-900/50 text-purple-300"

    case "DROPPED":
      return "bg-red-900/50 text-red-300"

    default:
      return "bg-surface-light text-text-secondary"
  }
}

export default async function GameDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let userGameId: bigint

  try {
    userGameId = BigInt(id)
  } catch {
    notFound()
  }

  const userGame = await prisma.userGame.findFirst({
    where: {
      id: userGameId,
      userId: user.id,
    },
    include: {
      game: true,
      platforms: true,
      playThrough: {
        orderBy: {
          playthroughNumber: "desc",
        },
      },
    },
  })

  if (!userGame) {
    notFound()
  }

  const platform =
    userGame.platforms.length > 0
      ? userGame.platforms.map((item) => item.platform).join(", ")
      : "No platform"

  const playthroughs = userGame.playThrough

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
        <div className="flex flex-col gap-4 sm:flex-row">
          {userGame.game.imageUrl ? (
            <img
              src={userGame.game.imageUrl}
              alt={`${userGame.game.title} cover`}
              className="border-border h-64 w-44 rounded-lg border object-cover"
            />
          ) : (
            <div className="border-border bg-surface-light h-64 w-44 rounded-lg border" />
          )}

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {userGame.game.title}
              </h1>

              <span
                className={`rounded-md px-3 py-1 text-sm ${getStatusClasses(
                  userGame.status
                )}`}
              >
                {formatStatus(userGame.status)}
              </span>
            </div>

            <div className="text-text-secondary flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                <span>{platform}</span>
              </div>

              <span>{userGame.genre ?? "No genre"}</span>
            </div>

            <div className="text-text-secondary flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Added: {formatDate(userGame.dateAdded)}</span>
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

          <DeleteGameDialog gameId={id} gameTitle={userGame.game.title} />
        </div>
      </div>

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

          {playthroughs.length === 0 ? (
            <div className="border-border rounded-lg border border-dashed p-8 text-center">
              <p className="font-medium">No playthroughs yet</p>

              <p className="text-text-secondary mt-1 text-sm">
                Add your first playthrough to start tracking progress.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
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
                      <th className="px-3 py-3 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {playthroughs.map((playthrough) => (
                      <tr
                        key={playthrough.id.toString()}
                        className="border-border border-b last:border-b-0"
                      >
                        <td className="px-3 py-4">
                          <span className="bg-primary text-primary-foreground rounded-md px-2 py-1 text-sm font-medium">
                            #{playthrough.playthroughNumber}
                          </span>
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`rounded-md px-2 py-1 text-sm ${getStatusClasses(
                              playthrough.status
                            )}`}
                          >
                            {formatStatus(playthrough.status)}
                          </span>
                        </td>

                        <td className="px-3 py-4 text-sm">
                          {formatDate(playthrough.dateStarted)}
                        </td>

                        <td className="px-3 py-4 text-sm">
                          {formatDate(playthrough.dateEnded)}
                        </td>

                        <td className="px-3 py-4 text-sm">
                          {playthrough.hoursPlayed?.toString() ?? "0"} hrs
                        </td>

                        <td className="px-3 py-4 text-sm">
                          {playthrough.rating ? (
                            <>
                              <span>{"★".repeat(playthrough.rating)}</span>
                              <span className="text-text-secondary">
                                {"☆".repeat(5 - playthrough.rating)}
                              </span>
                            </>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td className="px-3 py-4 text-right">
                          <Link
                            href={`/games/${id}/playthroughs/${playthrough.id.toString()}/edit`}
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

              {/* Mobile */}
              <div className="space-y-3 md:hidden">
                {playthroughs.map((playthrough) => (
                  <div
                    key={playthrough.id.toString()}
                    className="border-border bg-background rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-md px-2 py-1 text-sm font-medium">
                          #{playthrough.playthroughNumber}
                        </span>

                        <span
                          className={`rounded-md px-2 py-1 text-sm ${getStatusClasses(
                            playthrough.status
                          )}`}
                        >
                          {formatStatus(playthrough.status)}
                        </span>
                      </div>

                      <Link
                        href={`/games/${id}/playthroughs/${playthrough.id.toString()}/edit`}
                        className="border-border hover:bg-surface-light rounded-md border px-3 py-1.5 text-sm"
                      >
                        Edit
                      </Link>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-text-secondary">Started</p>
                        <p>{formatDate(playthrough.dateStarted)}</p>
                      </div>

                      <div>
                        <p className="text-text-secondary">Ended</p>
                        <p>{formatDate(playthrough.dateEnded)}</p>
                      </div>

                      <div>
                        <p className="text-text-secondary">Hours</p>
                        <p>{playthrough.hoursPlayed?.toString() ?? "0"} hrs</p>
                      </div>

                      <div>
                        <p className="text-text-secondary">Rating</p>
                        <p>
                          {playthrough.rating
                            ? `${"★".repeat(playthrough.rating)}${"☆".repeat(
                                5 - playthrough.rating
                              )}`
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Game Details */}
        <section className="border-border bg-surface rounded-lg border p-4 md:p-6">
          <h2 className="text-lg font-semibold">Game Details</h2>

          <div className="mt-4 space-y-4">
            <div className="border-border flex items-center justify-between border-b pb-3">
              <span className="text-text-secondary">Platform</span>
              <span>{platform}</span>
            </div>

            <div className="border-border flex items-center justify-between border-b pb-3">
              <span className="text-text-secondary">Genre</span>
              <span>{userGame.genre ?? "—"}</span>
            </div>

            <div className="border-border flex items-center justify-between border-b pb-3">
              <span className="text-text-secondary">Status</span>

              <span
                className={`rounded-md px-2 py-1 text-sm ${getStatusClasses(
                  userGame.status
                )}`}
              >
                {formatStatus(userGame.status)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Date Added</span>
              <span>{formatDate(userGame.dateAdded)}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Notes from most recent playthrough */}
      {playthroughs[0]?.notes && (
        <div className="border-border bg-background rounded-lg border p-4">
          <h3 className="font-medium">Notes</h3>

          <p className="text-text-secondary mt-2">{playthroughs[0].notes}</p>
        </div>
      )}
    </div>
  )
}
