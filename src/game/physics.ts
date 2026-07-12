'use client'

import type { Enemy, Platform } from '@/types/game'

export function resolveAABB(
  px: number, py: number, pw: number, ph: number,
  bx: number, by: number, bw: number, bh: number,
  velY = 0
): { hit: boolean; normalX: number; normalY: number; overlapX: number; overlapY: number } {
  const halfPW = pw / 2
  const halfPH = ph / 2
  const halfBW = bw / 2
  const halfBH = bh / 2

  const dx = px - bx
  const dy = py - by

  const overlapX = (halfPW + halfBW) - Math.abs(dx)
  const overlapY = (halfPH + halfBH) - Math.abs(dy)

  if (overlapX <= 0 || overlapY <= 0) {
    return { hit: false, normalX: 0, normalY: 0, overlapX: 0, overlapY: 0 }
  }

  if (velY !== 0 && overlapX > overlapY * 0.8) {
    const normalY = velY < 0 ? 1 : (dy > 0 ? 1 : -1)
    return { hit: true, normalX: 0, normalY, overlapX, overlapY }
  }

  if (overlapX < overlapY) {
    const normalX = dx > 0 ? 1 : -1
    return { hit: true, normalX, normalY: 0, overlapX, overlapY }
  }

  const normalY = dy > 0 ? 1 : -1
  return { hit: true, normalX: 0, normalY, overlapX, overlapY }
}

export function getEnemyVisualScale(type: string): number {
  switch (type) {
    case 'sumo': return 1.4
    case 'skeleton': return 1.2
    case 'ninja': return 1.25
    case 'archer': return 1.2
    case 'goomba': return 1.0
    case 'koopa': return 1.05
    case 'mushroom': return 1.0
    case 'drone': return 1.1
    default: return 1.0
  }
}

export function moveEnemyOnPlatforms(enemy: Enemy, platList: Platform[]): boolean {
  let onGround = false
  let hitWall = false
  const eScale = getEnemyVisualScale(enemy.type)
  const halfW = 0.5 * eScale
  const halfH = 0.6 * eScale
  for (const plat of platList) {
    if (plat.size.x === 0) continue
    const res = resolveAABB(
      enemy.position.x, enemy.position.y, halfW * 2, halfH * 2,
      plat.position.x, plat.position.y, plat.size.x, plat.size.y,
      enemy.velocity.y
    )
    if (res.hit) {
      if (res.normalY > 0) {
        enemy.position.y += res.overlapY
        if (enemy.velocity.y < 0) enemy.velocity.y = 0
        onGround = true
      } else if (res.normalY < 0) {
        enemy.position.y -= res.overlapY
        if (enemy.velocity.y > 0) enemy.velocity.y = 0
      } else {
        enemy.position.x += res.normalX * res.overlapX
        enemy.velocity.x *= -1
        enemy.direction *= -1
        hitWall = true
      }
    }
  }

  if (!onGround && enemy.velocity.y <= 0) {
    const enemyBottom = enemy.position.y - 0.3
    for (const plat of platList) {
      if (plat.size.x === 0) continue
      const halfBW = plat.size.x / 2
      const platTop = plat.position.y + plat.size.y / 2
      if (Math.abs(enemy.position.x - plat.position.x) < halfBW + 0.25 + 0.05) {
        const gap = enemyBottom - platTop
        if (gap >= -0.15 && gap <= 0.15) {
          enemy.position.y = platTop + 0.3
          enemy.velocity.y = 0
          onGround = true
          break
        }
      }
    }
  }

  let highestGround = -Infinity
  for (const plat of platList) {
    if (plat.size.x === 0) continue
    const halfBW = plat.size.x / 2
    const platTop = plat.position.y + plat.size.y / 2
    if (Math.abs(enemy.position.x - plat.position.x) < halfBW + 0.25) {
      if (platTop > highestGround && platTop <= enemy.position.y + 0.5) {
        highestGround = platTop
      }
    }
  }
  if (highestGround > -Infinity && enemy.position.y - 0.3 < highestGround) {
    enemy.position.y = highestGround + 0.3
    enemy.velocity.y = 0
    onGround = true
  }

  if (onGround) {
    let standingPlatTop = -Infinity
    for (const plat of platList) {
      if (plat.size.x === 0) continue
      const halfBW = plat.size.x / 2
      const platTop = plat.position.y + plat.size.y / 2
      if (Math.abs(enemy.position.x - plat.position.x) < halfBW + 0.3) {
        if (Math.abs((enemy.position.y - 0.3) - platTop) < 0.4 && platTop > standingPlatTop) {
          standingPlatTop = platTop
        }
      }
    }
    const probeY = standingPlatTop > -Infinity ? standingPlatTop + 0.1 : enemy.position.y - 0.35
    const lookAheadDist = 0.8 + Math.abs(enemy.velocity.x) * 8
    let groundAhead = false
    for (const plat of platList) {
      if (plat.size.x === 0) continue
      const halfBW = plat.size.x / 2
      const halfBH = plat.size.y / 2
      const platTop = plat.position.y + halfBH
      const lookAheadX = enemy.position.x + enemy.direction * lookAheadDist
      if (
        Math.abs(lookAheadX - plat.position.x) < halfBW + 0.1 &&
        probeY >= platTop - 0.6 &&
        probeY <= platTop + 0.6
      ) {
        groundAhead = true
        break
      }
    }
    if (!groundAhead) {
      enemy.velocity.x *= -1
      enemy.direction *= -1
      hitWall = true
    }
  }

  return hitWall
}