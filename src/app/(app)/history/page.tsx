export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">History & Analytics</h1>

        <p className="text-text-secondary mt-1">
          Review your gaming activity and progress over time.
        </p>
      </div>

      <section className="border-border bg-surface rounded-xl border p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>

            <select className="border-border bg-background w-full rounded-md border px-3 py-2">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Group By</label>

            <select className="border-border bg-background w-full rounded-md border px-3 py-2">
              <option>Month</option>
              <option>Week</option>
              <option>Game</option>
              <option>Genre</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Game</label>

            <select className="border-border bg-background w-full rounded-md border px-3 py-2">
              <option>All Games</option>
              <option>Elden Ring</option>
              <option>The Witcher 3</option>
              <option>Final Fantasy VII Rebirth</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Genre</label>

            <select className="border-border bg-background w-full rounded-md border px-3 py-2">
              <option>All Genres</option>
              <option>Action RPG</option>
              <option>RPG</option>
              <option>Action Adventure</option>
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border-border bg-surface rounded-xl border p-5">
          <p className="text-text-secondary text-sm">Total Play Time</p>

          <p className="mt-2 text-3xl font-bold">230 hrs</p>
        </div>

        <div className="border-border bg-surface rounded-xl border p-5">
          <p className="text-text-secondary text-sm">Games Played</p>

          <p className="mt-2 text-3xl font-bold">12</p>
        </div>

        <div className="border-border bg-surface rounded-xl border p-5">
          <p className="text-text-secondary text-sm">Games Completed</p>

          <p className="mt-2 text-3xl font-bold">4</p>
        </div>

        <div className="border-border bg-surface rounded-xl border p-5">
          <p className="text-text-secondary text-sm">Average Rating</p>

          <p className="mt-2 text-3xl font-bold">4.6</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="border-border bg-surface rounded-xl border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Play Time Over Time</h2>

            <p className="text-text-secondary mt-1 text-sm">
              Hours played during the selected period.
            </p>
          </div>

          <div className="flex h-72 items-end gap-4">
            {[
              { label: "May", value: 42 },
              { label: "Jun", value: 58 },
              { label: "Jul", value: 36 },
              { label: "Aug", value: 64 },
              { label: "Sep", value: 30 },
            ].map((item) => (
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
            {[
              {
                game: "Elden Ring",
                platform: "PS5",
                activity: "Played 4 hours",
                date: "Sep 26, 2026",
              },
              {
                game: "Final Fantasy VII Rebirth",
                platform: "PS5",
                activity: "Played 3 hours",
                date: "Sep 24, 2026",
              },
              {
                game: "The Witcher 3",
                platform: "PC",
                activity: "Completed playthrough",
                date: "Sep 21, 2026",
              },
              {
                game: "Baldur's Gate 3",
                platform: "PC",
                activity: "Played 2 hours",
                date: "Sep 18, 2026",
              },
            ].map((entry) => (
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
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
