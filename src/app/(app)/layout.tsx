import AppSidebar from "@/components/app-sidebar"

import { Bell, Moon } from "lucide-react"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-background min-h-screen md:flex">
      <AppSidebar />

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
