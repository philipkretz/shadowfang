'use client'

import * as THREE from 'three'
import type { Enemy } from '@/types/game'

export function renderSkeleton(
  enemy: Enemy,
  meshRef: React.RefObject<THREE.Group | null>,
  leftFootRef: React.RefObject<THREE.Mesh | null>,
  rightFootRef: React.RefObject<THREE.Mesh | null>
): React.ReactNode {
  const bone = '#e8e0d0'
  const boneDark = '#d0c8b0'
  const boneLight = '#f0e8d8'
  const boneShadow = '#b8b0a0'
  return (
    <group ref={meshRef}>
      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 14]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.15} />
      </mesh>

      {/* Pelvis - wider, anatomical */}
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[0.14, 0.06, 0.08]} />
        <meshStandardMaterial color={bone} roughness={0.65} />
      </mesh>
      {/* Pelvis wing details */}
      <mesh position={[0.08, -0.1, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.06, 0.04, 0.06]} />
        <meshStandardMaterial color={boneDark} roughness={0.7} />
      </mesh>
      <mesh position={[-0.08, -0.1, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.06, 0.04, 0.06]} />
        <meshStandardMaterial color={boneDark} roughness={0.7} />
      </mesh>

      {/* Spine - individual vertebrae */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <mesh key={`vert-${i}`} position={[0, -0.06 + i * 0.035, 0]}>
          <cylinderGeometry args={[0.022, 0.025, 0.025, 6]} />
          <meshStandardMaterial color={boneDark} roughness={0.7} />
        </mesh>
      ))}
      {/* Spinous processes */}
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={`spin-${i}`} position={[0, -0.04 + i * 0.035, -0.03]}>
          <boxGeometry args={[0.008, 0.02, 0.015]} />
          <meshStandardMaterial color={boneShadow} roughness={0.7} />
        </mesh>
      ))}

      {/* Ribcage - individual ribs with proper curvature */}
      <mesh position={[0, 0.12, 0.01]}>
        <boxGeometry args={[0.16, 0.16, 0.1]} />
        <meshStandardMaterial color={bone} roughness={0.65} transparent opacity={0.3} />
      </mesh>
      {/* Right ribs - curved */}
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={`rrib-${i}`} position={[0.06, 0.18 - i * 0.035, 0.03]} rotation={[0, 0, -0.3 - i * 0.05]}>
          <boxGeometry args={[0.09 - i * 0.005, 0.012, 0.012]} />
          <meshStandardMaterial color={boneLight} roughness={0.6} />
        </mesh>
      ))}
      {/* Left ribs - curved */}
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={`lrib-${i}`} position={[-0.06, 0.18 - i * 0.035, 0.03]} rotation={[0, 0, 0.3 + i * 0.05]}>
          <boxGeometry args={[0.09 - i * 0.005, 0.012, 0.012]} />
          <meshStandardMaterial color={boneLight} roughness={0.6} />
        </mesh>
      ))}
      {/* Rib front tips */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={`ribtip-${i}`} position={[0, 0.17 - i * 0.035, 0.07]}>
          <sphereGeometry args={[0.008, 4, 4]} />
          <meshStandardMaterial color={boneLight} roughness={0.5} />
        </mesh>
      ))}
      {/* Sternum */}
      <mesh position={[0, 0.14, 0.065]}>
        <boxGeometry args={[0.03, 0.1, 0.01]} />
        <meshStandardMaterial color={bone} roughness={0.6} />
      </mesh>

      {/* Clavicles - wider, more anatomical */}
      <mesh position={[0.08, 0.2, 0.02]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.1, 0.015, 0.018]} />
        <meshStandardMaterial color={bone} roughness={0.65} />
      </mesh>
      <mesh position={[-0.08, 0.2, 0.02]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.1, 0.015, 0.018]} />
        <meshStandardMaterial color={bone} roughness={0.65} />
      </mesh>
      {/* Scapulae (shoulder blades) */}
      <mesh position={[0.08, 0.18, -0.06]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.06, 0.08, 0.01]} />
        <meshStandardMaterial color={boneDark} roughness={0.7} />
      </mesh>
      <mesh position={[-0.08, 0.18, -0.06]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.06, 0.08, 0.01]} />
        <meshStandardMaterial color={boneDark} roughness={0.7} />
      </mesh>

      {/* Right arm - upper (humerus) */}
      <mesh position={[0.16, 0.14, 0]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.022, 0.13, 6, 8]} />
        <meshStandardMaterial color={bone} roughness={0.65} />
      </mesh>
      {/* Right elbow joint */}
      <mesh position={[0.18, 0.06, 0]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshStandardMaterial color={boneDark} roughness={0.6} />
      </mesh>
      {/* Right forearm - radius and ulna */}
      <mesh position={[0.19, -0.02, 0.01]} rotation={[0, 0, -0.1]}>
        <capsuleGeometry args={[0.018, 0.12, 6, 8]} />
        <meshStandardMaterial color={boneLight} roughness={0.6} />
      </mesh>
      <mesh position={[0.18, -0.02, -0.01]} rotation={[0, 0, -0.1]}>
        <capsuleGeometry args={[0.015, 0.12, 6, 8]} />
        <meshStandardMaterial color={boneShadow} roughness={0.6} />
      </mesh>
      {/* Right wrist */}
      <mesh position={[0.19, -0.09, 0.01]}>
        <sphereGeometry args={[0.016, 6, 6]} />
        <meshStandardMaterial color={boneDark} roughness={0.6} />
      </mesh>
      {/* Right hand - detailed bones */}
      <mesh position={[0.19, -0.12, 0.02]}>
        <boxGeometry args={[0.035, 0.035, 0.02]} />
        <meshStandardMaterial color={bone} roughness={0.6} />
      </mesh>
      {/* Finger bones */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={`rfinger-${i}`} position={[0.17 + i * 0.008, -0.15, 0.02]}>
          <capsuleGeometry args={[0.005, 0.02, 4, 4]} />
          <meshStandardMaterial color={boneLight} roughness={0.55} />
        </mesh>
      ))}
      {/* Thumb */}
      <mesh position={[0.21, -0.13, 0.03]} rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.005, 0.015, 4, 4]} />
        <meshStandardMaterial color={boneLight} roughness={0.55} />
      </mesh>

      {/* Left arm - upper (humerus) */}
      <mesh position={[-0.16, 0.14, 0]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.022, 0.13, 6, 8]} />
        <meshStandardMaterial color={bone} roughness={0.65} />
      </mesh>
      {/* Left elbow joint */}
      <mesh position={[-0.18, 0.06, 0]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshStandardMaterial color={boneDark} roughness={0.6} />
      </mesh>
      {/* Left forearm */}
      <mesh position={[-0.19, -0.02, 0.01]} rotation={[0, 0, 0.1]}>
        <capsuleGeometry args={[0.018, 0.12, 6, 8]} />
        <meshStandardMaterial color={boneLight} roughness={0.6} />
      </mesh>
      <mesh position={[-0.18, -0.02, -0.01]} rotation={[0, 0, 0.1]}>
        <capsuleGeometry args={[0.015, 0.12, 6, 8]} />
        <meshStandardMaterial color={boneShadow} roughness={0.6} />
      </mesh>
      {/* Left wrist */}
      <mesh position={[-0.19, -0.09, 0.01]}>
        <sphereGeometry args={[0.016, 6, 6]} />
        <meshStandardMaterial color={boneDark} roughness={0.6} />
      </mesh>
      {/* Left hand */}
      <mesh position={[-0.19, -0.12, 0.02]}>
        <boxGeometry args={[0.035, 0.035, 0.02]} />
        <meshStandardMaterial color={bone} roughness={0.6} />
      </mesh>
      {/* Finger bones */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={`lfinger-${i}`} position={[-0.21 + i * 0.008, -0.15, 0.02]}>
          <capsuleGeometry args={[0.005, 0.02, 4, 4]} />
          <meshStandardMaterial color={boneLight} roughness={0.55} />
        </mesh>
      ))}
      <mesh position={[-0.21, -0.13, 0.03]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.005, 0.015, 4, 4]} />
        <meshStandardMaterial color={boneLight} roughness={0.55} />
      </mesh>

      {/* Right leg - upper (femur) */}
      <mesh ref={rightFootRef} position={[0.07, -0.18, 0]}>
        <capsuleGeometry args={[0.025, 0.11, 6, 8]} />
        <meshStandardMaterial color={bone} roughness={0.65} />
      </mesh>
      {/* Right knee joint */}
      <mesh position={[0.07, -0.24, 0]}>
        <sphereGeometry args={[0.024, 8, 6]} />
        <meshStandardMaterial color={boneDark} roughness={0.6} />
      </mesh>
      {/* Right lower leg - tibia and fibula */}
      <mesh position={[0.07, -0.3, 0.01]}>
        <capsuleGeometry args={[0.02, 0.1, 6, 8]} />
        <meshStandardMaterial color={boneLight} roughness={0.6} />
      </mesh>
      <mesh position={[0.065, -0.3, -0.01]}>
        <capsuleGeometry args={[0.012, 0.1, 6, 8]} />
        <meshStandardMaterial color={boneShadow} roughness={0.6} />
      </mesh>
      {/* Right ankle */}
      <mesh position={[0.07, -0.36, 0.01]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshStandardMaterial color={boneDark} roughness={0.6} />
      </mesh>
      {/* Right foot - tarsals and metatarsals */}
      <mesh position={[0.07, -0.38, 0.04]}>
        <boxGeometry args={[0.035, 0.015, 0.08]} />
        <meshStandardMaterial color={bone} roughness={0.6} />
      </mesh>
      {/* Toe bones */}
      {[0, 1, 2].map(i => (
        <mesh key={`rtoe-${i}`} position={[0.06 + i * 0.008, -0.38, 0.09]}>
          <capsuleGeometry args={[0.004, 0.015, 4, 4]} />
          <meshStandardMaterial color={boneLight} roughness={0.55} />
        </mesh>
      ))}

      {/* Left leg - upper (femur) */}
      <mesh ref={leftFootRef} position={[-0.07, -0.18, 0]}>
        <capsuleGeometry args={[0.025, 0.11, 6, 8]} />
        <meshStandardMaterial color={bone} roughness={0.65} />
      </mesh>
      {/* Left knee joint */}
      <mesh position={[-0.07, -0.24, 0]}>
        <sphereGeometry args={[0.024, 8, 6]} />
        <meshStandardMaterial color={boneDark} roughness={0.6} />
      </mesh>
      {/* Left lower leg */}
      <mesh position={[-0.07, -0.3, 0.01]}>
        <capsuleGeometry args={[0.02, 0.1, 6, 8]} />
        <meshStandardMaterial color={boneLight} roughness={0.6} />
      </mesh>
      <mesh position={[-0.065, -0.3, -0.01]}>
        <capsuleGeometry args={[0.012, 0.1, 6, 8]} />
        <meshStandardMaterial color={boneShadow} roughness={0.6} />
      </mesh>
      {/* Left ankle */}
      <mesh position={[-0.07, -0.36, 0.01]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshStandardMaterial color={boneDark} roughness={0.6} />
      </mesh>
      {/* Left foot */}
      <mesh position={[-0.07, -0.38, 0.04]}>
        <boxGeometry args={[0.035, 0.015, 0.08]} />
        <meshStandardMaterial color={bone} roughness={0.6} />
      </mesh>
      {[0, 1, 2].map(i => (
        <mesh key={`ltoe-${i}`} position={[-0.08 + i * 0.008, -0.38, 0.09]}>
          <capsuleGeometry args={[0.004, 0.015, 4, 4]} />
          <meshStandardMaterial color={boneLight} roughness={0.55} />
        </mesh>
      ))}

      {/* Skull - detailed */}
      <mesh position={[0, 0.28, 0.02]}>
        <sphereGeometry args={[0.11, 14, 12]} />
        <meshStandardMaterial color={boneLight} roughness={0.55} />
      </mesh>
      {/* Cranium top */}
      <mesh position={[0, 0.34, -0.01]}>
        <sphereGeometry args={[0.09, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={bone} roughness={0.55} />
      </mesh>
      {/* Brow ridge - prominent */}
      <mesh position={[0, 0.31, 0.08]}>
        <boxGeometry args={[0.12, 0.02, 0.025]} />
        <meshStandardMaterial color={bone} roughness={0.6} />
      </mesh>
      {/* Eye sockets - deep */}
      <mesh position={[0.045, 0.29, 0.1]}>
        <sphereGeometry args={[0.038, 10, 8]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
      </mesh>
      <mesh position={[-0.045, 0.29, 0.1]}>
        <sphereGeometry args={[0.038, 10, 8]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
      </mesh>
      {/* Glowing eyes - deeper set */}
      <mesh position={[0.045, 0.29, 0.12]}>
        <sphereGeometry args={[0.022, 8, 6]} />
        <meshStandardMaterial color="#44ff44" emissive="#44ff44" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[-0.045, 0.29, 0.12]}>
        <sphereGeometry args={[0.022, 8, 6]} />
        <meshStandardMaterial color="#44ff44" emissive="#44ff44" emissiveIntensity={2.5} />
      </mesh>
      {/* Eye glow cores */}
      <mesh position={[0.045, 0.29, 0.135]}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshStandardMaterial color="#88ff88" emissive="#66ff66" emissiveIntensity={3} />
      </mesh>
      <mesh position={[-0.045, 0.29, 0.135]}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshStandardMaterial color="#88ff88" emissive="#66ff66" emissiveIntensity={3} />
      </mesh>
      {/* Nose hole - triangular */}
      <mesh position={[0, 0.26, 0.12]}>
        <boxGeometry args={[0.025, 0.03, 0.012]} />
        <meshStandardMaterial color="#1a1a0a" roughness={0.3} />
      </mesh>
      {/* Cheekbones */}
      <mesh position={[0.08, 0.27, 0.06]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color={bone} roughness={0.55} />
      </mesh>
      <mesh position={[-0.08, 0.27, 0.06]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color={bone} roughness={0.55} />
      </mesh>
      {/* Zygomatic arch */}
      <mesh position={[0.09, 0.28, 0.03]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.04, 0.008, 0.01]} />
        <meshStandardMaterial color={boneDark} roughness={0.6} />
      </mesh>
      <mesh position={[-0.09, 0.28, 0.03]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.04, 0.008, 0.01]} />
        <meshStandardMaterial color={boneDark} roughness={0.6} />
      </mesh>
      {/* Jaw - mandible with detail */}
      <mesh position={[0, 0.2, 0.06]}>
        <boxGeometry args={[0.1, 0.05, 0.07]} />
        <meshStandardMaterial color={bone} roughness={0.65} />
      </mesh>
      {/* Jaw angle */}
      <mesh position={[0.06, 0.22, 0.02]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color={boneDark} roughness={0.6} />
      </mesh>
      <mesh position={[-0.06, 0.22, 0.02]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color={boneDark} roughness={0.6} />
      </mesh>
      {/* Teeth - upper row */}
      {[-0.03, -0.015, 0, 0.015, 0.03].map((x, i) => (
        <mesh key={`uteeth-${i}`} position={[x, 0.225, 0.1]}>
          <boxGeometry args={[0.012, 0.018, 0.01]} />
          <meshStandardMaterial color="#f8f4f0" roughness={0.3} />
        </mesh>
      ))}
      {/* Teeth - lower row */}
      {[-0.025, -0.01, 0.01, 0.025].map((x, i) => (
        <mesh key={`lteeth-${i}`} position={[x, 0.21, 0.1]}>
          <boxGeometry args={[0.012, 0.015, 0.008]} />
          <meshStandardMaterial color="#f0ebe5" roughness={0.35} />
        </mesh>
      ))}
      {/* Chin */}
      <mesh position={[0, 0.185, 0.09]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color={boneLight} roughness={0.55} />
      </mesh>

      <pointLight position={[0, 0.15, 0.25]} color="#44ff44" intensity={0.7} distance={3} />
    </group>
  )
}
