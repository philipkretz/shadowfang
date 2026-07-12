'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Platform } from '@/types/game'
import { useBrickTexture, useGrassTexture, useQuestionTexture, useUsedBlockTexture, useStoneTexture } from '@/game/textures'

// ============================================
// PLATFORM COMPONENT - Detailed with textures
// ============================================
export function PlatformMesh({ platform }: { platform: Platform }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const brickTex = useBrickTexture()
  const grassTex = useGrassTexture()
  const questionTex = useQuestionTexture()
  const usedTex = useUsedBlockTexture()
  const stoneTex = useStoneTexture()

  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.position.set(platform.position.x, platform.position.y, platform.position.z)
    if (platform.type === 'question' && !platform.hit) {
      meshRef.current.position.y += Math.sin(Date.now() * 0.004) * 0.04
    }
  })

  if (platform.size.x === 0) return null

  const getTexture = () => {
    switch (platform.type) {
      case 'brick':
        return <boxGeometry args={[platform.size.x, platform.size.y, platform.size.z]} />
      case 'ground':
        return <boxGeometry args={[platform.size.x, platform.size.y, platform.size.z]} />
      case 'pipe':
        return <cylinderGeometry args={[platform.size.x / 2, platform.size.x / 2, platform.size.y, 12]} />
      case 'cloud':
        return <sphereGeometry args={[platform.size.x / 2, 10, 8]} />
      default:
        return <boxGeometry args={[platform.size.x, platform.size.y, platform.size.z]} />
    }
  }

  const getMaterial = () => {
    if (platform.lava) {
      return <meshStandardMaterial color="#ff3300" roughness={0.3} emissive="#ff4400" emissiveIntensity={0.6 + Math.sin(Date.now() * 0.005) * 0.3} transparent opacity={0.92} />
    }
    switch (platform.type) {
      case 'question':
        return platform.hit
          ? <meshStandardMaterial map={usedTex} roughness={0.7} />
          : <meshStandardMaterial map={questionTex} roughness={0.3} emissive="#f0c020" emissiveIntensity={0.15} />
      case 'brick':
        return platform.color === '#ffffff'
          ? <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.92} />
          : <meshStandardMaterial map={brickTex} roughness={0.7} />
      case 'ground':
        return <meshStandardMaterial map={grassTex} roughness={0.85} />
      case 'pipe':
        return (
          <meshStandardMaterial
            color="#38b838"
            roughness={0.25}
            metalness={0.15}
          />
        )
      case 'cloud':
        return <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.92} />
      case 'moving':
        return <meshStandardMaterial color={platform.color} roughness={0.3} metalness={0.5} emissive={platform.color} emissiveIntensity={0.3} />
      default:
        return <meshStandardMaterial map={stoneTex} roughness={0.6} />
    }
  }

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {getTexture()}
      {getMaterial()}
    </mesh>
  )
}

// ============================================
// ROLLING STONE COMPONENT
// ============================================
export function RollingStoneMesh({ stone }: { stone: { position: { x: number; y: number; z: number }; rotation: number; radius: number } }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.position.set(stone.position.x, stone.position.y, stone.position.z)
    meshRef.current.rotation.x = stone.rotation
    meshRef.current.rotation.z = stone.rotation * 0.5
  })

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[stone.radius, 10, 10]} />
      <meshStandardMaterial color="#7a6a5a" roughness={0.8} />
    </mesh>
  )
}
