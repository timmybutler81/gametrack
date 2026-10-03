import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const recentlyPlayed = [
  {
    title: "Elden Ring",
    platform: "PS5",
    progress: "Playing",
    hoursPlayed: 42,
  },
  {
    title: "Final Fantasy VII Rebirth",
    platform: "PS5",
    progress: "Playing",
    hoursPlayed: 35,
  },
  {
    title: "The Witcher 3: Wild Hunt",
    platform: "PC",
    progress: "Completed",
    hoursPlayed: 103,
  },
]

const libraryOverview = [
  {
    label: "Playing",
    value: 6,
  },
  {
    label: "Backlog",
    value: 7,
  },
  {
    label: "Completed",
    value: 8,
  },
  {
    label: "On Hold",
    value: 2,
  },
  {
    label: "Dropped",
    value: 1,
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <p className="text-text-secondary mt-2">
          Here&apos;s an overview of your gaming activity.
        </p>
      </div>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-text-secondary text-sm font-medium">
              Total Games
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">24</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-text-secondary text-sm font-medium">
              Completed Games
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">8</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-text-secondary text-sm font-medium">
              Total Hours
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">230</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-text-secondary text-sm font-medium">
              Achievements Earned
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">87</p>
          </CardContent>
        </Card>
      </section>

      {/* Recently Played */}
      <section className="mt-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recently Played</h2>

          <p className="text-text-secondary mt-1 text-sm">
            Games you&apos;ve been playing recently.
          </p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {recentlyPlayed.map((game) => (
            <Card key={game.title}>
              <CardHeader>
                <CardTitle>{game.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-text-secondary text-sm">{game.platform}</p>

                <p className="text-text-secondary text-sm">{game.progress}</p>

                <p className="text-text-secondary text-sm">
                  {game.hoursPlayed} hours played
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Achievement Progress */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold tracking-tight">
          Achievement Progress
        </h2>

        <p className="text-text-secondary mt-1 text-sm">
          Overall achievement completion across your tracked games.
        </p>

        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Overall Completion</span>

              <span className="font-medium">68%</span>
            </div>

            <div className="bg-background mt-3 h-3 w-full overflow-hidden rounded-full">
              <div className="bg-primary h-full w-[68%] rounded-full" />
            </div>

            <div className="text-text-secondary mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span>87 earned</span>

              <span>128 total</span>

              <span>41 remaining</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Library Overview */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold tracking-tight">Library Overview</h2>

        <p className="text-text-secondary mt-1 text-sm">
          A quick look at your current game library.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {libraryOverview.map((item) => (
            <Card key={item.label}>
              <CardContent className="pt-6">
                <p className="text-text-secondary text-sm">{item.label}</p>

                <p className="mt-2 text-2xl font-bold">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
