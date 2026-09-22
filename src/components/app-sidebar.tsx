"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  LayoutDashboard,
  Gamepad2,
  CirclePlus,
  History,
  Trophy,
  ChartNoAxesColumnIncreasing,
  User,
  Settings,
  LogOut,
} from "lucide-react"

const navItems = [
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

export default function AppSidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden min-h-screen w-64 border-r border-border bg-surface md:flex md:flex-col">
            <div className="flex flex-1 flex-col p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                    GameTrack
                    </h1>

                    <nav className="mt-8 space-y-2">
                    {<nav className="mt-8 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon

                        const isActive =
                        item.href === "/games"
                            ? pathname === "/games"
                            : pathname.startsWith(item.href)

                        return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 ${
                            isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-text-secondary hover:bg-surface-light hover:text-text-primary"
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </Link>
                        )
                    })}
                </nav>}
                    </nav>
                </div>

                <div className="mt-auto space-y-4">
                    {<button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-text-secondary hover:bg-surface-light hover:text-text-primary"
                        >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </button>}
                    {<div className="rounded-lg border border-border bg-surface-light p-4">
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
                    </div>}
                </div>
            </div>
        </aside>
    )
}