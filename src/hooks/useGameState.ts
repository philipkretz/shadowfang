'use client'

import { useCallback, useRef } from 'react'
import type { PlayerState, GameState, Enemy, Coin, Platform, Particle, PowerUp, Boss, Shuriken, Fireball, Arrow, RollingStone } from '@/types/game'
import {
  GRAVITY, TERMINAL_VELOCITY, JUMP_FORCE, DOUBLE_JUMP_FORCE, JUMP_CUT_MULTIPLIER,
  MAX_SPEED, GROUND_ACCEL, AIR_ACCEL, GROUND_FRICTION, AIR_FRICTION,
  COYOTE_TIME, JUMP_BUFFER_TIME, PLAYER_WIDTH, PLAYER_HEIGHT,
  ENEMY_GRAVITY, ENEMY_TERMINAL_VELOCITY, ENEMY_BOUNCE, ENEMY_SPEED,
  BOSS_SPEED, BOSS_CHASE_SPEED, BOSS_JUMP_FORCE, BOSS_SHURIKEN_SPEED, BOSS_SHURIKEN_LIFETIME,
  BOSS_WIDTH, BOSS_HEIGHT, FIREBALL_SPEED, FIREBALL_LIFETIME,
  COMBO_TIMEOUT, COMBO_BONUS_PER_KILL, LAVA_DAMAGE_INTERVAL, LAVA_KNOCKBACK_FORCE,
  NINJA_SPEED, NINJA_JUMP_FORCE, ARCHER_SPEED, ARROW_SPEED, ARROW_LIFETIME,
  SUMO_SPEED, SUMO_CHARGE_SPEED, SUMO_CHARGE_DISTANCE,
  MUSHROOM_BOUNCE_FORCE, MUSHROOM_SPEED, BONE_SPEED, BONE_LIFETIME,
  DRONE_SPEED, DRONE_HOVER_HEIGHT, DRONE_HOVER_AMPLITUDE, DRONE_BULLET_SPEED, DRONE_BULLET_LIFETIME,
  DRONE_CHASE_RANGE, GOLEM_GROUND_POUND_FORCE, GOLEM_ROCK_SPEED, GOLEM_ROCK_LIFETIME,
  GOLEM_SHOCKWAVE_SPEED, GOLEM_SHOCKWAVE_LIFETIME, GOLEM_CHARGE_SPEED,
  STORM_LIGHTNING_SPEED, STORM_LIGHTNING_LIFETIME, STORM_GUST_FORCE,
  SHADOW_DARK_BALL_SPEED, SHADOW_DARK_BALL_LIFETIME, SHADOW_TELEPORT_COOLDOWN,
} from '@/game/constants'
import { getDifficultyMultiplier, loadLevelData } from '@/game/levels'
import { resolveAABB, getEnemyVisualScale, moveEnemyOnPlatforms } from '@/game/physics'

