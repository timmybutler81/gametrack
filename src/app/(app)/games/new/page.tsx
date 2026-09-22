"use client"

import { use, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { games } from "@/data/games"

export default function AddGamePage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [selectedGame, setSelectedGame] = useState<any | null>(null)
    const [platform, setPlatform] = useState("")
    const [genre, setGenre] = useState("")
    const [status, setStatus] = useState("Backlog")
    const [dateAdded, setDateAdded] = useState(
        new Date().toISOString().split("T")[0])
    const [playthroughStatus, setPlaythroughStatus] = useState("Playing")
    const [dateStarted, setDateStarted] = useState("")
    const [dateEnded, setDateEnded] = useState("")
    const [hoursPlayed, setHoursPlayed] = useState("0")
    const [rating, setRating] = useState("0")
    const [achievementsSupported, setAchievementsSupported] = useState(true)
    const [achievementsCompleted, setAchievementsCompleted] = useState("0")
    const [achievementsTotal, setAchievementsTotal] = useState("0")
    const [notes, setNotes] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    async function handleSearch() {
        console.log("Searching for:", searchTerm)

        if (!searchTerm.trim()) {
            return
        }

        setIsSearching(true)

        try {
            const response = await fetch(
                `/api/games/search?q=${encodeURIComponent(searchTerm)}`
            )

            if (!response.ok) {
                throw new Error("Search Failed")
            }

            const data = await response.json()

            console.log("RAWG response:", data)

            setSearchResults(data)
        } catch (error) {
            console.error(error)
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
        setIsSaving(true)

        try {
            console.log({
            game: {
                id: selectedGame?.id,
                title: selectedGame?.name,
                image: selectedGame?.image,
                platform,
                genre,
                status,
                dateAdded,
            },
            playthrough: {
                status: playthroughStatus,
                dateStarted,
                dateEnded,
                hoursPlayed,
                rating,
                achievementsSupported,
                achievementsCompleted,
                achievementsTotal,
                notes,
            },
            })
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

                <p className="mt-2 text-text-secondary">
                    Add a  new game to your library and create your first playthrough.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-lg border border-border bg-surface p-4 md:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-semibold">
                            1
                        </div>

                        <div>
                            <h2 className="font-semibold">
                            Game Details
                            </h2>

                            <p className="text-sm text-text-secondary">
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
                                    className="flex w-full items-center gap-3 rounded-md border border-border p-3 text-left transition hover:bg-surface-light"
                                >
                                    {game.image ? (
                                    <img
                                        src={game.image}
                                        alt={`${game.name} cover`}
                                        className="h-16 w-12 rounded-md object-cover"
                                    />
                                    ) : (
                                    <div className="h-16 w-12 rounded-md bg-surface-light" />
                                    )}

                                    <div className="min-w-0 flex-1">
                                    <p className="font-medium">
                                        {game.name}
                                    </p>

                                    <p className="text-sm text-text-secondary">
                                        {game.released || "Release date unavailable"}
                                    </p>

                                    <p className="mt-1 text-sm text-text-secondary">
                                        {game.platforms?.join(", ")}
                                    </p>
                                    </div>
                                </button>
                                ))}
                            </div>
                            )}
                        
                        {selectedGame && (
                            <div className="mt-4 flex items-center gap-3 rounded-md border border-primary p-3">
                                {selectedGame.image && (
                                    <img
                                        src={selectedGame.image}
                                        alt={`${selectedGame.name} cover`}
                                        className="h-20 w-14 shrink-0 rounded-md object-cover"
                                    />
                                )}

                                <div className="min-w-0">
                                    <p className="font-medium">
                                        {selectedGame.name}
                                    </p>

                                    <p className="text-sm text-text-secondary">
                                        {selectedGame.released}
                                    </p>
                                </div>
                            </div>
                        )}
                    
                        <div className="mt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="platform">
                                    Platform <span className="text-red-500">*</span>
                                </Label>

                                <select
                                    id="platform"
                                    value={platform}
                                    onChange={(event) => setPlatform(event.target.value)}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2"
                                    >
                                    <option value="">
                                        Select Platform
                                    </option>

                                    {selectedGame?.platforms?.map((gamePlatform: string) => (
                                        <option
                                        key={gamePlatform}
                                        value={gamePlatform}
                                        >
                                        {gamePlatform}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="genre">
                                Genre
                            </Label>

                            <select
                                id="genre"
                                value={genre}
                                onChange={(event) => setGenre(event.target.value)}
                                className="w-full rounded-md border border-border bg-background px-3 py-2"
                                >
                                <option value="">
                                    Select Genre
                                </option>

                                {selectedGame?.genres?.map((gameGenre: string) => (
                                    <option
                                    key={gameGenre}
                                    value={gameGenre}
                                    >
                                    {gameGenre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
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
                                        variant={
                                            playthroughStatus === statusOption
                                            ? "default"
                                            : "outline"
                                        }
                                        onClick={() => setPlaythroughStatus(statusOption)}
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

                                <p className="text-sm text-text-secondary">
                                This is when you're adding the game to your collection.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-lg border border-border bg-surface p-4 md:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-semibold">
                            2
                        </div>

                        <div>
                            <h2 className="font-semibold">
                            First Playthrough
                            </h2>

                            <p className="text-sm text-text-secondary">
                            Optionally create your first playthrough
                            </p>
                        </div>
                        </div>

                    <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="playthroughStatus">
                            Status
                            </Label>

                            <select
                            id="playthroughStatus"
                            value={playthroughStatus}
                            onChange={(event) => setPlaythroughStatus(event.target.value)}
                            className="w-full rounded-md border border-border bg-background px-3 py-2"
                            >
                            <option value="Playing">Playing</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Dropped">Dropped</option>
                            <option value="Backlog">Backlog</option>
                            </select>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                            <Label htmlFor="dateStarted">
                                Date Started
                            </Label>

                            <Input
                                id="dateStarted"
                                type="date"
                                value={dateStarted}
                                onChange={(event) => setDateStarted(event.target.value)}
                            />
                            </div>

                            <div className="space-y-2">
                            <Label htmlFor="dateEnded">
                                Date Ended
                            </Label>

                            <Input
                                id="dateEnded"
                                type="date"
                                value={dateEnded}
                                onChange={(event) => setDateEnded(event.target.value)}
                            />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hoursPlayed">
                            Hours Played
                            </Label>

                            <Input
                            id="hoursPlayed"
                            type="number"
                            min="0"
                            value={hoursPlayed}
                            onChange={(event) => setHoursPlayed(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Rating</Label>

                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(String(star))}
                                    className="text-2xl"
                                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                >
                                    {Number(rating) >= star ? "★" : "☆"}
                                </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-border pt-4">
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
                            <div className="divide-y divide-border border-t border-border">
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
                                <Label htmlFor="achievementsTotal">
                                    Achievements Total
                                </Label>

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
                            <Label htmlFor="notes">
                            Notes
                            </Label>

                            <textarea
                            id="notes"
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            placeholder="Add any notes about this playthrough..."
                            maxLength={500}
                            className="min-h-28 w-full rounded-md border border-border bg-background px-3 py-2"
                            />

                            <p className="text-right text-sm text-text-secondary">
                            {notes.length} / 500
                            </p>
                        </div>
                    </div>
                </section>
            </div>



            <div className="rounded-lg border border-border bg-surface p-4 md:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                        ✨
                        </div>

                        <div>
                        <h3 className="font-semibold">
                            Add and Track in One Step
                        </h3>

                        <p className="mt-1 text-sm text-text-secondary">
                            Save the game and your first playthrough together. You can always add
                            more playthroughs later from the game details page.
                        </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        className="w-full sm:w-auto"
                        onClick={handleSaveGame}
                        disabled={isSaving || !selectedGame}
                    >
                        {isSaving ? "Saving..." : "Save Game"}
                    </Button>
                </div>
        </div>
    )
}