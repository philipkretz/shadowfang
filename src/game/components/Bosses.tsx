'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Boss } from '@/types/game'

// ============================================
// BOSS NINJA
// ============================================
export function BossNinja({ boss }: { boss: Boss }) {
  const groupRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Group>(null)
  const rightLegRef = useRef<THREE.Group>(null)
  const headbandRef = useRef<THREE.Mesh>(null)
  const headband2Ref = useRef<THREE.Mesh>(null)
  const scarfRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const t = timeRef.current
    timeRef.current += delta * 3

    const bx = boss.position.x
    const by = boss.position.y
    const dir = boss.direction

    groupRef.current.position.set(bx, by, boss.position.z)
    groupRef.current.scale.x = dir

    // Stunned wobble
    if (boss.phase === 'stunned') {
      groupRef.current.rotation.z = Math.sin(t * 8) * 0.3
    } else if (boss.phase === 'defeated') {
      groupRef.current.rotation.z = Math.sin(t * 2) * 0.5
    } else {
      groupRef.current.rotation.z = 0
    }

    const isMoving = Math.abs(boss.velocity.x) > 0.01
    const walkCycle = isMoving ? Math.sin(t * 2.5) * 0.5 : 0

    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = walkCycle * 0.6
      leftArmRef.current.rotation.z = -0.15
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = -walkCycle * 0.6
      rightArmRef.current.rotation.z = 0.15
    }
    if (leftLegRef.current) leftLegRef.current.rotation.x = -walkCycle * 0.5
    if (rightLegRef.current) rightLegRef.current.rotation.x = walkCycle * 0.5

    // Headband flutter
    if (headbandRef.current) {
      headbandRef.current.rotation.x = Math.sin(t * 1.5) * 0.2 - 0.4
    }
    if (headband2Ref.current) {
      headband2Ref.current.rotation.x = Math.sin(t * 1.7 + 1) * 0.25 - 0.35
    }

    // Scarf flutter
    if (scarfRef.current) {
      scarfRef.current.rotation.x = Math.sin(t * 2) * 0.3 - 0.5
    }

    // Invincibility flash
    if (boss.invincible) {
      groupRef.current.visible = Math.sin(t * 15) > 0
    } else {
      groupRef.current.visible = true
    }
  })

  const { primary, accent, glow } = boss.colorScheme

  return (
    <group ref={groupRef}>
      {/* Torso */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.42, 0.5, 0.28]} />
        <meshStandardMaterial color={primary} roughness={0.7} />
      </mesh>
      {/* Shoulder armor */}
      <mesh position={[-0.28, 0.5, 0]}>
        <boxGeometry args={[0.16, 0.12, 0.32]} />
        <meshStandardMaterial color={accent} roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0.28, 0.5, 0]}>
        <boxGeometry args={[0.16, 0.12, 0.32]} />
        <meshStandardMaterial color={accent} roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Belt/sash */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.44, 0.08, 0.3]} />
        <meshStandardMaterial color={accent} roughness={0.5} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[0.3, 0.32, 0.3]} />
        <meshStandardMaterial color={primary} roughness={0.7} />
      </mesh>
      {/* Face mask */}
      <mesh position={[0, 0.72, 0.16]}>
        <boxGeometry args={[0.28, 0.14, 0.04]} />
        <meshStandardMaterial color={'#111111'} roughness={0.9} />
      </mesh>
      {/* Glowing eyes */}
      <mesh position={[-0.08, 0.8, 0.15]}>
        <boxGeometry args={[0.06, 0.035, 0.02]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0.08, 0.8, 0.15]}>
        <boxGeometry args={[0.06, 0.035, 0.02]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={2.5} />
      </mesh>
      <pointLight position={[0, 0.8, 0.3]} color={glow} intensity={1.5} distance={3} />

      {/* Headband - top */}
      <mesh position={[0, 0.88, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.34, 0.06, 0.32]} />
        <meshStandardMaterial color={accent} roughness={0.6} />
      </mesh>
      {/* Headband tails - fluttering behind */}
      <mesh ref={headbandRef} position={[0, 0.86, -0.2]}>
        <boxGeometry args={[0.06, 0.05, 0.4]} />
        <meshStandardMaterial color={accent} roughness={0.6} />
      </mesh>
      <mesh ref={headband2Ref} position={[0.05, 0.84, -0.18]}>
        <boxGeometry args={[0.05, 0.04, 0.35]} />
        <meshStandardMaterial color={accent} roughness={0.6} />
      </mesh>

      {/* Scarf */}
      <mesh ref={scarfRef} position={[0, 0.6, -0.2]}>
        <boxGeometry args={[0.2, 0.12, 0.5]} />
        <meshStandardMaterial color={glow} roughness={0.5} transparent opacity={0.85} />
      </mesh>

      {/* Arms */}
      <group ref={leftArmRef} position={[-0.3, 0.45, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.14, 0.3, 0.14]} />
          <meshStandardMaterial color={primary} roughness={0.7} />
        </mesh>
        {/* Gauntlet */}
        <mesh position={[0, -0.28, 0]}>
          <boxGeometry args={[0.16, 0.1, 0.16]} />
          <meshStandardMaterial color={accent} roughness={0.3} metalness={0.5} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.3, 0.45, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.14, 0.3, 0.14]} />
          <meshStandardMaterial color={primary} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <boxGeometry args={[0.16, 0.1, 0.16]} />
          <meshStandardMaterial color={accent} roughness={0.3} metalness={0.5} />
        </mesh>
      </group>

      {/* Legs */}
      <group ref={leftLegRef} position={[-0.12, -0.05, 0]}>
        <mesh position={[0, -0.18, 0]}>
          <boxGeometry args={[0.15, 0.32, 0.15]} />
          <meshStandardMaterial color={primary} roughness={0.7} />
        </mesh>
        {/* Tabi boot */}
        <mesh position={[0, -0.36, 0]}>
          <boxGeometry args={[0.17, 0.08, 0.2]} />
          <meshStandardMaterial color={'#111111'} roughness={0.9} />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[0.12, -0.05, 0]}>
        <mesh position={[0, -0.18, 0]}>
          <boxGeometry args={[0.15, 0.32, 0.15]} />
          <meshStandardMaterial color={primary} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.36, 0]}>
          <boxGeometry args={[0.17, 0.08, 0.2]} />
          <meshStandardMaterial color={'#111111'} roughness={0.9} />
        </mesh>
      </group>

      {/* Back weapons - crossed swords */}
      <mesh position={[0.12, 0.45, -0.18]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.04, 0.35, 0.04]} />
        <meshStandardMaterial color={'#888888'} roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[-0.12, 0.45, -0.18]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.04, 0.35, 0.04]} />
        <meshStandardMaterial color={'#888888'} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Phase indicator - attack glow */}
      {boss.phase === 'attack' && (
        <pointLight position={[0, 0.5, 0.3]} color={glow} intensity={3} distance={4} />
      )}
    </group>
  )
}

