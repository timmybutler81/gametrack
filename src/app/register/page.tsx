"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  function handleCreateAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (password !== confirmPassword) {
      return
    }

    console.log({
      email,
      password,
      acceptedTerms,
    })

    // Temporary frontend-only behavior
    router.push("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      {/* Left Side */}
      <section className="bg-primary flex flex-1 items-center justify-center p-8">
        <div className="max-w-md">
          <h1 className="text-primary-foreground text-4xl font-bold">
            GameTrack
          </h1>

          <p className="text-primary-foreground/80 mt-4 text-lg">
            Start tracking your gaming journey today.
          </p>

          <p className="text-primary-foreground/70 mt-2">
            It&apos;s free and easy!
          </p>
        </div>
      </section>

      {/* Right Side */}
      <section className="bg-background flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold">Create Account</h2>

          <p className="text-text-secondary mt-2">Join GameTrack today</p>

          <form className="mt-8 space-y-4" onSubmit={handleCreateAccount}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>

              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            <label className="text-text-secondary flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-1"
              />

              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>

            <Button type="submit" className="w-full" disabled={!acceptedTerms}>
              Create Account
            </Button>

            <div className="flex items-center gap-3 py-2">
              <div className="bg-border h-px flex-1" />

              <span className="text-text-secondary text-xs">or</span>

              <div className="bg-border h-px flex-1" />
            </div>

            <p className="text-text-secondary text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}
