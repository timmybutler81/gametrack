"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { CalendarDays, ChevronRight, Gamepad2 } from "lucide-react"

type GameData = {
  id: string
  genre: string | null
  status: string
  dateAdded: string

  game: {
    title: string
    imageUrl: string | null
  }

  platforms: {
    id: string
    platform: string
  }[]
}

const statusMap: Record<string, string> = {
  Playing: "PLAYING",
  Completed: "COMPLETED",
  "On Hold": "ON_HOLD",
  Dropped: "DROPPED",
  Backlog: "BACKLOG",
}

function formatStatus(status: string) {
  if (status === "ON_HOLD") {
    return "On Hold"
  }

  return status.charAt(0) + status.slice(1).toLowerCase()
}

export default function EditGamePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const id = params.id

  const [gameData, setGameData] = useState<GameData | null>(null)

  const [platform, setPlatform] = useState("")
  const [genre, setGenre] = useState("")
  const [status, setStatus] = useState("Backlog")
  const [dateAdded, setDateAdded] = useState("")

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadGame() {
      try {
        const response = await fetch(`/api/games/${id}`)

        if (!response.ok) {
          throw new Error("Failed to load game")
        }

        const data: GameData = await response.json()

        setGameData(data)
        setPlatform(data.platforms[0]?.platform ?? "")
        setGenre(data.genre ?? "")
        setStatus(formatStatus(data.status))
        setDateAdded(data.dateAdded.split("T")[0])
      } catch (error) {
        console.error("Failed to load game:", error)
        setError("Failed to load game.")
      } finally {
        setIsLoading(false)
      }
    }

    loadGame()
  }, [id])

  async function handleUpdateGame() {
    if (!platform || !dateAdded) {
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/games/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform,
          genre,
          status: statusMap[status],
          dateAdded,
        }),
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error ?? "Failed to update game")
      }

      router.push(`/games/${id}`)
      router.refresh()
    } catch (error) {
      console.error("Update game failed:", error)

      setError(
        error instanceof Error ? error.message : "Failed to update game."
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

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link href="/games" className="text-primary hover:underline">
          Games
        </Link>

        <ChevronRight className="text-text-secondary h-4 w-4" />

        <Link href={`/games/${id}`} className="text-primary hover:underline">
          {gameData.game.title}
        </Link>

        <ChevronRight className="text-text-secondary h-4 w-4" />

        <span className="text-text-secondary">Edit</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {gameData.game.imageUrl ? (
          <img
            src={gameData.game.imageUrl}
            alt={`${gameData.game.title} cover`}
            className="border-border h-40 w-28 rounded-lg border object-cover"
          />
        ) : (
          <div className="border-border bg-surface-light h-40 w-28 rounded-lg border" />
        )}

        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Edit Game
          </h1>

          <p className="text-text-secondary mt-2">
            Update your library information.
          </p>

          <div className="text-text-secondary mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              {platform || "No platform"}
            </div>

            <span>{genre || "No genre"}</span>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Added:{" "}
              {dateAdded
                ? new Date(`${dateAdded}T00:00:00`).toLocaleDateString()
                : "—"}
            </div>
          </div>
        </div>
      </div>

      <section className="border-border bg-surface rounded-lg border p-4 md:p-6">
        <h2 className="text-lg font-semibold">Game Details</h2>

        <div className="mt-6 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>

            <Input id="title" value={gameData.game.title} disabled />

            <p className="text-text-secondary text-sm">
              Game title is provided by RAWG.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-2">
            <Label htmlFor="platform">
              Platform <span className="text-red-500">*</span>
            </Label>

            <select
              id="platform"
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
              className="border-border bg-background w-full rounded-md border px-3 py-2"
            >
              <option value="">Select Platform</option>

              <option value="PlayStation 5">PlayStation 5</option>

              <option value="PlayStation 4">PlayStation 4</option>

              <option value="PC">PC</option>

              <option value="Xbox Series S/X">Xbox Series S/X</option>

              <option value="Xbox One">Xbox One</option>

              <option value="Nintendo Switch">Nintendo Switch</option>
            </select>
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>

            <Input
              id="genre"
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>
              Game Status <span className="text-red-500">*</span>
            </Label>

            <div className="flex flex-wrap gap-2">
              {["Playing", "Completed", "On Hold", "Dropped", "Backlog"].map(
                (statusOption) => (
                  <Button
                    key={statusOption}
                    type="button"
                    variant={status === statusOption ? "default" : "outline"}
                    onClick={() => setStatus(statusOption)}
                  >
                    {statusOption}
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Date Added */}
          <div className="space-y-2">
            <Label htmlFor="dateAdded">
              Date Added <span className="text-red-500">*</span>
            </Label>

            <Input
              id="dateAdded"
              type="date"
              value={dateAdded}
              onChange={(event) => setDateAdded(event.target.value)}
              className="date-input"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="border-border mt-6 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="w-full sm:w-auto">
            <Link href={`/games/${id}`}>Cancel</Link>
          </Button>

          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={handleUpdateGame}
            disabled={isSaving || !platform || !dateAdded}
          >
            {isSaving ? "Updating..." : "Update Game"}
          </Button>
        </div>
      </section>
    </div>
  )
}
