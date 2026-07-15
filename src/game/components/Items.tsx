'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Coin, PowerUp } from '@/types/game'

// ============================================
// COIN COMPONENT - Detailed with embossed design
// ============================================
export function CoinMesh({ coin }: { coin: Coin }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return
    if (coin.collected) {
      meshRef.current.visible = false
      return
    }
    meshRef.current.visible = true
    meshRef.current.position.set(coin.position.x, coin.position.y, coin.position.z)
    meshRef.current.rotation.y = coin.spinAngle
    meshRef.current.position.y += Math.sin(coin.spinAngle * 2) * 0.08
  })

  return (
    <group ref={meshRef} castShadow>
      {/* Main coin body */}
      <mesh>
        <cylinderGeometry args={[0.14, 0.14, 0.04, 8]} />
        <meshStandardMaterial
          color="#ffe000"
          roughness={0.12}
          metalness={0.9}
          emissive="#ffbb00"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Edge ring */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 0.025, 8]} />
        <meshStandardMaterial
          color="#ffdd22"
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>
      {/* Inner circle detail */}
      <mesh position={[0, 0.022, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.005, 6]} />
        <meshStandardMaterial
          color="#ffee33"
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>
      {/* Star emblem on face */}
      <mesh position={[0, 0.025, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.06, 0.005, 0.015]} />
        <meshStandardMaterial color="#ffbb11" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.06, 0.005, 0.015]} />
        <meshStandardMaterial color="#ffbb11" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

// ============================================
// POWERUP COMPONENT - Detailed
// ============================================
export function PowerUpMesh({ powerUp }: { powerUp: PowerUp }) {
  const meshRef = useRef<THREE.Group>(null)
  const bounceRef = useRef(0)

  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.visible = powerUp.active && !powerUp.collected
    meshRef.current.position.set(powerUp.position.x, powerUp.position.y, powerUp.position.z)
    meshRef.current.rotation.y += 0.04

    // Bounce animation when spawning
    if (powerUp.active && !powerUp.collected) {
      bounceRef.current += 0.08
      const bounce = Math.abs(Math.sin(bounceRef.current)) * 0.1
      meshRef.current.position.y += bounce
    }
  })

  if (powerUp.type === 'mushroom') {
    return (
      <group ref={meshRef}>
        {/* Glow */}
        <mesh>
          <sphereGeometry args={[0.28, 10, 8]} />
          <meshStandardMaterial color="#ff4444" transparent opacity={0.12} emissive="#ff2222" emissiveIntensity={0.6} />
        </mesh>
        {/* Mushroom cap */}
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.18, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ff3333" roughness={0.35} />
        </mesh>
        {/* Cap top */}
        <mesh position={[0, 0.14, 0]}>
          <sphereGeometry args={[0.15, 10, 6]} />
          <meshStandardMaterial color="#ff4444" roughness={0.35} />
        </mesh>
        {/* White spots on cap */}
        <mesh position={[0.08, 0.22, 0.06]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[-0.06, 0.2, -0.08]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[0.02, 0.24, -0.04]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.12, 8]} />
          <meshStandardMaterial color="#ffeecc" roughness={0.5} />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.04, 0.08, 0.14]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[-0.04, 0.08, 0.14]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    )
  }

  if (powerUp.type === 'flower') {
    return (
      <group ref={meshRef}>
        {/* Glow */}
        <mesh>
          <sphereGeometry args={[0.28, 10, 8]} />
          <meshStandardMaterial color="#ff5599" transparent opacity={0.15} emissive="#ff3377" emissiveIntensity={0.8} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.15, 6]} />
          <meshStandardMaterial color="#228B22" roughness={0.5} />
        </mesh>
        {/* Leaves */}
        <mesh position={[-0.06, -0.02, 0]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.08, 0.03, 0.04]} />
          <meshStandardMaterial color="#2ea82e" roughness={0.5} />
        </mesh>
        <mesh position={[0.06, 0, 0]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.07, 0.03, 0.04]} />
          <meshStandardMaterial color="#3cb043" roughness={0.5} />
        </mesh>
        {/* Center */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial color="#ffbb11" emissive="#ffbb11" emissiveIntensity={0.6} roughness={0.3} />
        </mesh>
        {/* Petals */}
        {[0, 1, 2, 3, 4, 5].map(i => {
          const angle = (i * Math.PI * 2) / 6
          return (
            <mesh key={`fpetal-${i}`} position={[Math.cos(angle) * 0.07, 0.08 + Math.sin(angle) * 0.07, 0]}>
              <sphereGeometry args={[0.04, 6, 4]} />
              <meshStandardMaterial color="#ff5599" emissive="#ff3377" emissiveIntensity={0.7} roughness={0.4} />
            </mesh>
          )
        })}
      </group>
    )
  }

  // Star power-up
  return (
    <group ref={meshRef}>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.3, 10, 8]} />
        <meshStandardMaterial color="#ffff00" transparent opacity={0.12} emissive="#ffaa00" emissiveIntensity={0.6} />
      </mesh>
      {/* Star body - 5 points */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.12, Math.sin(angle) * 0.12 + 0.05, 0]} rotation={[0, 0, angle + Math.PI / 2]}>
            <coneGeometry args={[0.04, 0.14, 4]} />
            <meshStandardMaterial color="#ffee11" roughness={0.2} metalness={0.4} emissive="#ffbb11" emissiveIntensity={0.4} />
          </mesh>
        )
      })}
      {/* Center body */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial color="#ffee00" roughness={0.2} metalness={0.3} emissive="#ffcc00" emissiveIntensity={0.4} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.03, 0.08, 0.07]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.03, 0.08, 0.07]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Sparkle particles */}
      <mesh position={[0.15, 0.15, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.02]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.12, 0.18, 0.05]}>
        <boxGeometry args={[0.015, 0.015, 0.015]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}
