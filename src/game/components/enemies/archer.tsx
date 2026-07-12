'use client'

import * as THREE from 'three'
import type { Enemy } from '@/types/game'

export function renderArcher(
  enemy: Enemy,
  meshRef: React.RefObject<THREE.Group | null>,
  leftFootRef: React.RefObject<THREE.Mesh | null>,
  rightFootRef: React.RefObject<THREE.Mesh | null>
): React.ReactNode {
  const cloth = '#2a5218'
  const clothDark = '#1a3a10'
  const clothMid = '#345e22'
  const clothLight = '#3e6a2a'
  const skin = '#c8a882'
  const skinDark = '#b09068'
  const skinShadow = '#9a7a58'
  const leather = '#6a4220'
  const leatherDark = '#4a2e14'
  const leatherLight = '#8a5a30'
  return (
    <group ref={meshRef}>
      <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 20]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>

      {/* Right leg - upper (thigh) with leather wrap */}
      <mesh ref={rightFootRef} position={[0.09, -0.22, 0.02]}>
        <capsuleGeometry args={[0.06, 0.18, 8, 12]} />
        <meshStandardMaterial color={clothDark} roughness={0.5} />
      </mesh>
      {/* Right thigh muscle */}
      <mesh position={[0.09, -0.18, 0.04]}>
        <sphereGeometry args={[0.048, 8, 6]} />
        <meshStandardMaterial color={clothDark} roughness={0.48} />
      </mesh>
      {/* Right leg - lower (shin) */}
      <mesh position={[0.09, -0.36, 0.03]}>
        <capsuleGeometry args={[0.05, 0.15, 8, 12]} />
        <meshStandardMaterial color={clothDark} roughness={0.55} />
      </mesh>
      {/* Left leg - upper (thigh) */}
      <mesh ref={leftFootRef} position={[-0.09, -0.22, 0.02]}>
        <capsuleGeometry args={[0.06, 0.18, 8, 12]} />
        <meshStandardMaterial color={clothDark} roughness={0.5} />
      </mesh>
      {/* Left thigh muscle */}
      <mesh position={[-0.09, -0.18, 0.04]}>
        <sphereGeometry args={[0.048, 8, 6]} />
        <meshStandardMaterial color={clothDark} roughness={0.48} />
      </mesh>
      {/* Left leg - lower (shin) */}
      <mesh position={[-0.09, -0.36, 0.03]}>
        <capsuleGeometry args={[0.05, 0.15, 8, 12]} />
        <meshStandardMaterial color={clothDark} roughness={0.55} />
      </mesh>
      {/* Knee guards - leather */}
      <mesh position={[0.09, -0.27, 0.04]}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshStandardMaterial color={leather} roughness={0.55} />
      </mesh>
      <mesh position={[-0.09, -0.27, 0.04]}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshStandardMaterial color={leather} roughness={0.55} />
      </mesh>
      {/* Knee strap details */}
      <mesh position={[0.09, -0.27, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.052, 0.006, 4, 8]} />
        <meshStandardMaterial color={leatherDark} roughness={0.6} />
      </mesh>
      <mesh position={[-0.09, -0.27, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.052, 0.006, 4, 8]} />
        <meshStandardMaterial color={leatherDark} roughness={0.6} />
      </mesh>
      {/* Boots - tall leather */}
      <mesh position={[0.09, -0.44, 0.07]}>
        <boxGeometry args={[0.085, 0.065, 0.16]} />
        <meshStandardMaterial color={leather} roughness={0.55} />
      </mesh>
      <mesh position={[-0.09, -0.44, 0.07]}>
        <boxGeometry args={[0.085, 0.065, 0.16]} />
        <meshStandardMaterial color={leather} roughness={0.55} />
      </mesh>
      {/* Boot cuffs - folded leather */}
      <mesh position={[0.09, -0.4, 0.06]}>
        <boxGeometry args={[0.088, 0.018, 0.14]} />
        <meshStandardMaterial color={leatherDark} roughness={0.6} />
      </mesh>
      <mesh position={[-0.09, -0.4, 0.06]}>
        <boxGeometry args={[0.088, 0.018, 0.14]} />
        <meshStandardMaterial color={leatherDark} roughness={0.6} />
      </mesh>
      {/* Boot buckles */}
      <mesh position={[0.09, -0.41, 0.15]}>
        <boxGeometry args={[0.025, 0.025, 0.012]} />
        <meshStandardMaterial color="#c8a030" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-0.09, -0.41, 0.15]}>
        <boxGeometry args={[0.025, 0.025, 0.012]} />
        <meshStandardMaterial color="#c8a030" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Boot sole detail */}
      <mesh position={[0.09, -0.47, 0.07]}>
        <boxGeometry args={[0.09, 0.012, 0.165]} />
        <meshStandardMaterial color={leatherDark} roughness={0.7} />
      </mesh>
      <mesh position={[-0.09, -0.47, 0.07]}>
        <boxGeometry args={[0.09, 0.012, 0.165]} />
        <meshStandardMaterial color={leatherDark} roughness={0.7} />
      </mesh>

      {/* Torso - tapered with chest, athletic build */}
      <mesh position={[0, 0.02, 0.01]}>
        <capsuleGeometry args={[0.14, 0.2, 10, 14]} />
        <meshStandardMaterial color={cloth} roughness={0.5} />
      </mesh>
      {/* Shoulder leather straps */}
      <mesh position={[0.14, 0.12, 0.05]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.03, 0.14, 0.018]} />
        <meshStandardMaterial color={leather} roughness={0.55} />
      </mesh>
      <mesh position={[-0.14, 0.12, 0.05]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.03, 0.14, 0.018]} />
        <meshStandardMaterial color={leather} roughness={0.55} />
      </mesh>
      {/* Cross-body quiver strap */}
      <mesh position={[0.06, 0.08, 0.1]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.025, 0.3, 0.012]} />
        <meshStandardMaterial color={leatherDark} roughness={0.55} />
      </mesh>
      {/* Belt - detailed with pouches */}
      <mesh position={[0, -0.08, 0]}>
        <torusGeometry args={[0.15, 0.022, 10, 20]} />
        <meshStandardMaterial color={leather} roughness={0.45} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <torusGeometry args={[0.148, 0.015, 10, 20]} />
        <meshStandardMaterial color={leatherDark} roughness={0.5} />
      </mesh>
      {/* Belt buckle */}
      <mesh position={[0, -0.08, 0.15]}>
        <boxGeometry args={[0.035, 0.035, 0.014]} />
        <meshStandardMaterial color="#c8a030" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Belt pouches */}
      <mesh position={[0.12, -0.08, 0.09]}>
        <boxGeometry args={[0.04, 0.035, 0.03]} />
        <meshStandardMaterial color={leatherDark} roughness={0.6} />
      </mesh>
      <mesh position={[-0.12, -0.08, 0.09]}>
        <boxGeometry args={[0.04, 0.035, 0.03]} />
        <meshStandardMaterial color={leatherDark} roughness={0.6} />
      </mesh>
      {/* Pouch flap details */}
      <mesh position={[0.12, -0.06, 0.1]}>
        <boxGeometry args={[0.038, 0.008, 0.02]} />
        <meshStandardMaterial color={leatherLight} roughness={0.5} />
      </mesh>
      <mesh position={[-0.12, -0.06, 0.1]}>
        <boxGeometry args={[0.038, 0.008, 0.02]} />
        <meshStandardMaterial color={leatherLight} roughness={0.5} />
      </mesh>
      {/* Chest armor plate - leather */}
      <mesh position={[0, 0.08, 0.12]}>
        <boxGeometry args={[0.12, 0.1, 0.018]} />
        <meshStandardMaterial color={leatherLight} roughness={0.5} />
      </mesh>
      {/* Chest plate stitching */}
      <mesh position={[0, 0.08, 0.135]}>
        <boxGeometry args={[0.008, 0.1, 0.005]} />
        <meshStandardMaterial color={leatherDark} roughness={0.6} />
      </mesh>

      {/* Right arm - upper, muscular */}
      <mesh position={[0.2, 0.08, 0.04]} rotation={[0, 0, -0.25]}>
        <capsuleGeometry args={[0.052, 0.16, 8, 12]} />
        <meshStandardMaterial color={cloth} roughness={0.5} />
      </mesh>
      {/* Right bicep */}
      <mesh position={[0.2, 0.1, 0.08]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color={clothMid} roughness={0.45} />
      </mesh>
      {/* Right arm - forearm with leather bracer */}
      <mesh position={[0.22, -0.06, 0.06]} rotation={[0, 0, -0.12]}>
        <capsuleGeometry args={[0.044, 0.14, 8, 12]} />
        <meshStandardMaterial color={leather} roughness={0.55} />
      </mesh>
      {/* Bracer buckle */}
      <mesh position={[0.22, -0.1, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.042, 0.005, 4, 8]} />
        <meshStandardMaterial color="#c8a030" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Right hand */}
      <mesh position={[0.22, -0.17, 0.09]}>
        <boxGeometry args={[0.045, 0.05, 0.032]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Fingers */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={`rfinger-${i}`} position={[0.208 + i * 0.012, -0.2, 0.1]}>
          <capsuleGeometry args={[0.006, 0.022, 4, 4]} />
          <meshStandardMaterial color={skinDark} roughness={0.5} />
        </mesh>
      ))}

      {/* Left arm - upper */}
      <mesh position={[-0.2, 0.08, 0.04]} rotation={[0, 0, 0.25]}>
        <capsuleGeometry args={[0.052, 0.16, 8, 12]} />
        <meshStandardMaterial color={cloth} roughness={0.5} />
      </mesh>
      {/* Left bicep */}
      <mesh position={[-0.2, 0.1, 0.08]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color={clothMid} roughness={0.45} />
      </mesh>
      {/* Left arm - forearm */}
      <mesh position={[-0.22, -0.06, 0.06]} rotation={[0, 0, 0.12]}>
        <capsuleGeometry args={[0.044, 0.14, 8, 12]} />
        <meshStandardMaterial color={clothDark} roughness={0.55} />
      </mesh>
      {/* Left hand */}
      <mesh position={[-0.22, -0.17, 0.09]}>
        <boxGeometry args={[0.045, 0.05, 0.032]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Left fingers */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={`lfinger-${i}`} position={[-0.232 + i * 0.012, -0.2, 0.1]}>
          <capsuleGeometry args={[0.006, 0.022, 4, 4]} />
          <meshStandardMaterial color={skinDark} roughness={0.5} />
        </mesh>
      ))}

      {/* Bow - larger detailed recurve */}
      <group position={[0.24, 0.0, 0.12]} rotation={[0, 0, 0.1]}>
        <mesh>
          <torusGeometry args={[0.2, 0.01, 10, 20, Math.PI]} />
          <meshStandardMaterial color="#7a3a18" roughness={0.4} />
        </mesh>
        {/* Bow tips - recurve */}
        <mesh position={[0.2, 0.0, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.01, 0.035, 0.01]} />
          <meshStandardMaterial color="#5a2a10" roughness={0.45} />
        </mesh>
        <mesh position={[-0.2, 0.0, 0]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.01, 0.035, 0.01]} />
          <meshStandardMaterial color="#5a2a10" roughness={0.45} />
        </mesh>
        {/* Bow tips - horn overlay */}
        <mesh position={[0.2, 0.015, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.012, 0.015, 0.012]} />
          <meshStandardMaterial color="#f0e8d0" roughness={0.4} />
        </mesh>
        <mesh position={[-0.2, 0.015, 0]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.012, 0.015, 0.012]} />
          <meshStandardMaterial color="#f0e8d0" roughness={0.4} />
        </mesh>
        {/* Bowstring */}
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.4, 4]} />
          <meshStandardMaterial color="#ccccaa" roughness={0.6} />
        </mesh>
        {/* Bow grip wrapping */}
        <mesh position={[0, 0.0, 0.01]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.07, 8]} />
          <meshStandardMaterial color={leatherDark} roughness={0.6} />
        </mesh>
        {/* Bow limb detail - sinew backing */}
        <mesh position={[0.1, 0.0, 0]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.005, 0.15, 0.008]} />
          <meshStandardMaterial color={leatherLight} roughness={0.5} />
        </mesh>
      </group>

      {/* Quiver on back - larger, more detailed */}
      <mesh position={[-0.1, 0.1, -0.14]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.24, 10]} />
        <meshStandardMaterial color={leather} roughness={0.5} />
      </mesh>
      {/* Quiver rim */}
      <mesh position={[-0.1, 0.22, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.037, 0.006, 6, 8]} />
        <meshStandardMaterial color={leatherDark} roughness={0.55} />
      </mesh>
      {/* Quiver bottom */}
      <mesh position={[-0.1, -0.02, -0.14]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshStandardMaterial color={leatherDark} roughness={0.6} />
      </mesh>
      {/* Arrow shafts in quiver */}
      {[-0.11, -0.095, -0.085].map((x, i) => (
        <mesh key={`arrow-${i}`} position={[x, 0.26, -0.15]}>
          <cylinderGeometry args={[0.006, 0.006, 0.12, 4]} />
          <meshStandardMaterial color="#8a7a50" roughness={0.6} />
        </mesh>
      ))}
      {/* Arrow fletchings */}
      {[-0.11, -0.095].map((x, i) => (
        <mesh key={`fletch-${i}`} position={[x, 0.33, -0.16]} rotation={[0, 0, i === 0 ? 0.3 : -0.2]}>
          <boxGeometry args={[0.018, 0.035, 0.004]} />
          <meshStandardMaterial color="#cc3333" roughness={0.5} />
        </mesh>
      ))}
      {/* Arrow tips */}
      <mesh position={[-0.1, 0.34, -0.15]}>
        <coneGeometry args={[0.014, 0.04, 4]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.75} roughness={0.2} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.22, 0.01]}>
        <cylinderGeometry args={[0.045, 0.055, 0.06, 12]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Sternocleidomastoid */}
      <mesh position={[0.025, 0.22, 0.03]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.012, 0.04, 4, 4]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      <mesh position={[-0.025, 0.22, 0.03]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.012, 0.04, 4, 4]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>

      {/* Head - larger, human proportions */}
      <mesh position={[0, 0.32, 0.01]}>
        <sphereGeometry args={[0.115, 16, 14]} />
        <meshStandardMaterial color={skin} roughness={0.45} />
      </mesh>
      {/* Jaw / chin - stronger */}
      <mesh position={[0, 0.26, 0.06]}>
        <sphereGeometry args={[0.065, 10, 8]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      {/* Chin detail */}
      <mesh position={[0, 0.24, 0.08]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color={skin} roughness={0.45} />
      </mesh>
      {/* Cheekbones */}
      <mesh position={[0.08, 0.3, 0.06]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color={skin} roughness={0.45} />
      </mesh>
      <mesh position={[-0.08, 0.3, 0.06]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color={skin} roughness={0.45} />
      </mesh>
      {/* Hood - detailed with folds, larger */}
      <mesh position={[0, 0.37, -0.01]}>
        <sphereGeometry args={[0.125, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={cloth} roughness={0.5} />
      </mesh>
      {/* Hood drape - flowing down back */}
      <mesh position={[0, 0.31, -0.08]}>
        <boxGeometry args={[0.16, 0.14, 0.06]} />
        <meshStandardMaterial color={clothDark} roughness={0.5} />
      </mesh>
      {/* Hood side drapes */}
      <mesh position={[0.09, 0.3, -0.05]}>
        <boxGeometry args={[0.035, 0.1, 0.045]} />
        <meshStandardMaterial color={clothDark} roughness={0.5} />
      </mesh>
      <mesh position={[-0.09, 0.3, -0.05]}>
        <boxGeometry args={[0.035, 0.1, 0.045]} />
        <meshStandardMaterial color={clothDark} roughness={0.5} />
      </mesh>
      {/* Hood edge fold */}
      <mesh position={[0, 0.35, 0.05]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.115, 0.009, 8, 14, Math.PI]} />
        <meshStandardMaterial color={clothMid} roughness={0.5} />
      </mesh>
      {/* Hood fabric detail lines */}
      <mesh position={[0.06, 0.36, -0.02]}>
        <boxGeometry args={[0.008, 0.08, 0.005]} />
        <meshStandardMaterial color={clothLight} roughness={0.5} />
      </mesh>
      <mesh position={[-0.06, 0.36, -0.02]}>
        <boxGeometry args={[0.008, 0.08, 0.005]} />
        <meshStandardMaterial color={clothLight} roughness={0.5} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.3, 0.12]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      {/* Nostril detail */}
      <mesh position={[0.012, 0.295, 0.13]}>
        <sphereGeometry args={[0.006, 4, 4]} />
        <meshStandardMaterial color={skinShadow} roughness={0.6} />
      </mesh>
      <mesh position={[-0.012, 0.295, 0.13]}>
        <sphereGeometry args={[0.006, 4, 4]} />
        <meshStandardMaterial color={skinShadow} roughness={0.6} />
      </mesh>
      {/* Eye whites */}
      <mesh position={[0.048, 0.32, 0.1]}>
        <sphereGeometry args={[0.028, 10, 8]} />
        <meshStandardMaterial color="#f0ece4" roughness={0.25} />
      </mesh>
      <mesh position={[-0.048, 0.32, 0.1]}>
        <sphereGeometry args={[0.028, 10, 8]} />
        <meshStandardMaterial color="#f0ece4" roughness={0.25} />
      </mesh>
      {/* Irises */}
      <mesh position={[0.048, 0.32, 0.125]}>
        <sphereGeometry args={[0.016, 8, 6]} />
        <meshStandardMaterial color="#1a4a00" roughness={0.3} />
      </mesh>
      <mesh position={[-0.048, 0.32, 0.125]}>
        <sphereGeometry args={[0.016, 8, 6]} />
        <meshStandardMaterial color="#1a4a00" roughness={0.3} />
      </mesh>
      {/* Pupils */}
      <mesh position={[0.048, 0.32, 0.135]}>
        <sphereGeometry args={[0.009, 6, 6]} />
        <meshStandardMaterial color="#0a0a00" roughness={0.3} />
      </mesh>
      <mesh position={[-0.048, 0.32, 0.135]}>
        <sphereGeometry args={[0.009, 6, 6]} />
        <meshStandardMaterial color="#0a0a00" roughness={0.3} />
      </mesh>
      {/* Eye highlights */}
      <mesh position={[0.053, 0.325, 0.14]}>
        <sphereGeometry args={[0.006, 4, 4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-0.043, 0.325, 0.14]}>
        <sphereGeometry args={[0.006, 4, 4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
      {/* Eyebrows - thick, focused */}
      <mesh position={[0.048, 0.345, 0.1]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.042, 0.01, 0.012]} />
        <meshStandardMaterial color="#4a3020" roughness={0.6} />
      </mesh>
      <mesh position={[-0.048, 0.345, 0.1]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.042, 0.01, 0.012]} />
        <meshStandardMaterial color="#4a3020" roughness={0.6} />
      </mesh>
      {/* Mouth - determined expression */}
      <mesh position={[0, 0.275, 0.11]}>
        <boxGeometry args={[0.038, 0.008, 0.01]} />
        <meshStandardMaterial color="#8a4a3a" roughness={0.5} />
      </mesh>
      {/* Upper lip */}
      <mesh position={[0, 0.278, 0.115]}>
        <boxGeometry args={[0.032, 0.005, 0.008]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      {/* Ears */}
      <mesh position={[0.11, 0.31, 0]}>
        <sphereGeometry args={[0.022, 8, 6]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      <mesh position={[-0.11, 0.31, 0]}>
        <sphereGeometry args={[0.022, 8, 6]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      {/* Ear inner detail */}
      <mesh position={[0.115, 0.31, 0.008]}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshStandardMaterial color={skinShadow} roughness={0.6} />
      </mesh>
      <mesh position={[-0.115, 0.31, 0.008]}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshStandardMaterial color={skinShadow} roughness={0.6} />
      </mesh>
    </group>
  )
}
