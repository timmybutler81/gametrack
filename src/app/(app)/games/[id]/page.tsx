import Link from "next/link"

import { Button } from "@/components/ui/button"

import {
  CalendarDays,
  ChevronLeft,
  CircleUserRound,
  Gamepad2,
  NotebookText,
  Pencil,
  Sparkles,
  Star,
  Trash2,
  Trophy,
} from "lucide-react"

export default async function GameDetailsPage({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params
  return (
    <div className="space-y-6">

      {/* Back Link */}
      <Link
        href="/games"
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
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
            className="h-64 w-44 rounded-lg border border-border object-cover"
          />

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                Elden Ring
              </h1>

              <span className="rounded-md bg-green-900/50 px-3 py-1 text-sm text-green-300">
                Playing
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-text-secondary">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                <span>PS5</span>
              </div>

              <span>Action RPG</span>
            </div>

            <div className="flex items-center gap-2 text-text-secondary">
              <CalendarDays className="h-4 w-4" />
              <span>Added: May 10, 2025</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/games/${id}/edit`}
            className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 
                      text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Game</span>
          </Link>

          <Button
            variant="destructive"
            className="whitespace-nowrap px-4"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Game
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6 overflow-x-auto">

          <button
            type="button"
            className="flex shrink-0 items-center gap-2 border-b-2 border-primary px-2 py-3 font-medium"
          >
            <CircleUserRound className="h-4 w-4" />
            Overview
          </button>

          <button
            type="button"
            className="flex shrink-0 items-center gap-2 px-2 py-3 text-text-secondary hover:text-text-primary"
          >
            <Trophy className="h-4 w-4" />
            Playthroughs
          </button>

          <button
            type="button"
            className="flex shrink-0 items-center gap-2 px-2 py-3 text-text-secondary hover:text-text-primary"
          >
            <Star className="h-4 w-4" />
            Achievements
          </button>

          <button
            type="button"
            className="flex shrink-0 items-center gap-2 px-2 py-3 text-text-secondary hover:text-text-primary"
          >
            <Sparkles className="h-4 w-4" />
            Stats
          </button>

          <button
            type="button"
            className="flex shrink-0 items-center gap-2 px-2 py-3 text-text-secondary hover:text-text-primary"
          >
            <NotebookText className="h-4 w-4" />
            Notes
          </button>

        </div>
      </div>

      {/* Overview Content */}
        <div className="grid gap-6 lg:grid-cols-3">

        {/* Playthrough History */}
        <section className="rounded-lg border border-border bg-surface p-4 md:p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
                Playthrough History
            </h2>

            <Button>
                + New Playthrough
            </Button>
            </div>

            <div className="space-y-3">
                <div className="rounded-lg border border-border bg-background p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">
                            #2
                            </span>

                            <p className="font-medium">
                            Playthrough #2
                            </p>

                            <span className="rounded-md bg-green-900/50 px-2 py-1 text-sm text-green-300">
                            Playing
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                            <span>Started: Apr 12, 2025</span>
                            <span>42 hrs</span>
                            <span>★ 10/10</span>
                        </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            >
                            <Link href="/games/1/playthroughs/2/edit">
                                View
                            </Link>
                        </Button>

                    </div>
                </div>

                <div className="rounded-lg border border-border bg-background p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">
                            #1
                            </span>

                            <p className="font-medium">
                            Playthrough #1
                            </p>

                            <span className="rounded-md bg-blue-900/50 px-2 py-1 text-sm text-blue-300">
                            Completed
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                            <span>Jan 5, 2025 – Mar 30, 2025</span>
                            <span>85 hrs</span>
                            <span>★ 10/10</span>
                        </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            >
                            <Link href="/games/1/playthroughs/2/edit">
                                View
                            </Link>
                        </Button>

                    </div>
                </div>
            </div>
        </section>

        {/* Game Details */}
        <section className="rounded-lg border border-border bg-surface p-4 md:p-6">
            <h2 className="text-lg font-semibold">
            Game Details
            </h2>

            <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-text-secondary">
                        Platform
                    </span>

                    <span>
                        PS5
                    </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-text-secondary">
                        Genre
                    </span>

                    <span>
                        Action RPG
                    </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-text-secondary">
                        Status
                    </span>

                    <span className="rounded-md bg-green-900/50 px-2 py-1 text-sm text-green-300">
                        Playing
                    </span>
                    </div>

                    <div className="flex items-center justify-between">
                    <span className="text-text-secondary">
                        Date Added
                    </span>

                    <span>
                        May 10, 2025
                    </span>
                </div>
            </div>
        </section>
    </div>

     {/* Achievements Summary */}
        <section className="rounded-lg border border-border bg-surface p-4 md:p-6">
        <h2 className="text-lg font-semibold">
            Achievements Summary
        </h2>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">

            {/* Achievement Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-sm text-text-secondary">
                Achievements Supported
                </p>

                <p className="mt-2 text-2xl font-bold">
                42
                </p>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-sm text-text-secondary">
                Achievements Completed
                </p>

                <p className="mt-2 text-2xl font-bold">
                24 <span className="text-base font-normal text-text-secondary">(57%)</span>
                </p>
            </div>

            <div className="rounded-lg border border-border bg-background p-4 sm:col-span-2">
                <p className="text-sm text-text-secondary">
                Achievements Total
                </p>

                <p className="mt-2 text-2xl font-bold">
                42
                </p>
            </div>
            </div>

            {/* Notes */}
            <div className="rounded-lg border border-border bg-background p-4">
            <h3 className="font-medium">
                Notes
            </h3>

            <p className="mt-2 text-text-secondary">
                Exploring Limgrave and just defeated Godrick!
            </p>
            </div>

        </div>
    </section>

</div>
  )
}