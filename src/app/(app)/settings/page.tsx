"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useTheme } from "next-themes"

type SettingsResponse = {
  firstName: string
  lastName: string
  username: string
  email: string
  preferences: {
    theme: string
    defaultPlatform: string
    emailNotifications: boolean
    achievementNotifications: boolean
    privateProfile: boolean
    showGamingActivity: boolean
  }
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")

  const [selectedTheme, setSelectedTheme] = useState("dark")

  const [emailNotifications, setEmailNotifications] = useState(true)

  const [achievementNotifications, setAchievementNotifications] = useState(true)

  const [profilePrivate, setProfilePrivate] = useState(false)

  const [showActivity, setShowActivity] = useState(true)

  const [defaultPlatform, setDefaultPlatform] = useState("PS5")

  const [newPassword, setNewPassword] = useState("")

  const [confirmPassword, setConfirmPassword] = useState("")

  const [isLoading, setIsLoading] = useState(true)

  const [isSaving, setIsSaving] = useState(false)

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const [message, setMessage] = useState("")

  const [error, setError] = useState("")

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/settings")

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load settings.")
        }

        const settings = data as SettingsResponse

        setFirstName(settings.firstName)

        setLastName(settings.lastName)

        setEmail(settings.email)

        setUsername(settings.username)

        setSelectedTheme(settings.preferences.theme)

        setDefaultPlatform(settings.preferences.defaultPlatform || "PS5")

        setEmailNotifications(settings.preferences.emailNotifications)

        setAchievementNotifications(
          settings.preferences.achievementNotifications
        )

        setProfilePrivate(settings.preferences.privateProfile)

        setShowActivity(settings.preferences.showGamingActivity)
      } catch (loadError) {
        console.error("Failed to load settings:", loadError)

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load settings."
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const initials = useMemo(() => {
    const first = firstName.trim().charAt(0)

    const last = lastName.trim().charAt(0)

    const combined = `${first}${last}`.toUpperCase()

    if (combined) {
      return combined
    }

    if (username.trim()) {
      return username.trim().charAt(0).toUpperCase()
    }

    if (email.trim()) {
      return email.trim().charAt(0).toUpperCase()
    }

    return "G"
  }, [firstName, lastName, username, email])

  async function saveSettings() {
    setError("")
    setMessage("")
    setIsSaving(true)

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          theme: selectedTheme,
          defaultPlatform,
          emailNotifications,
          achievementNotifications,
          privateProfile: profilePrivate,
          showGamingActivity: showActivity,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save settings.")
      }

      setMessage("Settings saved successfully.")
    } catch (saveError) {
      console.error("Failed to save settings:", saveError)

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save settings."
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function updatePassword() {
    setError("")
    setMessage("")

    if (!newPassword) {
      setError("Enter a new password.")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.")
      return
    }

    setIsUpdatingPassword(true)

    try {
      const supabase = createClient()

      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (passwordError) {
        throw passwordError
      }

      setNewPassword("")
      setConfirmPassword("")

      setMessage("Password updated successfully.")
    } catch (passwordUpdateError) {
      console.error("Password update failed:", passwordUpdateError)

      setError(
        passwordUpdateError instanceof Error
          ? passwordUpdateError.message
          : "Failed to update password."
      )
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-text-secondary">Loading profile settings...</div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>

        <p className="text-text-secondary mt-1">
          Manage your account information and preferences.
        </p>
      </div>

      {/* Success / Error Messages */}
      {message && (
        <div className="rounded-md border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-500">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Profile Information */}
      <section className="border-border bg-surface rounded-xl border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>

          <p className="text-text-secondary mt-1 text-sm">
            Update your personal information.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 lg:items-start">
            <div className="bg-primary text-primary-foreground flex h-24 w-24 items-center justify-center rounded-full text-2xl font-semibold">
              {initials}
            </div>

            <p className="text-text-secondary text-xs">
              Profile image support can be added in a future version.
            </p>
          </div>

          {/* Profile Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </label>

              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="border-border bg-background w-full rounded-md border px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>

              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="border-border bg-background w-full rounded-md border px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                disabled
                readOnly
                className="border-border bg-background text-text-secondary w-full cursor-not-allowed rounded-md border px-3 py-2 opacity-70"
              />

              <p className="text-text-secondary text-xs">
                Email is managed by your authentication account.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                maxLength={50}
                className="border-border bg-background w-full rounded-md border px-3 py-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Password */}
      <section className="border-border bg-surface rounded-xl border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Change Password</h2>

          <p className="text-text-secondary mt-1 text-sm">
            Update the password used to sign in to your account.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </label>

            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="border-border bg-background w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="border-border bg-background w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <div className="border-border mt-8 flex justify-end border-t pt-6">
          <button
            type="button"
            onClick={updatePassword}
            disabled={isUpdatingPassword}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdatingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </section>

      {/* Preferences */}
      <section className="border-border bg-surface rounded-xl border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Preferences</h2>

          <p className="text-text-secondary mt-1 text-sm">
            Customize your GameTrack experience.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* General Preferences */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>

              <select
                value={theme ?? selectedTheme}
                onChange={(event) => {
                  const newTheme = event.target.value

                  setSelectedTheme(newTheme)
                  setTheme(newTheme)
                }}
                className="border-border bg-background w-full rounded-md border px-3 py-2"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>

              <p className="text-text-secondary text-xs">
                Theme preference is saved to your profile.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Default Platform</label>

              <select
                value={defaultPlatform}
                onChange={(event) => setDefaultPlatform(event.target.value)}
                className="border-border bg-background w-full rounded-md border px-3 py-2"
              >
                <option value="PS5">PS5</option>

                <option value="PC">PC</option>

                <option value="Xbox Series X|S">Xbox Series X|S</option>

                <option value="Nintendo Switch">Nintendo Switch</option>
              </select>
            </div>
          </div>

          {/* Notification / Privacy Preferences */}
          <div className="space-y-6">
            <PreferenceToggle
              label="Email Notifications"
              description="Receive important GameTrack updates by email."
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
            />

            <PreferenceToggle
              label="Achievement Notifications"
              description="Get notified when achievement milestones are reached."
              checked={achievementNotifications}
              onChange={() =>
                setAchievementNotifications(!achievementNotifications)
              }
            />

            <PreferenceToggle
              label="Private Profile"
              description="Limit who can view your profile and game library."
              checked={profilePrivate}
              onChange={() => setProfilePrivate(!profilePrivate)}
            />

            <PreferenceToggle
              label="Show Gaming Activity"
              description="Allow recent gaming activity to appear on your profile."
              checked={showActivity}
              onChange={() => setShowActivity(!showActivity)}
            />
          </div>
        </div>

        <div className="border-border mt-8 flex justify-end border-t pt-6">
          <button
            type="button"
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </section>
    </div>
  )
}

function PreferenceToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium">{label}</p>

        <p className="text-text-secondary text-sm">{description}</p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-primary" : "bg-background"
        }`}
        aria-label={`Toggle ${label.toLowerCase()}`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "right-1" : "left-1"
          }`}
        />
      </button>
    </div>
  )
}
