'use client'

// Player physics
export const GRAVITY = -0.028
export const TERMINAL_VELOCITY = -0.38
export const JUMP_FORCE = 0.44
export const DOUBLE_JUMP_FORCE = 0.37
export const JUMP_CUT_MULTIPLIER = 0.42
export const MAX_SPEED = 0.2
export const GROUND_ACCEL = 0.035
export const AIR_ACCEL = 0.02
export const GROUND_FRICTION = 0.78
export const AIR_FRICTION = 0.92
export const COYOTE_TIME = 8
export const JUMP_BUFFER_TIME = 10
export const PLAYER_WIDTH = 0.6
export const PLAYER_HEIGHT = 0.85

// Enemy physics
export const ENEMY_GRAVITY = -0.022
export const ENEMY_TERMINAL_VELOCITY = -0.3
export const ENEMY_BOUNCE = 0.14
export const ENEMY_SPEED = 0.032

// Boss physics
export const BOSS_SPEED = 0.045
export const BOSS_CHASE_SPEED = 0.07
export const BOSS_JUMP_FORCE = 0.3
export const BOSS_SHURIKEN_SPEED = 0.18
export const BOSS_SHURIKEN_LIFETIME = 70
export const BOSS_WIDTH = 0.8
export const BOSS_HEIGHT = 1.1

// Projectiles
export const FIREBALL_SPEED = 0.35
export const FIREBALL_LIFETIME = 90
export const COMBO_TIMEOUT = 120
export const COMBO_BONUS_PER_KILL = 50

// Lava
export const LAVA_DAMAGE_INTERVAL = 90
export const LAVA_KNOCKBACK_FORCE = 0.25

// Rolling stones
export const ROLLING_STONE_SPEED = 0.18
export const ROLLING_STONE_RADIUS = 0.6
export const ROLLING_STONE_SPAWN_INTERVAL = 240

// Ninja enemy
export const NINJA_SPEED = 0.035
export const NINJA_JUMP_INTERVAL = 140
export const NINJA_JUMP_FORCE = 0.25

// Archer enemy
export const ARCHER_SPEED = 0.015
export const ARCHER_SHOOT_INTERVAL = 160
export const ARROW_SPEED = 0.18
export const ARROW_LIFETIME = 80

// Sumo enemy
export const SUMO_SPEED = 0.018
export const SUMO_CHARGE_SPEED = 0.045
export const SUMO_CHARGE_DISTANCE = 4.5

// Mushroom enemy
export const MUSHROOM_BOUNCE_FORCE = 0.28
export const MUSHROOM_SPEED = 0.025

// Skeleton enemy
export const SKELETON_RISE_INTERVAL = 200
export const BONE_SPEED = 0.22
export const BONE_LIFETIME = 70

// Drone enemy
export const DRONE_SPEED = 0.025
export const DRONE_HOVER_HEIGHT = 2.8
export const DRONE_HOVER_AMPLITUDE = 0.4
export const DRONE_SHOOT_INTERVAL = 100
export const DRONE_BULLET_SPEED = 0.2
export const DRONE_BULLET_LIFETIME = 70
export const DRONE_CHASE_RANGE = 7

// Golem boss
export const GOLEM_GROUND_POUND_FORCE = 0.35
export const GOLEM_ROCK_SPEED = 0.14
export const GOLEM_ROCK_LIFETIME = 90
export const GOLEM_SHOCKWAVE_SPEED = 0.2
export const GOLEM_SHOCKWAVE_LIFETIME = 40
export const GOLEM_CHARGE_SPEED = 0.06

// Storm boss
export const STORM_LIGHTNING_SPEED = 0.3
export const STORM_LIGHTNING_LIFETIME = 50
export const STORM_GUST_FORCE = 0.18
export const STORM_ORBIT_SPEED = 0.04
export const STORM_ORBIT_RADIUS = 2.5

// Shadow boss
export const SHADOW_DARK_BALL_SPEED = 0.1
export const SHADOW_DARK_BALL_LIFETIME = 120
export const SHADOW_TELEPORT_COOLDOWN = 100
export const SHADOW_CLONE_LIFETIME = 180