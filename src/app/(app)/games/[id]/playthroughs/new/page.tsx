"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

type GameData = {
  id: string
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

const statusMap: Record<string, string> = {
  Playing: "PLAYING",
  Completed: "COMPLETED",
  "On Hold": "ON_HOLD",
  Dropped: "DROPPED",
}

export default function NewPlaythroughPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()

  const gameId = params.id

  const [gameData, setGameData] = useState<GameData | null>(null)

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
    async function loadGame() {
      try {
        const response = await fetch(`/api/games/${gameId}`)

        if (!response.ok) {
          throw new Error("Failed to load game")
        }

        const data: GameData = await response.json()

        setGameData(data)
      } catch (error) {
        console.error("Failed to load game:", error)
        setError("Failed to load game.")
      } finally {
        setIsLoading(false)
      }
    }

    loadGame()
  }, [gameId])

  async function handleCreatePlaythrough() {
    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/games/${gameId}/playthroughs`, {
        method: "POST",
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
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error ?? "Failed to create playthrough")
      }

      router.push(`/games/${gameId}`)
      router.refresh()
    } catch (error) {
      console.error("Create playthrough failed:", error)

      setError(
        error instanceof Error ? error.message : "Failed to create playthrough."
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-text-secondary">Loading game...</div>
  }

  if (!gameData) {
    return (
      <div className="space-y-4">
        <p className="text-red-400">{error ?? "Game not found."}</p>

        <Link href="/games" className="text-primary hover:underline">
          Return to Games
        </Link>
      </div>
    )
  }

  const platform = gameData.platforms[0]?.platform ?? "No platform"

  const addedDate = new Date(gameData.dateAdded).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="space-y-6">
      <div className="text-text-secondary flex flex-wrap items-center gap-2 text-sm">
        <Link href="/games" className="hover:text-text-primary">
          Games
        </Link>

        <span>/</span>

        <Link href={`/games/${gameId}`} className="hover:text-text-primary">
          {gameData.game.title}
        </Link>

        <span>/</span>

        <span className="text-text-primary">New Playthrough</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {gameData.game.imageUrl ? (
          <img
            src={gameData.game.imageUrl}
            alt={gameData.game.title}
            className="h-28 w-20 rounded-md object-cover"
          />
        ) : (
          <div className="bg-surface-light h-28 w-20 rounded-md" />
        )}

        <div>
          <h1 className="text-3xl font-bold">New Playthrough</h1>

          <p className="text-text-secondary mt-1">
            Create a new playthrough for {gameData.game.title}.
          </p>

          <div className="text-text-secondary mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span>{platform}</span>

            <span>{gameData.genre ?? "No genre"}</span>

            <span>Added {addedDate}</span>
          </div>
        </div>
      </div>

      <section className="border-border bg-surface rounded-xl border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Playthrough Details</h2>

          <p className="text-text-secondary mt-1 text-sm">
            Enter the details for your new playthrough.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
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

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

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
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium disabled:opacity-50"
          >
            {isSaving ? "Creating..." : "Create Playthrough"}
          </button>
        </div>
      </section>

      <div className="border-border bg-surface-light rounded-xl border p-4">
        <h3 className="font-medium">Playthroughs are independent</h3>

        <p className="text-text-secondary mt-1 text-sm">
          Creating a new playthrough will not change the base game information.
        </p>
      </div>
    </div>
  )
}
