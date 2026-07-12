import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlayerState, GameState } from '@/types/game'

export function CameraController({ player, game }: { player: React.RefObject<PlayerState>; game: React.RefObject<GameState> }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 3, 12))

  useFrame(() => {
    if (!player.current) return
    const p = player.current
    const g = game.current
    targetPos.current.x = THREE.MathUtils.lerp(targetPos.current.x, p.position.x + 2 + p.facing * 1, 0.04)
    targetPos.current.y = THREE.MathUtils.lerp(targetPos.current.y, Math.max(p.position.y + 2.5, 3.5), 0.04)
    targetPos.current.z = 12
    camera.position.lerp(targetPos.current, 0.06)

    // Screen shake
    if (g.screenShake > 0) {
      const intensity = g.screenShake * 0.3
      camera.position.x += (Math.random() - 0.5) * intensity
      camera.position.y += (Math.random() - 0.5) * intensity
    }

    camera.lookAt(
      THREE.MathUtils.lerp(camera.position.x - 2, p.position.x + 2, 0.5),
      THREE.MathUtils.lerp(camera.position.y - 2, p.position.y + 1, 0.5),
      0
    )
  })

  return null
}
