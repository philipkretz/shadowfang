'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Particle } from '@/types/game'

const colorCache = new Map<string, THREE.Color>()

function getCachedColor(hex: string): THREE.Color {
  let c = colorCache.get(hex)
  if (!c) {
    c = new THREE.Color(hex)
    colorCache.set(hex, c)
  }
  return c
}

function ParticleSystem({ particles }: { particles: React.RefObject<Particle[]> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useRef(new THREE.Object3D())
  const colors = useRef(new Float32Array(300))

  useFrame(() => {
    if (!meshRef.current) return
    const pList = particles.current
    const colorArr = colors.current
    for (let i = 0; i < 100; i++) {
      if (i < pList.length) {
        const p = pList[i]
        const life = p.life / p.maxLife
        dummy.current.position.set(p.position.x, p.position.y, p.position.z)
        dummy.current.scale.setScalar(p.size * life)
        dummy.current.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.current.matrix)

        const c = getCachedColor(p.color)
        const idx = i * 3
        colorArr[idx] = c.r
        colorArr[idx + 1] = c.g
        colorArr[idx + 2] = c.b
      } else {
        dummy.current.position.set(0, -100, 0)
        dummy.current.scale.setScalar(0)
        dummy.current.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.current.matrix)
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 100]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial roughness={0.5} />
      <instancedBufferAttribute args={[colors.current, 3]} attach="instanceColor" />
    </instancedMesh>
  )
}

export { ParticleSystem }
