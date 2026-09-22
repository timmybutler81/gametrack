import AppSidebar from "@/components/app-sidebar"
import Link from "next/link"

import {
  Bell,
  ChartNoAxesColumnIncreasing,
  CirclePlus,
  Gamepad2,
  History,
  LayoutDashboard,
  Menu,
  Moon,
  Settings,
  Trophy,
  User,
  LogOut,
} from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const mobileNavItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/games",
    label: "Games",
    icon: Gamepad2,
  },
  {
    href: "/games/new",
    label: "Add Game",
    icon: CirclePlus,
  },
  {
    href: "/history",
    label: "History",
    icon: History,
  },
  {
    href: "/achievements",
    label: "Achievements",
    icon: Trophy,
  },
  {
    href: "/reports",
    label: "Reports",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
]

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-background md:flex">
      <AppSidebar />

      <div className="min-w-0 flex-1">

        {/* Mobile Header */}
        <header className="flex items-center justify-between border-b border-border bg-surface p-4 md:hidden">
          <Link
            href="/dashboard"
            className="text-xl font-bold"
          >
            GameTrack
          </Link>

          <Sheet>
            <SheetTrigger>
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent side="left">
              <div className="mt-8">
                <h2 className="text-xl font-bold">
                  GameTrack
                </h2>

                <nav className="mt-8 space-y-2">
                  {mobileNavItems.map((item) => {
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-text-secondary hover:bg-surface-light hover:text-text-primary"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>

                <div className="mt-8 space-y-4">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-text-secondary hover:bg-surface-light hover:text-text-primary"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>

                  <div className="rounded-lg border border-border bg-surface-light p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                        TB
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium">
                          Tim Butler
                        </p>

                        <p className="truncate text-sm text-text-secondary">
                          tim@butler.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Desktop Header */}
        <header className="hidden items-center justify-between border-b border-border bg-surface px-6 py-4 md:flex">
          <div className="w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search games..."
              className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary"
            />
          </div>

          <div className="ml-4 flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-border p-2 hover:bg-surface-light"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="rounded-md border border-border p-2 hover:bg-surface-light"
              aria-label="Toggle theme"
            >
              <Moon className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}