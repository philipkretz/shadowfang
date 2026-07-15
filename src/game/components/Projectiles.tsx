'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Shuriken, Fireball, Arrow } from '@/types/game'

function ShurikenMeshInner({ shuriken, meshRef, timeRef }: {
  shuriken: Shuriken
  meshRef: React.RefObject<THREE.Group | null>
  timeRef: React.MutableRefObject<number>
}) {
  const bladeARef = useRef<THREE.Mesh>(null)
  const bladeBRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const trailRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    if (trailRef.current) {
      trailRef.current.position.x = shuriken.position.x - Math.cos(shuriken.rotation) * 0.4
      trailRef.current.position.y = shuriken.position.y - Math.sin(shuriken.rotation) * 0.4
      trailRef.current.position.z = shuriken.position.z
      const t = timeRef.current
      trailRef.current.scale.setScalar(0.6 + Math.sin(t * 15) * 0.3)
    }
  })

  return (
    <>
      <group ref={meshRef}>
        <mesh rotation={[0, 0, 0]}>
          <boxGeometry args={[0.35, 0.06, 0.06]} />
          <meshStandardMaterial color={'#888888'} emissive={'#5555aa'} emissiveIntensity={1.2} roughness={0.25} metalness={0.75} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.35, 0.06, 0.06]} />
          <meshStandardMaterial color={'#888888'} emissive={'#5555aa'} emissiveIntensity={1.2} roughness={0.25} metalness={0.75} />
        </mesh>
        <mesh ref={bladeBRef} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.3, 0.05, 0.05]} />
          <meshStandardMaterial color={'#999999'} emissive={'#6666bb'} emissiveIntensity={1.5} roughness={0.25} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.3, 0.05, 0.05]} />
          <meshStandardMaterial color={'#999999'} emissive={'#6666bb'} emissiveIntensity={1.5} roughness={0.25} metalness={0.75} />
        </mesh>
        <mesh ref={coreRef}>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 6]} />
          <meshStandardMaterial color={'#bbbbcc'} emissive={'#aaaacc'} emissiveIntensity={2} roughness={0.3} metalness={0.8} />
        </mesh>

      </group>
      <mesh ref={trailRef}>
        <sphereGeometry args={[0.08, 6, 4]} />
        <meshStandardMaterial color="#5555aa" emissive="#4444aa" emissiveIntensity={1} transparent opacity={0.3} roughness={0.3} />
      </mesh>
    </>
  )
}

