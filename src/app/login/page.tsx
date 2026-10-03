"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    router.push("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      {/* Left Side */}
      <section className="bg-primary flex flex-1 items-center justify-center p-8">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold">GameTrack</h1>

          <p className="text-primary-foreground/80 mt-4 text-lg">
            Track your games, achievements, and playthroughs all in one place.
          </p>
        </div>
      </section>

      {/* Right Side */}
      <section className="bg-background flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold">Welcome Back</h2>

          <p className="text-text-secondary mt-2">
            Sign in to continue to GameTrack
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
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

            <p className="text-text-secondary text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}
