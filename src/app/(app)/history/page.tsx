"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

type Playthrough = {
  id: string
  playthroughNumber: number
  platform: string
  status: string
  dateStarted: string | null
  dateEnded: string | null
  hoursPlayed: string | null
  rating: number | null
  achievementsSupported: boolean
  achievementsCompleted: number
  achievementsTotal: number
  notes: string | null
  createdAt: string
  updatedAt: string
}

type UserGame = {
  id: string
  genre: string | null
  status: string
  dateAdded: string
  game: {
    id: string
    title: string
  }
  platforms: {
    id: string
    platform: string
  }[]
  playthroughs: Playthrough[]
}

type HistoryEntry = {
  id: string
  userGameId: string
  game: string
  platform: string
  genre: string
  status: string
  hours: number
  rating: number | null
  date: Date
  dateStarted: string | null
  dateEnded: string | null
  playthroughNumber: number
}

function formatStatus(status: string) {
  if (status === "ON_HOLD") {
    return "On Hold"
  }

  return status.charAt(0) + status.slice(1).toLowerCase()
}

function getRangeStart(dateRange: string) {
  const now = new Date()

  if (dateRange === "Last 30 Days") {
    const start = new Date(now)
    start.setDate(start.getDate() - 30)
    return start
  }

  if (dateRange === "Last 90 Days") {
    const start = new Date(now)
    start.setDate(start.getDate() - 90)
    return start
  }

  if (dateRange === "This Year") {
    return new Date(now.getFullYear(), 0, 1)
  }

  return null
}

function getWeekStart(date: Date) {
  const result = new Date(date)
  const day = result.getDay()

  result.setDate(result.getDate() - day)
  result.setHours(0, 0, 0, 0)

  return result
}

