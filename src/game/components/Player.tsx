'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlayerState } from '@/types/game'

// ============================================
// PLAYER COMPONENT - Ninja (Detailed)
// ============================================
function Player({ player }: { player: React.RefObject<PlayerState> }) {
  const meshRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Group>(null)
  const rightLegRef = useRef<THREE.Group>(null)
  const scarfRef = useRef<THREE.Group>(null)
  const hoodTail1 = useRef<THREE.Group>(null)
  const hoodTail2 = useRef<THREE.Group>(null)
  const capeRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!meshRef.current || !player.current) return
    const p = player.current
    const t = Date.now() * 0.01
    meshRef.current.position.set(p.position.x, p.position.y, p.position.z)
    meshRef.current.scale.x = p.facing

    const runCycle = p.onGround && Math.abs(p.velocity.x) > 0.02

    if (leftArmRef.current && rightArmRef.current) {
      const armSwing = runCycle ? Math.sin(t * 9) * 0.8 : (p.onGround ? 0.1 : -0.35)
      leftArmRef.current.rotation.x = armSwing
      rightArmRef.current.rotation.x = -armSwing
      if (!p.onGround) {
        leftArmRef.current.rotation.z = 0.5
        rightArmRef.current.rotation.z = -0.5
      } else {
        leftArmRef.current.rotation.z = 0
        rightArmRef.current.rotation.z = 0
      }
    }

    if (leftLegRef.current && rightLegRef.current) {
      const legSwing = runCycle ? Math.sin(t * 9) * 0.65 : 0
      leftLegRef.current.rotation.x = -legSwing
      rightLegRef.current.rotation.x = legSwing
    }

    if (bodyRef.current) {
      const squash = p.onGround ? 1 : (p.velocity.y > 0 ? 1.06 : 0.94)
      bodyRef.current.scale.y = squash
    }

    meshRef.current.rotation.z = !p.onGround ? p.velocity.x * 1.0 : 0

    if (headRef.current) {
      headRef.current.rotation.z = !p.onGround ? -p.velocity.x * 0.3 : 0
    }

    if (hoodTail1.current && hoodTail2.current) {
      const flutter = runCycle ? Math.sin(t * 12) * 0.5 : Math.sin(t * 3) * 0.15
      hoodTail1.current.rotation.z = -0.4 + flutter
      hoodTail1.current.rotation.x = Math.sin(t * 7) * 0.25
      hoodTail2.current.rotation.z = -0.5 + flutter * 0.7
      hoodTail2.current.rotation.x = Math.sin(t * 7 + 1) * 0.3
    }

    if (scarfRef.current) {
      scarfRef.current.rotation.x = Math.sin(t * 5) * 0.15 + (runCycle ? 0.25 : 0)
      scarfRef.current.rotation.z = Math.sin(t * 4) * 0.08
      scarfRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
          child.rotation.x = Math.sin(t * 6 + i * 1.2) * 0.15
        }
      })
    }

    if (capeRef.current) {
      capeRef.current.rotation.x = Math.sin(t * 4) * 0.18 + (runCycle ? 0.3 : 0)
      capeRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
          child.rotation.x = Math.sin(t * 5 + i * 0.9) * 0.2
        }
      })
    }

    if (p.star) {
      meshRef.current.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshStandardMaterial
          if (mat.emissive) mat.emissiveIntensity = 0.5 + Math.sin(t * 5) * 0.5
        }
      })
    }

    if (p.dead) {
      const flash = Math.sin(Date.now() * 0.03) > 0
      meshRef.current.visible = flash
    } else if (p.invincible) {
      const blink = Math.sin(Date.now() * 0.02) > 0
      meshRef.current.visible = blink
    } else {
      meshRef.current.visible = true
    }
  })

  const clothDark = '#1a1a1a'
  const clothMid = '#222222'
  const clothLight = '#2a2a2a'
  const wrapTan = '#3a3530'
  const armorDark = '#151515'
  const armorEdge = '#333333'
  const metalDark = '#444444'
  const metalBright = '#777777'
  const accentRed = '#8b1a1a'
  const accentRedDark = '#6b1010'
  const eyeGlow = '#55ccff'
  const skinWrap = '#2d2820'

  return (
    <group ref={meshRef}>
      <mesh position={[0, -0.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      <group ref={bodyRef}>
        <group ref={headRef} position={[0, 0.42, 0]}>
          <mesh>
            <sphereGeometry args={[0.16, 12, 10]} />
            <meshStandardMaterial color={clothDark} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.08, -0.02]}>
            <coneGeometry args={[0.12, 0.18, 8]} />
            <meshStandardMaterial color={clothDark} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.04, 0.08]}>
            <boxGeometry args={[0.3, 0.14, 0.2]} />
            <meshStandardMaterial color={armorDark} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.02, 0.161]}>
            <boxGeometry args={[0.2, 0.04, 0.005]} />
            <meshStandardMaterial color="#050505" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.055, 0.155]}>
            <boxGeometry args={[0.22, 0.025, 0.03]} />
            <meshStandardMaterial color={armorDark} roughness={0.6} />
          </mesh>
          <mesh position={[0.13, -0.02, 0.06]}>
            <boxGeometry args={[0.03, 0.08, 0.1]} />
            <meshStandardMaterial color={armorDark} roughness={0.65} />
          </mesh>
          <mesh position={[-0.13, -0.02, 0.06]}>
            <boxGeometry args={[0.03, 0.08, 0.1]} />
            <meshStandardMaterial color={armorDark} roughness={0.65} />
          </mesh>
          <mesh position={[0.055, 0.02, 0.158]}>
            <sphereGeometry args={[0.028, 8, 6]} />
            <meshStandardMaterial color="#ffffff" emissive={eyeGlow} emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[-0.055, 0.02, 0.158]}>
            <sphereGeometry args={[0.028, 8, 6]} />
            <meshStandardMaterial color="#ffffff" emissive={eyeGlow} emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0.06, 0.02, 0.172]}>
            <sphereGeometry args={[0.015, 6, 4]} />
            <meshStandardMaterial color="#0a1520" />
          </mesh>
          <mesh position={[-0.05, 0.02, 0.172]}>
            <sphereGeometry args={[0.015, 6, 4]} />
            <meshStandardMaterial color="#0a1520" />
          </mesh>

          <group ref={hoodTail1} position={[0.08, -0.06, -0.14]}>
            <mesh position={[0, 0, -0.08]}>
              <cylinderGeometry args={[0.025, 0.015, 0.2, 6]} />
              <meshStandardMaterial color={clothDark} roughness={0.75} />
            </mesh>
            <mesh position={[0, 0, -0.2]}>
              <cylinderGeometry args={[0.015, 0.008, 0.1, 6]} />
              <meshStandardMaterial color={armorDark} roughness={0.75} />
            </mesh>
          </group>
          <group ref={hoodTail2} position={[-0.08, -0.06, -0.14]}>
            <mesh position={[0, 0, -0.06]}>
              <cylinderGeometry args={[0.022, 0.012, 0.16, 6]} />
              <meshStandardMaterial color={clothDark} roughness={0.75} />
            </mesh>
            <mesh position={[0, 0, -0.16]}>
              <cylinderGeometry args={[0.012, 0.006, 0.08, 6]} />
              <meshStandardMaterial color={armorDark} roughness={0.75} />
            </mesh>
          </group>
        </group>

        <group ref={scarfRef} position={[0, 0.32, -0.1]}>
          {[0, 1, 2, 3, 4].map(i => (
            <mesh key={`scarf-${i}`} position={[Math.sin(i * 0.5) * 0.02, 0, -0.06 - i * 0.07]}>
              <boxGeometry args={[0.18 - i * 0.02, 0.05 - i * 0.005, 0.08]} />
              <meshStandardMaterial color={i < 2 ? clothDark : armorDark} roughness={0.6} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>

        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.17, 0.14, 0.32, 8]} />
          <meshStandardMaterial color={clothMid} roughness={0.75} />
        </mesh>
        <mesh position={[0.08, 0.14, 0.08]}>
          <boxGeometry args={[0.14, 0.3, 0.005]} />
          <meshStandardMaterial color={clothDark} roughness={0.7} />
        </mesh>
        <mesh position={[-0.08, 0.14, 0.08]}>
          <boxGeometry args={[0.14, 0.3, 0.005]} />
          <meshStandardMaterial color={clothDark} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.14, 0.085]}>
          <boxGeometry args={[0.01, 0.28, 0.005]} />
          <meshStandardMaterial color={armorEdge} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.16, 0.17, 0.04, 8]} />
          <meshStandardMaterial color={armorDark} roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0.06, 0.3, 0]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[0.02, 0.38, 0.015]} />
          <meshStandardMaterial color={accentRedDark} roughness={0.5} />
        </mesh>
        <mesh position={[-0.06, 0.3, 0]} rotation={[0, 0, -0.6]}>
          <boxGeometry args={[0.02, 0.38, 0.015]} />
          <meshStandardMaterial color={accentRedDark} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.2, 0.09]}>
          <boxGeometry args={[0.06, 0.06, 0.01]} />
          <meshStandardMaterial color={metalBright} roughness={0.15} metalness={0.85} />
        </mesh>

        <mesh position={[0, 0.0, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.08, 8]} />
          <meshStandardMaterial color={accentRed} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.0, 0.09]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color={accentRedDark} roughness={0.5} />
        </mesh>
        <mesh position={[0.02, -0.06, 0.085]} rotation={[0.3, 0, 0.1]}>
          <boxGeometry args={[0.025, 0.1, 0.015]} />
          <meshStandardMaterial color={accentRed} roughness={0.5} />
        </mesh>
        <mesh position={[-0.015, -0.05, 0.085]} rotation={[0.2, 0, -0.12]}>
          <boxGeometry args={[0.02, 0.08, 0.015]} />
          <meshStandardMaterial color={accentRedDark} roughness={0.5} />
        </mesh>
        <mesh position={[0.14, -0.02, 0.04]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.04, 0.05, 0.035]} />
          <meshStandardMaterial color={armorDark} roughness={0.6} />
        </mesh>
        <mesh position={[-0.14, -0.02, 0.04]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.04, 0.05, 0.035]} />
          <meshStandardMaterial color={armorDark} roughness={0.6} />
        </mesh>
        <mesh position={[0.14, 0.0, 0.06]}>
          <sphereGeometry args={[0.012, 4, 4]} />
          <meshStandardMaterial color={metalBright} metalness={0.8} roughness={0.15} />
        </mesh>
        <mesh position={[-0.14, 0.0, 0.06]}>
          <sphereGeometry args={[0.012, 4, 4]} />
          <meshStandardMaterial color={metalBright} metalness={0.8} roughness={0.15} />
        </mesh>

        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.16, 0.14, 0.2, 8]} />
          <meshStandardMaterial color={clothMid} roughness={0.75} />
        </mesh>

        <mesh position={[0, 0.08, -0.12]}>
          <boxGeometry args={[0.14, 0.12, 0.04]} />
          <meshStandardMaterial color={armorDark} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.08, -0.145]}>
          <boxGeometry args={[0.1, 0.02, 0.01]} />
          <meshStandardMaterial color={metalDark} roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.14, -0.12]}>
          <boxGeometry args={[0.06, 0.04, 0.02]} />
          <meshStandardMaterial color={metalBright} roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.03, -0.135]}>
          <boxGeometry args={[0.12, 0.02, 0.008]} />
          <meshStandardMaterial color={metalDark} roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.08, -0.14]}>
          <boxGeometry args={[0.08, 0.06, 0.008]} />
          <meshStandardMaterial color={armorEdge} roughness={0.4} metalness={0.3} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.2, 0.22, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.06, 8, 6]} />
          <meshStandardMaterial color={armorDark} roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.1, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.05, 0.16, 8]} />
          <meshStandardMaterial color={clothMid} roughness={0.7} />
        </mesh>
        <mesh position={[0.04, -0.07, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.015, 0.08, 0.055]} />
          <meshStandardMaterial color={wrapTan} roughness={0.6} />
        </mesh>
        <mesh position={[-0.04, -0.12, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.015, 0.06, 0.05]} />
          <meshStandardMaterial color={wrapTan} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.19, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color={wrapTan} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.26, 0]}>
          <cylinderGeometry args={[0.035, 0.04, 0.12, 8]} />
          <meshStandardMaterial color={wrapTan} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.23, 0.038]}>
          <boxGeometry args={[0.065, 0.015, 0.008]} />
          <meshStandardMaterial color={wrapTan} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.25, 0.038]}>
          <boxGeometry args={[0.06, 0.015, 0.008]} />
          <meshStandardMaterial color={wrapTan} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.22, 0.035]}>
          <boxGeometry args={[0.08, 0.06, 0.012]} />
          <meshStandardMaterial color={metalDark} roughness={0.25} metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.28, 0.03]}>
          <boxGeometry args={[0.07, 0.04, 0.01]} />
          <meshStandardMaterial color={metalDark} roughness={0.25} metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial color={skinWrap} roughness={0.7} />
        </mesh>
        <mesh position={[0.02, -0.34, 0.025]}>
          <boxGeometry args={[0.015, 0.02, 0.02]} />
          <meshStandardMaterial color={metalDark} roughness={0.3} metalness={0.6} />
        </mesh>
        {[0, 1, 2].map(i => (
          <mesh key={`rfinger-${i}`} position={[-0.015 + i * 0.015, -0.37, 0.01]}>
            <boxGeometry args={[0.012, 0.025, 0.02]} />
            <meshStandardMaterial color={skinWrap} roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0.025, -0.36, 0.015]} rotation={[0.3, 0, 0.4]}>
          <boxGeometry args={[0.012, 0.02, 0.018]} />
          <meshStandardMaterial color={skinWrap} roughness={0.7} />
        </mesh>
      </group>

      <group ref={leftArmRef} position={[-0.2, 0.22, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.06, 8, 6]} />
          <meshStandardMaterial color={armorDark} roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.045, 0.05, 0.16, 8]} />
          <meshStandardMaterial color={clothMid} roughness={0.7} />
        </mesh>
        <mesh position={[-0.04, -0.07, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.015, 0.08, 0.055]} />
          <meshStandardMaterial color={wrapTan} roughness={0.6} />
        </mesh>
        <mesh position={[0.04, -0.12, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.015, 0.06, 0.05]} />
          <meshStandardMaterial color={wrapTan} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.19, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color={wrapTan} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.26, 0]}>
          <cylinderGeometry args={[0.035, 0.04, 0.12, 8]} />
          <meshStandardMaterial color={wrapTan} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.23, 0.038]}>
          <boxGeometry args={[0.065, 0.015, 0.008]} />
          <meshStandardMaterial color={wrapTan} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.25, 0.038]}>
          <boxGeometry args={[0.06, 0.015, 0.008]} />
          <meshStandardMaterial color={wrapTan} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.22, 0.035]}>
          <boxGeometry args={[0.08, 0.06, 0.012]} />
          <meshStandardMaterial color={metalDark} roughness={0.25} metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.28, 0.03]}>
          <boxGeometry args={[0.07, 0.04, 0.01]} />
          <meshStandardMaterial color={metalDark} roughness={0.25} metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial color={skinWrap} roughness={0.7} />
        </mesh>
        <mesh position={[-0.02, -0.34, 0.025]}>
          <boxGeometry args={[0.015, 0.02, 0.02]} />
          <meshStandardMaterial color={metalDark} roughness={0.3} metalness={0.6} />
        </mesh>
        {[0, 1, 2].map(i => (
          <mesh key={`lfinger-${i}`} position={[-0.015 + i * 0.015, -0.37, 0.01]}>
            <boxGeometry args={[0.012, 0.025, 0.02]} />
            <meshStandardMaterial color={skinWrap} roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[-0.025, -0.36, 0.015]} rotation={[0.3, 0, -0.4]}>
          <boxGeometry args={[0.012, 0.02, 0.018]} />
          <meshStandardMaterial color={skinWrap} roughness={0.7} />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.08, -0.22, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.055, 8, 6]} />
          <meshStandardMaterial color={armorDark} roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.055, 0.06, 0.18, 8]} />
          <meshStandardMaterial color={clothMid} roughness={0.7} />
        </mesh>
        <mesh position={[0.04, -0.08, 0.02]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.012, 0.1, 0.05]} />
          <meshStandardMaterial color={wrapTan} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.08, 0.06]}>
          <boxGeometry args={[0.08, 0.07, 0.025]} />
          <meshStandardMaterial color={armorDark} roughness={0.35} metalness={0.25} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.048, 6, 6]} />
          <meshStandardMaterial color={wrapTan} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.04, 0.045, 0.12, 8]} />
          <meshStandardMaterial color={wrapTan} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.24, 0.045]}>
          <boxGeometry args={[0.075, 0.08, 0.02]} />
          <meshStandardMaterial color={metalDark} roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, -0.36, 0.02]}>
          <boxGeometry args={[0.08, 0.05, 0.14]} />
          <meshStandardMaterial color={armorDark} roughness={0.6} />
        </mesh>
        <mesh position={[0.02, -0.36, 0.09]}>
          <boxGeometry args={[0.02, 0.05, 0.04]} />
          <meshStandardMaterial color={clothDark} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.33, 0.095]}>
          <boxGeometry args={[0.04, 0.008, 0.005]} />
          <meshStandardMaterial color={metalBright} metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.35, 0.095]}>
          <boxGeometry args={[0.035, 0.008, 0.005]} />
          <meshStandardMaterial color={metalBright} metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.39, 0.02]}>
          <boxGeometry args={[0.085, 0.012, 0.15]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.396, 0.05]}>
          <boxGeometry args={[0.06, 0.004, 0.04]} />
          <meshStandardMaterial color="#151515" roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.396, -0.01]}>
          <boxGeometry args={[0.06, 0.004, 0.04]} />
          <meshStandardMaterial color="#151515" roughness={0.85} />
        </mesh>
      </group>

      <group ref={leftLegRef} position={[-0.08, -0.22, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.055, 8, 6]} />
          <meshStandardMaterial color={armorDark} roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.055, 0.06, 0.18, 8]} />
          <meshStandardMaterial color={clothMid} roughness={0.7} />
        </mesh>
        <mesh position={[-0.04, -0.08, 0.02]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.012, 0.1, 0.05]} />
          <meshStandardMaterial color={wrapTan} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.08, 0.06]}>
          <boxGeometry args={[0.08, 0.07, 0.025]} />
          <meshStandardMaterial color={armorDark} roughness={0.35} metalness={0.25} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.048, 6, 6]} />
          <meshStandardMaterial color={wrapTan} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.04, 0.045, 0.12, 8]} />
          <meshStandardMaterial color={wrapTan} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.24, 0.045]}>
          <boxGeometry args={[0.075, 0.08, 0.02]} />
          <meshStandardMaterial color={metalDark} roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, -0.36, 0.02]}>
          <boxGeometry args={[0.08, 0.05, 0.14]} />
          <meshStandardMaterial color={armorDark} roughness={0.6} />
        </mesh>
        <mesh position={[-0.02, -0.36, 0.09]}>
          <boxGeometry args={[0.02, 0.05, 0.04]} />
          <meshStandardMaterial color={clothDark} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.33, 0.095]}>
          <boxGeometry args={[0.04, 0.008, 0.005]} />
          <meshStandardMaterial color={metalBright} metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.35, 0.095]}>
          <boxGeometry args={[0.035, 0.008, 0.005]} />
          <meshStandardMaterial color={metalBright} metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.39, 0.02]}>
          <boxGeometry args={[0.085, 0.012, 0.15]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.396, 0.05]}>
          <boxGeometry args={[0.06, 0.004, 0.04]} />
          <meshStandardMaterial color="#151515" roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.396, -0.01]}>
          <boxGeometry args={[0.06, 0.004, 0.04]} />
          <meshStandardMaterial color="#151515" roughness={0.85} />
        </mesh>
      </group>

      <group ref={capeRef} position={[0, 0.18, -0.14]}>
        {[0, 1, 2, 3].map(i => (
          <mesh key={`cape-${i}`} position={[Math.sin(i) * 0.01, -0.06 - i * 0.1, -0.04 - i * 0.02]}>
            <boxGeometry args={[0.26 - i * 0.03, 0.1 - i * 0.01, 0.015]} />
            <meshStandardMaterial
              color={i < 2 ? clothDark : armorDark}
              roughness={0.55}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      <group position={[0.1, 0.18, -0.16]} rotation={[0.15, 0, -0.12]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 6]} />
          <meshStandardMaterial color={accentRed} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.315, 0]}>
          <sphereGeometry args={[0.016, 6, 4]} />
          <meshStandardMaterial color={metalBright} metalness={0.8} roughness={0.15} />
        </mesh>
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <mesh key={`wrap-${i}`} position={[0, 0.12 + i * 0.025, 0.013]} rotation={[0, 0, i % 2 === 0 ? 0.7 : -0.7]}>
            <boxGeometry args={[0.008, 0.035, 0.003]} />
            <meshStandardMaterial color={armorDark} roughness={0.55} />
          </mesh>
        ))}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.015, 8]} />
          <meshStandardMaterial color={metalDark} roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.055, 0]}>
          <boxGeometry args={[0.05, 0.005, 0.035]} />
          <meshStandardMaterial color={metalBright} roughness={0.15} metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.14, 0]}>
          <boxGeometry args={[0.022, 0.32, 0.008]} />
          <meshStandardMaterial color="#aaaaaa" roughness={0.08} metalness={0.92} />
        </mesh>
        <mesh position={[0.013, -0.14, 0]}>
          <boxGeometry args={[0.003, 0.3, 0.006]} />
          <meshStandardMaterial color="#dddddd" roughness={0.05} metalness={0.95} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.025, 0.02, 0.012]} />
          <meshStandardMaterial color={metalBright} roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      <group position={[-0.05, 0.06, -0.16]} rotation={[0.1, -0.25, Math.PI / 5]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.03, 0.03, 0.008, 4]} />
          <meshStandardMaterial color={metalBright} metalness={0.9} roughness={0.1} />
        </mesh>
        {[0, 1, 2, 3].map(i => (
          <mesh key={`blade-${i}`} position={[0, 0, 0]} rotation={[0, 0, (i * Math.PI) / 2]}>
            <boxGeometry args={[0.008, 0.055, 0.004]} />
            <meshStandardMaterial color="#999999" metalness={0.85} roughness={0.1} />
          </mesh>
        ))}
      </group>

      {[0.16, -0.16].map((xOff, i) => (
        <group key={`shoulder-${i}`} position={[xOff, 0.22, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.055, 8, 6]} />
            <meshStandardMaterial color={armorDark} roughness={0.35} metalness={0.35} />
          </mesh>
          <mesh position={[0, 0.02, 0.02]}>
            <boxGeometry args={[0.08, 0.025, 0.06]} />
            <meshStandardMaterial color={armorEdge} roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.035, 0.01]}>
            <boxGeometry args={[0.06, 0.015, 0.04]} />
            <meshStandardMaterial color={metalDark} roughness={0.2} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Flower power-up indicator */}
      {player.current.flower && (
        <group position={[0.18, 0.6, 0.08]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.06, 8, 6]} />
            <meshStandardMaterial color="#ff5500" emissive="#ff3300" emissiveIntensity={3} />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map(i => {
            const angle = (i * Math.PI * 2) / 6
            return (
              <mesh key={`petal-${i}`} position={[Math.cos(angle) * 0.07, Math.sin(angle) * 0.07, 0]}>
                <sphereGeometry args={[0.035, 6, 4]} />
                <meshStandardMaterial color="#ff8833" emissive="#ff6600" emissiveIntensity={2} />
              </mesh>
            )
          })}

        </group>
      )}
    </group>
  )
}

export { Player }
