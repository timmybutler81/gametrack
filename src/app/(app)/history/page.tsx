"use client"

import { useState } from "react"

const playHistory = [
  {
    game: "Elden Ring",
    platform: "PS5",
    genre: "Action RPG",
    activity: "Played 4 hours",
    date: "Sep 26, 2026",
  },
  {
    game: "Final Fantasy VII Rebirth",
    platform: "PS5",
    genre: "RPG",
    activity: "Played 3 hours",
    date: "Sep 24, 2026",
  },
  {
    game: "The Witcher 3",
    platform: "PC",
    genre: "RPG",
    activity: "Completed playthrough",
    date: "Sep 21, 2026",
  },
  {
    game: "Baldur's Gate 3",
    platform: "PC",
    genre: "RPG",
    activity: "Played 2 hours",
    date: "Sep 18, 2026",
  },
]

const monthlyPlayTime = [
  { label: "May", value: 42 },
  { label: "Jun", value: 58 },
  { label: "Jul", value: 36 },
  { label: "Aug", value: 64 },
  { label: "Sep", value: 30 },
]

const weeklyPlayTime = [
  { label: "Week 1", value: 8 },
  { label: "Week 2", value: 14 },
  { label: "Week 3", value: 6 },
  { label: "Week 4", value: 11 },
]

const dateRangeStats = {
  "Last 30 Days": {
    totalPlayTime: 30,
    gamesPlayed: 4,
    gamesCompleted: 1,
    averageRating: 4.7,
  },
  "Last 90 Days": {
    totalPlayTime: 94,
    gamesPlayed: 7,
    gamesCompleted: 2,
    averageRating: 4.6,
  },
  "This Year": {
    totalPlayTime: 230,
    gamesPlayed: 12,
    gamesCompleted: 4,
    averageRating: 4.6,
  },
  "All Time": {
    totalPlayTime: 412,
    gamesPlayed: 24,
    gamesCompleted: 8,
    averageRating: 4.5,
  },
}

export default function HistoryPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days")
  const [groupBy, setGroupBy] = useState("Month")
  const [selectedGame, setSelectedGame] = useState("All Games")
  const [selectedGenre, setSelectedGenre] = useState("All Genres")

  const stats = dateRangeStats[dateRange as keyof typeof dateRangeStats]

  const filteredHistory = playHistory.filter((entry) => {
    const matchesGame =
      selectedGame === "All Games" || entry.game === selectedGame

    const matchesGenre =
      selectedGenre === "All Genres" || entry.genre === selectedGenre

    return matchesGame && matchesGenre
  })

  const chartData = groupBy === "Week" ? weeklyPlayTime : monthlyPlayTime

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
              <option>Elden Ring</option>
              <option>The Witcher 3</option>
              <option>Final Fantasy VII Rebirth</option>
              <option>Baldur&apos;s Gate 3</option>
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
              <option>Action RPG</option>
              <option>RPG</option>
            </select>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border-border bg-surface rounded-xl border p-5">
          <p className="text-text-secondary text-sm">Total Play Time</p>

          <p className="mt-2 text-3xl font-bold">{stats.totalPlayTime} hrs</p>
        </div>

        <div className="border-border bg-surface rounded-xl border p-5">
          <p className="text-text-secondary text-sm">Games Played</p>

          <p className="mt-2 text-3xl font-bold">{stats.gamesPlayed}</p>
        </div>

        <div className="border-border bg-surface rounded-xl border p-5">
          <p className="text-text-secondary text-sm">Games Completed</p>

          <p className="mt-2 text-3xl font-bold">{stats.gamesCompleted}</p>
        </div>

        <div className="border-border bg-surface rounded-xl border p-5">
          <p className="text-text-secondary text-sm">Average Rating</p>

          <p className="mt-2 text-3xl font-bold">{stats.averageRating}</p>
        </div>
      </section>

      {/* Main Analytics */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Play Time Over Time */}
        <div className="border-border bg-surface rounded-xl border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Play Time Over Time</h2>

            <p className="text-text-secondary mt-1 text-sm">
              Hours played during the selected period.
            </p>
          </div>

          <div className="flex h-72 items-end gap-4">
            {chartData.map((item) => (
              <div
                key={item.label}
                className="flex flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-text-secondary text-xs">
                  {item.value}h
                </span>

                <div
                  className="bg-primary w-full rounded-t-md"
                  style={{
                    height: `${item.value * 3}px`,
                  }}
                />

                <span className="text-text-secondary text-xs">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
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
            {[
              { label: "Playing", value: 6 },
              { label: "Backlog", value: 7 },
              { label: "Completed", value: 8 },
              { label: "On Hold", value: 2 },
              { label: "Dropped", value: 1 },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.label}</span>

                  <span className="text-text-secondary">{item.value}</span>
                </div>

                <div className="bg-background h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{
                      width: `${(item.value / 8) * 100}%`,
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

          <div className="space-y-5">
            {[
              { label: "RPG", hours: 92 },
              { label: "Action RPG", hours: 68 },
              { label: "Action Adventure", hours: 42 },
              { label: "Roguelike", hours: 18 },
              { label: "Simulation", hours: 10 },
            ].map((genre) => (
              <div key={genre.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{genre.label}</span>

                  <span className="text-text-secondary">{genre.hours} hrs</span>
                </div>

                <div className="bg-background h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{
                      width: `${(genre.hours / 92) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
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
              filteredHistory.map((entry) => (
                <div
                  key={`${entry.game}-${entry.date}`}
                  className="border-border bg-background flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{entry.game}</p>

                    <p className="text-text-secondary mt-1 text-sm">
                      {entry.platform} · {entry.activity}
                    </p>
                  </div>

                  <span className="text-text-secondary text-sm">
                    {entry.date}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
