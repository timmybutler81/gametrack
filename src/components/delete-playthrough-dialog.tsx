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

type DeletePlaythroughDialogProps = {
  gameId: string
  playthroughId: string
  playthroughNumber: number
}

export default function DeletePlaythroughDialog({
  gameId,
  playthroughId,
  playthroughNumber,
}: DeletePlaythroughDialogProps) {
  const router = useRouter()

  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/games/${gameId}/playthroughs/${playthroughId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error ?? "Failed to delete playthrough")
      }

      router.push(`/games/${gameId}`)
      router.refresh()
    } catch (error) {
      console.error("Delete playthrough failed:", error)

      setError(
        error instanceof Error ? error.message : "Failed to delete playthrough."
      )

      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-destructive text-destructive-foreground hover:bg-destructive/90 inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium whitespace-nowrap">
        <Trash2 className="h-4 w-4" />
        Delete Playthrough
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Playthrough #{playthroughNumber}?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently remove this playthrough from your library.
            This action cannot be undone.
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
            {isDeleting ? "Deleting..." : "Delete Playthrough"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