// ============================================
// BOSS GOLEM - Stone Sentinel (Level 3)
// ============================================
export function BossGolem({ boss }: { boss: Boss }) {
  const groupRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const t = timeRef.current
    timeRef.current += delta * 3

    groupRef.current.position.set(boss.position.x, boss.position.y, boss.position.z)
    const s = boss.scale || 1
    groupRef.current.scale.set(boss.direction * s, s, s)

    if (boss.phase === 'stunned') {
      groupRef.current.rotation.z = Math.sin(t * 8) * 0.2
    } else if (boss.phase === 'defeated') {
      groupRef.current.rotation.z = Math.sin(t * 2) * 0.5
    } else {
      groupRef.current.rotation.z = 0
    }

    const isMoving = Math.abs(boss.velocity.x) > 0.01
    const walkCycle = isMoving ? Math.sin(t * 1.5) * 0.5 : 0

    if (leftArmRef.current) leftArmRef.current.rotation.x = walkCycle * 0.4
    if (rightArmRef.current) rightArmRef.current.rotation.x = -walkCycle * 0.4

    if (boss.invincible) {
      groupRef.current.visible = Math.sin(t * 15) > 0
    } else {
      groupRef.current.visible = true
    }
  })

  const { primary, accent, glow } = boss.colorScheme
  const isEnraged = boss.health <= boss.maxHealth / 2

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 14]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.7, 0.7, 0.5]} />
        <meshStandardMaterial color={primary} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.5, 0.26]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.02, 0.3, 0.01]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={isEnraged ? 3 : 1} />
      </mesh>
      <mesh position={[0.05, 0.35, 0.26]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.015, 0.2, 0.01]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={isEnraged ? 3 : 1} />
      </mesh>
      <mesh position={[0, 0.4, 0.2]}>
        <sphereGeometry args={[0.1, 8, 6]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={isEnraged ? 4 : 2} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[0.5, 0.4, 0.4]} />
        <meshStandardMaterial color={primary} roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.05, 0.22]}>
        <boxGeometry args={[0.52, 0.08, 0.08]} />
        <meshStandardMaterial color={'#3a2a1a'} roughness={0.9} />
      </mesh>
      <mesh position={[-0.12, 0.95, 0.21]}>
        <sphereGeometry args={[0.055, 8, 6]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={isEnraged ? 4 : 2.5} />
      </mesh>
      <mesh position={[0.12, 0.95, 0.21]}>
        <sphereGeometry args={[0.055, 8, 6]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={isEnraged ? 4 : 2.5} />
      </mesh>
      <mesh position={[0, 0.84, 0.21]}>
        <boxGeometry args={[0.2, 0.025, 0.02]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={isEnraged ? 2 : 0.8} />
      </mesh>
      <group ref={leftArmRef} position={[-0.55, 0.3, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.22, 0.45, 0.22]} />
          <meshStandardMaterial color={primary} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.1, 0]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.08, 0.2, 5]} />
          <meshStandardMaterial color={accent} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.25, 0.18, 0.25]} />
          <meshStandardMaterial color={primary} roughness={0.95} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.55, 0.3, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.22, 0.45, 0.22]} />
          <meshStandardMaterial color={primary} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.08, 0.2, 5]} />
          <meshStandardMaterial color={accent} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.25, 0.18, 0.25]} />
          <meshStandardMaterial color={primary} roughness={0.95} />
        </mesh>
      </group>
      <mesh position={[-0.15, -0.25, 0]}>
        <boxGeometry args={[0.22, 0.45, 0.22]} />
        <meshStandardMaterial color={primary} roughness={0.95} />
      </mesh>
      <mesh position={[0.15, -0.25, 0]}>
        <boxGeometry args={[0.22, 0.45, 0.22]} />
        <meshStandardMaterial color={primary} roughness={0.95} />
      </mesh>
      <mesh position={[-0.15, -0.5, 0.05]}>
        <boxGeometry args={[0.26, 0.1, 0.3]} />
        <meshStandardMaterial color={'#3a2a1a'} roughness={0.9} />
      </mesh>
      <mesh position={[0.15, -0.5, 0.05]}>
        <boxGeometry args={[0.26, 0.1, 0.3]} />
        <meshStandardMaterial color={'#3a2a1a'} roughness={0.9} />
      </mesh>
      {isEnraged && (
        <pointLight position={[0, 0.4, 0.3]} color={glow} intensity={2} distance={4} />
      )}
      {boss.phase === 'attack' && (
        <pointLight position={[0, 0.5, 0.3]} color={glow} intensity={3} distance={5} />
      )}
    </group>
  )
}