export function useGameState() {
  const player = useRef<PlayerState>({
    position: { x: 0, y: 2, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    onGround: false,
    jumping: false,
    doubleJumped: false,
    facing: 1,
    big: false,
    star: false,
    starTimer: 0,
    flower: false,
    invincible: false,
    invincibleTimer: 0,
    animFrame: 0,
    animTimer: 0,
    dead: false,
    deathTimer: 0,
  })

  const game = useRef<GameState>({
    score: 0,
    coins: 0,
    lives: 5,
    level: 1,
    time: 300,
    gameOver: false,
    paused: false,
    started: false,
    levelComplete: false,
    bossDefeated: false,
    bossFightActive: false,
    bossIndex: 0,
    pendingEvents: [],
    combo: 0,
    comboTimer: 0,
      screenShake: 0,
      screenShakeTimer: 0,
      transitionTimer: 0,
      transitioning: false,
    })

  const platforms = useRef<Platform[]>([])
  const enemies = useRef<Enemy[]>([])
  const coins = useRef<Coin[]>([])
  const powerUps = useRef<PowerUp[]>([])
  const particles = useRef<Particle[]>([])
  const bosses = useRef<Boss[]>([])
  const shurikens = useRef<Shuriken[]>([])
  const fireballs = useRef<Fireball[]>([])
  const arrows = useRef<Arrow[]>([])
  const bossTriggered = useRef<Set<number>>(new Set())
  const standingPlatform = useRef<Platform | null>(null)
  const rollingStones = useRef<RollingStone[]>([])
  const rollingSpawners = useRef<{ position: { x: number; y: number; z: number }; direction: number; interval: number; timer: number; speed: number; radius: number }[]>([])
  const lavaDamageTimer = useRef(0)

  const loadLevel = useCallback((level: number) => {
    const data = loadLevelData(level)
    platforms.current = data.platforms
    enemies.current = data.enemies
    coins.current = data.coins
    powerUps.current = data.powerUps
    bosses.current = data.bosses
    shurikens.current = []
    fireballs.current = []
    arrows.current = []
    particles.current = []
    rollingStones.current = []
    bossTriggered.current = new Set()
    lavaDamageTimer.current = LAVA_DAMAGE_INTERVAL
    rollingSpawners.current = data.spawners.map(s => ({ ...s }))
    const diff = getDifficultyMultiplier(level)
    for (const e of enemies.current) {
      if (e.velocity.x !== 0) e.velocity.x = e.velocity.x > 0 ? Math.abs(e.velocity.x) * diff.speed : -Math.abs(e.velocity.x) * diff.speed
      if (e.health) e.health = Math.ceil(e.health * diff.health)
    }
    for (const b of bosses.current) {
      b.health = Math.ceil(b.maxHealth * diff.health)
      b.maxHealth = b.health
    }
    player.current.invincible = true
    player.current.invincibleTimer = 2
  }, [])

  const initialized = useRef(false)
  if (!initialized.current) {
    initialized.current = true
    loadLevel(1)
  }

  const physicsState = useRef({
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    wasOnGround: false,
    prevJump: false,
  })

  const addParticles = useCallback((x: number, y: number, count: number, color: string) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const speed = 0.08 + Math.random() * 0.12
      particles.current.push({
        position: { x, y, z: (Math.random() - 0.5) * 1.5 },
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed * 0.8 + 0.04,
          z: (Math.random() - 0.5) * 0.06
        },
        life: 0.7 + Math.random() * 0.6,
        maxLife: 1,
        color,
        size: 0.04 + Math.random() * 0.12
      })
    }
  }, [])

  const update = useCallback((dt: number, input: { left: boolean; right: boolean; jump: boolean; attack: boolean }) => {
    if (game.current.paused || game.current.gameOver || !game.current.started) return

    const p = player.current
    const g = game.current
    const ps = physicsState.current
    const jumpJustPressed = input.jump && !ps.prevJump
    ps.prevJump = input.jump

    if (p.dead) {
      p.deathTimer += dt
      p.velocity.y += GRAVITY * dt * 1.8
      p.position.y += p.velocity.y * dt * 1.8
      if (p.deathTimer > 2) {
        g.lives--
        if (g.lives <= 0) {
          g.gameOver = true
          g.pendingEvents.push('gameOver')
        } else {
          p.dead = false
          p.deathTimer = 0
          p.position = { x: 0, y: 2, z: 0 }
          p.velocity = { x: 0, y: 0, z: 0 }
          p.big = false
          p.star = false
          ps.coyoteTimer = 0
          ps.jumpBufferTimer = 0
        }
      }
      return
    }

    g.time -= dt * 0.010
    if (g.time <= 0) {
      g.time = 0
      p.dead = true
      p.deathTimer = 0
      p.velocity.y = JUMP_FORCE
    }

    if (p.star) {
      p.starTimer -= dt * 0.016
      if (p.starTimer <= 0) p.star = false
    }

    if (p.invincible) {
      p.invincibleTimer -= dt * 0.016
      if (p.invincibleTimer <= 0) p.invincible = false
    }

    if (g.combo > 0) {
      g.comboTimer -= dt
      if (g.comboTimer <= 0) {
        g.combo = 0
      }
    }

    if (g.screenShakeTimer > 0) {
      g.screenShakeTimer -= dt
      if (g.screenShakeTimer <= 0) {
        g.screenShake = 0
      } else {
        g.screenShake = g.screenShakeTimer / 10
      }
    }

    const accel = p.onGround ? GROUND_ACCEL : AIR_ACCEL
    const friction = p.onGround ? GROUND_FRICTION : AIR_FRICTION

    if (input.left) {
      p.velocity.x = Math.max(p.velocity.x - accel * dt, -MAX_SPEED)
      p.facing = -1
    } else if (input.right) {
      p.velocity.x = Math.min(p.velocity.x + accel * dt, MAX_SPEED)
      p.facing = 1
    } else {
      p.velocity.x *= Math.pow(friction, dt)
      if (Math.abs(p.velocity.x) < 0.005) p.velocity.x = 0
    }

    if (p.onGround) {
      ps.coyoteTimer = COYOTE_TIME
    } else {
      ps.coyoteTimer = Math.max(ps.coyoteTimer - dt, 0)
    }

    if (jumpJustPressed) {
      ps.jumpBufferTimer = JUMP_BUFFER_TIME
    } else {
      ps.jumpBufferTimer = Math.max(ps.jumpBufferTimer - dt, 0)
    }

    if (ps.jumpBufferTimer > 0) {
      if (ps.coyoteTimer > 0) {
        p.velocity.y = JUMP_FORCE
        ps.coyoteTimer = 0
        ps.jumpBufferTimer = 0
        p.onGround = false
        p.jumping = true
        p.doubleJumped = false
        addParticles(p.position.x, p.position.y - PLAYER_HEIGHT / 2, 6, '#cccccc')
      } else if (!p.doubleJumped && !p.onGround) {
        p.velocity.y = DOUBLE_JUMP_FORCE
        ps.jumpBufferTimer = 0
        p.doubleJumped = true
        p.jumping = true
        addParticles(p.position.x, p.position.y - PLAYER_HEIGHT / 2, 8, '#88ccff')
        g.pendingEvents.push('doubleJump')
      }
    }

    if (!input.jump && p.jumping && p.velocity.y > 0) {
      p.velocity.y *= JUMP_CUT_MULTIPLIER
      p.jumping = false
    }

    if (input.attack && p.flower && !p.dead) {
      input.attack = false
      const existingFireballs = fireballs.current.filter(f => f.active).length
      if (existingFireballs < 3) {
        fireballs.current.push({
          id: Date.now(),
          position: { x: p.position.x + p.facing * 0.5, y: p.position.y + 0.1, z: 0 },
          velocity: { x: p.facing * FIREBALL_SPEED, y: 0.06, z: 0 },
          rotation: 0,
          active: true,
          lifetime: FIREBALL_LIFETIME,
        })
        g.pendingEvents.push('fireball')
      }
    }

    p.velocity.y += GRAVITY * dt
    if (p.velocity.y < TERMINAL_VELOCITY) p.velocity.y = TERMINAL_VELOCITY

    const prevBottomY = p.position.y - PLAYER_HEIGHT / 2
    p.position.x += p.velocity.x * dt
    p.position.y += p.velocity.y * dt

    const preCollisionVelY = p.velocity.y

    p.animTimer += dt * 0.016
    const speedRatio = Math.abs(p.velocity.x) / MAX_SPEED
    const animSpeed = p.onGround ? 0.06 + (1 - speedRatio) * 0.08 : 0.04
    if (p.animTimer > animSpeed) {
      p.animTimer = 0
      p.animFrame = (p.animFrame + 1) % 4
    }

    p.onGround = false
    const platList = platforms.current

    if (standingPlatform.current) {
      const sp = standingPlatform.current
      if (sp.type === 'moving' && sp.movingAxis && sp.movingRange && sp.movingSpeed && sp.basePosition) {
        const prevX = sp.position.x
        const prevY = sp.position.y
        const offset = Math.sin(Date.now() * 0.001 * sp.movingSpeed) * sp.movingRange
        if (sp.movingAxis === 'y') {
          sp.position.y = sp.basePosition.y + offset
        } else {
          sp.position.x = sp.basePosition.x + offset
        }
        p.position.x += sp.position.x - prevX
        p.position.y += sp.position.y - prevY
      }
      standingPlatform.current = null
    }

    for (const plat of platList) {
      if (plat.type === 'moving' && plat.movingAxis && plat.movingRange && plat.movingSpeed && plat.basePosition) {
        const offset = Math.sin(Date.now() * 0.001 * plat.movingSpeed) * plat.movingRange
        if (plat.movingAxis === 'y') {
          plat.position.y = plat.basePosition.y + offset
        } else {
          plat.position.x = plat.basePosition.x + offset
        }
      }

      if (plat.size.x === 0 || plat.type === 'cloud') continue

      const halfPW = PLAYER_WIDTH / 2
      const halfPH = PLAYER_HEIGHT / 2
      const halfBW = plat.size.x / 2
      const halfBH = plat.size.y / 2
      const dx = p.position.x - plat.position.x
      const dy = p.position.y - plat.position.y
      const overlapX = (halfPW + halfBW) - Math.abs(dx)
      const overlapY = (halfPH + halfBH) - Math.abs(dy)

      if (overlapX <= 0 || overlapY <= 0) continue

      const playerFeet = p.position.y - PLAYER_HEIGHT / 2
      const platTop = plat.position.y + plat.size.y / 2
      const stepUpHeight = 0.45
      const isStepUp = overlapY > 0 && overlapY <= stepUpHeight && p.velocity.x !== 0 && playerFeet >= platTop - stepUpHeight && dy < 0
      const isClimbing = dy < 0 && p.velocity.x !== 0 && overlapX < 0.15 && overlapY > 0 && overlapY <= PLAYER_HEIGHT

      const preferY = overlapY < overlapX || isStepUp || isClimbing || (overlapY === overlapX && p.velocity.y !== 0)

      if (preferY) {
        let normalY: number
        if (isStepUp || isClimbing) {
          normalY = 1
        } else if (preCollisionVelY < -0.05) {
          normalY = 1
        } else if (preCollisionVelY > 0.05) {
          normalY = -1
        } else {
          normalY = dy > 0 ? 1 : -1
        }
        if (normalY > 0) {
          p.position.y = platTop + PLAYER_HEIGHT / 2
        } else {
          p.position.y += normalY * overlapY
        }
        if (normalY > 0) {
          p.onGround = true
          p.doubleJumped = false
          if (p.velocity.y < 0) p.velocity.y = 0

          if (plat.type === 'question' && !plat.hit && plat.contains) {
            plat.hit = true
            plat.color = '#a08030'
            if (plat.contains === 'coin') {
              g.coins++
              g.score += 100
              g.pendingEvents.push('coin')
              addParticles(plat.position.x, plat.position.y + 0.8, 8, '#ffd700')
            } else if (plat.contains === 'mushroom') {
              const pu = powerUps.current.find(pu => pu.type === 'mushroom' && !pu.collected && !pu.active)
              if (pu) {
                pu.position = { x: plat.position.x, y: plat.position.y + 1, z: 0 }
                pu.velocity = { x: 0.06, y: 0, z: 0 }
                pu.active = true
              }
            } else if (plat.contains === 'star') {
              const pu = powerUps.current.find(pu => pu.type === 'star' && !pu.collected && !pu.active)
              if (pu) {
                pu.position = { x: plat.position.x, y: plat.position.y + 1, z: 0 }
                pu.velocity = { x: 0.07, y: 0.16, z: 0 }
                pu.active = true
              }
            } else if (plat.contains === 'flower') {
              const pu = powerUps.current.find(pu => pu.type === 'flower' && !pu.collected && !pu.active)
              if (pu) {
                pu.position = { x: plat.position.x, y: plat.position.y + 1, z: 0 }
                pu.velocity = { x: 0, y: 0.12, z: 0 }
                pu.active = true
              }
            }
          }

          if (plat.type === 'brick' && p.big) {
            plat.color = 'transparent'
            plat.size = { x: 0, y: 0, z: 0 }
            addParticles(plat.position.x, plat.position.y, 12, '#e08040')
          }
        } else {
          if (p.velocity.y > 0) p.velocity.y = 0
          if (plat.type === 'question' && !plat.hit && plat.contains) {
            plat.hit = true
            plat.color = '#a08030'
            if (plat.contains === 'coin') {
              g.coins++
              g.score += 100
              g.pendingEvents.push('coin')
              addParticles(plat.position.x, plat.position.y + 0.8, 8, '#ffd700')
            } else if (plat.contains === 'mushroom') {
              const pu = powerUps.current.find(pu => pu.type === 'mushroom' && !pu.collected && !pu.active)
              if (pu) {
                pu.position = { x: plat.position.x, y: plat.position.y + 1, z: 0 }
                pu.velocity = { x: 0.06, y: 0, z: 0 }
                pu.active = true
              }
            } else if (plat.contains === 'star') {
              const pu = powerUps.current.find(pu => pu.type === 'star' && !pu.collected && !pu.active)
              if (pu) {
                pu.position = { x: plat.position.x, y: plat.position.y + 1, z: 0 }
                pu.velocity = { x: 0.07, y: 0.16, z: 0 }
                pu.active = true
              }
            } else if (plat.contains === 'flower') {
              const pu = powerUps.current.find(pu => pu.type === 'flower' && !pu.collected && !pu.active)
              if (pu) {
                pu.position = { x: plat.position.x, y: plat.position.y + 1, z: 0 }
                pu.velocity = { x: 0, y: 0.12, z: 0 }
                pu.active = true
              }
            }
          }
        }
      } else {
        const normalX = dx > 0 ? 1 : -1
        p.position.x += normalX * overlapX
        if (Math.abs(p.velocity.x) > 0.05) {
          addParticles(
            p.position.x - normalX * PLAYER_WIDTH / 2,
            p.position.y,
            3,
            '#aaaaaa'
          )
        }
        p.velocity.x = 0
      }
    }

    if (!p.onGround && p.velocity.y <= 0) {
      const playerBottom = p.position.y - PLAYER_HEIGHT / 2
      const halfPW = PLAYER_WIDTH / 2
      for (const plat of platList) {
        if (plat.size.x === 0 || plat.type === 'cloud') continue
        const halfBW = plat.size.x / 2
        const platTop = plat.position.y + plat.size.y / 2
        if (Math.abs(p.position.x - plat.position.x) < halfPW + halfBW + 0.05) {
          const gap = playerBottom - platTop
          if (gap >= -0.12 && gap <= 0.15) {
            p.position.y = platTop + PLAYER_HEIGHT / 2
            p.onGround = true
            p.doubleJumped = false
            p.velocity.y = 0
            break
          }
        }
      }
    }

    const playerBottomFinal = p.position.y - PLAYER_HEIGHT / 2
    const halfPWFinal = PLAYER_WIDTH / 2
    let highestSurface = -Infinity
    for (const plat of platList) {
      if (plat.size.x === 0 || plat.type === 'cloud') continue
      const halfBW = plat.size.x / 2
      const platTop = plat.position.y + plat.size.y / 2
      if (Math.abs(p.position.x - plat.position.x) < halfPWFinal + halfBW + 0.1) {
        if (platTop > highestSurface && platTop <= p.position.y + PLAYER_HEIGHT / 2 + 0.05) {
          highestSurface = platTop
        }
      }
    }
    if (highestSurface > -Infinity && playerBottomFinal < highestSurface) {
      p.position.y = highestSurface + PLAYER_HEIGHT / 2
      if (!p.onGround) {
        p.onGround = true
        p.doubleJumped = false
      }
      p.velocity.y = 0
    }

    if (!p.onGround && preCollisionVelY < 0) {
      const curBottom = p.position.y - PLAYER_HEIGHT / 2
      const halfPW = PLAYER_WIDTH / 2
      for (const plat of platList) {
        if (plat.size.x === 0 || plat.type === 'cloud') continue
        const halfBW = plat.size.x / 2
        const platTop = plat.position.y + plat.size.y / 2
        if (Math.abs(p.position.x - plat.position.x) < halfPW + halfBW + 0.05) {
          if (prevBottomY >= platTop && curBottom < platTop) {
            p.position.y = platTop + PLAYER_HEIGHT / 2
            p.onGround = true
            p.doubleJumped = false
            p.velocity.y = 0
            break
          }
        }
      }
    }

    if (p.onGround && !standingPlatform.current) {
      for (const plat of platList) {
        if (plat.type === 'moving' && plat.size.x > 0) {
          const res = resolveAABB(
            p.position.x, p.position.y, PLAYER_WIDTH, PLAYER_HEIGHT,
            plat.position.x, plat.position.y, plat.size.x, plat.size.y,
            p.velocity.y
          )
          if (res.hit && res.normalY > 0) {
            standingPlatform.current = plat
            break
          }
        }
      }
    }

    for (const coin of coins.current) {
      if (coin.collected) continue
      coin.spinAngle += dt * 0.06
      const distX = Math.abs(p.position.x - coin.position.x)
      const distY = Math.abs(p.position.y - coin.position.y)
      if (distX < 0.5 && distY < 0.6) {
        coin.collected = true
        g.coins++
        g.score += 200
        g.pendingEvents.push('coin')
        addParticles(coin.position.x, coin.position.y, 10, '#ffd700')
      }
    }

    for (const pu of powerUps.current) {
      if (!pu.active || pu.collected) continue
      pu.position.x += pu.velocity.x * dt
      pu.position.y += pu.velocity.y * dt
      pu.velocity.y += ENEMY_GRAVITY * dt * 0.6

      if (pu.position.y < 0.5) {
        pu.position.y = 0.5
        pu.velocity.y = ENEMY_BOUNCE
      }

      for (const plat of platList) {
        if (plat.size.x === 0 || plat.type === 'cloud') continue
        const puRes = resolveAABB(pu.position.x, pu.position.y, 0.5, 0.5, plat.position.x, plat.position.y, plat.size.x, plat.size.y)
        if (puRes.hit) {
          if (puRes.normalY !== 0) {
            pu.position.y += puRes.normalY * puRes.overlapY
            pu.velocity.y = 0
          } else {
            pu.velocity.x *= -1
          }
        }
      }

      const puDistX = Math.abs(p.position.x - pu.position.x)
      const puDistY = Math.abs(p.position.y - pu.position.y)
      if (puDistX < 0.55 && puDistY < 0.65) {
        pu.collected = true
        pu.active = false
        if (pu.type === 'mushroom') {
          p.big = true
          g.score += 1000
          g.pendingEvents.push('powerUp')
        } else if (pu.type === 'star') {
          p.star = true
          p.starTimer = 10
          g.score += 500
          g.pendingEvents.push('starPower')
        } else if (pu.type === 'flower') {
          p.flower = true
          g.score += 1500
          g.pendingEvents.push('powerUp')
        }
        addParticles(pu.position.x, pu.position.y, 15, pu.type === 'star' ? '#ffff00' : '#ff4444')
      }
    }

    for (const enemy of enemies.current) {
      if (!enemy.alive) continue

      if (enemy.stomped) {
        enemy.stompTimer += dt * 0.016
        if (enemy.stompTimer > 0.5) {
          addParticles(enemy.position.x, enemy.position.y, 6, '#cccccc')
          enemy.alive = false
        }
        continue
      }

      if (enemy.type === 'ninja') {
        const distToPlayerX = Math.abs(p.position.x - enemy.position.x)
        if (distToPlayerX < 7) {
          enemy.direction = p.position.x > enemy.position.x ? 1 : -1
          enemy.velocity.x = enemy.direction * NINJA_SPEED
        }
        if (enemy.velocity.y === 0 && distToPlayerX < 5 && Math.random() < 0.012 * dt) {
          enemy.velocity.y = NINJA_JUMP_FORCE
        }
      }

      if (enemy.type === 'archer') {
        const distToPlayerX = Math.abs(p.position.x - enemy.position.x)
        if (distToPlayerX < 12 && distToPlayerX > 2) {
          enemy.direction = p.position.x > enemy.position.x ? 1 : -1
          enemy.velocity.x = enemy.direction * ARCHER_SPEED
          if (Math.random() < 0.006 * dt && enemy.velocity.y === 0) {
            arrows.current.push({
              id: Date.now() + Math.random(),
              position: { x: enemy.position.x + enemy.direction * 0.3, y: enemy.position.y + 0.1, z: 0 },
              velocity: { x: enemy.direction * ARROW_SPEED, y: 0, z: 0 },
              rotation: 0,
              active: true,
              lifetime: ARROW_LIFETIME,
            })
          }
        } else {
          enemy.velocity.x *= 0.95
        }
      }

      if (enemy.type === 'sumo') {
        const distToPlayerX = Math.abs(p.position.x - enemy.position.x)
        if (distToPlayerX < SUMO_CHARGE_DISTANCE) {
          enemy.direction = p.position.x > enemy.position.x ? 1 : -1
          enemy.velocity.x = enemy.direction * SUMO_CHARGE_SPEED
        } else {
          if (enemy.velocity.x === 0) {
            enemy.velocity.x = enemy.direction * SUMO_SPEED
          }
        }
      }

      if (enemy.type === 'mushroom') {
        if (enemy.velocity.y === 0) {
          enemy.velocity.y = MUSHROOM_BOUNCE_FORCE * (0.7 + Math.random() * 0.6)
          if (Math.random() < 0.5) {
            enemy.velocity.x = (Math.random() - 0.5) * MUSHROOM_SPEED * 2
          }
        }
      }

      if (enemy.type === 'skeleton') {
        const distToPlayerX = Math.abs(p.position.x - enemy.position.x)
        if (distToPlayerX < 10) {
          enemy.direction = p.position.x > enemy.position.x ? 1 : -1
          enemy.velocity.x = enemy.direction * ENEMY_SPEED * 0.5
          if (enemy.velocity.y === 0 && Math.random() < 0.008 * dt) {
            arrows.current.push({
              id: Date.now() + Math.random(),
              position: { x: enemy.position.x + enemy.direction * 0.3, y: enemy.position.y + 0.4, z: 0 },
              velocity: { x: enemy.direction * BONE_SPEED, y: 0.15, z: 0 },
              rotation: 0,
              active: true,
              lifetime: BONE_LIFETIME,
            })
          }
        } else {
          enemy.velocity.x *= 0.9
        }
      }

      if (enemy.type === 'drone') {
        const distToPlayerX = Math.abs(p.position.x - enemy.position.x)
        const distToPlayerY = Math.abs(p.position.y - enemy.position.y)
        const targetY = DRONE_HOVER_HEIGHT + Math.sin(Date.now() * 0.001 + enemy.id) * DRONE_HOVER_AMPLITUDE

        const heightDiff = targetY - enemy.position.y
        enemy.velocity.y = heightDiff * 0.08

        if (distToPlayerX < DRONE_CHASE_RANGE) {
          enemy.direction = p.position.x > enemy.position.x ? 1 : -1
          const chaseSpeed = distToPlayerX < 3 ? DRONE_SPEED * 1.5 : DRONE_SPEED
          enemy.velocity.x = enemy.direction * chaseSpeed
        } else {
          enemy.velocity.x = enemy.direction * DRONE_SPEED * 0.6
        }

        if (distToPlayerX < DRONE_CHASE_RANGE && distToPlayerY < 4 && Math.random() < 0.01 * dt) {
          const dx = p.position.x - enemy.position.x
          const dy = p.position.y - enemy.position.y
          const angle = Math.atan2(dy, dx)
          shurikens.current.push({
            id: Date.now() + Math.random(),
            position: { x: enemy.position.x, y: enemy.position.y - 0.2, z: 0 },
            velocity: { x: Math.cos(angle) * DRONE_BULLET_SPEED, y: Math.sin(angle) * DRONE_BULLET_SPEED, z: 0 },
            rotation: 0,
            active: true,
            lifetime: DRONE_BULLET_LIFETIME,
            type: 'rock',
          })
        }
      }

      enemy.position.x += enemy.velocity.x * dt
      if (enemy.type === 'drone') {
        enemy.position.y += enemy.velocity.y * dt
      } else {
        enemy.velocity.y += ENEMY_GRAVITY * dt
        if (enemy.velocity.y < ENEMY_TERMINAL_VELOCITY) enemy.velocity.y = ENEMY_TERMINAL_VELOCITY
        enemy.position.y += enemy.velocity.y * dt
        moveEnemyOnPlatforms(enemy, platList)
      }

      if (enemy.position.y < -8) {
        addParticles(enemy.position.x, -3, 6, '#888888')
        enemy.alive = false
      }

      if (!p.dead && !p.invincible) {
        const eDistX = Math.abs(p.position.x - enemy.position.x)
        const eDistY = p.position.y - enemy.position.y

        const eScale = getEnemyVisualScale(enemy.type)
        const stompThresholdX = (enemy.type === 'ninja' ? 0.6 : 0.5) * eScale
        const stompThresholdY = (enemy.type === 'ninja' ? -0.15 : -0.15) * eScale

        if (eDistX < stompThresholdX && eDistY > -0.2 * eScale && eDistY < 0.55 * eScale) {
          if (p.star) {
            enemy.alive = false
            g.combo++
            g.comboTimer = COMBO_TIMEOUT
            g.score += 200 + (g.combo - 1) * COMBO_BONUS_PER_KILL
            addParticles(enemy.position.x, enemy.position.y, 12, '#ff8800')
            if (g.combo > 1) g.pendingEvents.push('combo')
            return 'enemyKill'
          } else if (eDistY > stompThresholdY) {
            if (enemy.health && enemy.health > 1) {
              enemy.health--
              p.velocity.y = JUMP_FORCE * 0.65
              p.jumping = true
              g.screenShake = 0.3
              g.screenShakeTimer = 8
              addParticles(enemy.position.x, enemy.position.y, 6, '#ffff00')
              return 'stomp'
            } else {
              enemy.stomped = true
              enemy.stompTimer = 0
              p.velocity.y = JUMP_FORCE * 0.65
              p.jumping = true
              g.combo++
              g.comboTimer = COMBO_TIMEOUT
              g.score += 100 + (g.combo - 1) * COMBO_BONUS_PER_KILL
              g.screenShake = 0.3
              g.screenShakeTimer = 8
              addParticles(enemy.position.x, enemy.position.y, 8, '#ffffff')
              if (g.combo > 1) g.pendingEvents.push('combo')
              return 'stomp'
            }
          } else {
            if (p.big) {
              p.big = false
              p.invincible = true
              p.invincibleTimer = 3
              addParticles(p.position.x, p.position.y, 10, '#ff0000')
              return 'hit'
            } else {
              p.dead = true
              p.deathTimer = 0
              p.velocity.y = JUMP_FORCE
              g.screenShake = 0.8
              g.screenShakeTimer = 20
              addParticles(p.position.x, p.position.y, 15, '#ff0000')
              return 'death'
            }
          }
        }
      }
    }

    for (const boss of bosses.current) {
      if (boss.defeated || boss.active) continue
      if (Math.abs(p.position.x - boss.spawnX) < 12) {
        boss.active = true
        boss.phase = 'chase'
        boss.phaseTimer = 180
        g.bossFightActive = true
        g.bossIndex = boss.id
        bossTriggered.current.add(boss.id)

      }
    }

    for (const boss of bosses.current) {
      if (!boss.active || !boss.alive || boss.defeated) continue

      const bScale = boss.scale
      const bW = BOSS_WIDTH * bScale
      const bH = BOSS_HEIGHT * bScale
      const isEnraged = boss.health <= boss.maxHealth / 2

      if (boss.bossType !== 'storm' || boss.phase !== 'attack') {
        boss.velocity.y += GRAVITY * dt
      } else {
        boss.velocity.y += GRAVITY * 0.3 * dt
      }
      boss.position.x += boss.velocity.x * dt
      boss.position.y += boss.velocity.y * dt

      if (boss.position.y < boss.groundY) {
        boss.position.y = boss.groundY
        boss.velocity.y = 0
      }

      for (const plat of platList) {
        if (plat.size.x === 0 || plat.type === 'cloud') continue
        const bossRes = resolveAABB(
          boss.position.x, boss.position.y, bW, bH,
          plat.position.x, plat.position.y, plat.size.x, plat.size.y
        )
        if (bossRes.hit) {
          if (bossRes.normalY !== 0) {
            boss.position.y += bossRes.normalY * bossRes.overlapY
            boss.velocity.y = 0
          } else {
            boss.position.x += bossRes.normalX * bossRes.overlapX
            boss.velocity.x = 0
          }
        }
      }

      boss.phaseTimer -= dt
      boss.attackCooldown -= dt
      if (boss.invincible) {
        boss.invincibleTimer -= dt * 0.016
        if (boss.invincibleTimer <= 0) boss.invincible = false
      }

      const distToPlayer = p.position.x - boss.position.x
      const absDist = Math.abs(distToPlayer)
      boss.direction = distToPlayer > 0 ? 1 : -1

      switch (boss.phase) {
        case 'chase': {
          if (boss.bossType === 'golem') {
            boss.velocity.x = boss.direction * (isEnraged ? GOLEM_CHARGE_SPEED * 1.4 : GOLEM_CHARGE_SPEED)
            if (boss.position.y <= boss.groundY + 0.05 && absDist < 3 && absDist > 1 && Math.random() < 0.025 * dt) {
              boss.velocity.y = BOSS_JUMP_FORCE * 0.9
            }
          } else if (boss.bossType === 'storm') {
            boss.velocity.x = boss.direction * BOSS_CHASE_SPEED * 0.8
            if (boss.position.y <= boss.groundY + 0.05 && Math.random() < 0.015 * dt) {
              boss.velocity.y = BOSS_JUMP_FORCE * 1.2
            }
          } else if (boss.bossType === 'shadow') {
            boss.velocity.x = boss.direction * BOSS_CHASE_SPEED * 1.1
            if (absDist < 6 && absDist > 3 && Math.random() < 0.008 * dt && boss.attackCooldown <= 0) {
              boss.position.x = p.position.x - boss.direction * 2
              boss.attackCooldown = SHADOW_TELEPORT_COOLDOWN
              addParticles(boss.position.x, boss.position.y, 10, boss.colorScheme.glow)
            }
          } else {
            boss.velocity.x = boss.direction * BOSS_CHASE_SPEED
            if (boss.position.y <= boss.groundY + 0.05 && absDist < 4 && absDist > 1.5 && Math.random() < 0.02 * dt) {
              boss.velocity.y = BOSS_JUMP_FORCE
            }
          }
          if (boss.phaseTimer <= 0 || absDist < 1.2) {
            boss.phase = 'attack'
            boss.phaseTimer = 90 + Math.random() * 60
            boss.velocity.x = 0
          }
          break
        }

        case 'attack': {
          boss.velocity.x *= 0.9

          if (boss.bossType === 'golem') {
            if (boss.attackCooldown <= 0) {
              const attackRoll = Math.random()
              if (attackRoll < 0.4) {
                boss.velocity.y = GOLEM_GROUND_POUND_FORCE
                for (let si = -2; si <= 2; si++) {
                  shurikens.current.push({
                    id: Date.now() + si + 0.1,
                    position: { x: boss.position.x + si * 1.5, y: boss.position.y - 0.2, z: 0 },
                    velocity: { x: si * GOLEM_SHOCKWAVE_SPEED, y: 0, z: 0 },
                    rotation: 0,
                    active: true,
                    lifetime: GOLEM_SHOCKWAVE_LIFETIME,
                    type: 'firewave',
                  })
                }
                boss.attackCooldown = isEnraged ? 60 : 90
                return 'shurikenThrow'
              } else if (attackRoll < 0.75) {
                const arcY = 0.12 + absDist * 0.015
                shurikens.current.push({
                  id: Date.now() + 0.2,
                  position: { x: boss.position.x + boss.direction * 0.6, y: boss.position.y + 0.5, z: 0 },
                  velocity: { x: boss.direction * GOLEM_ROCK_SPEED, y: arcY, z: 0 },
                  rotation: 0,
                  active: true,
                  lifetime: GOLEM_ROCK_LIFETIME,
                  type: 'rock',
                })
                boss.attackCooldown = isEnraged ? 65 : 95
                return 'shurikenThrow'
              } else {
                boss.velocity.x = boss.direction * GOLEM_CHARGE_SPEED * 2
                boss.attackCooldown = isEnraged ? 70 : 100
              }
            }
          } else if (boss.bossType === 'storm') {
            if (boss.attackCooldown <= 0) {
              const attackRoll = Math.random()
              if (attackRoll < 0.5) {
                const aimY = (p.position.y - boss.position.y) * 0.3
                shurikens.current.push({
                  id: Date.now() + 0.3,
                  position: { x: boss.position.x + boss.direction * 0.4, y: boss.position.y + 0.6, z: 0 },
                  velocity: { x: boss.direction * STORM_LIGHTNING_SPEED, y: aimY, z: 0 },
                  rotation: 0,
                  active: true,
                  lifetime: STORM_LIGHTNING_LIFETIME,
                  type: 'lightning',
                })
                if (isEnraged) {
                  shurikens.current.push({
                    id: Date.now() + 0.35,
                    position: { x: boss.position.x + boss.direction * 0.4, y: boss.position.y + 0.6, z: 0 },
                    velocity: { x: boss.direction * STORM_LIGHTNING_SPEED * 0.8, y: aimY + 0.08, z: 0 },
                    rotation: 0,
                    active: true,
                    lifetime: STORM_LIGHTNING_LIFETIME,
                    type: 'lightning',
                  })
                }
                boss.attackCooldown = isEnraged ? 45 : 70
                return 'shurikenThrow'
              } else {
                const gustDir = boss.direction
                p.velocity.x += gustDir * STORM_GUST_FORCE
                addParticles(p.position.x, p.position.y, 8, boss.colorScheme.glow)
                boss.attackCooldown = isEnraged ? 70 : 100
              }
            }
            if (boss.position.y > boss.groundY + 0.1) {
              boss.velocity.y *= 0.95
            }
          } else if (boss.bossType === 'shadow') {
            if (boss.attackCooldown <= 0) {
              const attackRoll = Math.random()
              if (attackRoll < 0.5) {
                shurikens.current.push({
                  id: Date.now() + 0.4,
                  position: { x: boss.position.x + boss.direction * 0.5, y: boss.position.y + 0.3, z: 0 },
                  velocity: { x: boss.direction * SHADOW_DARK_BALL_SPEED, y: 0, z: 0 },
                  rotation: 0,
                  active: true,
                  lifetime: SHADOW_DARK_BALL_LIFETIME,
                  type: 'dark_energy',
                })
                boss.attackCooldown = isEnraged ? 60 : 85
                return 'shurikenThrow'
              } else if (attackRoll < 0.8) {
                boss.position.x = p.position.x - boss.direction * 1.5
                boss.velocity.x = boss.direction * BOSS_CHASE_SPEED * 2
                addParticles(boss.position.x, boss.position.y, 12, boss.colorScheme.glow)
                boss.attackCooldown = isEnraged ? 50 : 75
              } else {
                for (let fi = -1; fi <= 1; fi++) {
                  shurikens.current.push({
                    id: Date.now() + 0.5 + fi * 0.1,
                    position: { x: boss.position.x + boss.direction * 0.5, y: boss.position.y + 0.2, z: 0 },
                    velocity: { x: boss.direction * BOSS_SHURIKEN_SPEED, y: fi * 0.04, z: 0 },
                    rotation: 0,
                    active: true,
                    lifetime: BOSS_SHURIKEN_LIFETIME,
                  })
                }
                boss.attackCooldown = isEnraged ? 55 : 80
                return 'shurikenThrow'
              }
            }
          } else {
            if (boss.attackCooldown <= 0) {
              shurikens.current.push({
                id: Date.now(),
                position: { x: boss.position.x + boss.direction * 0.5, y: boss.position.y + 0.2, z: 0 },
                velocity: { x: boss.direction * BOSS_SHURIKEN_SPEED, y: 0, z: 0 },
                rotation: 0,
                active: true,
                lifetime: BOSS_SHURIKEN_LIFETIME,
              })
              boss.attackCooldown = isEnraged ? 55 : 80
              return 'shurikenThrow'
            }
          }

          if (boss.phaseTimer <= 0) {
            boss.phase = absDist > 5 ? 'chase' : 'retreat'
            boss.phaseTimer = 60 + Math.random() * 40
          }
          break
        }

        case 'retreat': {
          if (boss.bossType === 'golem') {
            boss.velocity.x = -boss.direction * BOSS_SPEED * 0.8
          } else if (boss.bossType === 'storm') {
            boss.velocity.x = -boss.direction * BOSS_SPEED * 1.2
            if (boss.position.y <= boss.groundY + 0.05 && Math.random() < 0.04 * dt) {
              boss.velocity.y = BOSS_JUMP_FORCE * 1.3
            }
          } else if (boss.bossType === 'shadow') {
            if (Math.random() < 0.02 * dt) {
              boss.position.x = boss.spawnX + (Math.random() - 0.5) * 4
              addParticles(boss.position.x, boss.position.y, 8, boss.colorScheme.glow)
            }
            boss.velocity.x = -boss.direction * BOSS_SPEED
          } else {
            boss.velocity.x = -boss.direction * BOSS_SPEED
            if (boss.position.y <= boss.groundY + 0.05 && Math.random() < 0.03 * dt) {
              boss.velocity.y = BOSS_JUMP_FORCE * 0.8
            }
          }
          if (boss.phaseTimer <= 0 || absDist > 7) {
            boss.phase = 'chase'
            boss.phaseTimer = 120 + Math.random() * 60
          }
          break
        }

        case 'stunned':
          boss.velocity.x *= 0.92
          boss.phaseTimer -= dt
          if (boss.phaseTimer <= 0) {
            boss.phase = boss.health > 0 ? 'chase' : 'defeated'
            boss.phaseTimer = 120
          }
          break

        case 'defeated':
          boss.velocity.x *= 0.9
          boss.phaseTimer -= dt
          if (boss.phaseTimer <= 0) {
            boss.alive = false
            boss.active = false
            g.bossFightActive = false
            g.bossDefeated = true
            g.score += 2000
            addParticles(boss.position.x, boss.position.y, 40, boss.colorScheme.glow)
            addParticles(boss.position.x, boss.position.y + 0.5, 20, '#ffffff')
            g.pendingEvents.push('bossDefeatDone')
          }
          break
      }

      if (!p.dead && !boss.invincible && boss.phase !== 'defeated') {
        const bossDistX = Math.abs(p.position.x - boss.position.x)
        const bossDistY = p.position.y - boss.position.y

        if (bossDistX < (bW + PLAYER_WIDTH) / 2 && bossDistY > -bH * 0.4 && bossDistY < bH * 0.6) {
          if (p.star) {
            boss.health -= 2
            boss.invincible = true
            boss.invincibleTimer = 1
            boss.phase = 'stunned'
            boss.phaseTimer = 60
            boss.velocity.y = JUMP_FORCE * 0.5
            addParticles(boss.position.x, boss.position.y, 15, boss.colorScheme.glow)
            if (boss.health <= 0) {
              boss.phase = 'defeated'
              boss.phaseTimer = 90
              boss.velocity.y = JUMP_FORCE
              return 'bossDefeat'
            }
            return 'bossHit'
          } else if (bossDistY > 0.1) {
            boss.health--
            boss.invincible = true
            boss.invincibleTimer = 0.8
            boss.phase = 'stunned'
            boss.phaseTimer = 50
            p.velocity.y = JUMP_FORCE * 0.7
            p.jumping = true
            g.score += 500
            g.screenShake = 0.6
            g.screenShakeTimer = 15
            addParticles(boss.position.x, boss.position.y, 12, '#ffffff')
            if (boss.health <= 0) {
              boss.phase = 'defeated'
              boss.phaseTimer = 90
              boss.velocity.y = JUMP_FORCE
              return 'bossDefeat'
            }
            return 'bossHit'
          } else if (!p.invincible) {
            if (p.big) {
              p.big = false
              p.invincible = true
              p.invincibleTimer = 3
              addParticles(p.position.x, p.position.y, 10, '#ff0000')
              return 'hit'
            } else {
              p.dead = true
              p.deathTimer = 0
              p.velocity.y = JUMP_FORCE
              addParticles(p.position.x, p.position.y, 15, '#ff0000')
              return 'death'
            }
          }
        }
      }
    }

    shurikens.current = shurikens.current.filter(shur => {
      if (!shur.active) return false
      shur.position.x += shur.velocity.x * dt
      shur.position.y += shur.velocity.y * dt
      shur.rotation += 0.3 * dt
      shur.lifetime -= dt
      if (shur.lifetime <= 0) return false

      for (const plat of platList) {
        if (plat.size.x === 0 || plat.type === 'cloud') continue
        const projHalfW = shur.type === 'rock' || shur.type === 'dark_energy' ? 0.35 : shur.type === 'firewave' ? 0.5 : 0.15
        const projHalfH = shur.type === 'rock' || shur.type === 'dark_energy' ? 0.35 : shur.type === 'firewave' ? 0.15 : 0.15
        const dx = Math.abs(shur.position.x - plat.position.x) - (projHalfW + plat.size.x / 2)
        const dy = Math.abs(shur.position.y - plat.position.y) - (projHalfH + plat.size.y / 2)
        if (dx < 0 && dy < 0) {
          addParticles(shur.position.x, shur.position.y, 4, '#888888')
          return false
        }
      }

      if (!p.dead && !p.invincible) {
        const sDistX = Math.abs(p.position.x - shur.position.x)
        const sDistY = Math.abs(p.position.y - shur.position.y)
        const hitW = shur.type === 'rock' || shur.type === 'dark_energy' ? 0.6 : shur.type === 'firewave' ? 0.7 : 0.4
        const hitH = shur.type === 'rock' || shur.type === 'dark_energy' ? 0.6 : shur.type === 'firewave' ? 0.3 : 0.5
        if (sDistX < hitW && sDistY < hitH) {
          if (p.big) {
            p.big = false
            p.invincible = true
            p.invincibleTimer = 2
            addParticles(p.position.x, p.position.y, 8, '#ff0000')
          } else {
            p.dead = true
            p.deathTimer = 0
            p.velocity.y = JUMP_FORCE
            addParticles(p.position.x, p.position.y, 12, '#ff0000')
          }
          addParticles(shur.position.x, shur.position.y, 6, '#cccccc')
          return false
        }
      }

      return true
    })

    fireballs.current = fireballs.current.filter(fb => {
      if (!fb.active) return false
      fb.position.x += fb.velocity.x * dt
      fb.position.y += fb.velocity.y * dt
      fb.velocity.y -= 0.012 * dt
      fb.rotation += 0.4 * dt
      fb.lifetime -= dt
      if (fb.lifetime <= 0) return false

      if (fb.position.y < 0.15) {
        fb.position.y = 0.15
        fb.velocity.y = Math.abs(fb.velocity.y) * 0.6
        if (Math.abs(fb.velocity.y) < 0.03) fb.velocity.y = 0.08
        addParticles(fb.position.x, fb.position.y, 3, '#ff8800')
      }

      for (const plat of platList) {
        if (plat.size.x === 0 || plat.type === 'cloud') continue
        const halfW = 0.15
        const halfH = 0.15
        const dx = Math.abs(fb.position.x - plat.position.x) - (halfW + plat.size.x / 2)
        const dy = Math.abs(fb.position.y - plat.position.y) - (halfH + plat.size.y / 2)
        if (dx < 0 && dy < 0) {
          addParticles(fb.position.x, fb.position.y, 8, '#ff6600')
          g.screenShake = 0.15
          g.screenShakeTimer = 4
          return false
        }
      }

      for (const enemy of enemies.current) {
        if (!enemy.alive || enemy.stomped) continue
        const eDistX = Math.abs(fb.position.x - enemy.position.x)
        const eDistY = Math.abs(fb.position.y - enemy.position.y)
        const eScale = getEnemyVisualScale(enemy.type)
        if (eDistX < 0.55 * eScale && eDistY < 0.55 * eScale) {
          enemy.alive = false
          g.combo++
          g.comboTimer = COMBO_TIMEOUT
          g.score += 200 + (g.combo - 1) * COMBO_BONUS_PER_KILL
          g.screenShake = 0.4
          g.screenShakeTimer = 10
          addParticles(enemy.position.x, enemy.position.y, 16, '#ff6600')
          addParticles(enemy.position.x, enemy.position.y, 8, '#ffcc00')
          addParticles(fb.position.x, fb.position.y, 6, '#ff4400')
          if (g.combo > 1) g.pendingEvents.push('combo')
          return false
        }
      }

      for (const boss of bosses.current) {
        if (!boss.active || !boss.alive || boss.defeated || boss.invincible) continue
        const bossDistX = Math.abs(fb.position.x - boss.position.x)
        const bossDistY = Math.abs(fb.position.y - boss.position.y)
        if (bossDistX < (BOSS_WIDTH * boss.scale + 0.4) / 2 && bossDistY < BOSS_HEIGHT * boss.scale * 0.6) {
          boss.health--
          boss.invincible = true
          boss.invincibleTimer = 0.6
          boss.phase = 'stunned'
          boss.phaseTimer = 40
          boss.velocity.y = JUMP_FORCE * 0.4
          g.score += 500
          g.screenShake = 0.6
          g.screenShakeTimer = 14
          addParticles(boss.position.x, boss.position.y, 16, boss.colorScheme.glow)
          addParticles(boss.position.x, boss.position.y, 8, '#ffcc00')
          addParticles(fb.position.x, fb.position.y, 6, '#ff6600')
          if (boss.health <= 0) {
            boss.phase = 'defeated'
            boss.phaseTimer = 90
            boss.velocity.y = JUMP_FORCE
            g.pendingEvents.push('bossDefeat')
            g.pendingEvents.push('bossDefeatDone')
          } else {
            g.pendingEvents.push('bossHit')
          }
          return false
        }
      }

      return true
    })

    arrows.current = arrows.current.filter(arrow => {
      if (!arrow.active) return false
      arrow.position.x += arrow.velocity.x * dt
      arrow.position.y += arrow.velocity.y * dt
      arrow.rotation += 0.2 * dt
      arrow.lifetime -= dt
      if (arrow.lifetime <= 0) return false

      for (const plat of platList) {
        if (plat.size.x === 0 || plat.type === 'cloud') continue
        const dx = Math.abs(arrow.position.x - plat.position.x) - (0.12 + plat.size.x / 2)
        const dy = Math.abs(arrow.position.y - plat.position.y) - (0.05 + plat.size.y / 2)
        if (dx < 0 && dy < 0) {
          addParticles(arrow.position.x, arrow.position.y, 3, '#886644')
          return false
        }
      }

      if (!p.dead && !p.invincible) {
        const aDistX = Math.abs(p.position.x - arrow.position.x)
        const aDistY = Math.abs(p.position.y - arrow.position.y)
        if (aDistX < 0.4 && aDistY < 0.5) {
          if (p.big) {
            p.big = false
            p.invincible = true
            p.invincibleTimer = 2
            addParticles(p.position.x, p.position.y, 8, '#ff0000')
          } else {
            p.dead = true
            p.deathTimer = 0
            p.velocity.y = JUMP_FORCE
            addParticles(p.position.x, p.position.y, 12, '#ff0000')
          }
          addParticles(arrow.position.x, arrow.position.y, 4, '#886644')
          return false
        }
      }

      arrow.velocity.y += GRAVITY * dt * 0.3

      return true
    })

    if (!p.dead && standingPlatform.current?.lava) {
      if (lavaDamageTimer.current <= 0) {
        lavaDamageTimer.current = LAVA_DAMAGE_INTERVAL
        if (!p.star && !p.invincible) {
          if (p.big) {
            p.big = false
            p.invincible = true
            p.invincibleTimer = 3
            p.velocity.y = LAVA_KNOCKBACK_FORCE
            p.velocity.x = -p.facing * 0.15
            addParticles(p.position.x, p.position.y, 12, '#ff4400')
            addParticles(p.position.x, p.position.y, 8, '#ff8800')
            g.screenShake = 0.4
            g.screenShakeTimer = 12
            return 'hit'
          } else {
            p.dead = true
            p.deathTimer = 0
            p.velocity.y = JUMP_FORCE
            g.screenShake = 0.8
            g.screenShakeTimer = 20
            addParticles(p.position.x, p.position.y, 20, '#ff2200')
            return 'death'
          }
        }
      }
    }
    if (lavaDamageTimer.current > 0) lavaDamageTimer.current -= dt

    for (const spawner of rollingSpawners.current) {
      spawner.timer -= dt
      if (spawner.timer <= 0) {
        spawner.timer = spawner.interval
        const tooClose = rollingStones.current.some(s =>
          s.active && Math.abs(s.position.x - spawner.position.x) < 2 && Math.abs(s.position.y - spawner.position.y) < 2
        )
        if (!tooClose) {
          rollingStones.current.push({
            id: Date.now() + Math.random(),
            position: { x: spawner.position.x, y: spawner.position.y, z: 0 },
            velocity: { x: spawner.direction * spawner.speed, y: 0, z: 0 },
            rotation: 0,
            active: true,
            radius: spawner.radius,
          })
        }
      }
    }

    rollingStones.current = rollingStones.current.filter(stone => {
      if (!stone.active) return false

      stone.velocity.y += GRAVITY * dt
      if (stone.velocity.y < TERMINAL_VELOCITY) stone.velocity.y = TERMINAL_VELOCITY
      stone.position.x += stone.velocity.x * dt
      stone.position.y += stone.velocity.y * dt
      stone.rotation += stone.velocity.x * dt * 3

      let onPlatform = false
      for (const plat of platList) {
        if (plat.size.x === 0) continue
        const halfW = plat.size.x / 2
        const stoneBottom = stone.position.y - stone.radius
        const platTop = plat.position.y + plat.size.y / 2
        if (
          stone.position.x > plat.position.x - halfW - stone.radius &&
          stone.position.x < plat.position.x + halfW + stone.radius &&
          stoneBottom < platTop + 0.1 &&
          stoneBottom > platTop - 0.4 &&
          stone.velocity.y <= 0
        ) {
          stone.position.y = platTop + stone.radius
          stone.velocity.y = 0
          onPlatform = true
          break
        }
      }

      if (!onPlatform && stone.velocity.y <= 0) {
        const hasFloorAhead = platList.some(plat => {
          if (plat.size.x === 0) return false
          const probeX = stone.position.x + stone.velocity.x * 12
          const halfW = plat.size.x / 2
          return probeX > plat.position.x - halfW && probeX < plat.position.x + halfW && Math.abs(stone.position.y - plat.position.y) < 1.5
        })
        if (!hasFloorAhead && stone.velocity.y === 0) {
          addParticles(stone.position.x, stone.position.y - stone.radius, 4, '#888888')
          return false
        }
      }

      if (stone.position.y < -8) return false

      if (!p.dead && !p.invincible) {
        const sDistX = Math.abs(p.position.x - stone.position.x)
        const sDistY = Math.abs(p.position.y - stone.position.y)
        if (sDistX < stone.radius + 0.3 && sDistY < stone.radius + 0.5) {
          if (p.star) {
            addParticles(stone.position.x, stone.position.y, 12, '#ff8800')
            g.score += 200
            stone.active = false
            return false
          } else if (p.big) {
            p.big = false
            p.invincible = true
            p.invincibleTimer = 3
            const knockDir = p.position.x > stone.position.x ? 1 : -1
            p.velocity.x = knockDir * 0.2
            p.velocity.y = LAVA_KNOCKBACK_FORCE
            addParticles(p.position.x, p.position.y, 10, '#ff0000')
            g.screenShake = 0.4
            g.screenShakeTimer = 12
            return 'hit'
          } else {
            p.dead = true
            p.deathTimer = 0
            p.velocity.y = JUMP_FORCE
            const knockDir = p.position.x > stone.position.x ? 1 : -1
            p.velocity.x = knockDir * 0.15
            g.screenShake = 0.8
            g.screenShakeTimer = 20
            addParticles(p.position.x, p.position.y, 15, '#ff0000')
            return 'death'
          }
        }
      }

      return true
    })

    particles.current = particles.current.filter(part => {
      part.life -= dt * 0.018
      part.position.x += part.velocity.x * dt
      part.position.y += part.velocity.y * dt
      part.position.z += part.velocity.z * dt
      part.velocity.y -= 0.0012 * dt
      part.velocity.x *= 0.995
      return part.life > 0
    })

    if (p.position.y < -5) {
      p.dead = true
      p.deathTimer = 0
      return 'death'
    }

    const levelEndX = g.level === 1 ? 72 : g.level === 2 ? 68 : g.level === 3 ? 104 : g.level === 4 ? 100 : g.level === 5 ? 98 : g.level === 6 ? 100 : 108
    if (p.position.x > levelEndX && !g.levelComplete) {
      g.levelComplete = true
      g.score += Math.floor(g.time) * 10
      return 'levelComplete'
    }

    return null
  }, [addParticles])

  const resetGame = useCallback((advanceLevel = false) => {
    const currentLevel = advanceLevel ? game.current.level + 1 : 1
    game.current = {
      score: advanceLevel ? game.current.score : 0,
      coins: advanceLevel ? game.current.coins : 0,
      lives: advanceLevel ? game.current.lives : 5,
      level: currentLevel,
      time: currentLevel === 1 ? 300 : currentLevel === 7 ? 500 : 350,
      gameOver: false,
      paused: false,
      started: true,
      levelComplete: false,
      bossDefeated: false,
      bossFightActive: false,
      bossIndex: 0,
      pendingEvents: [],
      combo: 0,
      comboTimer: 0,
      screenShake: 0,
      screenShakeTimer: 0,
      transitionTimer: 0,
      transitioning: false,
    }
    player.current = {
      position: { x: 0, y: 2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      onGround: false,
      jumping: false,
      doubleJumped: false,
      facing: 1,
      big: false,
      star: false,
      starTimer: 0,
      flower: false,
      invincible: false,
      invincibleTimer: 0,
      animFrame: 0,
      animTimer: 0,
      dead: false,
      deathTimer: 0,
    }
    physicsState.current = {
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      wasOnGround: false,
      prevJump: false,
    }
    standingPlatform.current = null
    loadLevel(currentLevel)
  }, [loadLevel])

  return {
    player,
    game,
    platforms,
    enemies,
    coins,
    powerUps,
    particles,
    bosses,
    shurikens,
    fireballs,
    arrows,
    rollingStones,
    update,
    resetGame,
  }
}