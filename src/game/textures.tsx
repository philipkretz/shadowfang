'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

export function useBrickTexture(): THREE.CanvasTexture {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#d4782e'
    ctx.fillRect(0, 0, 64, 64)
    ctx.strokeStyle = '#a05820'
    ctx.lineWidth = 2
    for (let y = 0; y < 4; y++) {
      const offset = y % 2 === 0 ? 0 : 16
      for (let x = 0; x < 3; x++) {
        ctx.strokeRect(offset + x * 22, y * 16, 22, 16)
      }
    }
    ctx.fillStyle = '#e0905040'
    for (let i = 0; i < 40; i++) {
      ctx.fillRect(Math.random() * 64, Math.random() * 64, 2, 2)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    return tex
  }, [])
}

export function useGrassTexture(): THREE.CanvasTexture {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#6a4a2a'
    ctx.fillRect(0, 0, 64, 64)
    ctx.fillStyle = '#5cb83a'
    ctx.fillRect(0, 0, 64, 16)
    ctx.fillStyle = '#6cc84a'
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 64
      ctx.fillRect(x, 12 + Math.random() * 6, 2, 4 + Math.random() * 4)
    }
    ctx.fillStyle = '#4aa82a'
    for (let i = 0; i < 30; i++) {
      ctx.fillRect(Math.random() * 64, Math.random() * 64, 1, 1)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    return tex
  }, [])
}

export function useQuestionTexture(): THREE.CanvasTexture {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, 64, 64)
    grad.addColorStop(0, '#ffee55')
    grad.addColorStop(0.5, '#ffdd33')
    grad.addColorStop(1, '#e8b818')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)
    ctx.strokeStyle = '#c89010'
    ctx.lineWidth = 3
    ctx.strokeRect(2, 2, 60, 60)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 36px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('?', 32, 34)
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [])
}

export function useUsedBlockTexture(): THREE.CanvasTexture {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#a08030'
    ctx.fillRect(0, 0, 64, 64)
    ctx.strokeStyle = '#785018'
    ctx.lineWidth = 3
    ctx.strokeRect(2, 2, 60, 60)
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [])
}

export function useStoneTexture(): THREE.CanvasTexture {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#98a0a0'
    ctx.fillRect(0, 0, 64, 64)
    ctx.strokeStyle = '#788080'
    ctx.lineWidth = 1
    for (let i = 0; i < 8; i++) {
      ctx.strokeRect(Math.random() * 50, Math.random() * 50, 10 + Math.random() * 20, 10 + Math.random() * 20)
    }
    ctx.fillStyle = '#a8b0b030'
    for (let i = 0; i < 50; i++) {
      ctx.fillRect(Math.random() * 64, Math.random() * 64, 2, 2)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    return tex
  }, [])
}
