'use client'

import * as THREE from 'three'
import type { Enemy } from '@/types/game'

export function renderKoopa(
  enemy: Enemy,
  meshRef: React.RefObject<THREE.Group | null>,
  leftFootRef: React.RefObject<THREE.Mesh | null>,
  rightFootRef: React.RefObject<THREE.Mesh | null>
): React.ReactNode {
  const shell = '#2a8a2a'
  const shellLight = '#38b038'
  const shellDark = '#1a6a1a'
  const shellRidge = '#48c848'
  const skin = '#e8c870'
  const skinDark = '#d0a850'
  const skinShadow = '#b89040'
  return (
    <group ref={meshRef}>
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 18]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.18} />
      </mesh>

      {/* Shell - main dome, larger and more detailed */}
      <mesh position={[0, 0.1, -0.02]}>
        <sphereGeometry args={[0.3, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={shell} roughness={0.35} metalness={0.08} />
      </mesh>
      {/* Shell underside */}
      <mesh position={[0, 0.02, -0.02]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
        <meshStandardMaterial color={shellDark} roughness={0.4} />
      </mesh>
      {/* Shell ridge plates - hexagonal pattern */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={`ridge-${i}`} position={[0, 0.16 + i * 0.018, -0.02 - i * 0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.06 + i * 0.04, 0.08 + i * 0.04, 12]} />
          <meshStandardMaterial color={shellRidge} side={THREE.DoubleSide} roughness={0.3} />
        </mesh>
      ))}
      {/* Shell edge rim - thicker */}
      <mesh position={[0, 0.03, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.26, 0.31, 16]} />
        <meshStandardMaterial color={shellDark} side={THREE.DoubleSide} roughness={0.4} />
      </mesh>
      {/* Shell scute lines */}
      {[0, 1, 2].map(i => (
        <mesh key={`scute-${i}`} position={[0, 0.2 + i * 0.02, -0.02 - i * 0.04]} rotation={[Math.PI / 2, 0, Math.PI * i * 0.3]}>
          <boxGeometry args={[0.15 - i * 0.02, 0.005, 0.003]} />
          <meshStandardMaterial color={shellDark} roughness={0.5} />
        </mesh>
      ))}

      {/* Belly - larger, plated */}
      <mesh position={[0, -0.02, 0.14]}>
        <sphereGeometry args={[0.2, 12, 10]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Belly plates - horizontal lines */}
      <mesh position={[0, 0.04, 0.26]}>
        <boxGeometry args={[0.18, 0.015, 0.012]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.0, 0.26]}>
        <boxGeometry args={[0.16, 0.015, 0.012]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.04, 0.25]}>
        <boxGeometry args={[0.14, 0.015, 0.012]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.08, 0.23]}>
        <boxGeometry args={[0.12, 0.015, 0.012]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      {/* Belly center line */}
      <mesh position={[0, 0.0, 0.27]}>
        <boxGeometry args={[0.008, 0.12, 0.008]} />
        <meshStandardMaterial color={skinShadow} roughness={0.6} />
      </mesh>

      {/* Neck - thicker, more muscular */}
      <mesh position={[0.14, 0.16, 0.1]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.05, 0.06, 0.12, 10]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Neck scales */}
      <mesh position={[0.14, 0.18, 0.12]} rotation={[0, 0, 0.4]}>
        <torusGeometry args={[0.052, 0.005, 4, 8]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>

      {/* Head - larger, more detailed */}
      <group position={[0.18, 0.26, 0.12]}>
        <mesh>
          <sphereGeometry args={[0.12, 14, 12]} />
          <meshStandardMaterial color={skin} roughness={0.45} />
        </mesh>
        {/* Head top scales */}
        <mesh position={[0, 0.08, -0.02]}>
          <sphereGeometry args={[0.08, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <meshStandardMaterial color={skinDark} roughness={0.5} />
        </mesh>
        {/* Eye whites - larger */}
        <mesh position={[0.07, 0.04, 0.07]}>
          <sphereGeometry args={[0.05, 12, 10]} />
          <meshStandardMaterial color="#f8f4f0" roughness={0.25} />
        </mesh>
        {/* Iris */}
        <mesh position={[0.08, 0.04, 0.1]}>
          <sphereGeometry args={[0.03, 10, 8]} />
          <meshStandardMaterial color="#2a4a00" roughness={0.3} />
        </mesh>
        {/* Pupil */}
        <mesh position={[0.085, 0.04, 0.115]}>
          <sphereGeometry args={[0.018, 8, 6]} />
          <meshStandardMaterial color="#1a1a00" roughness={0.3} />
        </mesh>
        {/* Eye highlight */}
        <mesh position={[0.09, 0.05, 0.12]}>
          <sphereGeometry args={[0.008, 4, 4]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        {/* Brow ridge - fierce */}
        <mesh position={[0.05, 0.07, 0.05]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.09, 0.02, 0.025]} />
          <meshStandardMaterial color={skinDark} roughness={0.5} />
        </mesh>
        {/* Nostril */}
        <mesh position={[0.12, 0.01, 0.04]}>
          <sphereGeometry args={[0.008, 4, 4]} />
          <meshStandardMaterial color={skinShadow} roughness={0.5} />
        </mesh>
        {/* Beak - upper, curved */}
        <mesh position={[0.13, -0.01, 0.03]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.07, 0.03, 0.05]} />
          <meshStandardMaterial color="#e88030" roughness={0.35} />
        </mesh>
        {/* Beak - lower */}
        <mesh position={[0.13, -0.04, 0.03]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.06, 0.022, 0.045]} />
          <meshStandardMaterial color="#d07028" roughness={0.4} />
        </mesh>
        {/* Beak tip */}
        <mesh position={[0.17, -0.015, 0.03]}>
          <sphereGeometry args={[0.008, 4, 4]} />
          <meshStandardMaterial color="#c06020" roughness={0.4} />
        </mesh>
        {/* Ear area */}
        <mesh position={[0.12, 0.06, -0.04]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color={skinDark} roughness={0.5} />
        </mesh>
      </group>

      {/* Arms - thicker, with scales */}
      <group position={[0.24, 0.06, 0.12]}>
        <mesh position={[0, -0.04, 0]} rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.042, 0.1, 6, 8]} />
          <meshStandardMaterial color={skin} roughness={0.5} />
        </mesh>
        {/* Elbow */}
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color={skinDark} roughness={0.5} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0.01, -0.12, 0.02]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.035, 0.08, 6, 8]} />
          <meshStandardMaterial color={skin} roughness={0.5} />
        </mesh>
        <mesh position={[0.01, -0.18, 0.04]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color={skinDark} roughness={0.5} />
        </mesh>
        {/* Claw on hand */}
        <mesh position={[0.01, -0.18, 0.07]}>
          <coneGeometry args={[0.008, 0.02, 4]} />
          <meshStandardMaterial color="#d0a850" roughness={0.4} />
        </mesh>
      </group>
      <group position={[-0.18, 0.06, 0.12]}>
        <mesh position={[0, -0.04, 0]} rotation={[0, 0, 0.2]}>
          <capsuleGeometry args={[0.042, 0.1, 6, 8]} />
          <meshStandardMaterial color={skin} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color={skinDark} roughness={0.5} />
        </mesh>
        <mesh position={[-0.01, -0.12, 0.02]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.035, 0.08, 6, 8]} />
          <meshStandardMaterial color={skin} roughness={0.5} />
        </mesh>
        <mesh position={[-0.01, -0.18, 0.04]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color={skinDark} roughness={0.5} />
        </mesh>
        <mesh position={[-0.01, -0.18, 0.07]}>
          <coneGeometry args={[0.008, 0.02, 4]} />
          <meshStandardMaterial color="#d0a850" roughness={0.4} />
        </mesh>
      </group>

      {/* Legs - thicker */}
      <mesh ref={rightFootRef} position={[0.12, -0.22, 0.04]}>
        <capsuleGeometry args={[0.05, 0.1, 6, 8]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      <mesh ref={leftFootRef} position={[-0.12, -0.22, 0.04]}>
        <capsuleGeometry args={[0.05, 0.1, 6, 8]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Knee joints */}
      <mesh position={[0.12, -0.24, 0.04]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      <mesh position={[-0.12, -0.24, 0.04]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      {/* Feet - large, webbed toes */}
      <mesh position={[0.12, -0.3, 0.07]}>
        <boxGeometry args={[0.12, 0.05, 0.18]} />
        <meshStandardMaterial color="#e8a820" roughness={0.4} />
      </mesh>
      <mesh position={[-0.12, -0.3, 0.07]}>
        <boxGeometry args={[0.12, 0.05, 0.18]} />
        <meshStandardMaterial color="#e8a820" roughness={0.4} />
      </mesh>
      {/* Toes - 3 per foot */}
      {[0, 1, 2].map(i => (
        <mesh key={`rtoe-${i}`} position={[0.12 + (i - 1) * 0.03, -0.29, 0.16]}>
          <boxGeometry args={[0.03, 0.03, 0.02]} />
          <meshStandardMaterial color="#d09018" roughness={0.4} />
        </mesh>
      ))}
      {[0, 1, 2].map(i => (
        <mesh key={`ltoe-${i}`} position={[-0.12 + (i - 1) * 0.03, -0.29, 0.16]}>
          <boxGeometry args={[0.03, 0.03, 0.02]} />
          <meshStandardMaterial color="#d09018" roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}