function ShurikenMesh({ shuriken }: { shuriken: Shuriken }) {
  const meshRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    timeRef.current += delta
    const t = timeRef.current
    meshRef.current.position.set(shuriken.position.x, shuriken.position.y, shuriken.position.z)
    meshRef.current.rotation.z = shuriken.rotation
    const type = shuriken.type || 'shuriken'
    if (type === 'shuriken') {
      meshRef.current.rotation.y = t * 12
    } else if (type === 'rock') {
      meshRef.current.rotation.x = t * 3
      meshRef.current.rotation.z = shuriken.rotation + t * 2
    } else if (type === 'lightning') {
      meshRef.current.rotation.y = t * 8
    } else if (type === 'dark_energy') {
      meshRef.current.rotation.y = t * 4
      meshRef.current.rotation.x = Math.sin(t * 5) * 0.3
    } else if (type === 'firewave') {
      meshRef.current.rotation.z = shuriken.rotation
    }
  })

  const type = shuriken.type || 'shuriken'

  if (type === 'rock') {
    return (
      <group ref={meshRef}>
        <mesh>
          <dodecahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color={'#6b4423'} roughness={0.95} emissive={'#8b3a0f'} emissiveIntensity={0.6} />
        </mesh>
        <mesh scale={[1.05, 1.05, 1.05]}>
          <dodecahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color={'#5a3a1e'} roughness={0.9} transparent opacity={0.7} />
        </mesh>

      </group>
    )
  }

  if (type === 'lightning') {
    return (
      <group ref={meshRef}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.04, 0.4, 6]} />
          <meshStandardMaterial color={'#00ffff'} emissive={'#00ffff'} emissiveIntensity={4} transparent opacity={0.9} />
        </mesh>
        <mesh rotation={[0, 0, 0.4]} position={[0.05, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.03, 0.25, 5]} />
          <meshStandardMaterial color={'#00ddff'} emissive={'#00ddff'} emissiveIntensity={3} transparent opacity={0.8} />
        </mesh>
        <mesh rotation={[0, 0, -0.3]} position={[-0.04, 0.05, 0]}>
          <cylinderGeometry args={[0.01, 0.025, 0.2, 5]} />
          <meshStandardMaterial color={'#44ffff'} emissive={'#44ffff'} emissiveIntensity={3} transparent opacity={0.7} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.42, 8]} />
          <meshStandardMaterial color={'#00ffff'} emissive={'#00ffff'} emissiveIntensity={5} transparent opacity={0.25} />
        </mesh>

      </group>
    )
  }

  if (type === 'dark_energy') {
    return (
      <group ref={meshRef}>
        <mesh>
          <sphereGeometry args={[0.15, 8, 6]} />
          <meshStandardMaterial color={'#6600aa'} emissive={'#8800ff'} emissiveIntensity={3} roughness={0.2} transparent opacity={0.9} />
        </mesh>
        <mesh scale={[1.3, 1.3, 1.3]}>
          <sphereGeometry args={[0.14, 8, 6]} />
          <meshStandardMaterial color={'#4400aa'} emissive={'#6600dd'} emissiveIntensity={2} transparent opacity={0.3} />
        </mesh>
        <mesh scale={[1.6, 1.6, 1.6]}>
          <sphereGeometry args={[0.12, 6, 4]} />
          <meshStandardMaterial color={'#220088'} emissive={'#4400aa'} emissiveIntensity={1.5} transparent opacity={0.12} />
        </mesh>
        <mesh rotation={[0.7, 0, 0]} scale={[1.2, 1.2, 1.2]}>
          <torusGeometry args={[0.14, 0.015, 8, 12]} />
          <meshStandardMaterial color={'#8800ff'} emissive={'#aa00ff'} emissiveIntensity={3} transparent opacity={0.5} />
        </mesh>

      </group>
    )
  }

  if (type === 'firewave') {
    return (
      <group ref={meshRef}>
        <mesh>
          <boxGeometry args={[0.5, 0.12, 0.15]} />
          <meshStandardMaterial color={'#ff6600'} emissive={'#ff4400'} emissiveIntensity={3} roughness={0.3} transparent opacity={0.9} />
        </mesh>
        <mesh scale={[1.1, 1.2, 1.2]}>
          <boxGeometry args={[0.48, 0.1, 0.13]} />
          <meshStandardMaterial color={'#ff8800'} emissive={'#ff6600'} emissiveIntensity={2.5} transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.15, 0.08, 0]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.04, 0.15, 5]} />
          <meshStandardMaterial color={'#ffaa00'} emissive={'#ff8800'} emissiveIntensity={3} transparent opacity={0.7} />
        </mesh>
        <mesh position={[-0.1, 0.06, 0]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.03, 0.12, 5]} />
          <meshStandardMaterial color={'#ffcc00'} emissive={'#ffaa00'} emissiveIntensity={2.5} transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.05, -0.06, 0]} rotation={[0, 0, 0.1]}>
          <coneGeometry args={[0.025, 0.1, 4]} />
          <meshStandardMaterial color={'#ffdd44'} emissive={'#ffcc00'} emissiveIntensity={2} transparent opacity={0.5} />
        </mesh>

      </group>
    )
  }

  return <ShurikenMeshInner shuriken={shuriken} meshRef={meshRef} timeRef={timeRef} />
}

function FireballMesh({ fireball }: { fireball: Fireball }) {
  const meshRef = useRef<THREE.Group>(null)
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const trailRef = useRef<THREE.Mesh>(null)
  const trail2Ref = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    timeRef.current += delta
    const t = timeRef.current

    meshRef.current.position.set(fireball.position.x, fireball.position.y, fireball.position.z)
    meshRef.current.rotation.z = fireball.rotation

    if (outerRef.current) {
      const pulse = 1 + Math.sin(t * 18) * 0.15
      outerRef.current.scale.setScalar(pulse)
      const mat = outerRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 2.5 + Math.sin(t * 22) * 1.0
    }

    if (innerRef.current) {
      const flicker = 1 + Math.sin(t * 25 + 1.3) * 0.12
      innerRef.current.scale.setScalar(flicker)
      const mat = innerRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 3.5 + Math.sin(t * 30) * 1.5
    }

    if (coreRef.current) {
      const corePulse = 0.8 + Math.sin(t * 35 + 2.7) * 0.3
      coreRef.current.scale.setScalar(corePulse)
      const mat = coreRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 4 + Math.sin(t * 40) * 2
    }

    if (lightRef.current) {
      lightRef.current.intensity = 3.5 + Math.sin(t * 20) * 1.5
    }

    if (trailRef.current) {
      trailRef.current.position.x = fireball.position.x - fireball.velocity.x * 2.5
      trailRef.current.position.y = fireball.position.y - fireball.velocity.y * 1.5
      trailRef.current.position.z = fireball.position.z
      const trailPulse = 0.8 + Math.sin(t * 15) * 0.3
      trailRef.current.scale.setScalar(trailPulse)
      const mat = trailRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.35 + Math.sin(t * 12) * 0.15
      mat.emissiveIntensity = 1.5 + Math.sin(t * 18) * 0.8
    }
    if (trail2Ref.current) {
      trail2Ref.current.position.x = fireball.position.x - fireball.velocity.x * 5
      trail2Ref.current.position.y = fireball.position.y - fireball.velocity.y * 2.5
      trail2Ref.current.position.z = fireball.position.z
      const trail2Pulse = 0.7 + Math.sin(t * 12 + 1) * 0.35
      trail2Ref.current.scale.setScalar(trail2Pulse)
      const mat = trail2Ref.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.2 + Math.sin(t * 10 + 0.5) * 0.1
      mat.emissiveIntensity = 1 + Math.sin(t * 14) * 0.5
    }
  })

  return (
    <>
      <group ref={meshRef}>
        <mesh ref={outerRef}>
          <sphereGeometry args={[0.18, 10, 8]} />
          <meshStandardMaterial
            color="#ff6600"
            emissive="#ff4400"
            emissiveIntensity={3}
            roughness={0.15}
          />
        </mesh>
        <mesh ref={innerRef}>
          <sphereGeometry args={[0.12, 8, 6]} />
          <meshStandardMaterial
            color="#ffbb11"
            emissive="#ffbb11"
            emissiveIntensity={4}
            roughness={0.1}
          />
        </mesh>
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.06, 6, 4]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={5}
            roughness={0.05}
          />
        </mesh>

      </group>
      <mesh ref={trailRef}>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshStandardMaterial
          color="#ff8800"
          emissive="#ff6600"
          emissiveIntensity={2}
          transparent
          opacity={0.5}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={trail2Ref}>
        <sphereGeometry args={[0.06, 6, 4]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ff8800"
          emissiveIntensity={1.5}
          transparent
          opacity={0.25}
          roughness={0.3}
        />
      </mesh>
    </>
  )
}

