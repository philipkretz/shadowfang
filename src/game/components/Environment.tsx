'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Environment() {
  const cloudRefs = useRef<THREE.Group[]>([])
  const waterRefs = useRef<THREE.Mesh[]>([])
  const moteRefs = useRef<THREE.Mesh[]>([])
  const butterflyRefs = useRef<THREE.Group[]>([])

  useFrame(() => {
    const t = Date.now() * 0.001
    cloudRefs.current.forEach((cloud, i) => {
      if (cloud) {
        cloud.position.x = ((i * 14 - 40 + t * 0.4 * (1.5 + i % 3)) % 130) - 20
      }
    })
    waterRefs.current.forEach((water, i) => {
      if (water) {
        const s = water.scale
        s.x = 1 + Math.sin(t * 1.2 + i * 2) * 0.05
        s.y = 1 + Math.cos(t * 0.9 + i * 3) * 0.05
      }
    })
    moteRefs.current.forEach((mote, i) => {
      if (mote) {
        mote.position.y = 1 + (i % 4) * 2 + Math.sin(t * 0.8 + i * 1.7) * 0.4
        mote.position.x = ((i * 9 + 4) % 115) + Math.sin(t * 0.3 + i) * 0.5
      }
    })
    butterflyRefs.current.forEach((b, i) => {
      if (b) {
        const wingAngle = Math.sin(t * 8 + i * 2) * 0.6
        if (b.children[1]) b.children[1].rotation.z = 0.3 + wingAngle
        if (b.children[2]) b.children[2].rotation.z = -0.3 - wingAngle
        b.position.x += Math.sin(t * 0.5 + i * 3) * 0.003
        b.position.y = 2 + (i % 3) * 1.5 + Math.sin(t * 0.7 + i * 2) * 0.3
      }
    })
  })

  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.5} color="#d0e0ff" />
      <directionalLight
        position={[15, 22, 12]}
        intensity={2.0}
        color="#fff8e8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={140}
        shadow-camera-left={-50}
        shadow-camera-right={90}
        shadow-camera-top={30}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0008}
      />
      <hemisphereLight args={['#8ec0ff', '#5a8a3a', 0.35]} />
      <pointLight position={[8, 10, 6]} intensity={0.25} color="#ffe8a0" distance={25} />
      <fog attach="fog" args={['#c0dcf0', 30, 95]} />

      {/* Sky gradient with sun glow */}
      <mesh position={[30, 10, -30]} scale={[220, 110, 1]}>
        <planeGeometry />
        <shaderMaterial
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vUv;
            void main() {
              vec3 top = vec3(0.18, 0.42, 0.92);
              vec3 mid = vec3(0.45, 0.72, 1.0);
              vec3 horizon = vec3(0.82, 0.92, 1.0);
              vec3 bottom = vec3(0.92, 0.96, 1.0);
              vec3 color = mix(bottom, horizon, smoothstep(0.0, 0.25, vUv.y));
              color = mix(color, mid, smoothstep(0.25, 0.6, vUv.y));
              color = mix(color, top, smoothstep(0.6, 1.0, vUv.y));
              float sunDist = length(vUv - vec2(0.78, 0.72));
              color += vec3(1.0, 0.95, 0.7) * exp(-sunDist * 4.0) * 0.35;
              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>

      {/* Distant haze layer */}
      <mesh position={[30, 1, -28]} scale={[220, 15, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#c8ddf0" transparent opacity={0.3} />
      </mesh>

      {/* Animated clouds — layered, volumetric feel */}
      {Array.from({ length: 18 }).map((_, i) => {
        const scale = 0.8 + (i % 4) * 0.3
        const y = 6 + (i % 5) * 2.8
        const z = -10 - (i % 4) * 5
        const opacity = 0.7 + (i % 3) * 0.08
        return (
          <group
            key={`cloud-${i}`}
            ref={el => { if (el) cloudRefs.current[i] = el }}
            position={[(i * 12 - 45) % 130, y, z]}
            scale={[scale, scale * 0.6, scale]}
          >
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[1.4, 12, 10]} />
              <meshStandardMaterial color="#f0f4ff" roughness={1.0} transparent opacity={opacity} />
            </mesh>
            <mesh position={[1.0, 0.1, 0.15]}>
              <sphereGeometry args={[1.0, 10, 8]} />
              <meshStandardMaterial color="#eef2ff" roughness={1.0} transparent opacity={opacity - 0.04} />
            </mesh>
            <mesh position={[-0.8, -0.05, 0.2]}>
              <sphereGeometry args={[0.85, 10, 8]} />
              <meshStandardMaterial color="#f2f6ff" roughness={1.0} transparent opacity={opacity - 0.04} />
            </mesh>
            <mesh position={[0.3, 0.25, -0.15]}>
              <sphereGeometry args={[0.7, 8, 6]} />
              <meshStandardMaterial color="#f8faff" roughness={1.0} transparent opacity={opacity - 0.06} />
            </mesh>
            <mesh position={[-1.4, 0.15, -0.1]}>
              <sphereGeometry args={[0.6, 8, 6]} />
              <meshStandardMaterial color="#f0f4ff" roughness={1.0} transparent opacity={opacity - 0.06} />
            </mesh>
          </group>
        )
      })}

      {/* Mountains — layered with rock bands and snow */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = (i * 15 - 35) % 140
        const z = -24 - (i % 3) * 5
        const h = 10 + (i % 3) * 3
        const w = 5 + (i % 4) * 2
        return (
          <group key={`mountain-${i}`}>
            {/* Mountain base */}
            <mesh position={[x, -4, z]}>
              <coneGeometry args={[w, h, 7]} />
              <meshStandardMaterial color={i % 3 === 0 ? '#5c8a4c' : i % 3 === 1 ? '#4e7e42' : '#6a9a5a'} roughness={0.9} />
            </mesh>
            {/* Rock band */}
            <mesh position={[x, -4 + h * 0.25, z]}>
              <coneGeometry args={[w * 0.75, h * 0.35, 7]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#8a7a6a' : '#7a6a5a'} roughness={0.95} />
            </mesh>
            {/* Snow cap */}
            <mesh position={[x, -4 + h * 0.72, z]}>
              <coneGeometry args={[w * 0.25 + 0.5, h * 0.22, 7]} />
              <meshStandardMaterial color="#f4f6ff" roughness={0.92} />
            </mesh>
          </group>
        )
      })}

      {/* Trees — realistic trunks with branches, multi-layer canopy */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i * 11 - 20) % 115
        const z = -5 - (i % 4) * 2
        const trunkH = 1.4 + (i % 3) * 0.3
        const canopyColors = ['#2d9a2d', '#35a835', '#3dba3d', '#48c848']
        const darkCanopy = ['#1e7a1e', '#267a26', '#2d8a2d', '#359a35']
        return (
          <group key={`tree-${i}`} position={[x, 0, z]}>
            {/* Trunk */}
            <mesh position={[0, trunkH / 2, 0]}>
              <cylinderGeometry args={[0.06 + (i % 2) * 0.02, 0.1 + (i % 2) * 0.02, trunkH, 7]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#6b4226' : '#7a5236'} roughness={0.92} />
            </mesh>
            {/* Branch stubs */}
            <mesh position={[0.12, trunkH * 0.6, 0]} rotation={[0, 0, 0.6]} scale={[0.04, 0.3, 0.04]}>
              <cylinderGeometry args={[1, 0.5, 1, 4]} />
              <meshStandardMaterial color="#6b4226" roughness={0.92} />
            </mesh>
            <mesh position={[-0.1, trunkH * 0.45, 0.08]} rotation={[0.4, 0, -0.5]} scale={[0.04, 0.25, 0.04]}>
              <cylinderGeometry args={[1, 0.5, 1, 4]} />
              <meshStandardMaterial color="#6b4226" roughness={0.92} />
            </mesh>
            {/* Lower canopy — wider, darker */}
            <mesh position={[0, trunkH + 0.5, 0]}>
              <sphereGeometry args={[0.75 + (i % 3) * 0.1, 10, 8]} />
              <meshStandardMaterial color={darkCanopy[i % 4]} roughness={0.82} />
            </mesh>
            {/* Mid canopy */}
            <mesh position={[0.15, trunkH + 0.9, 0.1]}>
              <sphereGeometry args={[0.55 + (i % 2) * 0.1, 9, 7]} />
              <meshStandardMaterial color={canopyColors[i % 4]} roughness={0.78} />
            </mesh>
            {/* Top canopy — lighter, smaller */}
            <mesh position={[-0.1, trunkH + 1.25, -0.05]}>
              <sphereGeometry args={[0.4, 8, 6]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#50d050' : '#58d858'} roughness={0.75} />
            </mesh>
          </group>
        )
      })}

      {/* Flowers — varied shapes, more realistic */}
      {Array.from({ length: 35 }).map((_, i) => {
        const x = (i * 6.5 + 2) % 120 - 5
        const z = (i % 4) * 1.0 + 1.2
        const flowerColors = ['#ff6b8a', '#ffaa33', '#ff55aa', '#aa55ff', '#55aaff', '#ff8844', '#44ddff', '#ffdd44', '#ff7744', '#cc66ff']
        const c = flowerColors[i % flowerColors.length]
        return (
          <group key={`flower-${i}`} position={[x, 0, z]}>
            {/* Stem */}
            <mesh position={[0, 0.14, 0]}>
              <cylinderGeometry args={[0.01, 0.015, 0.28, 4]} />
              <meshStandardMaterial color="#2a8a2a" />
            </mesh>
            {/* Leaf */}
            {i % 3 === 0 && (
              <mesh position={[0.04, 0.08, 0]} rotation={[0, 0, 0.4]}>
                <sphereGeometry args={[0.03, 4, 3]} />
                <meshStandardMaterial color="#35a835" />
              </mesh>
            )}
            {/* Petals — small cluster */}
            {[0, 1, 2, 3, 4].map(p => (
              <mesh key={p} position={[Math.cos(p * 1.256) * 0.04, 0.3, Math.sin(p * 1.256) * 0.04]}>
                <sphereGeometry args={[0.025, 5, 4]} />
                <meshStandardMaterial
                  color={c}
                  emissive={c}
                  emissiveIntensity={0.15}
                />
              </mesh>
            ))}
            {/* Center */}
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.018, 4, 4]} />
              <meshStandardMaterial color="#ffee44" emissive="#ffee44" emissiveIntensity={0.3} />
            </mesh>
          </group>
        )
      })}

      {/* Bushes — fuller, more organic */}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = (i * 14 + 6) % 110
        const z = (i % 3) * 1.5 + 1.8
        return (
          <group key={`bush-${i}`} position={[x, 0, z]}>
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.45 + (i % 3) * 0.08, 10, 8]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#2e9a2e' : '#38a838'} roughness={0.82} />
            </mesh>
            <mesh position={[0.3, 0.15, 0.1]}>
              <sphereGeometry args={[0.3, 8, 6]} />
              <meshStandardMaterial color="#3ab83a" roughness={0.82} />
            </mesh>
            <mesh position={[-0.25, 0.12, 0.15]}>
              <sphereGeometry args={[0.28, 8, 6]} />
              <meshStandardMaterial color="#34a834" roughness={0.82} />
            </mesh>
            {/* Berry dots */}
            {i % 2 === 0 && [0, 1, 2].map(j => (
              <mesh key={j} position={[Math.cos(j * 2.1) * 0.3, 0.35, Math.sin(j * 2.1) * 0.3]}>
                <sphereGeometry args={[0.03, 4, 4]} />
                <meshStandardMaterial color="#dd3333" emissive="#dd3333" emissiveIntensity={0.2} />
              </mesh>
            ))}
          </group>
        )
      })}

      {/* Rocks — varied sizes, mossy */}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = (i * 12 + 4) % 115
        const z = (i % 4) * 1.2 + 0.8
        const s = 0.12 + (i % 4) * 0.06
        return (
          <group key={`rock-${i}`} position={[x, -0.3, z]}>
            <mesh position={[0, s * 0.5, 0]} rotation={[0.1 * (i % 3), i * 0.7, 0.05 * (i % 4)]}>
              <dodecahedronGeometry args={[s, 0]} />
              <meshStandardMaterial
                color={i % 3 === 0 ? '#7a7a7a' : i % 3 === 1 ? '#8a8a8a' : '#6a7a6a'}
                roughness={0.9}
              />
            </mesh>
            {i % 3 === 0 && (
              <mesh position={[0, s + 0.02, 0]}>
                <sphereGeometry args={[s * 0.6, 6, 4]} />
                <meshStandardMaterial color="#4a8a3a" roughness={0.85} transparent opacity={0.6} />
              </mesh>
            )}
          </group>
        )
      })}

      {/* Grass tufts — more blades, wind sway via vertex offset */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = (i * 7.5 + 1) % 120 - 5
        const z = (i % 5) * 1.0 + 0.5
        const bladeCount = 3 + (i % 2)
        return (
          <group key={`grass-${i}`} position={[x, 0, z]}>
            {Array.from({ length: bladeCount }).map((_, j) => {
              const angle = (j / bladeCount) * Math.PI * 2
              const len = 0.12 + (j % 2) * 0.04
              return (
                <mesh
                  key={j}
                  position={[Math.cos(angle) * 0.02, len / 2, Math.sin(angle) * 0.02]}
                  rotation={[0, angle, (j % 2 === 0 ? 0.15 : -0.15)]}
                >
                  <boxGeometry args={[0.012, len, 0.008]} />
                  <meshStandardMaterial color={j % 2 === 0 ? '#42b838' : '#50c848'} />
                </mesh>
              )
            })}
          </group>
        )
      })}

      {/* Butterflies — animated wings */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group
          key={`butterfly-${i}`}
          ref={el => { if (el) butterflyRefs.current[i] = el }}
          position={[(i * 18 + 8) % 110, 2 + (i % 3) * 1.2, (i % 3) * 1.5 + 0.5]}
        >
          <mesh>
            <sphereGeometry args={[0.025, 4, 4]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          <mesh position={[-0.05, 0.01, 0]} rotation={[0, 0, 0.3]}>
            <planeGeometry args={[0.07, 0.05]} />
            <meshStandardMaterial
              color={i % 4 === 0 ? '#ff88aa' : i % 4 === 1 ? '#88aaff' : i % 4 === 2 ? '#ffcc44' : '#aa88ff'}
              side={THREE.DoubleSide}
              emissive={i % 4 === 0 ? '#ff4488' : i % 4 === 1 ? '#4488ff' : i % 4 === 2 ? '#ffaa00' : '#8844ff'}
              emissiveIntensity={0.25}
            />
          </mesh>
          <mesh position={[0.05, 0.01, 0]} rotation={[0, 0, -0.3]}>
            <planeGeometry args={[0.07, 0.05]} />
            <meshStandardMaterial
              color={i % 4 === 0 ? '#ff88aa' : i % 4 === 1 ? '#88aaff' : i % 4 === 2 ? '#ffcc44' : '#aa88ff'}
              side={THREE.DoubleSide}
              emissive={i % 4 === 0 ? '#ff4488' : i % 4 === 1 ? '#4488ff' : i % 4 === 2 ? '#ffaa00' : '#8844ff'}
              emissiveIntensity={0.25}
            />
          </mesh>
        </group>
      ))}

      {/* Floating sparkle motes — animated */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={`mote-${i}`}
          ref={el => { if (el) moteRefs.current[i] = el }}
          position={[(i * 9 + 4) % 115, 1 + (i % 4) * 2, (i % 3) * 1.5]}
        >
          <sphereGeometry args={[0.018, 4, 4]} />
          <meshStandardMaterial
            color="#ffffee"
            emissive="#ffffdd"
            emissiveIntensity={2.0}
            transparent
            opacity={0.65}
          />
        </mesh>
      ))}

      {/* Sun with realistic glow and lens flare */}
      <group position={[48, 30, -38]}>
        <mesh>
          <sphereGeometry args={[3.0, 20, 20]} />
          <meshBasicMaterial color="#fff4cc" />
        </mesh>
        <mesh>
          <sphereGeometry args={[4.0, 16, 16]} />
          <meshBasicMaterial color="#ffee88" transparent opacity={0.2} />
        </mesh>
        <mesh>
          <sphereGeometry args={[6.5, 16, 16]} />
          <meshBasicMaterial color="#ffdd66" transparent opacity={0.08} />
        </mesh>
        <pointLight color="#ffeeaa" intensity={0.35} distance={150} />
      </group>

      {/* Water with animated surface and reflections */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={`water-${i}`}
          ref={el => { if (el) waterRefs.current[i] = el }}
          position={[12 + i * 22, -0.46, 2.5 + (i % 2) * 1.5]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[1.0 + (i % 2) * 0.4, 16]} />
          <meshStandardMaterial
            color="#4488cc"
            roughness={0.02}
            metalness={0.4}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}

      {/* Ground plane — grass texture feel */}
      <mesh position={[35, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 30]} />
        <meshStandardMaterial color="#5a9a42" roughness={0.92} />
      </mesh>
    </>
  )
}

export function FlagPole() {
  const flagRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(Date.now() * 0.003) * 0.15
    }
  })

  return (
    <group position={[72, 0, 0]}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.2, 10]} />
        <meshStandardMaterial color="#555555" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 10, 8]} />
        <meshStandardMaterial color="#cccccc" roughness={0.15} metalness={0.85} />
      </mesh>
      <mesh position={[0, 10.2, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.9} />
      </mesh>
      <group ref={flagRef} position={[0.4, 9, 0]}>
        <mesh position={[0.3, 0, 0]}>
          <planeGeometry args={[0.8, 0.55]} />
          <meshStandardMaterial color="#30d030" side={THREE.DoubleSide} roughness={0.5} />
        </mesh>
        <mesh position={[0.3, 0, 0.005]}>
          <circleGeometry args={[0.1, 5]} />
          <meshStandardMaterial color="#ffd700" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}
