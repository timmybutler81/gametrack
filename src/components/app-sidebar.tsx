"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    LayoutDashboard,
    Gamepad2,
    Trophy,
    User,
} from "lucide-react"

export default function AppSidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden w-64 border-r border-border bg-surface md:block">
            <div className="p-8">
                <h1 className="text-2xl font-bold tracking-tight">
                    GameTrack
                </h1>

                <nav className="mt-8 space-y-2">
                    <Link
                       href="/dashboard"
                       className={`flex items-center gap-3 rounded-md px-3 py-2 ${
                        pathname === "/dashboard"
                            ? "bg-primary text-primary-foreground"
                            : "text-text-secondary hover:bg-surface-light hover:text-text-primary"
                      }`}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                       href="/games"
                       className={`flex items-center gap-3 rounded-md px-3 py-2 ${
                        pathname === "/games"
                            ? "bg-primary text-primary-foreground"
                            : "text-text-secondary hover:bg-surface-light hover:text-text-primary"
                      }`}
                    >
                        <Gamepad2 className="h-4 w-4" />
                        <span>My Games</span>
                    </Link>

                    <Link
                       href="/achievements"
                       className={`flex items-center gap-3 rounded-md px-3 py-2 ${
                        pathname === "/achievements"
                            ? "bg-primary text-primary-foreground"
                            : "text-text-secondary hover:bg-surface-light hover:text-text-primary"
                      }`}
                    >
                        <Trophy className="h-4 w-4" />
                        <span>Achievements</span>
                    </Link>

                    <Link
                       href="/profile"
                       className={`flex items-center gap-3 rounded-md px-3 py-2 ${
                        pathname === "/profile"
                            ? "bg-primary text-primary-foreground"
                            : "text-text-secondary hover:bg-surface-light hover:text-text-primary"
                      }`}
                    >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </nav>
            </div>
        </aside>
    )
}