import {
  CirclePlus,
  Gamepad2,
  History,
  LayoutDashboard,
  Settings,
} from "lucide-react"

export const navItems = [
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
    label: "History & Analytics",
    icon: History,
  },
  {
    href: "/settings",
    label: "Profile Settings",
    icon: Settings,
  },
]
