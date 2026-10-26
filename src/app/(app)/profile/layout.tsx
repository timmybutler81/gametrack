import type { ReactNode } from "react"

export const metadata = {
  title: "Profile",
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
