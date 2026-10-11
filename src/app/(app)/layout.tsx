import AppSidebar from "@/components/app-sidebar"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

import { Bell, Moon } from "lucide-react"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
  })

  const authDisplayName =
    user.user_metadata?.full_name ?? user.user_metadata?.name

  const displayName: string =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : (profile?.username ??
        authDisplayName ??
        user.email?.split("@")[0] ??
        "GameTrack User")

  const email = user.email ?? ""

  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="bg-background min-h-screen md:flex">
      <AppSidebar name={displayName} email={email} initials={initials} />

      <div className="min-w-0 flex-1">
        {/* Desktop Header */}
        <header className="border-border bg-surface hidden items-center justify-between border-b px-6 py-4 md:flex">
          <div className="w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search games..."
              className="border-border bg-background focus:border-primary w-full rounded-md border px-4 py-2 text-sm transition outline-none"
            />
          </div>

          <div className="ml-4 flex items-center gap-2">
            <button
              type="button"
              className="border-border hover:bg-surface-light rounded-md border p-2"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="border-border hover:bg-surface-light rounded-md border p-2"
              aria-label="Toggle theme"
            >
              <Moon className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