export default function HistoryPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days")
  const [groupBy, setGroupBy] = useState("Month")
  const [selectedGame, setSelectedGame] = useState("All Games")
  const [selectedGenre, setSelectedGenre] = useState("All Genres")
  const [games, setGames] = useState<UserGame[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch("/api/history")

        if (!response.ok) {
          throw new Error("Failed to load history.")
        }

        const data = await response.json()
        setGames(data)
      } catch (loadError) {
        console.error("Failed to load history:", loadError)
        setError("Unable to load history and analytics.")
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [])

  const allHistory = useMemo<HistoryEntry[]>(() => {
    return games.flatMap((userGame) =>
      userGame.playthroughs.map((playthrough) => {
        const activityDate = new Date(
          playthrough.dateEnded ??
            playthrough.dateStarted ??
            playthrough.updatedAt
        )

        return {
          id: playthrough.id,
          userGameId: userGame.id,
          game: userGame.game.title,
          platform:
            playthrough.platform ??
            userGame.platforms[0]?.platform ??
            "Unknown",
          genre: userGame.genre ?? "Uncategorized",
          status: playthrough.status,
          hours: Number(playthrough.hoursPlayed ?? 0),
          rating: playthrough.rating,
          date: activityDate,
          dateStarted: playthrough.dateStarted,
          dateEnded: playthrough.dateEnded,
          playthroughNumber: playthrough.playthroughNumber,
        }
      })
    )
  }, [games])

  const rangeHistory = useMemo(() => {
    const start = getRangeStart(dateRange)

    if (!start) {
      return allHistory
    }

    return allHistory.filter((entry) => entry.date >= start)
  }, [allHistory, dateRange])

  const filteredHistory = useMemo(() => {
    return rangeHistory
      .filter((entry) => {
        const matchesGame =
          selectedGame === "All Games" || entry.game === selectedGame

        const matchesGenre =
          selectedGenre === "All Genres" || entry.genre === selectedGenre

        return matchesGame && matchesGenre
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [rangeHistory, selectedGame, selectedGenre])

  const gameOptions = useMemo(
    () =>
      [...games]
        .map((game) => game.game.title)
        .sort((a, b) => a.localeCompare(b)),
    [games]
  )

  const genreOptions = useMemo(
    () =>
      Array.from(
        new Set(
          games
            .map((game) => game.genre)
            .filter((genre): genre is string => Boolean(genre))
        )
      ).sort((a, b) => a.localeCompare(b)),
    [games]
  )

  const totalPlayTime = filteredHistory.reduce(
    (total, entry) => total + entry.hours,
    0
  )

  const gamesPlayed = new Set(filteredHistory.map((entry) => entry.userGameId))
    .size

  const gamesCompleted = new Set(
    filteredHistory
      .filter((entry) => entry.status === "COMPLETED")
      .map((entry) => entry.userGameId)
  ).size

  const ratings = filteredHistory
    .map((entry) => entry.rating)
    .filter((rating): rating is number => rating !== null)

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length
      : 0

  const statusData = [
    {
      label: "Playing",
      value: games.filter((game) => game.status === "PLAYING").length,
    },
    {
      label: "Backlog",
      value: games.filter((game) => game.status === "BACKLOG").length,
    },
    {
      label: "Completed",
      value: games.filter((game) => game.status === "COMPLETED").length,
    },
    {
      label: "On Hold",
      value: games.filter((game) => game.status === "ON_HOLD").length,
    },
    {
      label: "Dropped",
      value: games.filter((game) => game.status === "DROPPED").length,
    },
  ]

  const maxStatusValue = Math.max(...statusData.map((item) => item.value), 1)

  const genreHours = filteredHistory.reduce<Record<string, number>>(
    (result, entry) => {
      result[entry.genre] = (result[entry.genre] ?? 0) + entry.hours

      return result
    },
    {}
  )

  const topGenres = Object.entries(genreHours)
    .map(([label, hours]) => ({
      label,
      hours,
    }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5)

  const maxGenreHours = Math.max(...topGenres.map((genre) => genre.hours), 1)

  const chartData = useMemo(() => {
    const grouped = new Map<
      string,
      {
        label: string
        date: Date
        value: number
      }
    >()

    filteredHistory.forEach((entry) => {
      let groupDate: Date
      let key: string
      let label: string

      if (groupBy === "Week") {
        groupDate = getWeekStart(entry.date)

        key = groupDate.toISOString().slice(0, 10)

        label = groupDate.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      } else {
        groupDate = new Date(entry.date.getFullYear(), entry.date.getMonth(), 1)

        key = `${groupDate.getFullYear()}-${groupDate.getMonth()}`

        label = groupDate.toLocaleDateString(undefined, {
          month: "short",
          year: "2-digit",
        })
      }

      const existing = grouped.get(key)

      if (existing) {
        existing.value += entry.hours
      } else {
        grouped.set(key, {
          label,
          date: groupDate,
          value: entry.hours,
        })
      }
    })

    return Array.from(grouped.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-8)
  }, [filteredHistory, groupBy])

  const maxChartValue = Math.max(...chartData.map((item) => item.value), 1)

  if (isLoading) {
    return (
      <div className="text-text-secondary">
        Loading history and analytics...
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-border bg-surface rounded-xl border p-6">
        <h1 className="text-2xl font-bold">History & Analytics</h1>

        <p className="mt-4 text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">History & Analytics</h1>

        <p className="text-text-secondary mt-1">
          Review your gaming activity and progress over time.
        </p>
      </div>

      {/* Filters */}
      <section className="border-border bg-surface rounded-xl border p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>

            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              className="border-border bg-background w-full rounded-md border px-3 py-2"
            >
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Group By</label>

            <select
              value={groupBy}
              onChange={(event) => setGroupBy(event.target.value)}
              className="border-border bg-background w-full rounded-md border px-3 py-2"
            >
              <option>Month</option>
              <option>Week</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Game</label>

            <select
              value={selectedGame}
              onChange={(event) => setSelectedGame(event.target.value)}
              className="border-border bg-background w-full rounded-md border px-3 py-2"
            >
              <option>All Games</option>

              {gameOptions.map((game) => (
                <option key={game}>{game}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Genre</label>

            <select
              value={selectedGenre}
              onChange={(event) => setSelectedGenre(event.target.value)}
              className="border-border bg-background w-full rounded-md border px-3 py-2"
            >
              <option>All Genres</option>

              {genreOptions.map((genre) => (
                <option key={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border-border bg-surface rounded-xl border p-5">
          <p className="text-text-secondary text-sm">Total Play Time</p>

          <p className="mt-2 text-3xl font-bold">
            {Math.round(totalPlayTime * 10) / 10} hrs
          </p>
        </div>

        <div className="border-border bg-surface rounded-xl border p-5">
          <p className="text-text-secondary text-sm">Games Played</p>

          <p className="mt-2 text-3xl font-bold">{gamesPlayed}</p>
        </div>

        <div className="border-border bg-surface rounded-xl border p-5">
          <p className="text-text-secondary text-sm">Games Completed</p>

          <p className="mt-2 text-3xl font-bold">{gamesCompleted}</p>
        </div>

        <div className="border-border bg-surface rounded-xl border p-5">
          <p className="text-text-secondary text-sm">Average Rating</p>

          <p className="mt-2 text-3xl font-bold">
            {averageRating > 0 ? averageRating.toFixed(1) : "—"}
          </p>
        </div>
      </section>

      {/* Main Analytics */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Play Time */}
        <div className="border-border bg-surface rounded-xl border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Play Time Over Time</h2>

            <p className="text-text-secondary mt-1 text-sm">
              Hours played during the selected period.
            </p>
          </div>

          {chartData.length === 0 ? (
            <div className="text-text-secondary flex h-72 items-center justify-center text-sm">
              No playthrough data for the selected filters.
            </div>
          ) : (
            <div className="flex h-72 items-end gap-3">
              {chartData.map((item) => (
                <div
                  key={`${item.label}-${item.date.toISOString()}`}
                  className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-text-secondary text-xs">
                    {Math.round(item.value * 10) / 10}h
                  </span>

                  <div
                    className="bg-primary min-h-1 w-full rounded-t-md"
                    style={{
                      height: `${Math.max(
                        (item.value / maxChartValue) * 200,
                        4
                      )}px`,
                    }}
                  />

                  <span className="text-text-secondary text-center text-xs">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Games by Status */}
        <div className="border-border bg-surface rounded-xl border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Games by Status</h2>

            <p className="text-text-secondary mt-1 text-sm">
              Current distribution of your game library.
            </p>
          </div>

          <div className="space-y-5">
            {statusData.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <Link
                    href={`/games?status=${encodeURIComponent(item.label)}`}
                    className="hover:text-primary hover:underline"
                  >
                    {item.label}
                  </Link>

                  <span className="text-text-secondary">{item.value}</span>
                </div>

                <div className="bg-background h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{
                      width: `${(item.value / maxStatusValue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Analytics */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Top Genres */}
        <div className="border-border bg-surface rounded-xl border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Top Genres</h2>

            <p className="text-text-secondary mt-1 text-sm">
              Your most played genres.
            </p>
          </div>

          {topGenres.length === 0 ? (
            <p className="text-text-secondary text-sm">
              No genre play data for the selected filters.
            </p>
          ) : (
            <div className="space-y-5">
              {topGenres.map((genre) => (
                <div key={genre.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{genre.label}</span>

                    <span className="text-text-secondary">
                      {Math.round(genre.hours * 10) / 10} hrs
                    </span>
                  </div>

                  <div className="bg-background h-2 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{
                        width: `${(genre.hours / maxGenreHours) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Play History */}
        <div className="border-border bg-surface rounded-xl border p-6 xl:col-span-2">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Recent Play History</h2>

            <p className="text-text-secondary mt-1 text-sm">
              Your most recent gaming activity.
            </p>
          </div>

          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="border-border bg-background text-text-secondary rounded-lg border p-6 text-center text-sm">
                No play history matches the selected filters.
              </div>
            ) : (
              filteredHistory.slice(0, 10).map((entry) => (
                <Link
                  key={entry.id}
                  href={`/games/${entry.userGameId}`}
                  className="border-border bg-background hover:border-primary flex flex-col gap-3 rounded-lg border p-4 transition sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{entry.game}</p>

                    <p className="text-text-secondary mt-1 text-sm">
                      {entry.platform} · Playthrough #{entry.playthroughNumber}{" "}
                      · {formatStatus(entry.status)}
                    </p>

                    <p className="text-text-secondary mt-1 text-sm">
                      {entry.hours} hours played
                    </p>
                  </div>

                  <span className="text-text-secondary text-sm">
                    {entry.date.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
