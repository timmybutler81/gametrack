import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
    {/* Left Side */}
      <section className="flex flex-1 items-center justify-center bg-primary p-8">
        <div className="max-w-md">
            <h1 className="text-4xl font-bold">
                GameTrack
            </h1>

            <p className="mt-4 text-lg text-primary-foreground/80">
                Track your games, achievements, and playthroughs all in one place.
            </p>
        </div>
      </section>

    {/* Right Side */}
      <section className="flex flex-1 items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold">
                Welcome Back
            </h2>

            <p className="mt-2 text-text-secondary">
                Sign in to continue to GameTrack
            </p>

            <form className="mt-8 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                    />                
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                    />                
                </div>

                <Button type="submit" className="w-full">
                    Sign In
                </Button>
            </form>
        </div>
      </section>
    </main>
  )
}