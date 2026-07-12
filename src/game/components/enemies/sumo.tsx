'use client'

import * as THREE from 'three'
import type { Enemy } from '@/types/game'

export function renderSumo(
  enemy: Enemy,
  meshRef: React.RefObject<THREE.Group | null>,
  leftFootRef: React.RefObject<THREE.Mesh | null>,
  rightFootRef: React.RefObject<THREE.Mesh | null>
): React.ReactNode {
  const skin = '#dbb896'
  const skinDark = '#c9a07a'
  const skinShadow = '#b08a62'
  const skinHighlight = '#e8caa8'
  const hair = '#1a1a1a'
  const mawashiBlue = '#1a4a8a'
  const mawashiFold = '#153d73'
  const mawashiLight = '#2260a0'
  return (
    <group ref={meshRef}>
      <mesh position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 20]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.22} />
      </mesh>

      {/* Right leg - thick thigh, more muscular */}
      <mesh ref={rightFootRef} position={[0.16, -0.26, 0.02]}>
        <capsuleGeometry args={[0.085, 0.2, 8, 12]} />
        <meshStandardMaterial color={skin} roughness={0.55} />
      </mesh>
      {/* Right thigh muscle definition */}
      <mesh position={[0.16, -0.22, 0.06]}>
        <sphereGeometry args={[0.065, 10, 8]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      <mesh position={[0.18, -0.28, -0.02]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color={skinShadow} roughness={0.55} />
      </mesh>
      {/* Right leg - shin */}
      <mesh position={[0.16, -0.42, 0.03]}>
        <capsuleGeometry args={[0.072, 0.17, 8, 12]} />
        <meshStandardMaterial color={skinDark} roughness={0.6} />
      </mesh>
      {/* Left leg - thick thigh */}
      <mesh ref={leftFootRef} position={[-0.16, -0.26, 0.02]}>
        <capsuleGeometry args={[0.085, 0.2, 8, 12]} />
        <meshStandardMaterial color={skin} roughness={0.55} />
      </mesh>
      {/* Left thigh muscle */}
      <mesh position={[-0.16, -0.22, 0.06]}>
        <sphereGeometry args={[0.065, 10, 8]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      <mesh position={[-0.18, -0.28, -0.02]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color={skinShadow} roughness={0.55} />
      </mesh>
      {/* Left leg - shin */}
      <mesh position={[-0.16, -0.42, 0.03]}>
        <capsuleGeometry args={[0.072, 0.17, 8, 12]} />
        <meshStandardMaterial color={skinDark} roughness={0.6} />
      </mesh>
      {/* Knee definition - prominent */}
      <mesh position={[0.16, -0.3, 0.05]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      <mesh position={[-0.16, -0.3, 0.05]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Calves muscle */}
      <mesh position={[0.16, -0.4, -0.04]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color={skin} roughness={0.55} />
      </mesh>
      <mesh position={[-0.16, -0.4, -0.04]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color={skin} roughness={0.55} />
      </mesh>
      {/* Feet - large, flat */}
      <mesh position={[0.16, -0.52, 0.07]}>
        <boxGeometry args={[0.14, 0.06, 0.2]} />
        <meshStandardMaterial color={skinDark} roughness={0.6} />
      </mesh>
      <mesh position={[-0.16, -0.52, 0.07]}>
        <boxGeometry args={[0.14, 0.06, 0.2]} />
        <meshStandardMaterial color={skinDark} roughness={0.6} />
      </mesh>
      {/* Toes */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={`rtoe-${i}`} position={[0.16 + (i - 1.5) * 0.025, -0.5, 0.17]}>
          <sphereGeometry args={[0.014, 4, 4]} />
          <meshStandardMaterial color={skinShadow} roughness={0.6} />
        </mesh>
      ))}
      {[0, 1, 2, 3].map(i => (
        <mesh key={`ltoe-${i}`} position={[-0.16 + (i - 1.5) * 0.025, -0.5, 0.17]}>
          <sphereGeometry args={[0.014, 4, 4]} />
          <meshStandardMaterial color={skinShadow} roughness={0.6} />
        </mesh>
      ))}
      {/* Ankle bones */}
      <mesh position={[0.19, -0.48, 0]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color={skinDark} roughness={0.55} />
      </mesh>
      <mesh position={[-0.19, -0.48, 0]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color={skinDark} roughness={0.55} />
      </mesh>

      {/* Torso - barrel-shaped, massive */}
      <mesh position={[0, 0.04, 0.02]}>
        <capsuleGeometry args={[0.26, 0.24, 10, 16]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Belly protrusion - prominent, soft */}
      <mesh position={[0, -0.04, 0.18]}>
        <sphereGeometry args={[0.22, 14, 12]} />
        <meshStandardMaterial color={skin} roughness={0.45} />
      </mesh>
      {/* Belly skin highlight */}
      <mesh position={[0, -0.02, 0.24]}>
        <sphereGeometry args={[0.12, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
        <meshStandardMaterial color={skinHighlight} roughness={0.4} transparent opacity={0.4} />
      </mesh>
      {/* Belly button */}
      <mesh position={[0, -0.06, 0.26]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshStandardMaterial color={skinDark} roughness={0.6} />
      </mesh>
      {/* Love handles */}
      <mesh position={[0.2, -0.06, 0.06]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      <mesh position={[-0.2, -0.06, 0.06]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Chest / shoulders - broad, muscular */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.22, 14, 12]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Pectoral definition - large */}
      <mesh position={[0.1, 0.2, 0.14]}>
        <sphereGeometry args={[0.1, 10, 8]} />
        <meshStandardMaterial color={skin} roughness={0.45} />
      </mesh>
      <mesh position={[-0.1, 0.2, 0.14]}>
        <sphereGeometry args={[0.1, 10, 8]} />
        <meshStandardMaterial color={skin} roughness={0.45} />
      </mesh>
      {/* Pec lower edge */}
      <mesh position={[0.1, 0.16, 0.13]}>
        <boxGeometry args={[0.08, 0.01, 0.02]} />
        <meshStandardMaterial color={skinShadow} roughness={0.5} transparent opacity={0.5} />
      </mesh>
      <mesh position={[-0.1, 0.16, 0.13]}>
        <boxGeometry args={[0.08, 0.01, 0.02]} />
        <meshStandardMaterial color={skinShadow} roughness={0.5} transparent opacity={0.5} />
      </mesh>
      {/* Back muscle */}
      <mesh position={[0, 0.14, -0.14]}>
        <sphereGeometry args={[0.17, 10, 8]} />
        <meshStandardMaterial color={skinShadow} roughness={0.55} />
      </mesh>
      {/* Spine indentation */}
      <mesh position={[0, 0.1, -0.18]}>
        <boxGeometry args={[0.02, 0.16, 0.01]} />
        <meshStandardMaterial color={skinShadow} roughness={0.6} transparent opacity={0.4} />
      </mesh>

      {/* Mawashi (loincloth) - wrapped cloth, detailed */}
      <mesh position={[0, 0.0, 0]}>
        <torusGeometry args={[0.28, 0.045, 10, 24]} />
        <meshStandardMaterial color={mawashiBlue} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.0, 0]}>
        <torusGeometry args={[0.278, 0.032, 10, 24]} />
        <meshStandardMaterial color={mawashiFold} roughness={0.45} />
      </mesh>
      {/* Mawashi fold texture */}
      <mesh position={[0, 0.0, 0]}>
        <torusGeometry args={[0.282, 0.01, 6, 20]} />
        <meshStandardMaterial color={mawashiLight} roughness={0.4} transparent opacity={0.4} />
      </mesh>
      {/* Front mawashi flap - longer, folded */}
      <mesh position={[0, -0.08, 0.26]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.16, 0.26, 0.028]} />
        <meshStandardMaterial color={mawashiBlue} roughness={0.5} />
      </mesh>
      {/* Mawashi fold lines */}
      <mesh position={[0, -0.03, 0.27]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.14, 0.012, 0.006]} />
        <meshStandardMaterial color={mawashiLight} roughness={0.45} />
      </mesh>
      <mesh position={[0, -0.07, 0.27]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.13, 0.012, 0.006]} />
        <meshStandardMaterial color={mawashiLight} roughness={0.45} />
      </mesh>
      <mesh position={[0, -0.11, 0.27]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.12, 0.012, 0.006]} />
        <meshStandardMaterial color={mawashiLight} roughness={0.45} />
      </mesh>
      {/* Mawashi knot at back - detailed */}
      <mesh position={[0, 0.0, -0.26]}>
        <sphereGeometry args={[0.06, 10, 8]} />
        <meshStandardMaterial color={mawashiBlue} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.04, -0.28]}>
        <boxGeometry args={[0.07, 0.1, 0.035]} />
        <meshStandardMaterial color={mawashiFold} roughness={0.5} />
      </mesh>
      {/* Mawashi back tail */}
      <mesh position={[0, -0.1, -0.26]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.06, 0.12, 0.02]} />
        <meshStandardMaterial color={mawashiBlue} roughness={0.5} />
      </mesh>

      {/* Arms - very thick, muscular */}
      <mesh position={[0.32, 0.16, 0.04]} rotation={[0, 0, -0.25]}>
        <capsuleGeometry args={[0.072, 0.22, 8, 12]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      <mesh position={[-0.32, 0.16, 0.04]} rotation={[0, 0, 0.25]}>
        <capsuleGeometry args={[0.072, 0.22, 8, 12]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Bicep bulge - prominent */}
      <mesh position={[0.32, 0.2, 0.1]}>
        <sphereGeometry args={[0.065, 10, 8]} />
        <meshStandardMaterial color={skin} roughness={0.45} />
      </mesh>
      <mesh position={[-0.32, 0.2, 0.1]}>
        <sphereGeometry args={[0.065, 10, 8]} />
        <meshStandardMaterial color={skin} roughness={0.45} />
      </mesh>
      {/* Tricep */}
      <mesh position={[0.32, 0.16, -0.06]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color={skinShadow} roughness={0.55} />
      </mesh>
      <mesh position={[-0.32, 0.16, -0.06]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color={skinShadow} roughness={0.55} />
      </mesh>
      {/* Forearms - thick */}
      <mesh position={[0.34, 0.0, 0.06]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.06, 0.17, 8, 12]} />
        <meshStandardMaterial color={skinDark} roughness={0.55} />
      </mesh>
      <mesh position={[-0.34, 0.0, 0.06]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.06, 0.17, 8, 12]} />
        <meshStandardMaterial color={skinDark} roughness={0.55} />
      </mesh>
      {/* Forearm veins */}
      <mesh position={[0.36, 0.02, 0.1]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.005, 0.1, 4, 4]} />
        <meshStandardMaterial color={skinShadow} roughness={0.6} transparent opacity={0.4} />
      </mesh>
      <mesh position={[-0.36, 0.02, 0.1]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.005, 0.1, 4, 4]} />
        <meshStandardMaterial color={skinShadow} roughness={0.6} transparent opacity={0.4} />
      </mesh>
      {/* Hands / fists - large, detailed */}
      <mesh position={[0.35, -0.12, 0.09]}>
        <boxGeometry args={[0.07, 0.08, 0.06]} />
        <meshStandardMaterial color={skinDark} roughness={0.55} />
      </mesh>
      <mesh position={[-0.35, -0.12, 0.09]}>
        <boxGeometry args={[0.07, 0.08, 0.06]} />
        <meshStandardMaterial color={skinDark} roughness={0.55} />
      </mesh>
      {/* Knuckle bumps */}
      <mesh position={[0.35, -0.08, 0.12]}>
        <boxGeometry args={[0.06, 0.02, 0.012]} />
        <meshStandardMaterial color={skinShadow} roughness={0.55} />
      </mesh>
      <mesh position={[-0.35, -0.08, 0.12]}>
        <boxGeometry args={[0.06, 0.02, 0.012]} />
        <meshStandardMaterial color={skinShadow} roughness={0.55} />
      </mesh>
      {/* Fingers curled into fist */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={`rfinger-${i}`} position={[0.33 + i * 0.015, -0.15, 0.12]}>
          <capsuleGeometry args={[0.008, 0.03, 4, 4]} />
          <meshStandardMaterial color={skinDark} roughness={0.5} />
        </mesh>
      ))}
      {[0, 1, 2, 3].map(i => (
        <mesh key={`lfinger-${i}`} position={[-0.37 + i * 0.015, -0.15, 0.12]}>
          <capsuleGeometry args={[0.008, 0.03, 4, 4]} />
          <meshStandardMaterial color={skinDark} roughness={0.5} />
        </mesh>
      ))}

      {/* Neck - very thick */}
      <mesh position={[0, 0.34, 0.01]}>
        <cylinderGeometry args={[0.08, 0.09, 0.08, 12]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Neck fold / adam's apple */}
      <mesh position={[0, 0.34, 0.07]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      {/* Neck tendons */}
      <mesh position={[0.05, 0.34, 0.03]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.015, 0.05, 4, 4]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      <mesh position={[-0.05, 0.34, 0.03]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.015, 0.05, 4, 4]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>

      {/* Head - large, strong features */}
      <mesh position={[0, 0.46, 0.02]}>
        <sphereGeometry args={[0.15, 16, 14]} />
        <meshStandardMaterial color={skin} roughness={0.45} />
      </mesh>
      {/* Jaw / chin - strong, wide */}
      <mesh position={[0, 0.38, 0.08]}>
        <sphereGeometry args={[0.085, 12, 10]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {/* Jaw line definition */}
      <mesh position={[0.1, 0.4, 0.04]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.04, 0.08, 0.03]} />
        <meshStandardMaterial color={skinShadow} roughness={0.5} transparent opacity={0.3} />
      </mesh>
      <mesh position={[-0.1, 0.4, 0.04]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.04, 0.08, 0.03]} />
        <meshStandardMaterial color={skinShadow} roughness={0.5} transparent opacity={0.3} />
      </mesh>
      {/* Cheekbones */}
      <mesh position={[0.12, 0.43, 0.07]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      <mesh position={[-0.12, 0.43, 0.07]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>

      {/* Hair / topknot (chonmage) - detailed */}
      <mesh position={[0, 0.6, -0.02]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshStandardMaterial color={hair} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.58, -0.05]} rotation={[0.5, 0, 0]}>
        <capsuleGeometry args={[0.035, 0.06, 6, 8]} />
        <meshStandardMaterial color={hair} roughness={0.7} />
      </mesh>
      {/* Topknot wrapping */}
      <mesh position={[0, 0.57, -0.04]} rotation={[0.5, 0, 0]}>
        <torusGeometry args={[0.035, 0.006, 4, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.6} />
      </mesh>
      {/* Shaved head top - scalp visible */}
      <mesh position={[0, 0.58, 0.02]}>
        <sphereGeometry args={[0.11, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={skinDark} roughness={0.6} />
      </mesh>
      {/* Hair line edge */}
      <mesh position={[0, 0.54, 0.07]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.105, 0.009, 6, 12, Math.PI]} />
        <meshStandardMaterial color={hair} roughness={0.7} />
      </mesh>
      {/* Scalp stubble texture */}
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={`stubble-${i}`} position={[
          Math.cos(i * Math.PI / 2.5) * 0.06,
          0.57,
          Math.sin(i * Math.PI / 2.5) * 0.06
        ]}>
          <sphereGeometry args={[0.005, 3, 3]} />
          <meshStandardMaterial color={hair} roughness={0.8} />
        </mesh>
      ))}

      {/* Face details - realistic */}
      {/* Eyes - white sclera */}
      <mesh position={[0.06, 0.47, 0.14]}>
        <sphereGeometry args={[0.032, 10, 8]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.3} />
      </mesh>
      <mesh position={[-0.06, 0.47, 0.14]}>
        <sphereGeometry args={[0.032, 10, 8]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.3} />
      </mesh>
      {/* Irises */}
      <mesh position={[0.06, 0.47, 0.165]}>
        <sphereGeometry args={[0.02, 10, 8]} />
        <meshStandardMaterial color="#3a2000" roughness={0.3} />
      </mesh>
      <mesh position={[-0.06, 0.47, 0.165]}>
        <sphereGeometry args={[0.02, 10, 8]} />
        <meshStandardMaterial color="#3a2000" roughness={0.3} />
      </mesh>
      {/* Pupils */}
      <mesh position={[0.06, 0.47, 0.18]}>
        <sphereGeometry args={[0.012, 8, 6]} />
        <meshStandardMaterial color="#0a0500" roughness={0.3} />
      </mesh>
      <mesh position={[-0.06, 0.47, 0.18]}>
        <sphereGeometry args={[0.012, 8, 6]} />
        <meshStandardMaterial color="#0a0500" roughness={0.3} />
      </mesh>
      {/* Eye highlights */}
      <mesh position={[0.065, 0.475, 0.185]}>
        <sphereGeometry args={[0.005, 4, 4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-0.055, 0.475, 0.185]}>
        <sphereGeometry args={[0.005, 4, 4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
      {/* Eyebrows - thick, fierce */}
      <mesh position={[0.06, 0.5, 0.14]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.055, 0.014, 0.014]} />
        <meshStandardMaterial color={hair} roughness={0.7} />
      </mesh>
      <mesh position={[-0.06, 0.5, 0.14]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.055, 0.014, 0.014]} />
        <meshStandardMaterial color={hair} roughness={0.7} />
      </mesh>
      {/* Brow ridge */}
      <mesh position={[0, 0.49, 0.12]}>
        <boxGeometry args={[0.12, 0.018, 0.025]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      {/* Nose - broad, strong */}
      <mesh position={[0, 0.44, 0.16]}>
        <sphereGeometry args={[0.03, 10, 8]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      {/* Nose bridge */}
      <mesh position={[0, 0.46, 0.14]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.02, 0.04, 0.015]} />
        <meshStandardMaterial color={skin} roughness={0.45} />
      </mesh>
      {/* Nostrils */}
      <mesh position={[0.018, 0.435, 0.17]}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshStandardMaterial color={skinShadow} roughness={0.6} />
      </mesh>
      <mesh position={[-0.018, 0.435, 0.17]}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshStandardMaterial color={skinShadow} roughness={0.6} />
      </mesh>
      {/* Mouth - grimace with teeth */}
      <mesh position={[0, 0.4, 0.14]}>
        <boxGeometry args={[0.06, 0.014, 0.014]} />
        <meshStandardMaterial color="#8a4a3a" roughness={0.5} />
      </mesh>
      {/* Upper lip */}
      <mesh position={[0, 0.405, 0.148]}>
        <boxGeometry args={[0.055, 0.007, 0.01]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      {/* Lower lip */}
      <mesh position={[0, 0.395, 0.148]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshStandardMaterial color={skinShadow} roughness={0.5} />
      </mesh>
      {/* Teeth visible in grimace */}
      <mesh position={[0, 0.402, 0.148]}>
        <boxGeometry args={[0.04, 0.006, 0.005]} />
        <meshStandardMaterial color="#f0ebe5" roughness={0.3} />
      </mesh>
      {/* Ears - detailed */}
      <mesh position={[0.15, 0.46, 0]}>
        <sphereGeometry args={[0.03, 10, 8]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      <mesh position={[-0.15, 0.46, 0]}>
        <sphereGeometry args={[0.03, 10, 8]} />
        <meshStandardMaterial color={skinDark} roughness={0.5} />
      </mesh>
      {/* Ear inner detail */}
      <mesh position={[0.155, 0.46, 0.012]}>
        <sphereGeometry args={[0.014, 4, 4]} />
        <meshStandardMaterial color={skinShadow} roughness={0.6} />
      </mesh>
      <mesh position={[-0.155, 0.46, 0.012]}>
        <sphereGeometry args={[0.014, 4, 4]} />
        <meshStandardMaterial color={skinShadow} roughness={0.6} />
      </mesh>

      {/* Health indicator */}
      {(enemy.health ?? 1) > 1 && (
        <mesh position={[0, 0.68, 0]}>
          <sphereGeometry args={[0.045, 8, 6]} />
          <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={0.8} />
        </mesh>
      )}
    </group>
  )
}
