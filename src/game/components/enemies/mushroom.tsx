'use client'

import * as THREE from 'three'
import type { Enemy } from '@/types/game'

export function renderMushroom(
  enemy: Enemy,
  meshRef: React.RefObject<THREE.Group | null>,
  leftFootRef: React.RefObject<THREE.Mesh | null>,
  rightFootRef: React.RefObject<THREE.Mesh | null>
): React.ReactNode {
  const stem = '#f0e8d0'
  const stemDark = '#d8d0b8'
  const stemShadow = '#c0b8a0'
  const capColor = enemy.direction > 0 ? '#cc2222' : '#2244bb'
  const capDark = enemy.direction > 0 ? '#991818' : '#1a3388'
  const capLight = enemy.direction > 0 ? '#ee3333' : '#3366dd'
  return (
    <group ref={meshRef}>
      <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 14]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.15} />
      </mesh>

      {/* Stem - tapered, textured */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.08, 0.11, 0.26, 12]} />
        <meshStandardMaterial color={stem} roughness={0.5} />
      </mesh>
      {/* Stem texture rings */}
      <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.09, 0.006, 6, 12]} />
        <meshStandardMaterial color={stemDark} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.085, 0.005, 6, 12]} />
        <meshStandardMaterial color={stemShadow} roughness={0.55} />
      </mesh>
      {/* Stem ring at top */}
      <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.085, 0.01, 8, 12]} />
        <meshStandardMaterial color={stemDark} roughness={0.5} />
      </mesh>

      {/* Cap - large dome */}
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.24, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={capColor} roughness={0.35} />
      </mesh>
      {/* Cap underside - gills */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.22, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.2]} />
        <meshStandardMaterial color={capDark} roughness={0.4} />
      </mesh>
      {/* Cap gill lines */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={`gill-${i}`} position={[0, 0.09, 0]} rotation={[Math.PI / 2, Math.PI * i * 0.25, 0]}>
          <boxGeometry args={[0.003, 0.003, 0.2]} />
          <meshStandardMaterial color={capDark} roughness={0.5} />
        </mesh>
      ))}
      {/* Cap rim */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.25, 14]} />
        <meshStandardMaterial color={capDark} side={THREE.DoubleSide} roughness={0.4} />
      </mesh>
      {/* Cap spots - larger, more */}
      <mesh position={[0.12, 0.24, 0.08]}>
        <sphereGeometry args={[0.05, 10, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.35} />
      </mesh>
      <mesh position={[-0.1, 0.22, 0.1]}>
        <sphereGeometry args={[0.045, 10, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.35} />
      </mesh>
      <mesh position={[0.03, 0.28, -0.06]}>
        <sphereGeometry args={[0.038, 8, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.35} />
      </mesh>
      <mesh position={[-0.13, 0.2, -0.04]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.35} />
      </mesh>
      <mesh position={[0.1, 0.2, -0.1]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.35} />
      </mesh>
      <mesh position={[-0.04, 0.26, 0.08]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.35} />
      </mesh>
      {/* Cap highlight */}
      <mesh position={[0.05, 0.26, 0.06]}>
        <sphereGeometry args={[0.08, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
        <meshStandardMaterial color={capLight} roughness={0.3} transparent opacity={0.3} />
      </mesh>

      {/* Face - expressive */}
      {/* Eye whites */}
      <mesh position={[0.06, 0.08, 0.12]}>
        <sphereGeometry args={[0.032, 10, 8]} />
        <meshStandardMaterial color="#f8f4f0" roughness={0.25} />
      </mesh>
      <mesh position={[-0.06, 0.08, 0.12]}>
        <sphereGeometry args={[0.032, 10, 8]} />
        <meshStandardMaterial color="#f8f4f0" roughness={0.25} />
      </mesh>
      {/* Pupils */}
      <mesh position={[0.06, 0.08, 0.15]}>
        <sphereGeometry args={[0.018, 8, 6]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.3} />
      </mesh>
      <mesh position={[-0.06, 0.08, 0.15]}>
        <sphereGeometry args={[0.018, 8, 6]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.3} />
      </mesh>
      {/* Eye highlights */}
      <mesh position={[0.065, 0.085, 0.16]}>
        <sphereGeometry args={[0.006, 4, 4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-0.055, 0.085, 0.16]}>
        <sphereGeometry args={[0.006, 4, 4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
      {/* Cheeks */}
      <mesh position={[0.09, 0.05, 0.1]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial color="#dd8866" roughness={0.8} transparent opacity={0.35} />
      </mesh>
      <mesh position={[-0.09, 0.05, 0.1]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial color="#dd8866" roughness={0.8} transparent opacity={0.35} />
      </mesh>
      {/* Mouth - cute smile */}
      <mesh position={[0, 0.02, 0.13]}>
        <boxGeometry args={[0.05, 0.015, 0.01]} />
        <meshStandardMaterial color="#6a3a20" roughness={0.5} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.06, 0.13]}>
        <sphereGeometry args={[0.008, 4, 4]} />
        <meshStandardMaterial color={stemDark} roughness={0.5} />
      </mesh>

      {/* Feet - with shoe detail */}
      <mesh ref={rightFootRef} position={[0.07, -0.2, 0.03]}>
        <boxGeometry args={[0.07, 0.045, 0.1]} />
        <meshStandardMaterial color="#8a6a40" roughness={0.6} />
      </mesh>
      <mesh ref={leftFootRef} position={[-0.07, -0.2, 0.03]}>
        <boxGeometry args={[0.07, 0.045, 0.1]} />
        <meshStandardMaterial color="#8a6a40" roughness={0.6} />
      </mesh>
      {/* Shoe soles */}
      <mesh position={[0.07, -0.22, 0.03]}>
        <boxGeometry args={[0.075, 0.01, 0.105]} />
        <meshStandardMaterial color="#6a4a20" roughness={0.7} />
      </mesh>
      <mesh position={[-0.07, -0.22, 0.03]}>
        <boxGeometry args={[0.075, 0.01, 0.105]} />
        <meshStandardMaterial color="#6a4a20" roughness={0.7} />
      </mesh>
    </group>
  )
}
