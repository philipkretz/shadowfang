'use client'

import type { Platform, Enemy, Coin, PowerUp, Boss, RollingStoneSpawner } from '@/types/game'
import {
  ENEMY_SPEED, NINJA_SPEED, ARCHER_SPEED, SUMO_SPEED, DRONE_SPEED, DRONE_HOVER_HEIGHT,
  ROLLING_STONE_SPEED, ROLLING_STONE_RADIUS, ROLLING_STONE_SPAWN_INTERVAL,
} from './constants'

export function getDifficultyMultiplier(level: number): { speed: number; health: number; count: number } {
  const speed = 1 + (level - 1) * 0.08
  const health = 1 + (level - 1) * 0.15
  const count = Math.min(2 + Math.floor((level - 1) * 1.5), 8)
  return { speed, health, count }
}

export function scaleEnemySpeed(baseSpeed: number, level: number): number {
  return baseSpeed * getDifficultyMultiplier(level).speed
}

export function scaleBossHealth(baseHealth: number, level: number): number {
  return Math.ceil(baseHealth * getDifficultyMultiplier(level).health)
}

export function createBosses(): Boss[] {
  return [
    {
      id: 0,
      name: 'Kuro',
      title: 'The Shadow Blade',
      bossType: 'ninja',
      colorScheme: { primary: '#2a0a3a', accent: '#8b00ff', glow: '#cc44ff' },
      position: { x: 35, y: 2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      health: 5,
      maxHealth: 5,
      alive: true,
      active: false,
      defeated: false,
      direction: -1,
      phase: 'idle',
      phaseTimer: 0,
      attackCooldown: 0,
      invincible: false,
      invincibleTimer: 0,
      spawnX: 35,
      groundY: 0.8,
      scale: 1,
    },
    {
      id: 1,
      name: 'Akane',
      title: 'The Crimson Storm',
      bossType: 'ninja',
      colorScheme: { primary: '#4a0a0a', accent: '#ff2200', glow: '#ff6644' },
      position: { x: 65, y: 2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      health: 8,
      maxHealth: 8,
      alive: true,
      active: false,
      defeated: false,
      direction: -1,
      phase: 'idle',
      phaseTimer: 0,
      attackCooldown: 0,
      invincible: false,
      invincibleTimer: 0,
      spawnX: 65,
      groundY: 0.8,
      scale: 1,
    },
  ]
}

function createLevel1Platforms(): Platform[] {
  const platforms: Platform[] = []

  for (let i = -2; i < 62; i++) {
    platforms.push({
      position: { x: i * 2, y: -0.5, z: 0 },
      size: { x: 2, y: 1, z: 4 },
      color: '#5cb83a',
      type: 'ground'
    })
  }

  platforms.push(
    { position: { x: 5, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'coin' },
    { position: { x: 10, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'mushroom' },
    { position: { x: 15, y: 4, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'coin' },
  )

  platforms.push(
    { position: { x: 7, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#d4782e', type: 'brick' },
    { position: { x: 8, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#d4782e', type: 'brick' },
    { position: { x: 9, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#d4782e', type: 'brick' },
    { position: { x: 14, y: 4, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#d4782e', type: 'brick' },
    { position: { x: 16, y: 4, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#d4782e', type: 'brick' },
  )

  platforms.push(
    { position: { x: 12, y: 1, z: 0 }, size: { x: 1.2, y: 2.5, z: 1.2 }, color: '#38b838', type: 'pipe' },
    { position: { x: 22, y: 1.5, z: 0 }, size: { x: 1.2, y: 3.5, z: 1.2 }, color: '#38b838', type: 'pipe' },
    { position: { x: 40, y: 1, z: 0 }, size: { x: 1.2, y: 2.5, z: 1.2 }, color: '#38b838', type: 'pipe' },
  )

  platforms.push(
    { position: { x: 25, y: 2, z: 0 }, size: { x: 3, y: 0.5, z: 2 }, color: '#b87030', type: 'brick' },
    { position: { x: 30, y: 3.5, z: 0 }, size: { x: 2, y: 0.5, z: 2 }, color: '#b87030', type: 'brick' },
    { position: { x: 34, y: 5, z: 0 }, size: { x: 4, y: 0.5, z: 2 }, color: '#b87030', type: 'brick' },
  )

  platforms.push(
    { position: { x: 38, y: 3, z: 0 }, size: { x: 2.5, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 3, movingSpeed: 0.02, basePosition: { x: 38, y: 3, z: 0 } },
    { position: { x: 45, y: 4, z: 0 }, size: { x: 2.5, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'x', movingRange: 4, movingSpeed: 0.015, basePosition: { x: 45, y: 4, z: 0 } },
    { position: { x: 55, y: 2, z: 0 }, size: { x: 2, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 2.5, movingSpeed: 0.022, basePosition: { x: 55, y: 2, z: 0 } },
  )

  platforms.push(
    { position: { x: 20, y: 6, z: 0 }, size: { x: 3, y: 0.6, z: 2 }, color: '#ffffff', type: 'cloud' },
    { position: { x: 28, y: 7.5, z: 0 }, size: { x: 2, y: 0.6, z: 2 }, color: '#ffffff', type: 'cloud' },
    { position: { x: 50, y: 5, z: 0 }, size: { x: 4, y: 0.6, z: 2 }, color: '#ffffff', type: 'cloud' },
  )

  for (let i = 42; i < 62; i++) {
    const exists = platforms.some(p => p.type === 'ground' && Math.abs(p.position.x - i * 2) < 1.5)
    if (!exists) {
      platforms.push({
        position: { x: i * 2, y: -0.5, z: 0 },
        size: { x: 2, y: 1, z: 4 },
        color: '#4a8c2a',
        type: 'ground'
      })
    }
  }

  platforms.push(
    { position: { x: 48, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'star' },
    { position: { x: 52, y: 3, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'flower' },
    { position: { x: 55, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'coin' },
  )

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j <= i; j++) {
      platforms.push({
        position: { x: 62 + i * 1, y: 0 + j * 1, z: 0 },
        size: { x: 1, y: 1, z: 3 },
        color: '#d4782e',
        type: 'brick'
      })
    }
  }

  platforms.push({
    position: { x: 72, y: 5, z: 0 },
    size: { x: 1, y: 10, z: 1 },
    color: '#999999',
    type: 'cloud'
  })

  return platforms
}

function createLevel1Enemies(): Enemy[] {
  return [
    { id: 1, type: 'goomba', position: { x: 8, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 1.0, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 2, type: 'goomba', position: { x: 16, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.9, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 3, type: 'koopa', position: { x: 24, y: 0.8, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.6, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 4, type: 'goomba', position: { x: 30, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 1.0, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 5, type: 'goomba', position: { x: 33, y: 0.5, z: 0 }, velocity: { x: ENEMY_SPEED * 0.9, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1 },
    { id: 6, type: 'koopa', position: { x: 42, y: 0.8, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.7, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 7, type: 'goomba', position: { x: 50, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.95, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 8, type: 'goomba', position: { x: 54, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.85, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 9, type: 'spike', position: { x: 58, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 1.1, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 10, type: 'koopa', position: { x: 60, y: 0.8, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.6, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
  ]
}

function createLevel1Coins(): Coin[] {
  const coins: Coin[] = []
  let id = 0

  for (let i = 0; i < 5; i++) {
    coins.push({ id: id++, position: { x: 18 + i * 1.2, y: 3 + Math.sin(i * 0.5) * 0.5, z: 0 }, collected: false, spinAngle: 0 })
  }

  for (let i = 0; i < 3; i++) {
    coins.push({ id: id++, position: { x: 25 + i * 1, y: 4, z: 0 }, collected: false, spinAngle: 0 })
  }

  for (let i = 0; i < 3; i++) {
    coins.push({ id: id++, position: { x: 38 + i * 1, y: 2, z: 0 }, collected: false, spinAngle: 0 })
  }

  for (let i = 0; i < 4; i++) {
    coins.push({ id: id++, position: { x: 63 + i, y: 2 + i, z: 0 }, collected: false, spinAngle: 0 })
  }

  for (let i = 0; i < 6; i++) {
    coins.push({ id: id++, position: { x: 46 + i * 1.5, y: 6 + Math.sin(i) * 0.8, z: 0 }, collected: false, spinAngle: 0 })
  }

  return coins
}

function createLevel1PowerUps(): PowerUp[] {
  const powerUps: PowerUp[] = []
  let id = 0
  for (const plat of createLevel1Platforms()) {
    if (plat.type === 'question' && plat.contains && plat.contains !== 'coin') {
      powerUps.push({
        id: id++,
        type: plat.contains,
        position: { x: -5, y: -5, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        collected: false,
        active: false,
      })
    }
  }
  return powerUps
}

function createLevel2Platforms(): Platform[] {
  const platforms: Platform[] = []

  const groundSegments = [
    [-2, 8],
    [11, 18],
    [21, 28],
    [29, 38],
    [41, 48],
  ]
  for (const [start, end] of groundSegments) {
    for (let i = start; i < end; i++) {
      platforms.push({
        position: { x: i * 2, y: -0.5, z: 0 },
        size: { x: 2, y: 1, z: 4 },
        color: '#707088',
        type: 'ground'
      })
    }
  }

  platforms.push(
    { position: { x: 4, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'coin' },
    { position: { x: 8, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'mushroom' },
    { position: { x: 15, y: 3.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'flower' },
    { position: { x: 24, y: 3, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'coin' },
    { position: { x: 33, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'star' },
    { position: { x: 44, y: 3, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'mushroom' },
    { position: { x: 53, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'coin' },
  )

  platforms.push(
    { position: { x: 6, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#8890aa', type: 'brick' },
    { position: { x: 7, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#8890aa', type: 'brick' },
    { position: { x: 14, y: 3.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#8890aa', type: 'brick' },
    { position: { x: 16, y: 3.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#8890aa', type: 'brick' },
    { position: { x: 23, y: 3, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#8890aa', type: 'brick' },
    { position: { x: 25, y: 3, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#8890aa', type: 'brick' },
    { position: { x: 35, y: 4, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#8890aa', type: 'brick' },
    { position: { x: 36, y: 4, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#8890aa', type: 'brick' },
    { position: { x: 37, y: 4, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#8890aa', type: 'brick' },
  )

  platforms.push(
    { position: { x: 10, y: 1, z: 0 }, size: { x: 1.2, y: 2.5, z: 1.2 }, color: '#707088', type: 'pipe' },
    { position: { x: 26, y: 1.2, z: 0 }, size: { x: 1.2, y: 2.9, z: 1.2 }, color: '#707088', type: 'pipe' },
    { position: { x: 42, y: 1, z: 0 }, size: { x: 1.2, y: 2.5, z: 1.2 }, color: '#707088', type: 'pipe' },
  )

  platforms.push(
    { position: { x: 19, y: 2.5, z: 0 }, size: { x: 3, y: 0.5, z: 2 }, color: '#707088', type: 'brick' },
    { position: { x: 29, y: 3.5, z: 0 }, size: { x: 2.5, y: 0.5, z: 2 }, color: '#707088', type: 'brick' },
    { position: { x: 39, y: 3, z: 0 }, size: { x: 2, y: 0.5, z: 2 }, color: '#707088', type: 'brick' },
    { position: { x: 48, y: 4, z: 0 }, size: { x: 3, y: 0.5, z: 2 }, color: '#707088', type: 'brick' },
  )

  platforms.push(
    { position: { x: 19, y: 1.5, z: 0 }, size: { x: 2.5, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 3, movingSpeed: 0.025, basePosition: { x: 19, y: 1.5, z: 0 } },
    { position: { x: 40, y: 2, z: 0 }, size: { x: 2.5, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 4, movingSpeed: 0.02, basePosition: { x: 40, y: 2, z: 0 } },
    { position: { x: 50, y: 2.5, z: 0 }, size: { x: 2.5, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'x', movingRange: 3, movingSpeed: 0.03, basePosition: { x: 50, y: 2.5, z: 0 } },
    { position: { x: 35, y: 1.5, z: 0 }, size: { x: 2, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'x', movingRange: 2, movingSpeed: 0.025, basePosition: { x: 35, y: 1.5, z: 0 } },
  )

  platforms.push(
    { position: { x: 16, y: 5.5, z: 0 }, size: { x: 2.5, y: 0.6, z: 2 }, color: '#ffffff', type: 'cloud' },
    { position: { x: 32, y: 6, z: 0 }, size: { x: 3, y: 0.6, z: 2 }, color: '#ffffff', type: 'cloud' },
    { position: { x: 46, y: 5, z: 0 }, size: { x: 2, y: 0.6, z: 2 }, color: '#ffffff', type: 'cloud' },
  )

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j <= i; j++) {
      platforms.push({
        position: { x: 58 + i * 1, y: 0 + j * 1, z: 0 },
        size: { x: 1, y: 1, z: 3 },
        color: '#8890aa',
        type: 'brick'
      })
    }
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j <= (2 - i); j++) {
      platforms.push({
        position: { x: 62 + i * 1, y: 0 + j * 1, z: 0 },
        size: { x: 1, y: 1, z: 3 },
        color: '#8890aa',
        type: 'brick'
      })
    }
  }

  platforms.push({
    position: { x: 68, y: 5, z: 0 },
    size: { x: 1, y: 10, z: 1 },
    color: '#999999',
    type: 'cloud'
  })

  return platforms
}

function createLevel2Enemies(): Enemy[] {
  return [
    { id: 1, type: 'goomba', position: { x: 6, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 2, type: 'ninja', position: { x: 10, y: 0.5, z: 0 }, velocity: { x: -NINJA_SPEED * 0.7, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 3, type: 'archer', position: { x: 28, y: 0.5, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 4, type: 'koopa', position: { x: 30, y: 0.8, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.6, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 5, type: 'spike', position: { x: 46, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 6, type: 'goomba', position: { x: 50, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.9, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 7, type: 'ninja', position: { x: 64, y: 0.5, z: 0 }, velocity: { x: -NINJA_SPEED * 0.7, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 8, type: 'archer', position: { x: 70, y: 0.5, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
  ]
}

function createLevel2Coins(): Coin[] {
  const coins: Coin[] = []
  let id = 0

  for (let i = 0; i < 4; i++) {
    coins.push({ id: id++, position: { x: 14 + i * 1.2, y: 3 + Math.sin(i * 0.5) * 0.5, z: 0 }, collected: false, spinAngle: 0 })
  }

  for (let i = 0; i < 3; i++) {
    coins.push({ id: id++, position: { x: 22 + i * 1, y: 3.5, z: 0 }, collected: false, spinAngle: 0 })
  }

  for (let i = 0; i < 3; i++) {
    coins.push({ id: id++, position: { x: 33 + i * 1, y: 2, z: 0 }, collected: false, spinAngle: 0 })
  }

  for (let i = 0; i < 5; i++) {
    coins.push({ id: id++, position: { x: 44 + i * 1.2, y: 4.5 + Math.sin(i) * 0.8, z: 0 }, collected: false, spinAngle: 0 })
  }

  for (let i = 0; i < 4; i++) {
    coins.push({ id: id++, position: { x: 59 + i, y: 1 + i * 0.8, z: 0 }, collected: false, spinAngle: 0 })
  }

  return coins
}

function createLevel2PowerUps(): PowerUp[] {
  const powerUps: PowerUp[] = []
  let id = 0
  for (const plat of createLevel2Platforms()) {
    if (plat.type === 'question' && plat.contains && plat.contains !== 'coin') {
      powerUps.push({
        id: id++,
        type: plat.contains,
        position: { x: -5, y: -5, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        collected: false,
        active: false,
      })
    }
  }
  return powerUps
}

function createLevel2Bosses(): Boss[] {
  return [
    {
      id: 0,
      name: 'Zenith',
      title: 'The Iron Shadow',
      bossType: 'ninja',
      colorScheme: { primary: '#1a2a3a', accent: '#4488cc', glow: '#66aaff' },
      position: { x: 35, y: 2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      health: 6,
      maxHealth: 6,
      alive: true,
      active: false,
      defeated: false,
      direction: -1,
      phase: 'idle',
      phaseTimer: 0,
      attackCooldown: 0,
      invincible: false,
      invincibleTimer: 0,
      spawnX: 35,
      groundY: 0.8,
      scale: 1,
    },
    {
      id: 1,
      name: 'Vortex',
      title: 'The Storm Caller',
      bossType: 'ninja',
      colorScheme: { primary: '#2a1a0a', accent: '#ff8800', glow: '#ffaa44' },
      position: { x: 53, y: 2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      health: 10,
      maxHealth: 10,
      alive: true,
      active: false,
      defeated: false,
      direction: -1,
      phase: 'idle',
      phaseTimer: 0,
      attackCooldown: 0,
      invincible: false,
      invincibleTimer: 0,
      spawnX: 53,
      groundY: 0.8,
      scale: 1,
    },
  ]
}

function createLevel3Platforms(): Platform[] {
  const platforms: Platform[] = []
  for (let i = 0; i < 15; i++) platforms.push({ position: { x: i * 2, y: -0.5, z: 0 }, size: { x: 2, y: 1, z: 4 }, color: '#6b5540', type: 'ground' })
  for (let i = 17; i < 38; i++) platforms.push({ position: { x: i * 2, y: -0.5, z: 0 }, size: { x: 2, y: 1, z: 4 }, color: '#6b5540', type: 'ground' })
  for (let i = 39; i < 55; i++) platforms.push({ position: { x: i * 2, y: -0.5, z: 0 }, size: { x: 2, y: 1, z: 4 }, color: '#6b5540', type: 'ground' })
  for (let i = 0; i < 54; i++) {
    if (i % 4 < 2) {
      platforms.push({ position: { x: i * 2, y: 9, z: 0 }, size: { x: 2, y: 1, z: 4 }, color: '#5a4535', type: 'brick' })
    }
  }
  platforms.push(
    { position: { x: 30.5, y: 1, z: 0 }, size: { x: 2, y: 0.5, z: 2 }, color: '#7a6550', type: 'brick' },
    { position: { x: 32.5, y: 2.5, z: 0 }, size: { x: 2, y: 0.5, z: 2 }, color: '#7a6550', type: 'brick' },
  )
  platforms.push(
    { position: { x: 8, y: 7.5, z: 0 }, size: { x: 1.5, y: 0.5, z: 2 }, color: '#8a7560', type: 'brick' },
    { position: { x: 22, y: 7.5, z: 0 }, size: { x: 1.5, y: 0.5, z: 2 }, color: '#8a7560', type: 'brick' },
    { position: { x: 40, y: 7.5, z: 0 }, size: { x: 1.5, y: 0.5, z: 2 }, color: '#8a7560', type: 'brick' },
  )
  platforms.push(
    { position: { x: 14, y: 2.5, z: 0 }, size: { x: 1.5, y: 0.5, z: 2 }, color: '#8a7560', type: 'brick' },
    { position: { x: 20, y: 4, z: 0 }, size: { x: 2, y: 0.5, z: 2 }, color: '#8a7560', type: 'brick' },
    { position: { x: 46, y: 3, z: 0 }, size: { x: 2.5, y: 0.5, z: 2 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 2, movingSpeed: 0.018, basePosition: { x: 46, y: 3, z: 0 } },
    { position: { x: 50, y: 2, z: 0 }, size: { x: 2, y: 0.5, z: 2 }, color: '#a8a8ff', type: 'moving', movingAxis: 'x', movingRange: 3, movingSpeed: 0.015, basePosition: { x: 50, y: 2, z: 0 } },
    { position: { x: 32, y: 1.5, z: 0 }, size: { x: 2, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 2, movingSpeed: 0.02, basePosition: { x: 32, y: 1.5, z: 0 } },
    { position: { x: 28, y: 0.5, z: 0 }, size: { x: 2, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'x', movingRange: 2, movingSpeed: 0.016, basePosition: { x: 28, y: 0.5, z: 0 } },
    { position: { x: 18, y: 1.5, z: 0 }, size: { x: 1.8, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 1.5, movingSpeed: 0.022, basePosition: { x: 18, y: 1.5, z: 0 } },
    { position: { x: 56, y: 1, z: 0 }, size: { x: 2, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 2.5, movingSpeed: 0.019, basePosition: { x: 56, y: 1, z: 0 } },
  )
  platforms.push(
    { position: { x: 6, y: 3, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'mushroom' },
    { position: { x: 26, y: 3, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'coin' },
    { position: { x: 42, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'star' },
  )
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j <= i; j++) {
      platforms.push({ position: { x: 96 + i * 1, y: 0 + j * 1, z: 0 }, size: { x: 1, y: 1, z: 3 }, color: '#5a4535', type: 'brick' })
    }
  }
  platforms.push({ position: { x: 104, y: 5, z: 0 }, size: { x: 1, y: 10, z: 1 }, color: '#999999', type: 'cloud' })
  return platforms
}

function createLevel3Enemies(): Enemy[] {
  return [
    { id: 1, type: 'skeleton', position: { x: 5, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.8, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 2, type: 'goomba', position: { x: 10, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 3, type: 'sumo', position: { x: 18, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.7, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1, health: 1 },
    { id: 4, type: 'skeleton', position: { x: 24, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.9, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 5, type: 'goomba', position: { x: 36, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 6, type: 'sumo', position: { x: 44, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.6, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1, health: 1 },
    { id: 7, type: 'mushroom', position: { x: 14, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.6, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 8, type: 'drone', position: { x: 16, y: 2.8, z: 0 }, velocity: { x: DRONE_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1 },
    { id: 9, type: 'drone', position: { x: 42, y: 3.0, z: 0 }, velocity: { x: -DRONE_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
  ]
}

function createLevel3Coins(): Coin[] {
  const coins: Coin[] = []
  let id = 0
  for (let i = 0; i < 5; i++) coins.push({ id: id++, position: { x: 10 + i * 1.2, y: 2 + Math.sin(i) * 0.5, z: 0 }, collected: false, spinAngle: 0 })
  for (let i = 0; i < 3; i++) coins.push({ id: id++, position: { x: 30.5 + i * 1, y: 2.5, z: 0 }, collected: false, spinAngle: 0 })
  for (let i = 0; i < 4; i++) coins.push({ id: id++, position: { x: 40 + i * 1.5, y: 5 + Math.sin(i) * 0.5, z: 0 }, collected: false, spinAngle: 0 })
  for (let i = 0; i < 5; i++) coins.push({ id: id++, position: { x: 97 + i, y: 2 + i, z: 0 }, collected: false, spinAngle: 0 })
  return coins
}

function createLevel3PowerUps(): PowerUp[] {
  const powerUps: PowerUp[] = []
  let id = 0
  for (const plat of createLevel3Platforms()) {
    if (plat.type === 'question' && plat.contains && plat.contains !== 'coin') {
      powerUps.push({ id: id++, type: plat.contains, position: { x: -5, y: -5, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, collected: false, active: false })
    }
  }
  return powerUps
}

function createLevel3Bosses(): Boss[] {
  return [{
    id: 100,
    name: 'Grotto',
    title: 'The Stone Sentinel',
    bossType: 'golem',
    colorScheme: { primary: '#5a4030', accent: '#c09040', glow: '#ffaa33' },
    position: { x: 88, y: 0.8, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    alive: true,
    health: 12,
    maxHealth: 12,
    active: false,
    defeated: false,
    direction: -1,
    phase: 'idle',
    phaseTimer: 0,
    attackCooldown: 0,
    invincible: false,
    invincibleTimer: 0,
    spawnX: 88,
    groundY: 0.8,
    scale: 1.8,
  }]
}

function createLevel4Platforms(): Platform[] {
  const platforms: Platform[] = []
  for (let i = 0; i < 8; i++) platforms.push({ position: { x: i * 2, y: -0.5, z: 0 }, size: { x: 2, y: 1, z: 4 }, color: '#7bc8f0', type: 'ground' })
  const clouds = [
    { x: 18, y: 1.5 }, { x: 22, y: 3 }, { x: 26, y: 2 }, { x: 30, y: 4 },
    { x: 34, y: 2.5 }, { x: 38, y: 1 }, { x: 42, y: 3.5 }, { x: 46, y: 2 },
  ]
  clouds.forEach(c => platforms.push({ position: { x: c.x, y: c.y, z: 0 }, size: { x: 3, y: 0.6, z: 2 }, color: '#ffffff', type: 'brick' }))
  platforms.push(
    { position: { x: 50, y: 3, z: 0 }, size: { x: 2.5, y: 0.5, z: 2 }, color: '#a8a8ff', type: 'moving', movingAxis: 'x', movingRange: 3, movingSpeed: 0.02, basePosition: { x: 50, y: 3, z: 0 } },
    { position: { x: 56, y: 3, z: 0 }, size: { x: 2.5, y: 0.5, z: 2 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 2, movingSpeed: 0.018, basePosition: { x: 56, y: 3, z: 0 } },
    { position: { x: 35, y: 3, z: 0 }, size: { x: 2, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 2.5, movingSpeed: 0.022, basePosition: { x: 35, y: 3, z: 0 } },
    { position: { x: 20, y: 2, z: 0 }, size: { x: 2.5, y: 0.5, z: 2 }, color: '#a8a8ff', type: 'moving', movingAxis: 'x', movingRange: 2.5, movingSpeed: 0.017, basePosition: { x: 20, y: 2, z: 0 } },
    { position: { x: 28, y: 3.5, z: 0 }, size: { x: 2, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 2, movingSpeed: 0.02, basePosition: { x: 28, y: 3.5, z: 0 } },
    { position: { x: 44, y: 2, z: 0 }, size: { x: 2, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'x', movingRange: 3, movingSpeed: 0.021, basePosition: { x: 44, y: 2, z: 0 } },
    { position: { x: 66, y: 4.5, z: 0 }, size: { x: 2.5, y: 0.5, z: 2 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 2, movingSpeed: 0.019, basePosition: { x: 66, y: 4.5, z: 0 } },
  )
  for (let i = 30; i < 55; i++) platforms.push({ position: { x: i * 2, y: -0.5, z: 0 }, size: { x: 2, y: 1, z: 4 }, color: '#5cb83a', type: 'ground' })
  platforms.push(
    { position: { x: 64, y: 2, z: 0 }, size: { x: 2, y: 0.5, z: 2 }, color: '#ffffff', type: 'brick' },
    { position: { x: 68, y: 3.5, z: 0 }, size: { x: 2, y: 0.5, z: 2 }, color: '#ffffff', type: 'brick' },
    { position: { x: 72, y: 5, z: 0 }, size: { x: 3, y: 0.5, z: 2 }, color: '#ffffff', type: 'brick' },
  )
  for (let i = 36; i < 50; i++) platforms.push({ position: { x: i * 2, y: -0.5, z: 0 }, size: { x: 2, y: 1, z: 4 }, color: '#4a8c2a', type: 'ground' })
  platforms.push(
    { position: { x: 4, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'mushroom' },
    { position: { x: 22, y: 5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'coin' },
    { position: { x: 38, y: 3, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'flower' },
    { position: { x: 44, y: 3, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'star' },
  )
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j <= i; j++) {
      platforms.push({ position: { x: 92 + i * 1, y: 0 + j * 1, z: 0 }, size: { x: 1, y: 1, z: 3 }, color: '#4a8c2a', type: 'brick' })
    }
  }
  platforms.push({ position: { x: 100, y: 5, z: 0 }, size: { x: 1, y: 10, z: 1 }, color: '#999999', type: 'brick' })
  return platforms
}

function createLevel4Enemies(): Enemy[] {
  return [
    { id: 1, type: 'ninja', position: { x: 34, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.8, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 2, type: 'archer', position: { x: 38, y: 0.5, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 3, type: 'goomba', position: { x: 42, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 4, type: 'mushroom', position: { x: 46, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.5, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 5, type: 'ninja', position: { x: 50, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.7, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 6, type: 'koopa', position: { x: 54, y: 0.8, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.6, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 7, type: 'mushroom', position: { x: 68, y: 4.2, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.4, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 8, type: 'sumo', position: { x: 40, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.5, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1, health: 1 },
    { id: 9, type: 'drone', position: { x: 20, y: 3.2, z: 0 }, velocity: { x: DRONE_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1 },
    { id: 10, type: 'drone', position: { x: 52, y: 2.8, z: 0 }, velocity: { x: -DRONE_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
  ]
}

function createLevel4Coins(): Coin[] {
  const coins: Coin[] = []
  let id = 0
  for (let i = 0; i < 4; i++) coins.push({ id: id++, position: { x: 18 + i * 1.5, y: 3 + Math.sin(i) * 0.5, z: 0 }, collected: false, spinAngle: 0 })
  for (let i = 0; i < 5; i++) coins.push({ id: id++, position: { x: 34 + i * 1.2, y: 5 + Math.sin(i) * 0.8, z: 0 }, collected: false, spinAngle: 0 })
  for (let i = 0; i < 3; i++) coins.push({ id: id++, position: { x: 64 + i * 2, y: 3.5, z: 0 }, collected: false, spinAngle: 0 })
  for (let i = 0; i < 5; i++) coins.push({ id: id++, position: { x: 93 + i, y: 2 + i, z: 0 }, collected: false, spinAngle: 0 })
  return coins
}

function createLevel4PowerUps(): PowerUp[] {
  const powerUps: PowerUp[] = []
  let id = 0
  for (const plat of createLevel4Platforms()) {
    if (plat.type === 'question' && plat.contains && plat.contains !== 'coin') {
      powerUps.push({ id: id++, type: plat.contains, position: { x: -5, y: -5, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, collected: false, active: false })
    }
  }
  return powerUps
}

function createLevel4Bosses(): Boss[] {
  return [{
    id: 101,
    name: 'Aether',
    title: 'The Storm Weaver',
    bossType: 'storm',
    colorScheme: { primary: '#0a1a3a', accent: '#2266cc', glow: '#44aaff' },
    position: { x: 84, y: 0.8, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    alive: true,
    health: 14,
    maxHealth: 14,
    active: false,
    defeated: false,
    direction: -1,
    phase: 'idle',
    phaseTimer: 0,
    attackCooldown: 0,
    invincible: false,
    invincibleTimer: 0,
    spawnX: 84,
    groundY: 0.8,
    scale: 1.6,
  }]
}

function createLevel5Platforms(): Platform[] {
  const platforms: Platform[] = []
  for (let i = 0; i < 12; i++) platforms.push({ position: { x: i * 2, y: -0.5, z: 0 }, size: { x: 2, y: 1, z: 4 }, color: '#6b5540', type: 'ground' })
  for (let i = 14; i < 35; i++) platforms.push({ position: { x: i * 2, y: -0.5, z: 0 }, size: { x: 2, y: 1, z: 4 }, color: '#6b5540', type: 'ground' })
  for (let i = 37; i < 52; i++) platforms.push({ position: { x: i * 2, y: -0.5, z: 0 }, size: { x: 2, y: 1, z: 4 }, color: '#6b5540', type: 'ground' })
  for (let i = 0; i < 52; i++) {
    if (i % 3 < 2) platforms.push({ position: { x: i * 2, y: 9, z: 0 }, size: { x: 2, y: 1, z: 4 }, color: '#4a3525', type: 'brick' })
  }
  platforms.push(
    { position: { x: 25, y: 1.5, z: 0 }, size: { x: 2, y: 0.5, z: 2 }, color: '#6b5540', type: 'brick' },
    { position: { x: 27, y: 3, z: 0 }, size: { x: 2, y: 0.5, z: 2 }, color: '#6b5540', type: 'brick' },
    { position: { x: 71, y: 1.5, z: 0 }, size: { x: 2, y: 0.5, z: 2 }, color: '#6b5540', type: 'brick' },
    { position: { x: 73, y: 3, z: 0 }, size: { x: 2, y: 0.5, z: 2 }, color: '#6b5540', type: 'brick' },
  )
  platforms.push(
    { position: { x: 48, y: 3, z: 0 }, size: { x: 2.5, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'x', movingRange: 4, movingSpeed: 0.02, basePosition: { x: 48, y: 3, z: 0 } },
    { position: { x: 55, y: 4, z: 0 }, size: { x: 2.5, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 3, movingSpeed: 0.022, basePosition: { x: 55, y: 4, z: 0 } },
    { position: { x: 62, y: 2.5, z: 0 }, size: { x: 2, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'x', movingRange: 3, movingSpeed: 0.025, basePosition: { x: 62, y: 2.5, z: 0 } },
    { position: { x: 26, y: 0.5, z: 0 }, size: { x: 2, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'x', movingRange: 2, movingSpeed: 0.018, basePosition: { x: 26, y: 0.5, z: 0 } },
    { position: { x: 72, y: 0.5, z: 0 }, size: { x: 2, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'x', movingRange: 2, movingSpeed: 0.02, basePosition: { x: 72, y: 0.5, z: 0 } },
    { position: { x: 38, y: 2, z: 0 }, size: { x: 2.2, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 2.5, movingSpeed: 0.021, basePosition: { x: 38, y: 2, z: 0 } },
    { position: { x: 80, y: 3, z: 0 }, size: { x: 2.5, y: 0.4, z: 1.5 }, color: '#a8a8ff', type: 'moving', movingAxis: 'y', movingRange: 2, movingSpeed: 0.023, basePosition: { x: 80, y: 3, z: 0 } },
  )
  platforms.push(
    { position: { x: 4, y: 3, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'mushroom' },
    { position: { x: 20, y: 3, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'star' },
    { position: { x: 42, y: 2.5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'flower' },
    { position: { x: 60, y: 5, z: 0 }, size: { x: 0.8, y: 0.8, z: 0.8 }, color: '#ffdd33', type: 'question', contains: 'mushroom' },
  )
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j <= i; j++) {
      platforms.push({ position: { x: 88 + i * 1, y: 0 + j * 1, z: 0 }, size: { x: 1, y: 1, z: 3 }, color: '#4a3525', type: 'brick' })
    }
  }
  platforms.push({ position: { x: 98, y: 5, z: 0 }, size: { x: 1, y: 10, z: 1 }, color: '#999999', type: 'cloud' })
  return platforms
}

function createLevel5Enemies(): Enemy[] {
  return [
    { id: 1, type: 'ninja', position: { x: 6, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.9, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 2, type: 'skeleton', position: { x: 10, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.8, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 3, type: 'sumo', position: { x: 16, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.6, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1, health: 1 },
    { id: 4, type: 'archer', position: { x: 20, y: 0.5, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 5, type: 'mushroom', position: { x: 30, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.5, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 6, type: 'ninja', position: { x: 42, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.8, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 7, type: 'sumo', position: { x: 46, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.5, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1, health: 1 },
    { id: 8, type: 'archer', position: { x: 50, y: 0.5, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 9, type: 'mushroom', position: { x: 54, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.6, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 10, type: 'ninja', position: { x: 58, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.9, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 11, type: 'skeleton', position: { x: 64, y: 0.5, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.7, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 12, type: 'koopa', position: { x: 68, y: 0.8, z: 0 }, velocity: { x: -ENEMY_SPEED * 0.6, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 13, type: 'drone', position: { x: 14, y: 3.0, z: 0 }, velocity: { x: DRONE_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1 },
    { id: 14, type: 'drone', position: { x: 35, y: 3.2, z: 0 }, velocity: { x: -DRONE_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
  ]
}

function createLevel5Coins(): Coin[] {
  const coins: Coin[] = []
  let id = 0
  for (let i = 0; i < 5; i++) coins.push({ id: id++, position: { x: 8 + i * 1.2, y: 3 + Math.sin(i) * 0.5, z: 0 }, collected: false, spinAngle: 0 })
  for (let i = 0; i < 4; i++) coins.push({ id: id++, position: { x: 25 + i * 1, y: 3, z: 0 }, collected: false, spinAngle: 0 })
  for (let i = 0; i < 5; i++) coins.push({ id: id++, position: { x: 48 + i * 1.5, y: 5 + Math.sin(i) * 0.8, z: 0 }, collected: false, spinAngle: 0 })
  for (let i = 0; i < 4; i++) coins.push({ id: id++, position: { x: 60 + i * 1.2, y: 4 + Math.sin(i) * 0.6, z: 0 }, collected: false, spinAngle: 0 })
  for (let i = 0; i < 6; i++) coins.push({ id: id++, position: { x: 89 + i, y: 2 + i, z: 0 }, collected: false, spinAngle: 0 })
  return coins
}

function createLevel5PowerUps(): PowerUp[] {
  const powerUps: PowerUp[] = []
  let id = 0
  for (const plat of createLevel5Platforms()) {
    if (plat.type === 'question' && plat.contains && plat.contains !== 'coin') {
      powerUps.push({ id: id++, type: plat.contains, position: { x: -5, y: -5, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, collected: false, active: false })
    }
  }
  return powerUps
}

function createLevel5Bosses(): Boss[] {
  return [{
    id: 102,
    name: 'Kuro II',
    title: 'The Dark Revenant',
    bossType: 'shadow',
    colorScheme: { primary: '#1a0828', accent: '#7700dd', glow: '#bb44ff' },
    position: { x: 80, y: 0.8, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    alive: true,
    health: 10,
    maxHealth: 20,
    active: false,
    defeated: false,
    direction: -1,
    phase: 'idle',
    phaseTimer: 0,
    attackCooldown: 0,
    invincible: false,
    invincibleTimer: 0,
    spawnX: 80,
    groundY: 0.8,
    scale: 2.2,
  }]
}

function createLevel6Platforms(): Platform[] {
  const platforms: Platform[] = []
  const addGround = (x: number, length: number) => {
    for (let i = 0; i < length; i++) platforms.push({ position: { x: x + i, y: 0, z: 0 }, size: { x: 1, y: 1, z: 1 }, color: '#2a1a0a', type: 'ground' })
  }
  const addBrickRow = (x: number, y: number, length: number) => {
    for (let i = 0; i < length; i++) platforms.push({ position: { x: x + i, y, z: 0 }, size: { x: 1, y: 1, z: 1 }, color: '#4a2a0a', type: 'brick' })
  }
  addGround(0, 10)
  platforms.push({ position: { x: 7, y: 1.5, z: 0 }, size: { x: 2, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'mushroom' })
  platforms.push({ position: { x: 15, y: 2, z: 0 }, size: { x: 4, y: 1, z: 1 }, color: '#5a3a1a', type: 'brick' })
  platforms.push({ position: { x: 17, y: 3, z: 0 }, size: { x: 4, y: 1, z: 1 }, color: '#5a3a1a', type: 'brick' })
  platforms.push({ position: { x: 22, y: 1.5, z: 0 }, size: { x: 2, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'star' })
  for (let i = 0; i < 10; i++) platforms.push({ position: { x: 26 + i, y: -1, z: 0 }, size: { x: 1, y: 0.5, z: 1 }, color: '#ff4400', type: 'ground', lava: true })
  platforms.push({ position: { x: 29, y: 2, z: 0 }, size: { x: 1, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'coin' })
  platforms.push({ position: { x: 31, y: 3, z: 0 }, size: { x: 1, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'coin' })
  platforms.push({
    position: { x: 38, y: 2, z: 0 }, size: { x: 3, y: 0.5, z: 1 }, color: '#aa6600', type: 'moving',
    movingAxis: 'y', movingRange: 1.5, movingSpeed: 0.8, basePosition: { x: 38, y: 2, z: 0 },
  })
  for (let i = 0; i < 6; i++) platforms.push({ position: { x: 44 + i, y: -1, z: 0 }, size: { x: 1, y: 0.5, z: 1 }, color: '#ff4400', type: 'ground', lava: true })
  addBrickRow(45, 2, 4)
  platforms.push({ position: { x: 47, y: 1.5, z: 0 }, size: { x: 2, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'flower' })
  addBrickRow(45, 4, 2)
  platforms.push({
    position: { x: 58, y: 3, z: 0 }, size: { x: 3, y: 0.5, z: 1 }, color: '#aa6600', type: 'moving',
    movingAxis: 'x', movingRange: 2, movingSpeed: 1.0, basePosition: { x: 58, y: 3, z: 0 },
  })
  addGround(64, 16)
  addBrickRow(66, 2, 3)
  addBrickRow(70, 3, 3)
  platforms.push({ position: { x: 68, y: 1.5, z: 0 }, size: { x: 2, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'coin' })
  platforms.push({ position: { x: 72, y: 4.5, z: 0 }, size: { x: 2, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'mushroom' })
  addBrickRow(80, 1, 8)
  addBrickRow(82, 2, 4)
  addBrickRow(84, 3, 2)
  addBrickRow(90, 0, 6)
  addGround(90, 6)
  platforms.push({ position: { x: 92, y: 1.5, z: 0 }, size: { x: 2, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'star' })
  return platforms
}

function createLevel6Enemies(): Enemy[] {
  const diff = getDifficultyMultiplier(6)
  return [
    { id: 0, type: 'goomba', position: { x: 5, y: 2, z: 0 }, velocity: { x: ENEMY_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
    { id: 1, type: 'ninja', position: { x: 12, y: 2, z: 0 }, velocity: { x: NINJA_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
    { id: 2, type: 'goomba', position: { x: 28, y: 2, z: 0 }, velocity: { x: -ENEMY_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1, health: Math.ceil(diff.health) },
    { id: 3, type: 'archer', position: { x: 32, y: 2, z: 0 }, velocity: { x: -ARCHER_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1, health: Math.ceil(diff.health) },
    { id: 4, type: 'sumo', position: { x: 48, y: 2, z: 0 }, velocity: { x: SUMO_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
    { id: 5, type: 'drone', position: { x: 56, y: DRONE_HOVER_HEIGHT, z: 0 }, velocity: { x: DRONE_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1 },
    { id: 6, type: 'ninja', position: { x: 68, y: 2, z: 0 }, velocity: { x: NINJA_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
    { id: 7, type: 'goomba', position: { x: 73, y: 2, z: 0 }, velocity: { x: ENEMY_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
    { id: 8, type: 'skeleton', position: { x: 76, y: 2, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1, health: Math.ceil(diff.health) },
    { id: 9, type: 'ninja', position: { x: 85, y: 4, z: 0 }, velocity: { x: -NINJA_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1, health: Math.ceil(diff.health) },
    { id: 10, type: 'goomba', position: { x: 93, y: 2, z: 0 }, velocity: { x: ENEMY_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
  ]
}

function createLevel6Coins(): Coin[] {
  return [
    { id: 0, position: { x: 4, y: 2, z: 0 }, collected: false, spinAngle: 0 },
    { id: 1, position: { x: 6, y: 2, z: 0 }, collected: false, spinAngle: 0.5 },
    { id: 2, position: { x: 16, y: 4, z: 0 }, collected: false, spinAngle: 1 },
    { id: 3, position: { x: 18, y: 5, z: 0 }, collected: false, spinAngle: 1.5 },
    { id: 4, position: { x: 38, y: 5, z: 0 }, collected: false, spinAngle: 2 },
    { id: 5, position: { x: 46, y: 3, z: 0 }, collected: false, spinAngle: 2.5 },
    { id: 6, position: { x: 48, y: 5, z: 0 }, collected: false, spinAngle: 3 },
    { id: 7, position: { x: 69, y: 3, z: 0 }, collected: false, spinAngle: 3.5 },
    { id: 8, position: { x: 71, y: 4, z: 0 }, collected: false, spinAngle: 4 },
    { id: 9, position: { x: 93, y: 3, z: 0 }, collected: false, spinAngle: 4.5 },
  ]
}

function createLevel6PowerUps(): PowerUp[] {
  return [
    { id: 0, type: 'mushroom', position: { x: -10, y: -10, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, collected: false, active: false },
    { id: 1, type: 'star', position: { x: -10, y: -10, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, collected: false, active: false },
  ]
}

function createLevel6Bosses(): Boss[] {
  return [
    {
      id: 0,
      name: 'Pyra',
      title: 'The Lava Colossus',
      bossType: 'golem',
      colorScheme: { primary: '#4a1a00', accent: '#ff4400', glow: '#ff8844' },
      position: { x: 75, y: 2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      health: 12,
      maxHealth: 12,
      alive: true,
      active: false,
      defeated: false,
      direction: -1,
      phase: 'idle',
      phaseTimer: 0,
      attackCooldown: 0,
      invincible: false,
      invincibleTimer: 0,
      spawnX: 75,
      groundY: 0.8,
      scale: 2.4,
    },
    {
      id: 1,
      name: 'Ember',
      title: 'The Flame Warden',
      bossType: 'ninja',
      colorScheme: { primary: '#3a0a00', accent: '#ff6600', glow: '#ffaa44' },
      position: { x: 95, y: 2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      health: 15,
      maxHealth: 15,
      alive: true,
      active: false,
      defeated: false,
      direction: -1,
      phase: 'idle',
      phaseTimer: 0,
      attackCooldown: 0,
      invincible: false,
      invincibleTimer: 0,
      spawnX: 95,
      groundY: 0.8,
      scale: 1,
    },
  ]
}

function createLevel7Platforms(): Platform[] {
  const platforms: Platform[] = []
  const addGround = (x: number, length: number) => {
    for (let i = 0; i < length; i++) platforms.push({ position: { x: x + i, y: 0, z: 0 }, size: { x: 1, y: 1, z: 1 }, color: '#0a0a1a', type: 'ground' })
  }
  const addBrickRow = (x: number, y: number, length: number) => {
    for (let i = 0; i < length; i++) platforms.push({ position: { x: x + i, y, z: 0 }, size: { x: 1, y: 1, z: 1 }, color: '#1a1a3a', type: 'brick' })
  }
  addGround(0, 8)
  platforms.push({ position: { x: 5, y: 1.5, z: 0 }, size: { x: 2, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'flower' })
  platforms.push({
    position: { x: 12, y: 2, z: 0 }, size: { x: 3, y: 0.5, z: 1 }, color: '#6644aa', type: 'moving',
    movingAxis: 'y', movingRange: 2, movingSpeed: 0.9, basePosition: { x: 12, y: 2, z: 0 },
  })
  platforms.push({
    position: { x: 17, y: 3.5, z: 0 }, size: { x: 3, y: 0.5, z: 1 }, color: '#6644aa', type: 'moving',
    movingAxis: 'x', movingRange: 2.5, movingSpeed: 1.1, basePosition: { x: 17, y: 3.5, z: 0 },
  })
  for (let i = 0; i < 8; i++) platforms.push({ position: { x: 22 + i, y: -1, z: 0 }, size: { x: 1, y: 0.5, z: 1 }, color: '#cc2200', type: 'ground', lava: true })
  addBrickRow(23, 2, 4)
  platforms.push({ position: { x: 26, y: 1.5, z: 0 }, size: { x: 2, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'star' })
  addBrickRow(24, 4, 2)
  platforms.push({ position: { x: 28, y: 5, z: 0 }, size: { x: 1, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'coin' })
  platforms.push({
    position: { x: 35, y: 3, z: 0 }, size: { x: 2, y: 0.5, z: 1 }, color: '#6644aa', type: 'moving',
    movingAxis: 'y', movingRange: 2.5, movingSpeed: 0.7, basePosition: { x: 35, y: 3, z: 0 },
  })
  for (let i = 0; i < 10; i++) platforms.push({ position: { x: 40 + i, y: -1, z: 0 }, size: { x: 1, y: 0.5, z: 1 }, color: '#cc2200', type: 'ground', lava: true })
  addBrickRow(42, 2, 3)
  addBrickRow(46, 3, 4)
  platforms.push({ position: { x: 44, y: 1.5, z: 0 }, size: { x: 2, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'mushroom' })
  platforms.push({ position: { x: 48, y: 4.5, z: 0 }, size: { x: 2, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'coin' })
  platforms.push({
    position: { x: 57, y: 2, z: 0 }, size: { x: 3, y: 0.5, z: 1 }, color: '#6644aa', type: 'moving',
    movingAxis: 'x', movingRange: 3, movingSpeed: 1.2, basePosition: { x: 57, y: 2, z: 0 },
  })
  addGround(63, 18)
  addBrickRow(65, 2, 3)
  addBrickRow(69, 3, 3)
  addBrickRow(73, 4, 2)
  platforms.push({ position: { x: 67, y: 1.5, z: 0 }, size: { x: 2, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'star' })
  platforms.push({ position: { x: 71, y: 5.5, z: 0 }, size: { x: 2, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'mushroom' })
  addBrickRow(81, 0, 2)
  addBrickRow(81, 1, 2)
  addGround(85, 16)
  addBrickRow(87, 2, 4)
  addBrickRow(91, 3, 4)
  addBrickRow(95, 4, 3)
  platforms.push({ position: { x: 89, y: 1.5, z: 0 }, size: { x: 2, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'coin' })
  platforms.push({ position: { x: 93, y: 5.5, z: 0 }, size: { x: 2, y: 0.4, z: 1 }, color: '#ffa500', type: 'question', contains: 'flower' })
  addBrickRow(99, 1, 6)
  addBrickRow(101, 2, 4)
  addBrickRow(103, 3, 2)
  return platforms
}

function createLevel7Enemies(): Enemy[] {
  const diff = getDifficultyMultiplier(7)
  return [
    { id: 0, type: 'ninja', position: { x: 4, y: 2, z: 0 }, velocity: { x: NINJA_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
    { id: 1, type: 'goomba', position: { x: 6, y: 2, z: 0 }, velocity: { x: ENEMY_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
    { id: 2, type: 'drone', position: { x: 14, y: DRONE_HOVER_HEIGHT, z: 0 }, velocity: { x: DRONE_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1 },
    { id: 3, type: 'ninja', position: { x: 24, y: 2, z: 0 }, velocity: { x: NINJA_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
    { id: 4, type: 'skeleton', position: { x: 27, y: 2, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1, health: Math.ceil(diff.health) },
    { id: 5, type: 'archer', position: { x: 30, y: 2, z: 0 }, velocity: { x: -ARCHER_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1, health: Math.ceil(diff.health) },
    { id: 6, type: 'sumo', position: { x: 43, y: 2, z: 0 }, velocity: { x: SUMO_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
    { id: 7, type: 'goomba', position: { x: 47, y: 2, z: 0 }, velocity: { x: -ENEMY_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1, health: Math.ceil(diff.health) },
    { id: 8, type: 'ninja', position: { x: 51, y: 5, z: 0 }, velocity: { x: NINJA_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
    { id: 9, type: 'drone', position: { x: 55, y: DRONE_HOVER_HEIGHT, z: 0 }, velocity: { x: -DRONE_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1 },
    { id: 10, type: 'skeleton', position: { x: 66, y: 2, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
    { id: 11, type: 'ninja', position: { x: 70, y: 4, z: 0 }, velocity: { x: -NINJA_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1, health: Math.ceil(diff.health) },
    { id: 12, type: 'goomba', position: { x: 74, y: 5, z: 0 }, velocity: { x: ENEMY_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
    { id: 13, type: 'archer', position: { x: 88, y: 2, z: 0 }, velocity: { x: ARCHER_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
    { id: 14, type: 'sumo', position: { x: 92, y: 2, z: 0 }, velocity: { x: -SUMO_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: -1, health: Math.ceil(diff.health) },
    { id: 15, type: 'ninja', position: { x: 96, y: 5, z: 0 }, velocity: { x: NINJA_SPEED, y: 0, z: 0 }, alive: true, stomped: false, stompTimer: 0, direction: 1, health: Math.ceil(diff.health) },
  ]
}

function createLevel7Coins(): Coin[] {
  return [
    { id: 0, position: { x: 3, y: 2, z: 0 }, collected: false, spinAngle: 0 },
    { id: 1, position: { x: 5, y: 3, z: 0 }, collected: false, spinAngle: 0.5 },
    { id: 2, position: { x: 12, y: 5, z: 0 }, collected: false, spinAngle: 1 },
    { id: 3, position: { x: 17, y: 6, z: 0 }, collected: false, spinAngle: 1.5 },
    { id: 4, position: { x: 25, y: 3, z: 0 }, collected: false, spinAngle: 2 },
    { id: 5, position: { x: 35, y: 6, z: 0 }, collected: false, spinAngle: 2.5 },
    { id: 6, position: { x: 44, y: 3, z: 0 }, collected: false, spinAngle: 3 },
    { id: 7, position: { x: 49, y: 6, z: 0 }, collected: false, spinAngle: 3.5 },
    { id: 8, position: { x: 57, y: 5, z: 0 }, collected: false, spinAngle: 4 },
    { id: 9, position: { x: 68, y: 3, z: 0 }, collected: false, spinAngle: 4.5 },
    { id: 10, position: { x: 72, y: 5, z: 0 }, collected: false, spinAngle: 5 },
    { id: 11, position: { x: 89, y: 3, z: 0 }, collected: false, spinAngle: 5.5 },
    { id: 12, position: { x: 93, y: 4, z: 0 }, collected: false, spinAngle: 6 },
  ]
}

function createLevel7PowerUps(): PowerUp[] {
  return [
    { id: 0, type: 'mushroom', position: { x: -10, y: -10, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, collected: false, active: false },
    { id: 1, type: 'star', position: { x: -10, y: -10, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, collected: false, active: false },
    { id: 2, type: 'flower', position: { x: -10, y: -10, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, collected: false, active: false },
  ]
}

function createLevel7Bosses(): Boss[] {
  return [
    {
      id: 0,
      name: 'Nyx',
      title: 'The Shadow Sovereign',
      bossType: 'shadow',
      colorScheme: { primary: '#0a0020', accent: '#6600cc', glow: '#aa44ff' },
      position: { x: 80, y: 2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      health: 16,
      maxHealth: 16,
      alive: true,
      active: false,
      defeated: false,
      direction: -1,
      phase: 'idle',
      phaseTimer: 0,
      attackCooldown: 0,
      invincible: false,
      invincibleTimer: 0,
      spawnX: 80,
      groundY: 0.8,
      scale: 2.0,
    },
    {
      id: 1,
      name: 'Umbral',
      title: 'The Final Darkness',
      bossType: 'shadow',
      colorScheme: { primary: '#050010', accent: '#9900ff', glow: '#dd66ff' },
      position: { x: 98, y: 2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      health: 22,
      maxHealth: 22,
      alive: true,
      active: false,
      defeated: false,
      direction: -1,
      phase: 'idle',
      phaseTimer: 0,
      attackCooldown: 0,
      invincible: false,
      invincibleTimer: 0,
      spawnX: 98,
      groundY: 0.8,
      scale: 2.5,
    },
  ]
}

export function loadLevelData(level: number): {
  platforms: Platform[]
  enemies: Enemy[]
  coins: Coin[]
  powerUps: PowerUp[]
  bosses: Boss[]
  spawners: RollingStoneSpawner[]
} {
  const levelLoaders: Record<number, () => {
    platforms: Platform[]
    enemies: Enemy[]
    coins: Coin[]
    powerUps: PowerUp[]
    bosses: Boss[]
    spawners: RollingStoneSpawner[]
  }> = {
    1: () => ({
      platforms: createLevel1Platforms(),
      enemies: createLevel1Enemies(),
      coins: createLevel1Coins(),
      powerUps: createLevel1PowerUps(),
      bosses: createBosses(),
      spawners: [],
    }),
    2: () => ({
      platforms: createLevel2Platforms(),
      enemies: createLevel2Enemies(),
      coins: createLevel2Coins(),
      powerUps: createLevel2PowerUps(),
      bosses: createLevel2Bosses(),
      spawners: [],
    }),
    3: () => ({
      platforms: createLevel3Platforms(),
      enemies: createLevel3Enemies(),
      coins: createLevel3Coins(),
      powerUps: createLevel3PowerUps(),
      bosses: createLevel3Bosses(),
      spawners: [
        { position: { x: 48, y: 5, z: 0 }, direction: -1, interval: ROLLING_STONE_SPAWN_INTERVAL, timer: 0, speed: ROLLING_STONE_SPEED, radius: ROLLING_STONE_RADIUS },
        { position: { x: 80, y: 5, z: 0 }, direction: -1, interval: ROLLING_STONE_SPAWN_INTERVAL, timer: 60, speed: ROLLING_STONE_SPEED * 1.1, radius: ROLLING_STONE_RADIUS },
      ],
    }),
    4: () => ({
      platforms: createLevel4Platforms(),
      enemies: createLevel4Enemies(),
      coins: createLevel4Coins(),
      powerUps: createLevel4PowerUps(),
      bosses: createLevel4Bosses(),
      spawners: [
        { position: { x: 35, y: 4, z: 0 }, direction: -1, interval: ROLLING_STONE_SPAWN_INTERVAL * 0.8, timer: 0, speed: ROLLING_STONE_SPEED * 1.1, radius: ROLLING_STONE_RADIUS },
        { position: { x: 70, y: 4, z: 0 }, direction: -1, interval: ROLLING_STONE_SPAWN_INTERVAL, timer: 80, speed: ROLLING_STONE_SPEED, radius: ROLLING_STONE_RADIUS },
      ],
    }),
    5: () => ({
      platforms: createLevel5Platforms(),
      enemies: createLevel5Enemies(),
      coins: createLevel5Coins(),
      powerUps: createLevel5PowerUps(),
      bosses: createLevel5Bosses(),
      spawners: [
        { position: { x: 50, y: 5, z: 0 }, direction: -1, interval: ROLLING_STONE_SPAWN_INTERVAL * 0.7, timer: 0, speed: ROLLING_STONE_SPEED * 1.2, radius: ROLLING_STONE_RADIUS },
        { position: { x: 82, y: 5, z: 0 }, direction: -1, interval: ROLLING_STONE_SPAWN_INTERVAL * 0.8, timer: 40, speed: ROLLING_STONE_SPEED * 1.1, radius: ROLLING_STONE_RADIUS },
      ],
    }),
    6: () => ({
      platforms: createLevel6Platforms(),
      enemies: createLevel6Enemies(),
      coins: createLevel6Coins(),
      powerUps: createLevel6PowerUps(),
      bosses: createLevel6Bosses(),
      spawners: [
        { position: { x: 30, y: 3, z: 0 }, direction: -1, interval: ROLLING_STONE_SPAWN_INTERVAL * 0.6, timer: 0, speed: ROLLING_STONE_SPEED * 1.3, radius: ROLLING_STONE_RADIUS },
        { position: { x: 66, y: 3, z: 0 }, direction: -1, interval: ROLLING_STONE_SPAWN_INTERVAL * 0.7, timer: 50, speed: ROLLING_STONE_SPEED * 1.2, radius: ROLLING_STONE_RADIUS },
        { position: { x: 92, y: 3, z: 0 }, direction: -1, interval: ROLLING_STONE_SPAWN_INTERVAL, timer: 100, speed: ROLLING_STONE_SPEED, radius: ROLLING_STONE_RADIUS },
      ],
    }),
    7: () => ({
      platforms: createLevel7Platforms(),
      enemies: createLevel7Enemies(),
      coins: createLevel7Coins(),
      powerUps: createLevel7PowerUps(),
      bosses: createLevel7Bosses(),
      spawners: [
        { position: { x: 42, y: 4, z: 0 }, direction: -1, interval: ROLLING_STONE_SPAWN_INTERVAL * 0.5, timer: 0, speed: ROLLING_STONE_SPEED * 1.4, radius: ROLLING_STONE_RADIUS },
        { position: { x: 72, y: 4, z: 0 }, direction: -1, interval: ROLLING_STONE_SPAWN_INTERVAL * 0.6, timer: 30, speed: ROLLING_STONE_SPEED * 1.3, radius: ROLLING_STONE_RADIUS },
        { position: { x: 95, y: 4, z: 0 }, direction: -1, interval: ROLLING_STONE_SPAWN_INTERVAL * 0.7, timer: 70, speed: ROLLING_STONE_SPEED * 1.2, radius: ROLLING_STONE_RADIUS },
      ],
    }),
  }

  return (levelLoaders[level] || levelLoaders[7])()
}