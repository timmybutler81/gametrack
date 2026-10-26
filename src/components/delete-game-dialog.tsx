"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type DeleteGameDialogProps = {
  gameId: string
  gameTitle: string
}

export default function DeleteGameDialog({
  gameId,
  gameTitle,
}: DeleteGameDialogProps) {
  const router = useRouter()

  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error ?? "Failed to delete game")
      }

      router.push("/games")
      router.refresh()
    } catch (error) {
      console.error("Delete game failed:", error)

      setError(
        error instanceof Error ? error.message : "Failed to delete game."
      )

      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-destructive text-destructive-foreground hover:bg-destructive/90 inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium whitespace-nowrap">
        <Trash2 className="h-4 w-4" />
        Delete Game
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {gameTitle}?</AlertDialogTitle>

          <AlertDialogDescription>
            This will remove the game and its playthrough history from your
            library. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={(event) => {
              event.preventDefault()
              handleDelete()
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Game"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
