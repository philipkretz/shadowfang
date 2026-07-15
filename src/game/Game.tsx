'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameState } from '@/hooks/useGameState'
import { useInput } from '@/hooks/useInput'
import { getAudioEngine } from '@/audio/AudioEngine'
import type { PlayerState, GameState, Platform, Enemy, Coin, PowerUp, Particle, Fireball, Arrow, Shuriken } from '@/types/game'
import type { AudioEngine } from '@/audio/AudioEngine'
import { loadHighscores, isHighscore, insertHighscore, type HighscoreEntry } from '@/game/highscore'
import { useBrickTexture, useGrassTexture, useQuestionTexture, useUsedBlockTexture, useStoneTexture } from '@/game/textures'
import { Environment, FlagPole } from '@/game/components/Environment'
import { EnemyMesh } from '@/game/components/EnemyMesh'
import { PlatformMesh, RollingStoneMesh } from '@/game/components/Platforms'
import { CoinMesh, PowerUpMesh } from '@/game/components/Items'
import { Player } from '@/game/components/Player'
import { ProjectileSystem } from '@/game/components/Projectiles'
import { ParticleSystem } from '@/game/components/Particles'
import { BossNinja, BossGolem, BossStorm, BossShadow } from '@/game/components/Bosses'
import { CameraController } from '@/game/components/Camera'
import { HUD, TouchControls, StartScreen } from '@/game/ui/GameUI'

