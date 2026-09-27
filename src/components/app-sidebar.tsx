"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { LogOut, Menu } from "lucide-react"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { navItems } from "@/lib/navigation"

export default function AppSidebar() {
  const pathname = usePathname()

  function isNavItemActive(href: string) {
    if (href === "/games") {
      return pathname === "/games" || /^\/games\/\d+/.test(pathname)
    }

    return pathname.startsWith(href)
  }

  const [mobileMenueOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="border-border bg-surface hidden min-h-screen w-64 border-r md:flex md:flex-col">
        <div className="flex flex-1 flex-col p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">GameTrack</h1>

            <nav className="mt-8 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = isNavItemActive(item.href)

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
            </nav>
          </div>

          <div className="mt-auto space-y-4">
            <Link
              href="/"
              className="text-text-secondary hover:bg-surface-light hover:text-text-primary flex w-full items-center gap-3 rounded-md px-3 py-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Link>

            <div className="border-border bg-surface-light rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full font-semibold">
                  TB
                </div>

                <div className="min-w-0">
                  <p className="font-medium">Tim Butler</p>

                  <p className="text-text-secondary truncate text-sm">
                    tim@butler.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="border-border bg-surface flex items-center justify-between border-b p-4 md:hidden">
        <Link href="/dashboard" className="text-xl font-bold">
          GameTrack
        </Link>

        <Sheet open={mobileMenueOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger
            className="hover:bg-surface-light rounded-md p-2"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>

          <SheetContent side="left">
            <div className="flex h-full flex-col">
              <div>
                <h2 className="text-xl font-bold">GameTrack</h2>

                <nav className="mt-8 space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = isNavItemActive(item.href)

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
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
                </nav>
              </div>

              <div className="mt-auto space-y-4 pb-6">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-secondary hover:bg-surface-light hover:text-text-primary flex w-full items-center gap-3 rounded-md px-3 py-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>

                <div className="border-border bg-surface-light rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full font-semibold">
                      TB
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium">Tim Butler</p>

                      <p className="text-text-secondary truncate text-sm">
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
    </>
  )
}