function ArrowMesh({ arrow }: { arrow: Arrow }) {
  const meshRef = useRef<THREE.Group>(null)
  const trailRef = useRef<THREE.Mesh>(null)
  const headRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    timeRef.current += delta
    const t = timeRef.current

    meshRef.current.position.set(arrow.position.x, arrow.position.y, arrow.position.z)
    meshRef.current.rotation.z = Math.atan2(arrow.velocity.y, arrow.velocity.x)

    if (headRef.current) {
      const mat = headRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 2 + Math.sin(t * 18) * 1.0
    }

    if (trailRef.current) {
      trailRef.current.position.x = arrow.position.x - arrow.velocity.x * 0.3
      trailRef.current.position.y = arrow.position.y - arrow.velocity.y * 0.3
      trailRef.current.position.z = arrow.position.z
      const trailPulse = 0.5 + Math.sin(t * 12) * 0.2
      trailRef.current.scale.setScalar(trailPulse)
    }
  })

  return (
    <>
      <group ref={meshRef}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.3, 4]} />
          <meshStandardMaterial color="#8B4513" roughness={0.5} />
        </mesh>
        <mesh ref={headRef} position={[0.18, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.03, 0.06, 4]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.7} roughness={0.2} emissive="#ffaa44" emissiveIntensity={2} />
        </mesh>
        <mesh position={[-0.12, 0.02, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.04, 0.025, 0.005]} />
          <meshStandardMaterial color="#cc2222" roughness={0.4} />
        </mesh>
        <mesh position={[-0.12, -0.02, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.04, 0.025, 0.005]} />
          <meshStandardMaterial color="#cc2222" roughness={0.4} />
        </mesh>

      </group>
      <mesh ref={trailRef}>
        <sphereGeometry args={[0.06, 6, 4]} />
        <meshStandardMaterial color="#ff8844" emissive="#ff6622" emissiveIntensity={1.5} transparent opacity={0.3} roughness={0.2} />
      </mesh>
    </>
  )
}

function ProjectileSystem({ shurikens, fireballs, arrows }: {
  shurikens: React.RefObject<Shuriken[]>
  fireballs: React.RefObject<Fireball[]>
  arrows: React.RefObject<Arrow[]>
}) {
  const [activeCount, setActiveCount] = useState(0)
  const prevCountRef = useRef(0)

  useFrame(() => {
    const count = shurikens.current.filter(s => s.active).length
      + fireballs.current.filter(f => f.active).length
      + arrows.current.filter(a => a.active).length
    if (count !== prevCountRef.current) {
      prevCountRef.current = count
      setActiveCount(count)
    }
  })

  return (
    <>
      {shurikens.current.filter(s => s.active).map((shur) => (
        <ShurikenMesh key={`shur-${shur.id}`} shuriken={shur} />
      ))}
      {fireballs.current.filter(f => f.active).map((fb) => (
        <FireballMesh key={`fb-${fb.id}`} fireball={fb} />
      ))}
      {arrows.current.filter(a => a.active).map((arrow) => (
        <ArrowMesh key={`arrow-${arrow.id}`} arrow={arrow} />
      ))}
    </>
  )
}

export { ProjectileSystem }

export type { Shuriken }
