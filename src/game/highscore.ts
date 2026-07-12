'use client'

export interface HighscoreEntry {
  name: string
  score: number
  level: number
  date: string
}

const STORAGE_KEY = 'shadowfang_highscores'
const MAX_ENTRIES = 10

export function loadHighscores(): HighscoreEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as HighscoreEntry[]
  } catch {
    return []
  }
}

export function saveHighscores(entries: HighscoreEntry[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function isHighscore(score: number, current: HighscoreEntry[]): boolean {
  if (current.length < MAX_ENTRIES) return score > 0
  return score > current[current.length - 1].score
}

export function insertHighscore(
  entry: HighscoreEntry,
  current: HighscoreEntry[]
): HighscoreEntry[] {
  const updated = [...current, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES)
  saveHighscores(updated)
  return updated
}
