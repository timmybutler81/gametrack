import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        id: user.id,
      },
      include: {
        userPreferences: true,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 })
    }

    const metadata = user.user_metadata ?? {}

    const fullName =
      typeof metadata.full_name === "string"
        ? metadata.full_name.trim()
        : typeof metadata.name === "string"
          ? metadata.name.trim()
          : typeof metadata.display_name === "string"
            ? metadata.display_name.trim()
            : ""

    const nameParts = fullName.split(/\s+/).filter(Boolean)

    const authFirstName =
      typeof metadata.first_name === "string"
        ? metadata.first_name.trim()
        : typeof metadata.given_name === "string"
          ? metadata.given_name.trim()
          : (nameParts[0] ?? "")

    const authLastName =
      typeof metadata.last_name === "string"
        ? metadata.last_name.trim()
        : typeof metadata.family_name === "string"
          ? metadata.family_name.trim()
          : nameParts.length > 1
            ? nameParts.slice(1).join(" ")
            : ""

    return NextResponse.json({
      firstName: profile.firstName?.trim() || authFirstName,

      lastName: profile.lastName?.trim() || authLastName,

      username: profile.username?.trim() || "",

      email: user.email ?? "",

      preferences: {
        theme: profile.userPreferences?.theme ?? "dark",

        defaultPlatform: profile.userPreferences?.defaultPlatform ?? "PS5",

        emailNotifications: profile.userPreferences?.emailNotifications ?? true,

        achievementNotifications:
          profile.userPreferences?.achievementNotifications ?? true,

        privateProfile: profile.userPreferences?.privateProfile ?? false,

        showGamingActivity: profile.userPreferences?.showGamingActivity ?? true,
      },
    })
  } catch (error) {
    console.error("GET /api/settings failed:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load settings.",
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    const firstName =
      typeof body.firstName === "string" ? body.firstName.trim() : ""

    const lastName =
      typeof body.lastName === "string" ? body.lastName.trim() : ""

    const username =
      typeof body.username === "string" ? body.username.trim() : ""

    const theme = typeof body.theme === "string" ? body.theme : "dark"

    const defaultPlatform =
      typeof body.defaultPlatform === "string"
        ? body.defaultPlatform.trim()
        : ""

    const emailNotifications = Boolean(body.emailNotifications)

    const achievementNotifications = Boolean(body.achievementNotifications)

    const privateProfile = Boolean(body.privateProfile)

    const showGamingActivity = Boolean(body.showGamingActivity)

    const validThemes = ["dark", "light", "system"]

    if (!validThemes.includes(theme)) {
      return NextResponse.json({ error: "Invalid theme." }, { status: 400 })
    }

    if (username.length > 50) {
      return NextResponse.json(
        {
          error: "Username must be 50 characters or fewer.",
        },
        { status: 400 }
      )
    }

    if (username.length > 0) {
      const existingUsername = await prisma.profile.findFirst({
        where: {
          username,
          NOT: {
            id: user.id,
          },
        },
      })

      if (existingUsername) {
        return NextResponse.json(
          {
            error: "That username is already in use.",
          },
          { status: 409 }
        )
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const profile = await tx.profile.update({
        where: {
          id: user.id,
        },
        data: {
          firstName: firstName.length > 0 ? firstName : null,

          lastName: lastName.length > 0 ? lastName : null,

          username: username.length > 0 ? username : null,
        },
      })

      const preferences = await tx.userPreference.upsert({
        where: {
          userId: user.id,
        },
        update: {
          theme,

          defaultPlatform: defaultPlatform.length > 0 ? defaultPlatform : null,

          emailNotifications,
          achievementNotifications,
          privateProfile,
          showGamingActivity,
        },
        create: {
          userId: user.id,
          theme,

          defaultPlatform: defaultPlatform.length > 0 ? defaultPlatform : null,

          emailNotifications,
          achievementNotifications,
          privateProfile,
          showGamingActivity,
        },
      })

      return {
        profile,
        preferences,
      }
    })

    return NextResponse.json({
      message: "Settings saved successfully.",
      profile: {
        firstName: result.profile.firstName ?? "",

        lastName: result.profile.lastName ?? "",

        username: result.profile.username ?? "",
      },
      preferences: result.preferences,
    })
  } catch (error) {
    console.error("PATCH /api/settings failed:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to save settings.",
      },
      { status: 500 }
    )
  }
}
