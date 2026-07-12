'use client'

import * as THREE from 'three'
import type { Enemy } from '@/types/game'

export function renderGoomba(
  enemy: Enemy,
  meshRef: React.RefObject<THREE.Group | null>,
  leftFootRef: React.RefObject<THREE.Mesh | null>,
  rightFootRef: React.RefObject<THREE.Mesh | null>
): React.ReactNode {
  const fur = '#8a5c28'
  const furLight = '#a07030'
  const furDark = '#6a4018'
  const furMid = '#926828'
  return (
    <group ref={meshRef}>
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.28, 18]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.18} />
      </mesh>

      {/* Body - round torso */}
      <mesh position={[0, 0.0, 0]}>
        <sphereGeometry args={[0.26, 16, 14]} />
        <meshStandardMaterial color={fur} roughness={0.65} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, -0.04, 0.12]}>
        <sphereGeometry args={[0.18, 12, 10]} />
        <meshStandardMaterial color={furLight} roughness={0.55} />
      </mesh>
      {/* Chest fur tuft */}
      <mesh position={[0, 0.06, 0.16]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial color={furMid} roughness={0.6} />
      </mesh>

      {/* Mushroom cap - large dome */}
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.28, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={furDark} roughness={0.5} />
      </mesh>
      {/* Cap rim */}
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.29, 16]} />
        <meshStandardMaterial color={furDark} side={THREE.DoubleSide} roughness={0.5} />
      </mesh>
      {/* Cap spots - larger, more detailed */}
      <mesh position={[0.12, 0.3, 0.08]}>
        <sphereGeometry args={[0.06, 10, 8]} />
        <meshStandardMaterial color={furLight} roughness={0.5} />
      </mesh>
      <mesh position={[-0.1, 0.28, -0.09]}>
        <sphereGeometry args={[0.05, 10, 8]} />
        <meshStandardMaterial color={furLight} roughness={0.5} />
      </mesh>
      <mesh position={[0.03, 0.34, -0.05]}>
        <sphereGeometry args={[0.042, 8, 6]} />
        <meshStandardMaterial color={furLight} roughness={0.5} />
      </mesh>
      <mesh position={[-0.14, 0.26, 0.05]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <meshStandardMaterial color={furLight} roughness={0.5} />
      </mesh>
      <mesh position={[0.1, 0.26, -0.1]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshStandardMaterial color={furLight} roughness={0.5} />
      </mesh>
      {/* Cap texture bumps */}
      <mesh position={[0.06, 0.32, 0.1]}>
        <sphereGeometry args={[0.015, 6, 4]} />
        <meshStandardMaterial color={furDark} roughness={0.6} />
      </mesh>
      <mesh position={[-0.08, 0.3, 0.06]}>
        <sphereGeometry args={[0.012, 6, 4]} />
        <meshStandardMaterial color={furDark} roughness={0.6} />
      </mesh>

      {/* Eye whites - larger, more expressive */}
      <mesh position={[0.085, 0.12, 0.2]}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshStandardMaterial color="#f8f4f0" roughness={0.25} />
      </mesh>
      <mesh position={[-0.085, 0.12, 0.2]}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshStandardMaterial color="#f8f4f0" roughness={0.25} />
      </mesh>
      {/* Pupils */}
      <mesh position={[0.095, 0.11, 0.26]}>
        <sphereGeometry args={[0.038, 10, 8]} />
        <meshStandardMaterial color="#1a0800" roughness={0.3} />
      </mesh>
      <mesh position={[-0.075, 0.11, 0.26]}>
        <sphereGeometry args={[0.038, 10, 8]} />
        <meshStandardMaterial color="#1a0800" roughness={0.3} />
      </mesh>
      {/* Eye highlights */}
      <mesh position={[0.1, 0.12, 0.275]}>
        <sphereGeometry args={[0.012, 4, 4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-0.07, 0.12, 0.275]}>
        <sphereGeometry args={[0.012, 4, 4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
      {/* Angry brows */}
      <mesh position={[0.11, 0.2, 0.21]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[0.09, 0.022, 0.015]} />
        <meshStandardMaterial color={furDark} roughness={0.6} />
      </mesh>
      <mesh position={[-0.11, 0.2, 0.21]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.09, 0.022, 0.015]} />
        <meshStandardMaterial color={furDark} roughness={0.6} />
      </mesh>
      {/* Mouth - downturned, snarling */}
      <mesh position={[0, 0.02, 0.24]}>
        <boxGeometry args={[0.1, 0.03, 0.012]} />
        <meshStandardMaterial color="#3a1800" roughness={0.5} />
      </mesh>
      {/* Lower lip */}
      <mesh position={[0, -0.01, 0.23]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color={furDark} roughness={0.6} />
      </mesh>
      {/* Teeth */}
      <mesh position={[0.03, 0.04, 0.24]}>
        <boxGeometry args={[0.015, 0.02, 0.008]} />
        <meshStandardMaterial color="#f8f4f0" roughness={0.3} />
      </mesh>
      <mesh position={[-0.03, 0.04, 0.24]}>
        <boxGeometry args={[0.015, 0.02, 0.008]} />
        <meshStandardMaterial color="#f8f4f0" roughness={0.3} />
      </mesh>
      {/* Cheek blush */}
      <mesh position={[0.16, 0.08, 0.16]}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshStandardMaterial color="#b85530" roughness={0.8} transparent opacity={0.35} />
      </mesh>
      <mesh position={[-0.16, 0.08, 0.16]}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshStandardMaterial color="#b85530" roughness={0.8} transparent opacity={0.35} />
      </mesh>

      {/* Arms - stubby but defined */}
      <mesh position={[0.22, 0.02, 0.04]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.042, 0.1, 6, 8]} />
        <meshStandardMaterial color={fur} roughness={0.6} />
      </mesh>
      <mesh position={[-0.22, 0.02, 0.04]} rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.042, 0.1, 6, 8]} />
        <meshStandardMaterial color={fur} roughness={0.6} />
      </mesh>
      {/* Hands */}
      <mesh position={[0.24, -0.06, 0.06]}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshStandardMaterial color={furDark} roughness={0.6} />
      </mesh>
      <mesh position={[-0.24, -0.06, 0.06]}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshStandardMaterial color={furDark} roughness={0.6} />
      </mesh>
      {/* Claw marks on hands */}
      <mesh position={[0.24, -0.04, 0.09]}>
        <boxGeometry args={[0.03, 0.008, 0.008]} />
        <meshStandardMaterial color={furMid} roughness={0.5} />
      </mesh>
      <mesh position={[-0.24, -0.04, 0.09]}>
        <boxGeometry args={[0.03, 0.008, 0.008]} />
        <meshStandardMaterial color={furMid} roughness={0.5} />
      </mesh>

      {/* Legs - thick */}
      <mesh ref={rightFootRef} position={[0.11, -0.22, 0.02]}>
        <capsuleGeometry args={[0.06, 0.1, 6, 8]} />
        <meshStandardMaterial color={fur} roughness={0.6} />
      </mesh>
      <mesh ref={leftFootRef} position={[-0.11, -0.22, 0.02]}>
        <capsuleGeometry args={[0.06, 0.1, 6, 8]} />
        <meshStandardMaterial color={fur} roughness={0.6} />
      </mesh>
      {/* Feet - larger */}
      <mesh position={[0.11, -0.3, 0.07]}>
        <boxGeometry args={[0.12, 0.06, 0.16]} />
        <meshStandardMaterial color={furDark} roughness={0.65} />
      </mesh>
      <mesh position={[-0.11, -0.3, 0.07]}>
        <boxGeometry args={[0.12, 0.06, 0.16]} />
        <meshStandardMaterial color={furDark} roughness={0.65} />
      </mesh>
      {/* Toes */}
      <mesh position={[0.11, -0.29, 0.15]}>
        <boxGeometry args={[0.1, 0.035, 0.025]} />
        <meshStandardMaterial color={furDark} roughness={0.65} />
      </mesh>
      <mesh position={[-0.11, -0.29, 0.15]}>
        <boxGeometry args={[0.1, 0.035, 0.025]} />
        <meshStandardMaterial color={furDark} roughness={0.65} />
      </mesh>
    </group>
  )
}
