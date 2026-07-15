'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Enemy } from '@/types/game'
import { renderGoomba, renderKoopa, renderNinja, renderArcher, renderSumo, renderMushroom, renderSkeleton, renderDrone } from './enemies'

// ============================================
// ENEMY COMPONENT - Detailed
// ============================================
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

type RenderFn = (enemy: Enemy, meshRef: React.RefObject<THREE.Group | null>, leftFootRef: React.RefObject<THREE.Mesh | null>, rightFootRef: React.RefObject<THREE.Mesh | null>) => React.ReactNode

const renderers: Record<string, RenderFn> = {
  goomba: renderGoomba,
  koopa: renderKoopa,
  ninja: renderNinja,
  archer: renderArcher,
  sumo: renderSumo,
  mushroom: renderMushroom,
  skeleton: renderSkeleton,
  drone: renderDrone,
}

export function EnemyMesh({ enemy }: { enemy: Enemy }) {
  const meshRef = useRef<THREE.Group>(null)
  const leftFootRef = useRef<THREE.Mesh>(null)
  const rightFootRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.position.set(enemy.position.x, enemy.position.y, enemy.position.z)
    meshRef.current.visible = enemy.alive
    const baseScale = getEnemyVisualScale(enemy.type)
    meshRef.current.scale.x = enemy.direction * baseScale

    if (enemy.stomped) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 0.2 * baseScale, 0.15)
      meshRef.current.position.y -= 0.15 * baseScale
    } else {
      meshRef.current.scale.y = baseScale
    }

    const walkCycle = Date.now() * 0.008 * Math.abs(enemy.velocity.x) * 25

    // Animate feet
    if (leftFootRef.current && rightFootRef.current && !enemy.stomped) {
      leftFootRef.current.position.x = -0.1 + Math.sin(walkCycle) * 0.04
      rightFootRef.current.position.x = 0.1 - Math.sin(walkCycle) * 0.04
      leftFootRef.current.position.z = 0.04 + Math.cos(walkCycle) * 0.03
      rightFootRef.current.position.z = 0.04 - Math.cos(walkCycle) * 0.03
    }
  })

  const renderer = renderers[enemy.type]
  if (renderer) return <>{renderer(enemy, meshRef, leftFootRef, rightFootRef)}</>

  // Spike enemy - more detailed (default fallback)
  return (
    <group ref={meshRef}>
      <mesh position={[0, -0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 10]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.15} />
      </mesh>
      {/* Core body */}
      <mesh position={[0, 0, 0]}>
        <dodecahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#dd3333" roughness={0.35} metalness={0.2} />
      </mesh>
      {/* Inner glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.16, 8, 6]} />
        <meshStandardMaterial color="#ff5555" emissive="#ff3311" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      {/* Spikes - more and varied sizes */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh key={i} position={[
          Math.cos(i * Math.PI / 4) * 0.18,
          Math.sin(i * Math.PI / 4) * 0.18,
          0
        ]} rotation={[0, 0, i * Math.PI / 4]}>
          <coneGeometry args={[0.04, 0.14, 5]} />
          <meshStandardMaterial color="#ff5555" roughness={0.3} metalness={0.1} />
        </mesh>
      ))}
      {/* Secondary smaller spikes */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`s${i}`} position={[
          Math.cos(i * Math.PI / 2 + Math.PI / 4) * 0.15,
          Math.sin(i * Math.PI / 2 + Math.PI / 4) * 0.15,
          0.08
        ]} rotation={[0.3, 0, i * Math.PI / 2 + Math.PI / 4]}>
          <coneGeometry args={[0.025, 0.08, 4]} />
          <meshStandardMaterial color="#ff7755" roughness={0.3} />
        </mesh>
      ))}
      {/* Eyes - menacing */}
      <mesh position={[0.07, 0.06, 0.2]}>
        <sphereGeometry args={[0.045, 8, 6]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.07, 0.06, 0.2]}>
        <sphereGeometry args={[0.045, 8, 6]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.8} />
      </mesh>
      {/* Pupils */}
      <mesh position={[0.07, 0.06, 0.24]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#1a0000" />
      </mesh>
      <mesh position={[-0.07, 0.06, 0.24]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#1a0000" />
      </mesh>
    </group>
  )
}
