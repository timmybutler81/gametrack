import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const recentlyPlayed = [
  {
    title: "Final Fantasy XIV",
    platform: "PlayStation 5",
    progress: "In Progress",
    hoursPlayed: 80,
  },
  {
    title: "Stardew Valley",
    platform: "PC",
    progress: "Completed",
    hoursPlayed: 120,
  },
  {
    title: "Octopath Traveler II",
    platform: "PlayStation 5",
    progress: "In Progress",
    hoursPlayed: 50,
  },

]

export default function DashboardPage() {
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-text-secondary">
          Here&apos;s an overview of your gaming activity.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-text-secondary">
                Total Games
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">
                12
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-text-secondary">
                Completed Games
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">
                4
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-text-secondary">
                Achievements Earned
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">
                87
              </p>
            </CardContent>
          </Card>

          <div className="mt-10">
            <h2 className="text-2xl font-bold tracking-tight">
              Recently Played
            </h2>
          
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {recentlyPlayed.map((game) => (
              <Card key={game.title}>
                <CardHeader>
                  <CardTitle>
                    {game.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <p className="text-sm text-text-secondary">
                    {game.platform}
                  </p>

                  <p className="text-sm text-text-secondary">
                    {game.progress}
                  </p>

                  <p className="text-sm text-text-secondary">
                    {game.hoursPlayed} hours played
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold tracking-tight">
              Achievement Progress
            </h2>

            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">
                    Overall Completion
                  </span>

                  <span className="font-medium">
                    68%
                  </span>
                </div>

              <div className="mt-3 h-2 w-full rounded-full bg-surface-light">
                <div className="h-2 w-[68%] rounded-full bg-primary" />
              </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}