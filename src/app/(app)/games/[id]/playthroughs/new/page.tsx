"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

export default function NewPlaythroughPage() {
  const router = useRouter()
  const params = useParams()

  const gameId = params.id

  const [status, setStatus] = useState("Playing")
  const [dateStarted, setDateStarted] = useState("")
  const [dateEnded, setDateEnded] = useState("")
  const [hoursPlayed, setHoursPlayed] = useState("0")
  const [rating, setRating] = useState(0)

  const [achievementsSupported, setAchievementsSupported] = useState(true)
  const [achievementsCompleted, setAchievementsCompleted] = useState("0")
  const [achievementsTotal, setAchievementsTotal] = useState("0")

  const [notes, setNotes] = useState("")

  function handleCreatePlaythrough() {
    const newPlaythrough = {
      status,
      dateStarted,
      dateEnded,
      hoursPlayed,
      rating,
      achievementsSupported,
      achievementsCompleted,
      achievementsTotal,
      notes,
    }

    console.log("New Playthrough:", newPlaythrough)

    router.push(`/games/${gameId}`)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-text-secondary flex flex-wrap items-center gap-2 text-sm">
        <Link href="/games" className="hover:text-text-primary">
          Games
        </Link>

        <span>/</span>

        <Link href={`/games/${gameId}`} className="hover:text-text-primary">
          Elden Ring
        </Link>

        <span>/</span>

        <span className="text-text-primary">New Playthrough</span>
      </div>

      {/* Game Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img
          src="https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg"
          alt="Elden Ring"
          className="h-28 w-20 rounded-md object-cover"
        />

        <div>
          <h1 className="text-3xl font-bold">New Playthrough</h1>

          <p className="text-text-secondary mt-1">
            Create a new playthrough for this game.
          </p>

          <div className="text-text-secondary mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span>PS5</span>
            <span>Action RPG</span>
            <span>Added May 10, 2025</span>
          </div>
        </div>
      </div>

      {/* Playthrough Details */}
      <section className="border-border bg-surface rounded-xl border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Playthrough Details</h2>

          <p className="text-text-secondary mt-1 text-sm">
            Enter the details for your new playthrough.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="border-border bg-background w-full rounded-md border px-3 py-2"
              >
                <option value="Playing">Playing</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Started</label>

                <input
                  type="date"
                  value={dateStarted}
                  onChange={(event) => setDateStarted(event.target.value)}
                  className="date-input border-border bg-background w-full rounded-md border px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Ended</label>

                <input
                  type="date"
                  value={dateEnded}
                  onChange={(event) => setDateEnded(event.target.value)}
                  className="date-input border-border bg-background w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Hours Played</label>

              <input
                type="number"
                min="0"
                value={hoursPlayed}
                onChange={(event) => setHoursPlayed(event.target.value)}
                className="border-border bg-background w-full rounded-md border px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>

              <div className="flex gap-1 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition hover:scale-110"
                    aria-label={`Rate ${star} stars`}
                  >
                    {rating >= star ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Achievements Supported</p>

                <p className="text-text-secondary text-sm">
                  Track achievement progress for this playthrough.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAchievementsSupported(!achievementsSupported)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  achievementsSupported ? "bg-primary" : "bg-background"
                }`}
                aria-label="Toggle achievement tracking"
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    achievementsSupported ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Completed</label>

                <input
                  type="number"
                  min="0"
                  value={achievementsCompleted}
                  onChange={(event) =>
                    setAchievementsCompleted(event.target.value)
                  }
                  disabled={!achievementsSupported}
                  className="border-border bg-background w-full rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Total</label>

                <input
                  type="number"
                  min="0"
                  value={achievementsTotal}
                  onChange={(event) => setAchievementsTotal(event.target.value)}
                  disabled={!achievementsSupported}
                  className="border-border bg-background w-full rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Notes</label>

                <span className="text-text-secondary text-xs">
                  {notes.length}/500
                </span>
              </div>

              <textarea
                rows={8}
                maxLength={500}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="border-border bg-background w-full resize-none rounded-md border px-3 py-2"
                placeholder="Add notes about this playthrough..."
              />
            </div>
          </div>
        </div>

        <div className="border-border mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push(`/games/${gameId}`)}
            className="border-border hover:bg-surface-light rounded-md border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreatePlaythrough}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium"
          >
            Create Playthrough
          </button>
        </div>
      </section>

      {/* Info */}
      <div className="border-border bg-surface-light rounded-xl border p-4">
        <h3 className="font-medium">Playthroughs are independent</h3>

        <p className="text-text-secondary mt-1 text-sm">
          Creating a new playthrough will not change the base game information.
        </p>
      </div>
    </div>
  )
}