// ============================================
// MAIN GAME COMPONENT
// ============================================
export default function Game() {
  const { player, game, platforms, enemies, coins, powerUps, particles, bosses, shurikens, fireballs, arrows, rollingStones, update, resetGame } = useGameState()
  const { input, setButton } = useInput()
  const audioRef = useRef(getAudioEngine())
  const lastEventRef = useRef<string>('')
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [levelComplete, setLevelComplete] = useState(false)
  const [transitionOpacity, setTransitionOpacity] = useState(0)
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [bossFlash, setBossFlash] = useState(false)
  const [highscores, setHighscores] = useState<HighscoreEntry[]>([])
  const [showNameEntry, setShowNameEntry] = useState(false)
  const [showVictory, setShowVictory] = useState(false)
  const [levelIntro, setLevelIntro] = useState<{ title: string; subtitle: string; story?: string } | null>(null)

  useEffect(() => {
    setHighscores(loadHighscores())
    return () => {
      audioRef.current.destroy()
    }
  }, [])

  const levelIntros: Record<number, { title: string; subtitle: string; story?: string }> = {
    1: { title: 'WORLD 1-1', subtitle: 'The Green Fields', story: 'Fang storms the peaceful meadows, somehow making everything on fire. The Shadow Master\'s grunts never saw it coming — mostly because they\'re not very bright. Stomp their faces. Collect the loot. Try not to fall off things.' },
    2: { title: 'WORLD 1-2', subtitle: 'Stormy Plains', story: 'Thunder rolls. Lightning cracks. Ninjas leap from the shadows like it\'s their day job — because it is. Archers rain arrows from above. "This is fine," Fang mutters, on fire for the third time today.' },
    3: { title: 'WORLD 2-1', subtitle: 'Underground Cave', story: 'It smells like damp socks and regret down here. Sumo wrestlers block the tunnels, and the skeletons don\'t even have the decency to stay dead. At least the stalactites look pretty... from a safe distance.' },
    4: { title: 'WORLD 2-2', subtitle: 'Sky Kingdom', story: 'Fang has always hated heights. Also wind. And clouds that aren\'t solid. But the Shadow Master\'s fortress lies ahead, so here we are — platforming over a bottomless abyss with the aerodynamic properties of a brick. What could go wrong?' },
    5: { title: 'WORLD 3-1', subtitle: 'The Final Castle', story: 'The Dark Revenant waits at the top. All of Fang\'s training, all of his rage, all of the things he broke today — it all leads here. Also, he finally found his favorite mug. It was in the Shadow Master\'s throne room. This is personal now.' },
    6: { title: 'WORLD 3-2', subtitle: 'The Lava Fortress', story: 'Fang dives headfirst into the inferno because apparently a normal castle wasn\'t enough. Lava pools, fire traps, and the angriest golem he\'s ever met. "At least it\'s warm," he says, actively on fire. Again.' },
    7: { title: 'WORLD 4-1', subtitle: 'The Shadow Realm', story: 'The final frontier. The Shadow Sovereign\'s domain — where light goes to die and platforms are held together by spite. Every enemy the Shadow Master ever recruited is here. All of them. Even the interns. Especially the interns.' },
  }

  const showLevelIntro = useCallback((level: number) => {
    const intro = levelIntros[level]
    if (!intro) return
    setLevelIntro(intro)
    setTimeout(() => setLevelIntro(null), 3000)
  }, [])

  const handleStart = useCallback(() => {
    audioRef.current.init()
    audioRef.current.resume()
    audioRef.current.startMusic()
    game.current.started = true
    setStarted(true)
    showLevelIntro(1)
  }, [game, showLevelIntro])

  const handleRestart = useCallback(() => {
    audioRef.current.stopMusic()
    resetGame()
    audioRef.current.startMusic()
    setGameOver(false)
    setLevelComplete(false)
    setShowNameEntry(false)
    setShowVictory(false)
    setTransitionOpacity(0)
    showLevelIntro(1)
  }, [resetGame, showLevelIntro])

  const handlePause = useCallback(() => {
    const next = !game.current.paused
    game.current.paused = next
    setPaused(next)
    if (next) {
      audioRef.current.stopMusic()
    } else {
      audioRef.current.startMusic()
    }
  }, [game])

  const handleResume = useCallback(() => {
    game.current.paused = false
    setPaused(false)
    audioRef.current.startMusic()
  }, [game])

  const handleNextLevel = useCallback(() => {
    audioRef.current.stopMusic()
    resetGame(true)
    setLevelComplete(false)
    setTransitionOpacity(0)
    audioRef.current.startMusic()
    showLevelIntro(game.current.level)
  }, [resetGame, game, showLevelIntro])

  const handleHighscoreSave = useCallback((name: string) => {
    const entry: HighscoreEntry = {
      name,
      score: game.current.score,
      level: game.current.level,
      date: new Date().toISOString().slice(0, 10),
    }
    const updated = insertHighscore(entry, highscores)
    setHighscores(updated)
    setShowNameEntry(false)
    setGameOver(true)
  }, [highscores, game])

  const handleVictoryContinue = useCallback(() => {
    setShowVictory(false)
    if (isHighscore(game.current.score, highscores)) {
      setShowNameEntry(true)
    } else {
      setGameOver(true)
    }
  }, [game, highscores])

  useEffect(() => {
    if (levelComplete) {
      const isFinalLevel = game.current.level >= 7
      let op = 0
      const fadeIn = setInterval(() => {
        op += 0.04
        if (op >= 1) {
          op = 1
          setTransitionOpacity(1)
          clearInterval(fadeIn)
          transitionTimerRef.current = setTimeout(() => {
            if (isFinalLevel) {
              setLevelComplete(false)
              setTransitionOpacity(0)
              setShowVictory(true)
            } else {
              handleNextLevel()
            }
          }, 1200)
        } else {
          setTransitionOpacity(op)
        }
      }, 16)
      return () => {
        clearInterval(fadeIn)
        if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
      }
    }
  }, [levelComplete, handleNextLevel, game, highscores])

  function GameLoop() {
    useFrame((_, delta) => {
      if (!game.current.started) return
      const dt = Math.min(delta * 60, 3)
      const event = update(dt, input.current)

      if (event && event !== lastEventRef.current) {
        switch (event) {
          case 'stomp':
            audioRef.current.playStomp()
            break
          case 'enemyKill':
            audioRef.current.playEnemyHit()
            break
          case 'hit':
            audioRef.current.playBump()
            break
          case 'death':
            audioRef.current.playDeath()
            break
          case 'levelComplete':
            audioRef.current.playLevelComplete()
            audioRef.current.stopMusic()
            setLevelComplete(true)
            break
          case 'bossHit':
            audioRef.current.playBossHit()
            break
          case 'bossDefeat':
            audioRef.current.playBossDefeat()
            break
          case 'shurikenThrow':
            audioRef.current.playShurikenThrow()
            break
        }
        lastEventRef.current = event
      }

      if (event === undefined) {
        lastEventRef.current = ''
      }

      const pending = game.current.pendingEvents
      while (pending.length > 0) {
        const evt = pending.shift()!
        switch (evt) {
          case 'doubleJump':
            audioRef.current.playDoubleJump()
            break
          case 'powerUp':
            audioRef.current.playPowerUp()
            break
          case 'starPower':
            audioRef.current.playStarPower()
            break
          case 'gameOver':
            audioRef.current.playGameOver()
            if (isHighscore(game.current.score, highscores)) {
              setShowNameEntry(true)
            } else {
              setGameOver(true)
            }
            break
          case 'bossDefeatDone':
            setBossFlash(true)
            setTimeout(() => setBossFlash(false), 300)
            break
          case 'fireball':
            audioRef.current.playFireball()
            break
          case 'combo':
            audioRef.current.playCombo()
            break
          case 'coin':
            audioRef.current.playCoin()
            break
        }
      }
    })

    return null
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative">
      {!started && <StartScreen onStart={handleStart} highscores={highscores} />}

      <Canvas
        shadows
        camera={{ position: [0, 3, 12], fov: 50, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
        style={{ touchAction: 'none' }}
      >
        <color attach="background" args={['#b8d8f8']} />

        <CameraController player={player} game={game} />
        <GameLoop />
        <Environment />
        <FlagPole />

        <Player player={player} />

        {platforms.current.map((plat, i) => (
          <PlatformMesh key={`plat-${i}`} platform={plat} />
        ))}

        {rollingStones.current.filter(s => s.active).map((stone) => (
          <RollingStoneMesh key={`stone-${stone.id}`} stone={stone} />
        ))}

        {enemies.current.map((enemy) => (
          <EnemyMesh key={`enemy-${enemy.id}`} enemy={enemy} />
        ))}

        {coins.current.map((coin) => (
          <CoinMesh key={`coin-${coin.id}`} coin={coin} />
        ))}

        {powerUps.current.map((pu) => (
          <PowerUpMesh key={`pu-${pu.id}`} powerUp={pu} />
        ))}

        {bosses.current.filter(b => b.active && b.alive).map((boss) => {
          if (boss.bossType === 'golem') {
            return <BossGolem key={`boss-${boss.id}`} boss={boss} />
          } else if (boss.bossType === 'storm') {
            return <BossStorm key={`boss-${boss.id}`} boss={boss} />
          } else if (boss.bossType === 'shadow') {
            return <BossShadow key={`boss-${boss.id}`} boss={boss} />
          } else {
            return <BossNinja key={`boss-${boss.id}`} boss={boss} />
          }
        })}

        <ProjectileSystem shurikens={shurikens} fireballs={fireballs} arrows={arrows} />

        <ParticleSystem particles={particles} />
      </Canvas>

      <HUD game={game} bosses={bosses} onRestart={handleRestart} onNextLevel={handleNextLevel} onResume={handleResume} started={started} gameOver={gameOver} levelComplete={levelComplete} paused={paused} highscores={highscores} onHighscoreSave={handleHighscoreSave} showNameEntry={showNameEntry} showVictory={showVictory} onVictoryContinue={handleVictoryContinue} />
      <TouchControls setButton={setButton} onPause={handlePause} started={started} />

      {transitionOpacity > 0 && (
        <div
          className="fixed inset-0 z-[60] pointer-events-none"
          style={{
            background: `rgba(0,0,0,${transitionOpacity})`,
          }}
        />
      )}

      {levelIntro && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center pointer-events-none animate-fadeIn">
          <div className="text-center bg-black/60 backdrop-blur-sm rounded-2xl px-10 py-8 max-w-xl mx-4 border border-white/10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-widest drop-shadow-lg">{levelIntro.title}</h2>
            <p className="text-xl md:text-2xl text-yellow-300 font-bold tracking-wide mb-4">{levelIntro.subtitle}</p>
            {levelIntro.story && (
              <p className="text-sm md:text-base text-white/80 leading-relaxed italic">{levelIntro.story}</p>
            )}
          </div>
        </div>
      )}

      {bossFlash && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'white',
            opacity: 0.6,
            pointerEvents: 'none',
            animation: 'fadeOut 0.3s ease-out forwards',
          }}
        />
      )}
    </div>
  )
}
