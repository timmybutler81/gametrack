"use client"

"use client"

import { useState } from "react"

export default function SettingsPage() {
  const [firstName, setFirstName] = useState("Tim")
  const [lastName, setLastName] = useState("Butler")
  const [email, setEmail] = useState("tim@butler.com")
  const [username, setUsername] = useState("timmybutler81")
  const [theme, setTheme] = useState("dark")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [achievementNotifications, setAchievementNotifications] = useState(true)
  const [profilePrivate, setProfilePrivate] = useState(false)
  const [showActivity, setShowActivity] = useState(true)
  const [defaultPlatform, setDefaultPlatform] = useState("PS5")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>

        <p className="text-text-secondary mt-1">
          Manage your account information and preferences.
        </p>
      </div>

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
              TB
            </div>

            <button
              type="button"
              className="text-primary text-sm hover:underline"
            >
              Change Photo
            </button>
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
                onChange={(event) => setEmail(event.target.value)}
                className="border-border bg-background w-full rounded-md border px-3 py-2"
              />
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
                className="border-border bg-background w-full rounded-md border px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="border-border mt-8 flex justify-end border-t pt-6">
          <button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium"
          >
            Save Changes
          </button>
        </div>
      </section>

      <section className="border-border bg-surface rounded-xl border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Change Password</h2>

          <p className="text-text-secondary mt-1 text-sm">
            Update the password used to sign in to your account.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="text-sm font-medium">
              Current Password
            </label>

            <input
              id="currentPassword"
              type="password"
              className="border-border bg-background w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </label>

            <input
              id="newPassword"
              type="password"
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
              className="border-border bg-background w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <div className="border-border mt-8 flex justify-end border-t pt-6">
          <button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium"
          >
            Update Password
          </button>
        </div>
      </section>

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
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
                className="border-border bg-background w-full rounded-md border px-3 py-2"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
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
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Email Notifications</p>

                <p className="text-text-secondary text-sm">
                  Receive important GameTrack updates by email.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  emailNotifications ? "bg-primary" : "bg-background"
                }`}
                aria-label="Toggle email notifications"
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    emailNotifications ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Achievement Notifications</p>

                <p className="text-text-secondary text-sm">
                  Get notified when achievement milestones are reached.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAchievementNotifications(!achievementNotifications)
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  achievementNotifications ? "bg-primary" : "bg-background"
                }`}
                aria-label="Toggle achievement notifications"
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    achievementNotifications ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Private Profile</p>

                <p className="text-text-secondary text-sm">
                  Limit who can view your profile and game library.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setProfilePrivate(!profilePrivate)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  profilePrivate ? "bg-primary" : "bg-background"
                }`}
                aria-label="Toggle private profile"
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    profilePrivate ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Show Gaming Activity</p>

                <p className="text-text-secondary text-sm">
                  Allow recent gaming activity to appear on your profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowActivity(!showActivity)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  showActivity ? "bg-primary" : "bg-background"
                }`}
                aria-label="Toggle gaming activity"
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    showActivity ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="border-border mt-8 flex justify-end border-t pt-6">
          <button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium"
          >
            Save Preferences
          </button>
        </div>
      </section>
    </div>
  )
}
