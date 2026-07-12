'use client'

import { useCallback, useEffect, useRef } from 'react'

export interface InputState {
  left: boolean
  right: boolean
  jump: boolean
  attack: boolean
}

export function useInput() {
  const input = useRef<InputState>({ left: false, right: false, jump: false, attack: false })

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        input.current.left = true
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        input.current.right = true
        break
      case 'ArrowUp':
      case 'w':
      case 'W':
      case ' ':
        input.current.jump = true
        break
      case 'z':
      case 'Z':
      case 'x':
      case 'X':
        input.current.attack = true
        break
    }
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        input.current.left = false
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        input.current.right = false
        break
      case 'ArrowUp':
      case 'w':
      case 'W':
      case ' ':
        input.current.jump = false
        break
      case 'z':
      case 'Z':
      case 'x':
      case 'X':
        input.current.attack = false
        break
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  const setButton = useCallback((button: 'left' | 'right' | 'jump' | 'attack', pressed: boolean) => {
    input.current[button] = pressed
  }, [])

  return { input, setButton }
}
