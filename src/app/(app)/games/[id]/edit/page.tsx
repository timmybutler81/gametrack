"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  CalendarDays,
  ChevronRight,
  Gamepad2,
} from "lucide-react"

export default function EditGamePage() {
  const [title, setTitle] = useState("Elden Ring")
  const [platform, setPlatform] = useState("PS5")
  const [genre, setGenre] = useState("Action RPG")
  const [status, setStatus] = useState("Playing")
  const [dateAdded, setDateAdded] = useState("2025-05-10")

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/games"
          className="text-primary hover:underline"
        >
          Games
        </Link>

        <ChevronRight className="h-4 w-4 text-text-secondary" />

        <Link
          href="/games/1"
          className="text-primary hover:underline"
        >
          Elden Ring
        </Link>

        <ChevronRight className="h-4 w-4 text-text-secondary" />

        <span className="text-text-secondary">
          Edit
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img
          src="https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg"
          alt="Elden Ring cover"
          className="h-40 w-28 rounded-lg border border-border object-cover"
        />

        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Edit Game
          </h1>

          <p className="mt-2 text-text-secondary">
            Update the base game information.
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              PS5
            </div>

            <span>Action RPG</span>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Added: May 10, 2025
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-lg border border-border bg-surface p-4 md:p-6">
        <h2 className="text-lg font-semibold">
          Game Details
        </h2>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>

            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">
              Platform <span className="text-red-500">*</span>
            </Label>

            <select
              id="platform"
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2"
            >
              <option value="PS5">PlayStation 5</option>
              <option value="PS4">PlayStation 4</option>
              <option value="PC">PC</option>
              <option value="Xbox Series S/X">Xbox Series S/X</option>
              <option value="Xbox One">Xbox One</option>
              <option value="Switch">Switch</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">
              Genre
            </Label>

            <select
              id="genre"
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2"
            >
              <option value="Action RPG">Action RPG</option>
              <option value="RPG">RPG</option>
              <option value="Action Adventure">Action Adventure</option>
              <option value="Roguelike">Roguelike</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>
              Game Status <span className="text-red-500">*</span>
            </Label>

            <div className="flex flex-wrap gap-2">
              {["Playing", "Completed", "On Hold", "Dropped", "Backlog"].map(
                (statusOption) => (
                  <Button
                    key={statusOption}
                    type="button"
                    variant={status === statusOption ? "default" : "outline"}
                    onClick={() => setStatus(statusOption)}
                  >
                    {statusOption}
                  </Button>
                )
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateAdded">
              Date Added <span className="text-red-500">*</span>
            </Label>

            <Input
              id="dateAdded"
              type="date"
              value={dateAdded}
              onChange={(event) => setDateAdded(event.target.value)}
              className="date-input"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Link href="/games/1">
              Cancel
            </Link>
          </Button>

          <Button
            type="button"
            className="w-full sm:w-auto"
          >
            Update Game
          </Button>
        </div>
      </section>

    </div>
  )
}