// ============================================
// BOSS STORM - Storm Weaver (Level 4)
// ============================================
export function BossStorm({ boss }: { boss: Boss }) {
  const groupRef = useRef<THREE.Group>(null)
  const leftRobeRef = useRef<THREE.Mesh>(null)
  const rightRobeRef = useRef<THREE.Mesh>(null)
  const orb1Ref = useRef<THREE.Mesh>(null)
  const orb2Ref = useRef<THREE.Mesh>(null)
  const orb3Ref = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const t = timeRef.current
    timeRef.current += delta * 3

    groupRef.current.position.set(boss.position.x, boss.position.y, boss.position.z)
    const s = boss.scale || 1
    groupRef.current.scale.set(boss.direction * s, s, s)

    if (boss.phase === 'stunned') {
      groupRef.current.rotation.z = Math.sin(t * 8) * 0.25
    } else if (boss.phase === 'defeated') {
      groupRef.current.rotation.z = Math.sin(t * 2) * 0.5
    } else {
      groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.05
    }

    if (leftRobeRef.current) {
      leftRobeRef.current.rotation.x = Math.sin(t * 1.5) * 0.3 - 0.3
      leftRobeRef.current.position.x = -0.15 + Math.sin(t * 1.2) * 0.03
    }
    if (rightRobeRef.current) {
      rightRobeRef.current.rotation.x = Math.sin(t * 1.7 + 1) * 0.3 - 0.3
      rightRobeRef.current.position.x = 0.15 + Math.sin(t * 1.4) * 0.03
    }

    const orbRadius = 0.35
    if (orb1Ref.current) {
      orb1Ref.current.position.x = Math.cos(t * 2) * orbRadius
      orb1Ref.current.position.z = Math.sin(t * 2) * orbRadius
      orb1Ref.current.position.y = 0.5 + Math.sin(t * 3) * 0.1
    }
    if (orb2Ref.current) {
      orb2Ref.current.position.x = Math.cos(t * 2 + 2.1) * orbRadius
      orb2Ref.current.position.z = Math.sin(t * 2 + 2.1) * orbRadius
      orb2Ref.current.position.y = 0.5 + Math.sin(t * 3 + 1) * 0.1
    }
    if (orb3Ref.current) {
      orb3Ref.current.position.x = Math.cos(t * 2 + 4.2) * orbRadius
      orb3Ref.current.position.z = Math.sin(t * 2 + 4.2) * orbRadius
      orb3Ref.current.position.y = 0.5 + Math.sin(t * 3 + 2) * 0.1
    }

    if (boss.invincible) {
      groupRef.current.visible = Math.sin(t * 15) > 0
    } else {
      groupRef.current.visible = true
    }
  })

  const { primary, accent, glow } = boss.colorScheme
  const isEnraged = boss.health <= boss.maxHealth / 2

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.45, 14]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.15} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.15, 0.4, 0.7, 8]} />
        <meshStandardMaterial color={primary} roughness={0.5} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.35, 0.6, 8]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.8} transparent opacity={0.4} />
      </mesh>
      <mesh ref={leftRobeRef} position={[-0.15, -0.15, -0.1]}>
        <boxGeometry args={[0.18, 0.4, 0.15]} />
        <meshStandardMaterial color={accent} roughness={0.5} transparent opacity={0.85} />
      </mesh>
      <mesh ref={rightRobeRef} position={[0.15, -0.15, -0.1]}>
        <boxGeometry args={[0.18, 0.4, 0.15]} />
        <meshStandardMaterial color={accent} roughness={0.5} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.35, 0.1]}>
        <boxGeometry args={[0.3, 0.25, 0.15]} />
        <meshStandardMaterial color={accent} roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.2, 10, 8]} />
        <meshStandardMaterial color={primary} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.72, -0.05]}>
        <sphereGeometry args={[0.22, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color={primary} roughness={0.7} />
      </mesh>
      <mesh position={[-0.07, 0.65, 0.17]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={isEnraged ? 5 : 3} />
      </mesh>
      <mesh position={[0.07, 0.65, 0.17]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={isEnraged ? 5 : 3} />
      </mesh>
      <mesh position={[-0.25, 0.25, 0]}>
        <capsuleGeometry args={[0.05, 0.3, 6, 6]} />
        <meshStandardMaterial color={primary} roughness={0.5} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.25, 0.25, 0]}>
        <capsuleGeometry args={[0.05, 0.3, 6, 6]} />
        <meshStandardMaterial color={primary} roughness={0.5} transparent opacity={0.8} />
      </mesh>
      <mesh ref={orb1Ref} position={[0.35, 0.5, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={3} />
      </mesh>
      <mesh ref={orb2Ref} position={[-0.35, 0.5, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={3} />
      </mesh>
      <mesh ref={orb3Ref} position={[0, 0.5, 0.35]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={3} />
      </mesh>
      {isEnraged && (
        <>
          <mesh position={[0.3, 0.8, 0.1]} rotation={[0.5, 0, 0.8]}>
            <cylinderGeometry args={[0.005, 0.015, 0.3, 4]} />
            <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={5} transparent opacity={0.8} />
          </mesh>
          <mesh position={[-0.3, 0.8, 0.1]} rotation={[0.5, 0, -0.8]}>
            <cylinderGeometry args={[0.005, 0.015, 0.3, 4]} />
            <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={5} transparent opacity={0.8} />
          </mesh>
        </>
      )}
      <pointLight position={[0, 0.5, 0.3]} color={glow} intensity={isEnraged ? 2 : 1.2} distance={4} />
      {boss.phase === 'attack' && (
        <pointLight position={[0, 0.5, 0.3]} color={glow} intensity={3} distance={5} />
      )}
    </group>
  )
}

// ============================================
// BOSS SHADOW - Dark Revenant (Level 5)
// ============================================
export function BossShadow({ boss }: { boss: Boss }) {
  const groupRef = useRef<THREE.Group>(null)
  const leftArm1Ref = useRef<THREE.Group>(null)
  const rightArm1Ref = useRef<THREE.Group>(null)
  const leftArm2Ref = useRef<THREE.Group>(null)
  const rightArm2Ref = useRef<THREE.Group>(null)
  const capeRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const t = timeRef.current
    timeRef.current += delta * 3

    groupRef.current.position.set(boss.position.x, boss.position.y, boss.position.z)
    const s = boss.scale || 1
    groupRef.current.scale.set(boss.direction * s, s, s)

    if (boss.phase === 'stunned') {
      groupRef.current.rotation.z = Math.sin(t * 8) * 0.3
    } else if (boss.phase === 'defeated') {
      groupRef.current.rotation.z = Math.sin(t * 2) * 0.5
    } else {
      groupRef.current.rotation.z = 0
    }

    const isMoving = Math.abs(boss.velocity.x) > 0.01
    const walkCycle = isMoving ? Math.sin(t * 2) * 0.5 : 0

    if (leftArm1Ref.current) leftArm1Ref.current.rotation.x = walkCycle * 0.5
    if (rightArm1Ref.current) rightArm1Ref.current.rotation.x = -walkCycle * 0.5
    if (leftArm2Ref.current) leftArm2Ref.current.rotation.x = Math.sin(t * 1.8) * 0.3
    if (rightArm2Ref.current) rightArm2Ref.current.rotation.x = Math.sin(t * 1.8 + 1) * 0.3

    if (capeRef.current) {
      capeRef.current.rotation.x = Math.sin(t * 2) * 0.4 - 0.5
    }

    if (boss.invincible) {
      groupRef.current.visible = Math.sin(t * 15) > 0
    } else {
      groupRef.current.visible = true
    }
  })

  const { primary, accent, glow } = boss.colorScheme
  const isEnraged = boss.health <= boss.maxHealth / 2
  const isFinalPhase = boss.health <= boss.maxHealth / 4

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 14]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
      <mesh ref={capeRef} position={[0, 0.2, -0.2]}>
        <boxGeometry args={[0.6, 0.9, 0.15]} />
        <meshStandardMaterial color={'#0a000a'} roughness={0.9} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.5, 0.55, 0.3]} />
        <meshStandardMaterial color={primary} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.55, 0.16]}>
        <boxGeometry args={[0.4, 0.03, 0.01]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={isEnraged ? 2 : 0.8} />
      </mesh>
      <mesh position={[0, 0.35, 0.16]}>
        <boxGeometry args={[0.35, 0.025, 0.01]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={isEnraged ? 2 : 0.8} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.32, 0.32, 0.3]} />
        <meshStandardMaterial color={primary} roughness={0.65} />
      </mesh>
      <mesh position={[-0.15, 1.1, 0]} rotation={[0, 0, 0.4]}>
        <coneGeometry args={[0.04, 0.25, 6]} />
        <meshStandardMaterial color={accent} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0.15, 1.1, 0]} rotation={[0, 0, -0.4]}>
        <coneGeometry args={[0.04, 0.25, 6]} />
        <meshStandardMaterial color={accent} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[-0.08, 0.87, 0.16]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={isFinalPhase ? 6 : isEnraged ? 4 : 2.5} />
      </mesh>
      <mesh position={[0.08, 0.87, 0.16]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={isFinalPhase ? 6 : isEnraged ? 4 : 2.5} />
      </mesh>
      <mesh position={[-0.08, 0.87, 0.175]}>
        <sphereGeometry args={[0.018, 4, 4]} />
        <meshStandardMaterial color={'#ffffff'} emissive={'#ffffff'} emissiveIntensity={isFinalPhase ? 5 : 2} />
      </mesh>
      <mesh position={[0.08, 0.87, 0.175]}>
        <sphereGeometry args={[0.018, 4, 4]} />
        <meshStandardMaterial color={'#ffffff'} emissive={'#ffffff'} emissiveIntensity={isFinalPhase ? 5 : 2} />
      </mesh>
      <group ref={leftArm1Ref} position={[-0.35, 0.5, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.06, 0.25, 6, 6]} />
          <meshStandardMaterial color={primary} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.1, 0.08, 0.1]} />
          <meshStandardMaterial color={accent} roughness={0.3} metalness={0.6} />
        </mesh>
      </group>
      <group ref={rightArm1Ref} position={[0.35, 0.5, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.06, 0.25, 6, 6]} />
          <meshStandardMaterial color={primary} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.1, 0.08, 0.1]} />
          <meshStandardMaterial color={accent} roughness={0.3} metalness={0.6} />
        </mesh>
      </group>
      <group ref={leftArm2Ref} position={[-0.3, 0.2, 0]}>
        <mesh position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.045, 0.2, 6, 6]} />
          <meshStandardMaterial color={primary} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.08, 0.07, 0.08]} />
          <meshStandardMaterial color={accent} roughness={0.4} metalness={0.5} />
        </mesh>
      </group>
      <group ref={rightArm2Ref} position={[0.3, 0.2, 0]}>
        <mesh position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.045, 0.2, 6, 6]} />
          <meshStandardMaterial color={primary} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.08, 0.07, 0.08]} />
          <meshStandardMaterial color={accent} roughness={0.4} metalness={0.5} />
        </mesh>
      </group>
      <mesh position={[-0.15, -0.25, 0]}>
        <boxGeometry args={[0.18, 0.4, 0.18]} />
        <meshStandardMaterial color={primary} roughness={0.7} />
      </mesh>
      <mesh position={[0.15, -0.25, 0]}>
        <boxGeometry args={[0.18, 0.4, 0.18]} />
        <meshStandardMaterial color={primary} roughness={0.7} />
      </mesh>
      <mesh position={[-0.15, -0.5, 0.05]}>
        <boxGeometry args={[0.2, 0.08, 0.25]} />
        <meshStandardMaterial color={'#0a000a'} roughness={0.8} />
      </mesh>
      <mesh position={[0.15, -0.5, 0.05]}>
        <boxGeometry args={[0.2, 0.08, 0.25]} />
        <meshStandardMaterial color={'#0a000a'} roughness={0.8} />
      </mesh>
      {isEnraged && (
        <pointLight position={[0, 0.5, 0.3]} color={glow} intensity={2} distance={4} />
      )}
      {isFinalPhase && (
        <pointLight position={[0, 0, 0]} color={'#ff00ff'} intensity={1.5} distance={6} />
      )}
      {boss.phase === 'attack' && (
        <pointLight position={[0, 0.5, 0.3]} color={glow} intensity={3} distance={5} />
      )}
    </group>
  )
}
