export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface AABB {
  min: Vec3
  max: Vec3
}

export interface Platform {
  position: Vec3
  size: Vec3
  color: string
  type: 'ground' | 'brick' | 'question' | 'pipe' | 'cloud' | 'moving'
  movingAxis?: 'x' | 'y'
  movingRange?: number
  movingSpeed?: number
  basePosition?: Vec3
  contains?: 'coin' | 'mushroom' | 'star' | 'flower'
  hit?: boolean
  lava?: boolean
}

export interface Enemy {
  id: number
  type: 'goomba' | 'koopa' | 'spike' | 'ninja' | 'archer' | 'sumo' | 'mushroom' | 'skeleton' | 'drone'
  position: Vec3
  velocity: Vec3
  alive: boolean
  stomped: boolean
  stompTimer: number
  direction: number
  health?: number
}

export interface Boss {
  id: number
  name: string
  title: string
  bossType: 'ninja' | 'golem' | 'storm' | 'shadow'
  colorScheme: {
    primary: string
    accent: string
    glow: string
  }
  position: Vec3
  velocity: Vec3
  health: number
  maxHealth: number
  alive: boolean
  active: boolean
  defeated: boolean
  direction: number
  phase: 'idle' | 'chase' | 'attack' | 'retreat' | 'stunned' | 'defeated'
  phaseTimer: number
  attackCooldown: number
  invincible: boolean
  invincibleTimer: number
  spawnX: number
  groundY: number
  scale: number
}

export interface Shuriken {
  id: number
  position: Vec3
  velocity: Vec3
  rotation: number
  active: boolean
  lifetime: number
  type?: 'shuriken' | 'rock' | 'lightning' | 'dark_energy' | 'firewave'
}

export interface Coin {
  id: number
  position: Vec3
  collected: boolean
  spinAngle: number
}

export interface PowerUp {
  id: number
  type: 'mushroom' | 'star' | 'flower'
  position: Vec3
  velocity: Vec3
  collected: boolean
  active: boolean
}

export interface Particle {
  position: Vec3
  velocity: Vec3
  life: number
  maxLife: number
  color: string
  size: number
}

export interface Fireball {
  id: number
  position: Vec3
  velocity: Vec3
  rotation: number
  active: boolean
  lifetime: number
}

export interface Arrow {
  id: number
  position: Vec3
  velocity: Vec3
  rotation: number
  active: boolean
  lifetime: number
}

export interface PlayerState {
  position: Vec3
  velocity: Vec3
  onGround: boolean
  jumping: boolean
  doubleJumped: boolean
  facing: number
  big: boolean
  star: boolean
  starTimer: number
  flower: boolean
  invincible: boolean
  invincibleTimer: number
  animFrame: number
  animTimer: number
  dead: boolean
  deathTimer: number
}

export interface GameState {
  score: number
  coins: number
  lives: number
  level: number
  time: number
  gameOver: boolean
  paused: boolean
  started: boolean
  levelComplete: boolean
  bossDefeated: boolean
  bossFightActive: boolean
  bossIndex: number
  pendingEvents: string[]
  combo: number
  comboTimer: number
  screenShake: number
  screenShakeTimer: number
  transitionTimer: number
  transitioning: boolean
}

export type GameAction =
  | 'moveLeft'
  | 'moveRight'
  | 'jump'
  | 'stopLeft'
  | 'stopRight'
  | 'pause'
  | 'restart'

export interface RollingStone {
  id: number
  position: Vec3
  velocity: Vec3
  rotation: number
  active: boolean
  radius: number
}

export interface RollingStoneSpawner {
  position: Vec3
  direction: number
  interval: number
  timer: number
  speed: number
  radius: number
}
