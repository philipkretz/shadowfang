'use client'

import * as THREE from 'three'
import type { Enemy } from '@/types/game'

export function renderNinja(
  enemy: Enemy,
  meshRef: React.RefObject<THREE.Group | null>,
  leftFootRef: React.RefObject<THREE.Mesh | null>,
  rightFootRef: React.RefObject<THREE.Mesh | null>
): React.ReactNode {
  const cloth = '#141428'
  const clothDark = '#0a0a1a'
  const clothMid = '#1e1e38'
  const clothLight = '#262648'
  const skin = '#c8a882'
  const skinDark = '#b09068'
  const skinShadow = '#9a7a58'
  return (
    <group ref={meshRef}>
      <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 20]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>

      {/* Right leg - upper (thigh) - thicker, muscular */}
      <mesh ref={rightFootRef} position={[0.1, -0.22, 0.02]}>
        <capsuleGeometry args={[0.065, 0.18, 8, 12]} />
        <meshStandardMaterial color={cloth} roughness={0.5} />
      </mesh>
      {/* Right thigh muscle definition */}
      <mesh position={[0.1, -0.18, 0.04]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color={clothMid} roughness={0.45} />
      </mesh>
      {/* Right leg - lower (shin) */}
      <mesh position={[0.1, -0.36, 0.03]}>
        <capsuleGeometry args={[0.052, 0.15, 8, 12]} />
        <meshStandardMaterial color={clothDark} roughness={0.55} />
      </mesh>
      {/* Right shin guard */}
      <mesh position={[0.1, -0.34, 0.06]}>
        <boxGeometry args={[0.06, 0.12, 0.015]} />
        <meshStandardMaterial color={clothMid} roughness={0.5} />
      </mesh>
      {/* Left leg - upper (thigh) */}
      <mesh ref={leftFootRef} position={[-0.1, -0.22, 0.02]}>
        <capsuleGeometry args={[0.065, 0.18, 8, 12]} />
        <meshStandardMaterial color={cloth} roughness={0.5} />
      </mesh>
      {/* Left thigh muscle definition */}
      <mesh position={[-0.1, -0.18, 0.04]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color={clothMid} roughness={0.45} />
      </mesh>
      {/* Left leg - lower (shin) */}
      <mesh position={[-0.1, -0.36, 0.03]}>
        <capsuleGeometry args={[0.052, 0.15, 8, 12]} />
        <meshStandardMaterial color={clothDark} roughness={0.55} />
      </mesh>
      {/* Left shin guard */}
      <mesh position={[-0.1, -0.34, 0.06]}>
        <boxGeometry args={[0.06, 0.12, 0.015]} />
        <meshStandardMaterial color={clothMid} roughness={0.5} />
      </mesh>
      {/* Knee joints - larger, padded */}
      <mesh position={[0.1, -0.27, 0.03]}>
        <sphereGeometry args={[0.058, 10, 8]} />
        <meshStandardMaterial color={clothDark} roughness={0.6} />
      </mesh>
      <mesh position={[-0.1, -0.27, 0.03]}>
        <sphereGeometry args={[0.058, 10, 8]} />
        <meshStandardMaterial color={clothDark} roughness={0.6} />
      </mesh>
      {/* Knee wrap detail */}
      <mesh position={[0.1, -0.27, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.055, 0.006, 4, 8]} />
        <meshStandardMaterial color={clothLight} roughness={0.5} />
      </mesh>
      <mesh position={[-0.1, -0.27, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.055, 0.006, 4, 8]} />
        <meshStandardMaterial color={clothLight} roughness={0.5} />
      </mesh>
      {/* Feet - detailed tabi boots */}
      <mesh position={[0.1, -0.47, 0.07]}>
        <boxGeometry args={[0.09, 0.045, 0.16]} />
        <meshStandardMaterial color={clothDark} roughness={0.6} />
      </mesh>
      <mesh position={[-0.1, -0.47, 0.07]}>
        <boxGeometry args={[0.09, 0.045, 0.16]} />
        <meshStandardMaterial color={clothDark} roughness={0.6} />
      </mesh>
      {/* Toe wraps - split toe */}
      <mesh position={[0.1, -0.46, 0.15]}>
        <boxGeometry args={[0.075, 0.03, 0.02]} />
        <meshStandardMaterial color={cloth} roughness={0.5} />
      </mesh>
      <mesh position={[-0.1, -0.46, 0.15]}>
        <boxGeometry args={[0.075, 0.03, 0.02]} />
        <meshStandardMaterial color={cloth} roughness={0.5} />
      </mesh>
      {/* Ankle wraps */}
      <mesh position={[0.1, -0.43, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.05, 0.005, 4, 8]} />
        <meshStandardMaterial color={clothLight} roughness={0.5} />
      </mesh>
      <mesh position={[-0.1, -0.43, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.05, 0.005, 4, 8]} />
        <meshStandardMaterial color={clothLight} roughness={0.5} />
      </mesh>

      {/* Torso - broader shoulders, tapered waist, athletic build */}
      <mesh position={[0, 0.02, 0.01]}>
        <capsuleGeometry args={[0.16, 0.2, 10, 14]} />
        <meshStandardMaterial color={cloth} roughness={0.45} />
      </mesh>
      {/* Shoulder padding - armored */}
      <mesh position={[0.17, 0.12, 0.01]}>
        <sphereGeometry args={[0.075, 10, 8]} />
        <meshStandardMaterial color={clothDark} roughness={0.5} />
      </mesh>
      <mesh position={[-0.17, 0.12, 0.01]}>
        <sphereGeometry args={[0.075, 10, 8]} />
        <meshStandardMaterial color={clothDark} roughness={0.5} />
      </mesh>
      {/* Shoulder armor ridge */}
      <mesh position={[0.17, 0.15, 0.01]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.08, 0.015, 0.06]} />
        <meshStandardMaterial color={clothLight} roughness={0.45} />
      </mesh>
      <mesh position={[-0.17, 0.15, 0.01]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.08, 0.015, 0.06]} />
        <meshStandardMaterial color={clothLight} roughness={0.45} />
      </mesh>
      {/* Chest definition - pectorals under cloth */}
      <mesh position={[0.06, 0.08, 0.1]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshStandardMaterial color={clothMid} roughness={0.4} />
      </mesh>
      <mesh position={[-0.06, 0.08, 0.1]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshStandardMaterial color={clothMid} roughness={0.4} />
      </mesh>
      {/* Abdominal area */}
      <mesh position={[0, -0.04, 0.1]}>
        <boxGeometry args={[0.14, 0.14, 0.06]} />
        <meshStandardMaterial color={clothMid} roughness={0.42} />
      </mesh>
      {/* Belt - wide obi */}
      <mesh position={[0, -0.08, 0]}>
        <torusGeometry args={[0.17, 0.03, 10, 20]} />
        <meshStandardMaterial color="#8a1a1a" roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.06, 0]}>
        <torusGeometry args={[0.165, 0.02, 10, 20]} />
        <meshStandardMaterial color="#6a1414" roughness={0.45} />
      </mesh>
      {/* Belt knot - detailed bow */}
      <mesh position={[0, -0.08, 0.17]}>
        <boxGeometry args={[0.045, 0.07, 0.025]} />
        <meshStandardMaterial color="#8a1a1a" roughness={0.4} />
      </mesh>
      <mesh position={[0.04, -0.06, 0.16]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.06, 0.02, 0.015]} />
        <meshStandardMaterial color="#9a2222" roughness={0.4} />
      </mesh>
      <mesh position={[-0.04, -0.06, 0.16]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.06, 0.02, 0.015]} />
        <meshStandardMaterial color="#9a2222" roughness={0.4} />
      </mesh>

      {/* Right arm - upper, muscular */}
      <mesh position={[0.22, 0.08, 0.04]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.055, 0.16, 8, 12]} />
        <meshStandardMaterial color={cloth} roughness={0.45} />
      </mesh>
      {/* Right bicep bulge */}
      <mesh position={[0.22, 0.1, 0.08]}>
        <sphereGeometry args={[0.042, 8, 6]} />
        <meshStandardMaterial color={clothMid} roughness={0.4} />
      </mesh>
      {/* Right arm - forearm with bracer */}
      <mesh position={[0.24, -0.06, 0.06]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.045, 0.13, 8, 12]} />
        <meshStandardMaterial color={clothDark} roughness={0.5} />
      </mesh>
      {/* Right wrist guard */}
      <mesh position={[0.24, -0.12, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.042, 0.006, 4, 8]} />
        <meshStandardMaterial color={clothLight} roughness={0.45} />
      </mesh>
      {/* Right hand - detailed with fingers */}
      <mesh position={[0.24, -0.17, 0.08]}>
        <boxGeometry args={[0.048, 0.055, 0.035]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Fingers on right hand */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={`rfinger-${i}`} position={[0.225 + i * 0.012, -0.2, 0.09]}>
          <capsuleGeometry args={[0.006, 0.025, 4, 4]} />
          <meshStandardMaterial color={skinDark} roughness={0.5} />
        </mesh>
      ))}
      {/* Right thumb */}
      <mesh position={[0.26, -0.18, 0.09]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.006, 0.02, 4, 4]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>

      {/* Left arm - upper */}
      <mesh position={[-0.22, 0.08, 0.04]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.055, 0.16, 8, 12]} />
        <meshStandardMaterial color={cloth} roughness={0.45} />
      </mesh>
      {/* Left bicep bulge */}
      <mesh position={[-0.22, 0.1, 0.08]}>
        <sphereGeometry args={[0.042, 8, 6]} />
        <meshStandardMaterial color={clothMid} roughness={0.4} />
      </mesh>
      {/* Left arm - forearm */}
      <mesh position={[-0.24, -0.06, 0.06]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.045, 0.13, 8, 12]} />
        <meshStandardMaterial color={clothDark} roughness={0.5} />
      </mesh>
      {/* Left wrist guard */}
      <mesh position={[-0.24, -0.12, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.042, 0.006, 4, 8]} />
        <meshStandardMaterial color={clothLight} roughness={0.45} />
      </mesh>
      {/* Left hand */}
      <mesh position={[-0.24, -0.17, 0.08]}>
        <boxGeometry args={[0.048, 0.055, 0.035]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Fingers on left hand */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={`lfinger-${i}`} position={[-0.255 + i * 0.012, -0.2, 0.09]}>
          <capsuleGeometry args={[0.006, 0.025, 4, 4]} />
          <meshStandardMaterial color={skinDark} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[-0.26, -0.18, 0.09]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.006, 0.02, 4, 4]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>

      {/* Katana on back - larger, more detailed */}
      <mesh position={[-0.12, 0.1, -0.14]} rotation={[0.12, 0, 0.08]}>
        <boxGeometry args={[0.022, 0.44, 0.009]} />
        <meshStandardMaterial color="#cccccc" metalness={0.85} roughness={0.12} />
      </mesh>
      {/* Katana blade edge highlight */}
      <mesh position={[-0.12, 0.1, -0.135]} rotation={[0.12, 0, 0.08]}>
        <boxGeometry args={[0.005, 0.44, 0.005]} />
        <meshStandardMaterial color="#eeeeee" metalness={0.9} roughness={0.08} />
      </mesh>
      {/* Katana handle wrapping */}
      <mesh position={[-0.12, -0.1, -0.14]} rotation={[0.12, 0, 0.08]}>
        <boxGeometry args={[0.026, 0.14, 0.014]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.7} />
      </mesh>
      {/* Handle wrap detail lines */}
      {[-0.07, -0.09, -0.11, -0.13].map((y, i) => (
        <mesh key={`wrap-${i}`} position={[-0.12, y, -0.14]} rotation={[0.12, 0, 0.08]}>
          <boxGeometry args={[0.03, 0.008, 0.016]} />
          <meshStandardMaterial color="#c8a030" roughness={0.4} />
        </mesh>
      ))}
      {/* Tsuba (hand guard) - ornate */}
      <mesh position={[-0.12, -0.02, -0.14]} rotation={[0.12, 0, 0.08]}>
        <boxGeometry args={[0.06, 0.01, 0.03]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[-0.12, -0.02, -0.14]} rotation={[0.12, 0, 0.08]}>
        <cylinderGeometry args={[0.02, 0.02, 0.012, 8]} />
        <meshStandardMaterial color="#c8a030" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Katana tip */}
      <mesh position={[-0.12, 0.32, -0.15]} rotation={[0.12, 0, 0.08]}>
        <coneGeometry args={[0.011, 0.035, 4]} />
        <meshStandardMaterial color="#dddddd" metalness={0.85} roughness={0.08} />
      </mesh>

      {/* Neck - muscular, thicker */}
      <mesh position={[0, 0.22, 0.01]}>
        <cylinderGeometry args={[0.055, 0.065, 0.07, 12]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Trapezius muscles - larger */}
      <mesh position={[0.07, 0.2, -0.025]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color={cloth} roughness={0.5} />
      </mesh>
      <mesh position={[-0.07, 0.2, -0.025]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color={cloth} roughness={0.5} />
      </mesh>
      {/* Sternocleidomastoid */}
      <mesh position={[0.03, 0.2, 0.03]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.015, 0.04, 4, 4]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      <mesh position={[-0.03, 0.2, 0.03]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.015, 0.04, 4, 4]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>

      {/* Head - larger, proper human proportions */}
      <mesh position={[0, 0.33, 0.01]}>
        <sphereGeometry args={[0.12, 16, 14]} />
        <meshStandardMaterial color={cloth} roughness={0.45} />
      </mesh>
      {/* Head top shape */}
      <mesh position={[0, 0.38, -0.01]}>
        <sphereGeometry args={[0.1, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={cloth} roughness={0.45} />
      </mesh>
      {/* Face mask - wrap style, contoured */}
      <mesh position={[0, 0.28, 0.08]}>
        <boxGeometry args={[0.16, 0.1, 0.1]} />
        <meshStandardMaterial color={clothDark} roughness={0.4} />
      </mesh>
      {/* Mask fabric folds */}
      <mesh position={[0.07, 0.28, 0.13]}>
        <boxGeometry args={[0.018, 0.08, 0.012]} />
        <meshStandardMaterial color={clothMid} roughness={0.5} />
      </mesh>
      <mesh position={[-0.07, 0.28, 0.13]}>
        <boxGeometry args={[0.018, 0.08, 0.012]} />
        <meshStandardMaterial color={clothMid} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.3, 0.13]}>
        <boxGeometry args={[0.012, 0.06, 0.01]} />
        <meshStandardMaterial color={clothLight} roughness={0.5} />
      </mesh>
      {/* Nose bridge under mask */}
      <mesh position={[0, 0.3, 0.12]}>
        <boxGeometry args={[0.03, 0.04, 0.02]} />
        <meshStandardMaterial color={cloth} roughness={0.45} />
      </mesh>
      {/* Brow area above mask - exposed skin */}
      <mesh position={[0, 0.33, 0.1]}>
        <boxGeometry args={[0.14, 0.03, 0.035]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>

      {/* Headband - detailed, larger */}
      <mesh position={[0, 0.35, 0.01]}>
        <torusGeometry args={[0.12, 0.018, 10, 20]} />
        <meshStandardMaterial color="#cc2222" roughness={0.35} />
      </mesh>
      {/* Headband emblem */}
      <mesh position={[0, 0.35, 0.13]}>
        <circleGeometry args={[0.015, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Headband knot */}
      <mesh position={[0, 0.35, -0.11]}>
        <boxGeometry args={[0.03, 0.03, 0.035]} />
        <meshStandardMaterial color="#cc2222" roughness={0.35} />
      </mesh>
      {/* Headband tails - fluttering in wind */}
      <mesh position={[0.07, 0.3, -0.12]} rotation={[0.7, 0, 0.3]}>
        <boxGeometry args={[0.022, 0.12, 0.14]} />
        <meshStandardMaterial color="#cc2222" roughness={0.35} />
      </mesh>
      <mesh position={[-0.06, 0.3, -0.12]} rotation={[0.7, 0, -0.3]}>
        <boxGeometry args={[0.02, 0.1, 0.12]} />
        <meshStandardMaterial color="#cc2222" roughness={0.35} />
      </mesh>
      <mesh position={[0.02, 0.28, -0.14]} rotation={[0.8, 0, 0.1]}>
        <boxGeometry args={[0.015, 0.07, 0.1]} />
        <meshStandardMaterial color="#aa1818" roughness={0.4} />
      </mesh>

      {/* Eyes - glowing through mask slit */}
      <mesh position={[0.05, 0.33, 0.1]}>
        <sphereGeometry args={[0.028, 10, 8]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff2222" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.05, 0.33, 0.1]}>
        <sphereGeometry args={[0.028, 10, 8]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff2222" emissiveIntensity={2} />
      </mesh>
      {/* Eye glow highlights */}
      <mesh position={[0.05, 0.335, 0.12]}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshStandardMaterial color="#ff8888" emissive="#ff4444" emissiveIntensity={3} />
      </mesh>
      <mesh position={[-0.05, 0.335, 0.12]}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshStandardMaterial color="#ff8888" emissive="#ff4444" emissiveIntensity={3} />
      </mesh>
      {/* Ear bumps under headband */}
      <mesh position={[0.12, 0.32, 0]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshStandardMaterial color={cloth} roughness={0.5} />
      </mesh>
      <mesh position={[-0.12, 0.32, 0]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshStandardMaterial color={cloth} roughness={0.5} />
      </mesh>

      <pointLight color="#ff2222" intensity={0.8} distance={3} />
    </group>
  )
}
