"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AddGamePage() {
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedGame, setSelectedGame] = useState<any | null>(null)

  const [platform, setPlatform] = useState("")
  const [genre, setGenre] = useState("")
  const [status, setStatus] = useState("Backlog")

  const [dateAdded, setDateAdded] = useState(
    new Date().toISOString().split("T")[0]
  )

  const [playthroughStatus, setPlaythroughStatus] = useState("Playing")

  const [dateStarted, setDateStarted] = useState("")
  const [dateEnded, setDateEnded] = useState("")
  const [hoursPlayed, setHoursPlayed] = useState("0")
  const [rating, setRating] = useState(0)

  const [achievementsSupported, setAchievementsSupported] = useState(true)

  const [achievementsCompleted, setAchievementsCompleted] = useState("0")

  const [achievementsTotal, setAchievementsTotal] = useState("0")

  const [notes, setNotes] = useState("")

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch() {
    if (!searchTerm.trim()) {
      return
    }

    setIsSearching(true)

    try {
      const response = await fetch(
        `/api/games/search?q=${encodeURIComponent(searchTerm)}`
      )

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const data = await response.json()

      setSearchResults(data)
    } catch (error) {
      console.error("Game search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  function handleSelectGame(game: any) {
    setSelectedGame(game)
    setSearchTerm(game.name ?? "")

    setPlatform(game.platforms?.[0] ?? "")
    setGenre(game.genres?.[0] ?? "")

    setSearchResults([])
  }

  async function handleSaveGame() {
    if (!selectedGame || !platform) {
      return
    }

    setIsSaving(true)
    setError(null)

    const gameStatusMap: Record<string, string> = {
      Playing: "PLAYING",
      Backlog: "BACKLOG",
      Completed: "COMPLETED",
      "On Hold": "ON_HOLD",
      Dropped: "DROPPED",
    }

    const playthroughStatusMap: Record<string, string> = {
      Playing: "PLAYING",
      Completed: "COMPLETED",
      "On Hold": "ON_HOLD",
      Dropped: "DROPPED",
    }

    try {
      // Save the game first
      const gameResponse = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rawgId: selectedGame.id,
          title: selectedGame.name,
          developer: selectedGame.developer ?? null,
          imageUrl: selectedGame.image ?? null,
          releaseDate: selectedGame.released ?? null,
          genre: genre || null,
          status: gameStatusMap[status],
          dateAdded,
          platforms: [platform],
        }),
      })

      if (!gameResponse.ok) {
        const data = await gameResponse.json()

        throw new Error(data.error ?? "Failed to save game")
      }

      const savedGame = await gameResponse.json()

      // Only create the optional playthrough when the user entered
      // meaningful playthrough information.
      const shouldCreatePlaythrough =
        dateStarted !== "" ||
        dateEnded !== "" ||
        Number(hoursPlayed) > 0 ||
        rating > 0 ||
        Number(achievementsCompleted) > 0 ||
        Number(achievementsTotal) > 0 ||
        notes.trim() !== ""

      if (shouldCreatePlaythrough) {
        const playthroughResponse = await fetch(
          `/api/games/${savedGame.id}/playthroughs`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: playthroughStatusMap[playthroughStatus],
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

        if (!playthroughResponse.ok) {
          const data = await playthroughResponse.json()

          throw new Error(
            data.error ??
              "Game was saved, but the playthrough could not be saved."
          )
        }
      }

      router.push(`/games/${savedGame.id}`)
      router.refresh()
    } catch (error) {
      console.error("Save game failed:", error)

      setError(error instanceof Error ? error.message : "Failed to save game.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Add New Game
        </h1>

        <p className="text-text-secondary mt-2">
          Add a new game to your library and optionally create your first
          playthrough.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Game Details */}
        <section className="border-border bg-surface rounded-lg border p-4 md:p-6">
          <div className="flex items-start gap-3">
            <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold">
              1
            </div>

            <div>
              <h2 className="font-semibold">Game Details</h2>

              <p className="text-text-secondary text-sm">
                Add the game to your library
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>

            <Input
              id="title"
              placeholder="Enter game title"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <Button
              type="button"
              className="mt-2"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search Games"}
            </Button>

            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => handleSelectGame(game)}
                    className="border-border hover:bg-surface-light flex w-full items-center gap-3 rounded-md border p-3 text-left transition"
                  >
                    {game.image ? (
                      <img
                        src={game.image}
                        alt={`${game.name} cover`}
                        className="h-16 w-12 rounded-md object-cover"
                      />
                    ) : (
                      <div className="bg-surface-light h-16 w-12 rounded-md" />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{game.name}</p>

                      <p className="text-text-secondary text-sm">
                        {game.released || "Release date unavailable"}
                      </p>

                      <p className="text-text-secondary mt-1 text-sm">
                        {game.platforms?.join(", ")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedGame && (
              <div className="border-primary mt-4 flex items-center gap-3 rounded-md border p-3">
                {selectedGame.image && (
                  <img
                    src={selectedGame.image}
                    alt={`${selectedGame.name} cover`}
                    className="h-20 w-14 shrink-0 rounded-md object-cover"
                  />
                )}

                <div className="min-w-0">
                  <p className="font-medium">{selectedGame.name}</p>

                  <p className="text-text-secondary text-sm">
                    {selectedGame.released}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
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

                {selectedGame?.platforms?.map((gamePlatform: string) => (
                  <option key={gamePlatform} value={gamePlatform}>
                    {gamePlatform}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>

              <select
                id="genre"
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
                className="border-border bg-background w-full rounded-md border px-3 py-2"
              >
                <option value="">Select Genre</option>

                {selectedGame?.genres?.map((gameGenre: string) => (
                  <option key={gameGenre} value={gameGenre}>
                    {gameGenre}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="dateAdded">
                Date Added <span className="text-red-500">*</span>
              </Label>

              <Input
                id="dateAdded"
                type="date"
                value={dateAdded}
                onChange={(event) => setDateAdded(event.target.value)}
              />
            </div>
          </div>
        </section>

        {/* First Playthrough */}
        <section className="border-border bg-surface rounded-lg border p-4 md:p-6">
          <div className="flex items-start gap-3">
            <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold">
              2
            </div>

            <div>
              <h2 className="font-semibold">First Playthrough</h2>

              <p className="text-text-secondary text-sm">
                Optionally create your first playthrough
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="playthroughStatus">Status</Label>

              <select
                id="playthroughStatus"
                value={playthroughStatus}
                onChange={(event) => setPlaythroughStatus(event.target.value)}
                className="border-border bg-background w-full rounded-md border px-3 py-2"
              >
                <option value="Playing">Playing</option>

                <option value="Completed">Completed</option>

                <option value="On Hold">On Hold</option>

                <option value="Dropped">Dropped</option>
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dateStarted">Date Started</Label>

                <Input
                  id="dateStarted"
                  type="date"
                  value={dateStarted}
                  onChange={(event) => setDateStarted(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateEnded">Date Ended</Label>

                <Input
                  id="dateEnded"
                  type="date"
                  value={dateEnded}
                  onChange={(event) => setDateEnded(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hoursPlayed">Hours Played</Label>

              <Input
                id="hoursPlayed"
                type="number"
                min="0"
                step="0.25"
                value={hoursPlayed}
                onChange={(event) => setHoursPlayed(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl"
                    aria-label={`Rate ${star} stars`}
                  >
                    {rating >= star ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-border flex items-center justify-between border-t pt-4">
              <div>
                <Label htmlFor="achievementsSupported">
                  Achievements Supported
                </Label>
              </div>

              <button
                id="achievementsSupported"
                type="button"
                onClick={() => setAchievementsSupported(!achievementsSupported)}
                className={`relative h-6 w-11 rounded-full transition ${
                  achievementsSupported ? "bg-primary" : "bg-surface-light"
                }`}
                aria-pressed={achievementsSupported}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    achievementsSupported ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            {achievementsSupported && (
              <div className="divide-border border-border divide-y border-t">
                <div className="flex items-center justify-between py-4">
                  <Label htmlFor="achievementsCompleted">
                    Achievements Completed
                  </Label>

                  <Input
                    id="achievementsCompleted"
                    type="number"
                    min="0"
                    value={achievementsCompleted}
                    onChange={(event) =>
                      setAchievementsCompleted(event.target.value)
                    }
                    className="w-24 text-right"
                  />
                </div>

                <div className="flex items-center justify-between py-4">
                  <Label htmlFor="achievementsTotal">Achievements Total</Label>

                  <Input
                    id="achievementsTotal"
                    type="number"
                    min="0"
                    value={achievementsTotal}
                    onChange={(event) =>
                      setAchievementsTotal(event.target.value)
                    }
                    className="w-24 text-right"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>

              <textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add any notes about this playthrough..."
                maxLength={500}
                className="border-border bg-background min-h-28 w-full rounded-md border px-3 py-2"
              />

              <p className="text-text-secondary text-right text-sm">
                {notes.length} / 500
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="border-border bg-surface rounded-lg border p-4 md:p-6">
        <div className="flex items-start gap-3">
          <div className="bg-primary/20 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            ✨
          </div>

          <div>
            <h3 className="font-semibold">Add and Track in One Step</h3>

            <p className="text-text-secondary mt-1 text-sm">
              Save the game and your first playthrough together. You can always
              add more playthroughs later from the game details page.
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => router.push("/games")}
        >
          Cancel
        </Button>

        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={handleSaveGame}
          disabled={isSaving || !selectedGame || !platform}
        >
          {isSaving ? "Saving..." : "Save Game"}
        </Button>
      </div>
    </div>
  )
}
