import AppSidebar from "@/components/app-sidebar";
import Link from "next/link"
import { Menu } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background md:flex">
      <AppSidebar />

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-surface p-4 md:hidden">
          <Link href="/dashboard" className="text-xl font-bold">
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
                  <Link 
                    href="/dashboard"
                    className="block rounded-md px-3 py-2 text-text-secondary hover:bg-surface-light hover:text-text-primary"
                  >
                    Dashboard
                  </Link>

                  <Link 
                    href="/games"
                    className="block rounded-md px-3 py-2 text-text-secondary hover:bg-surface-light hover:text-text-primary"
                  >
                    My Games
                  </Link>

                  <Link 
                    href="/achievements"
                    className="block rounded-md px-3 py-2 text-text-secondary hover:bg-surface-light hover:text-text-primary"
                  >
                    Achievements
                  </Link>

                  <Link 
                    href="/profile"
                    className="block rounded-md px-3 py-2 text-text-secondary hover:bg-surface-light hover:text-text-primary"
                  >
                    Profile
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </header>
      
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}