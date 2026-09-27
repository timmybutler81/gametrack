"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import Link from "next/link"

import { ChevronLeft } from "lucide-react"

export default function EditPlaythroughPage() {
  const router = useRouter()
  const params = useParams()

  const gameId = params.id

  const [status, setStatus] = useState("Playing")
  const [dateStarted, setDateStarted] = useState("2025-04-12")
  const [dateEnded, setDateEnded] = useState("")
  const [hoursPlayed, setHoursPlayed] = useState("42")
  const [rating, setRating] = useState(5)

  const [achievementsSupported, setAchievementsSupported] = useState(true)
  const [achievementsCompleted, setAchievementsCompleted] = useState("24")
  const [achievementsTotal, setAchievementsTotal] = useState("42")

  const [notes, setNotes] = useState(
    "Exploring Limgrave and just defeated Godrick!"
  )

  function handleUpdatePlaythrough() {
    const updatedPlaythrough = {
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

    console.log("Updated Playthrough:", updatedPlaythrough)

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

        <Link href="/games/1" className="hover:text-text-primary">
          Elden Ring
        </Link>

        <span>/</span>

        <span>Playthrough #2</span>

        <span>/</span>

        <span className="text-text-primary">Edit</span>
      </div>

      {/* Game Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img
          src="https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg"
          alt="Elden Ring"
          className="h-28 w-20 rounded-md object-cover"
        />

        <div>
          <h1 className="text-3xl font-bold">Edit Playthrough</h1>

          <p className="text-text-secondary mt-1">
            Playthroughs are saved independently from the base game record.
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
            Update the progress and details for this playthrough.
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hours Played</label>

            <input
              type="number"
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
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Achievements Supported</p>

              <p className="text-text-secondary text-sm">
                Track achievement progress for this playthrough.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAchievementsSupported(!achievementsSupported)}
              className={`relative h-6 w-11 rounded-full transition ${
                achievementsSupported ? "bg-primary" : "bg-surface-light"
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
            onClick={handleUpdatePlaythrough}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium"
          >
            Update Playthrough
          </button>
        </div>
      </section>

      <div className="border-border bg-surface-light rounded-xl border p-4">
        <h3 className="font-medium">Playthroughs are independent</h3>

        <p className="text-text-secondary mt-1 text-sm">
          Updating this playthrough will not change the base game information.
        </p>
      </div>
    </div>
  )
}
