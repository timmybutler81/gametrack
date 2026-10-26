"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import DeletePlaythroughDialog from "@/components/delete-playthrough-dialog"

const statusMap: Record<string, string> = {
  Playing: "PLAYING",
  Completed: "COMPLETED",
  "On Hold": "ON_HOLD",
  Dropped: "DROPPED",
}

function formatStatus(status: string) {
  if (status === "ON_HOLD") {
    return "On Hold"
  }

  return status.charAt(0) + status.slice(1).toLowerCase()
}

function formatDateForInput(value: string | null) {
  if (!value) {
    return ""
  }

  return value.split("T")[0]
}

type PlaythroughData = {
  id: string
  playthroughNumber: number
  status: string
  dateStarted: string | null
  dateEnded: string | null
  hoursPlayed: string | null
  rating: number | null
  achievementsSupported: boolean
  achievementsCompleted: number
  achievementsTotal: number
  notes: string | null

  userGame: {
    genre: string | null
    dateAdded: string

    game: {
      title: string
      imageUrl: string | null
    }

    platforms: {
      platform: string
    }[]
  }
}

export default function EditPlaythroughPage() {
  const router = useRouter()

  const params = useParams<{
    id: string
    playthroughId: string
  }>()

  const gameId = params.id
  const playthroughId = params.playthroughId

  const [playthroughData, setPlaythroughData] =
    useState<PlaythroughData | null>(null)

  const [status, setStatus] = useState("Playing")

  const [dateStarted, setDateStarted] = useState("")

  const [dateEnded, setDateEnded] = useState("")

  const [hoursPlayed, setHoursPlayed] = useState("0")

  const [rating, setRating] = useState(0)

  const [achievementsSupported, setAchievementsSupported] = useState(true)

  const [achievementsCompleted, setAchievementsCompleted] = useState("0")

  const [achievementsTotal, setAchievementsTotal] = useState("0")

  const [notes, setNotes] = useState("")

  const [isLoading, setIsLoading] = useState(true)

  const [isSaving, setIsSaving] = useState(false)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPlaythrough() {
      try {
        const response = await fetch(
          `/api/games/${gameId}/playthroughs/${playthroughId}`
        )

        if (!response.ok) {
          throw new Error("Failed to load playthrough")
        }

        const data: PlaythroughData = await response.json()

        setPlaythroughData(data)

        setStatus(formatStatus(data.status))

        setDateStarted(formatDateForInput(data.dateStarted))

        setDateEnded(formatDateForInput(data.dateEnded))

        setHoursPlayed(data.hoursPlayed ?? "0")

        setRating(data.rating ?? 0)

        setAchievementsSupported(data.achievementsSupported)

        setAchievementsCompleted(String(data.achievementsCompleted))

        setAchievementsTotal(String(data.achievementsTotal))

        setNotes(data.notes ?? "")
      } catch (error) {
        console.error("Failed to load playthrough:", error)

        setError("Failed to load playthrough.")
      } finally {
        setIsLoading(false)
      }
    }

    loadPlaythrough()
  }, [gameId, playthroughId])

  async function handleUpdatePlaythrough() {
    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/games/${gameId}/playthroughs/${playthroughId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: statusMap[status],

            dateStarted,
            dateEnded,
            hoursPlayed,
            rating,

            achievementsSupported,

            achievementsCompleted,

            achievementsTotal,

            notes,
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error ?? "Failed to update playthrough")
      }

      router.push(`/games/${gameId}`)

      router.refresh()
    } catch (error) {
      console.error("Update playthrough failed:", error)

      setError(
        error instanceof Error ? error.message : "Failed to update playthrough."
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-text-secondary">Loading playthrough...</div>
  }

  if (!playthroughData) {
    return (
      <div className="space-y-4">
        <p className="text-red-400">{error ?? "Playthrough not found."}</p>

        <Link
          href={`/games/${gameId}`}
          className="text-primary hover:underline"
        >
          Return to Game
        </Link>
      </div>
    )
  }

  const platform =
    playthroughData.userGame.platforms[0]?.platform ?? "No platform"

  const genre = playthroughData.userGame.genre ?? "No genre"

  const addedDate = new Date(
    playthroughData.userGame.dateAdded
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-text-secondary flex flex-wrap items-center gap-2 text-sm">
        <Link href="/games" className="hover:text-text-primary">
          Games
        </Link>

        <span>/</span>

        <Link href={`/games/${gameId}`} className="hover:text-text-primary">
          {playthroughData.userGame.game.title}
        </Link>

        <span>/</span>

        <span>Playthrough #{playthroughData.playthroughNumber}</span>

        <span>/</span>

        <span className="text-text-primary">Edit</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {playthroughData.userGame.game.imageUrl ? (
          <img
            src={playthroughData.userGame.game.imageUrl}
            alt={playthroughData.userGame.game.title}
            className="h-28 w-20 rounded-md object-cover"
          />
        ) : (
          <div className="bg-surface-light h-28 w-20 rounded-md" />
        )}

        <div>
          <h1 className="text-3xl font-bold">Edit Playthrough</h1>

          <p className="text-text-secondary mt-1">
            Playthroughs are saved independently from the base game record.
          </p>

          <div className="text-text-secondary mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span>{platform}</span>
            <span>{genre}</span>
            <span>Added {addedDate}</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <section className="border-border bg-surface rounded-xl border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Playthrough Details</h2>

          <p className="text-text-secondary mt-1 text-sm">
            Update the progress and details for this playthrough.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left */}
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
                step="0.25"
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

          {/* Right */}
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
                  className="border-border bg-background w-full rounded-md border px-3 py-2 disabled:opacity-50"
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
                  className="border-border bg-background w-full rounded-md border px-3 py-2 disabled:opacity-50"
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

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

        <div className="border-border mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <DeletePlaythroughDialog
            gameId={gameId}
            playthroughId={playthroughId}
            playthroughNumber={playthroughData.playthroughNumber}
          />

          <div className="flex flex-col gap-3 sm:flex-row">
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
              disabled={isSaving}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium disabled:opacity-50"
            >
              {isSaving ? "Updating..." : "Update Playthrough"}
            </button>
          </div>
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
