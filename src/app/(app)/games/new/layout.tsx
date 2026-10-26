import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: {
    absolute: "Add Game · GameTrack",
  },
}

export default function AddGameLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
