import type { ReactNode } from "react"

export const metadata = {
  title: "Games",
}

export default function GamesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
