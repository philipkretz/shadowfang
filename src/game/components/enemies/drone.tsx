'use client'

import * as THREE from 'three'
import type { Enemy } from '@/types/game'

export function renderDrone(
  enemy: Enemy,
  meshRef: React.RefObject<THREE.Group | null>,
  leftFootRef: React.RefObject<THREE.Mesh | null>,
  rightFootRef: React.RefObject<THREE.Mesh | null>
): React.ReactNode {
  const droneColor = '#556677'
  const droneAccent = '#00ccff'
  const droneGlow = '#44ddff'
  return (
    <group ref={meshRef}>
      {/* Shadow on ground (projected) */}
      <mesh position={[0, -enemy.position.y + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 10]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.12} />
      </mesh>

      {/* Main body - flat disc */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.3, 0.12, 8]} />
        <meshStandardMaterial color={droneColor} roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Body top plate */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.04, 8]} />
        <meshStandardMaterial color={'#445566'} roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Central dome */}
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.12, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={droneColor} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Eye/sensor - front */}
      <mesh position={[0, 0.06, 0.32]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color={droneAccent} emissive={droneAccent} emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0, 0.06, 0.34]}>
        <sphereGeometry args={[0.025, 4, 4]} />
        <meshStandardMaterial color={'#ffffff'} emissive={'#ffffff'} emissiveIntensity={3} />
      </mesh>
      {/* Rotors - 4 arms extending outward */}
      {[0, 1, 2, 3].map(i => {
        const angle = (i * Math.PI) / 2
        const cx = Math.cos(angle) * 0.3
        const cz = Math.sin(angle) * 0.3
        return (
          <group key={`rotor-${i}`} position={[cx, 0.08, cz]}>
            {/* Arm */}
            <mesh rotation={[0, 0, angle + Math.PI / 2]}>
              <boxGeometry args={[0.22, 0.025, 0.03]} />
              <meshStandardMaterial color={'#3a4a5a'} roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Motor hub */}
            <mesh>
              <cylinderGeometry args={[0.04, 0.04, 0.05, 6]} />
              <meshStandardMaterial color={'#334455'} roughness={0.3} metalness={0.7} />
            </mesh>
            {/* Rotor disc (spinning visual) */}
            <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.05, 0.18, 12]} />
              <meshStandardMaterial color={droneAccent} emissive={droneAccent} emissiveIntensity={0.8} transparent opacity={0.35} side={2} />
            </mesh>
          </group>
        )
      })}
      {/* Bottom sensor array */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.04, 6]} />
        <meshStandardMaterial color={'#223344'} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Status lights on underside */}
      <mesh position={[0.15, -0.07, 0.1]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshStandardMaterial color={'#ff3333'} emissive={'#ff3333'} emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.15, -0.07, 0.1]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshStandardMaterial color={'#33ff33'} emissive={'#33ff33'} emissiveIntensity={2} />
      </mesh>
      {/* Landing gear struts */}
      <mesh position={[0.12, -0.12, 0.08]}>
        <cylinderGeometry args={[0.012, 0.012, 0.1, 4]} />
        <meshStandardMaterial color={'#334455'} roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[-0.12, -0.12, 0.08]}>
        <cylinderGeometry args={[0.012, 0.012, 0.1, 4]} />
        <meshStandardMaterial color={'#334455'} roughness={0.5} metalness={0.6} />
      </mesh>

    </group>
  )
}
