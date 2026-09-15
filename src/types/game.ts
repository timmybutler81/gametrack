export type GameStatus =
  | "Playing"
  | "Backlog"
  | "Completed"
  | "On Hold"
  | "Dropped"

export interface Game {
  id: number
  title: string
  developer: string
  platform: string
  genre: string
  status: GameStatus
  playthroughNumber?: number
  hoursPlayed?: number
  dateAdded: string
  image?: string
}