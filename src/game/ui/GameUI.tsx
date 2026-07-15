'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import type { GameState, Boss } from '@/types/game'
import type { AudioEngine } from '@/audio/AudioEngine'
import { type HighscoreEntry } from '@/game/highscore'

export function VictoryScreen({ score, coins, lives, time, onContinue }: {
  score: number
  coins: number
  lives: number
  time: number
  onContinue: () => void
}) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2400),
      setTimeout(() => setPhase(4), 3800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-auto overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, rgba(30,0,60,0.95) 0%, rgba(0,0,0,0.98) 70%)' }}>

      {/* Animated stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="absolute rounded-full animate-pulse"
            style={{
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
              backgroundColor: i % 5 === 0 ? '#ffd700' : i % 3 === 0 ? '#aa88ff' : '#ffffff',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              opacity: 0.4 + Math.random() * 0.6,
            }}
          />
        ))}
      </div>

      {/* Radial golden glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(255,200,0,0.12) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 text-center max-w-2xl px-4">
        {/* Phase 1: Blade icon */}
        <div className={`transition-all duration-1000 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-6xl md:text-8xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>⚔️</div>
        </div>

        {/* Phase 1: VICTORY title */}
        <div className={`transition-all duration-1000 delay-300 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <h1 className="text-6xl md:text-9xl font-black mb-2 tracking-widest"
            style={{
              background: 'linear-gradient(to bottom, #ffd700 0%, #ff8800 50%, #ff4400 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(255,170,0,0.6)) drop-shadow(0 0 60px rgba(255,100,0,0.3))',
            }}>
            VICTORY
          </h1>
        </div>

        {/* Phase 2: Subtitle */}
        <div className={`transition-all duration-1000 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-xl md:text-3xl text-yellow-300 font-bold tracking-widest mb-6"
            style={{ textShadow: '0 0 20px rgba(255,200,0,0.5)' }}>
            THE SHADOW MASTER HAS BEEN DEFEATED
          </h2>
        </div>

        {/* Phase 2: Story conclusion */}
        <div className={`transition-all duration-1000 delay-200 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="text-white/80 text-sm md:text-base mb-6 space-y-2 italic max-w-lg mx-auto">
            <p>The Shadow Blade hums in Fang's grip, finally at peace. The darkness shatters like glass,</p>
            <p>and light floods back into the realm for the first time in a generation.</p>
            <p className="text-yellow-300/90 mt-3 not-italic font-semibold">
              Fang sheathes the blade, picks up his mug from the rubble, and walks into the sunrise.
            </p>
            <p className="text-white/50 text-xs mt-2 not-italic">
              "Same time next week?" asks the Narrator.<br/>
              "Absolutely not," says Fang, already planning the next adventure.
            </p>
          </div>
        </div>

        {/* Phase 3: Stats */}
        <div className={`transition-all duration-1000 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-md mx-auto">
            <div className="bg-black/40 rounded-xl p-3 border border-yellow-500/20">
              <div className="text-yellow-400 text-xs font-bold tracking-wider">SCORE</div>
              <div className="text-white text-xl font-black">{String(score).padStart(6, '0')}</div>
            </div>
            <div className="bg-black/40 rounded-xl p-3 border border-yellow-500/20">
              <div className="text-yellow-400 text-xs font-bold tracking-wider">COINS</div>
              <div className="text-yellow-300 text-xl font-black">×{coins}</div>
            </div>
            <div className="bg-black/40 rounded-xl p-3 border border-yellow-500/20">
              <div className="text-yellow-400 text-xs font-bold tracking-wider">TIME BONUS</div>
              <div className="text-green-400 text-xl font-black">+{Math.floor(time * 10)}</div>
            </div>
            <div className="bg-black/40 rounded-xl p-3 border border-yellow-500/20">
              <div className="text-yellow-400 text-xs font-bold tracking-wider">LIVES</div>
              <div className="text-green-400 text-xl font-black">×{lives}</div>
            </div>
          </div>
          <div className="text-yellow-400 text-2xl font-black mb-2">
            FINAL SCORE: {String(score + Math.floor(time * 10)).padStart(6, '0')}
          </div>
        </div>

        {/* Phase 4: Continue button */}
        <div className={`transition-all duration-1000 ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={onContinue}
            className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black text-xl font-black rounded-xl transition-all active:scale-95 shadow-xl shadow-yellow-500/30 border-2 border-yellow-300/50 tracking-wider"
          >
            CLAIM YOUR GLORY
          </button>
          <p className="text-white/40 text-xs mt-3 italic">"Best mug in the realm. Don't tell anyone." — Fang</p>
        </div>
      </div>
    </div>
  )
}

export function HUD({
  game,
  bosses,
  onRestart,
  onNextLevel,
  onResume,
  started,
  gameOver,
  levelComplete,
  paused,
  highscores,
  onHighscoreSave,
  showNameEntry,
  showVictory,
  onVictoryContinue,
}: {
  game: React.RefObject<GameState>
  bosses: React.RefObject<Boss[]>
  onRestart: () => void
  onNextLevel: () => void
  onResume: () => void
  started: boolean
  gameOver: boolean
  levelComplete: boolean
  paused: boolean
  highscores: HighscoreEntry[]
  onHighscoreSave: (name: string) => void
  showNameEntry: boolean
  showVictory: boolean
  onVictoryContinue: () => void
}) {
  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(0)
  const [world, setWorld] = useState('1-1')
  const [time, setTime] = useState(0)
  const [lives, setLives] = useState(3)
  const [combo, setCombo] = useState(0)
  const [activeBoss, setActiveBoss] = useState<Boss | null>(null)

  useEffect(() => {
    let raf: number
    const worlds: Record<number, string> = { 1: '1-1', 2: '1-2', 3: '2-1', 4: '2-2', 5: '3-1', 6: '3-2', 7: '4-1' }
    let prevScore = 0, prevCoins = 0, prevLives = 3, prevCombo = 0, prevTime = 0, prevWorld = '1-1'
    let prevBossHp = -1
    const tick = () => {
      const g = game.current
      if (g.score !== prevScore) { prevScore = g.score; setScore(g.score) }
      if (g.coins !== prevCoins) { prevCoins = g.coins; setCoins(g.coins) }
      if (g.lives !== prevLives) { prevLives = g.lives; setLives(g.lives) }
      if (g.combo !== prevCombo) { prevCombo = g.combo; setCombo(g.combo) }
      if (Math.floor(g.time) !== prevTime) { prevTime = Math.floor(g.time); setTime(prevTime) }
      const w = worlds[g.level] || '1-1'
      if (w !== prevWorld) { prevWorld = w; setWorld(w) }
      const boss = bosses.current.find(b => b.active && b.alive && !b.defeated) || null
      const bhp = boss ? boss.health : -1
      if (bhp !== prevBossHp) { prevBossHp = bhp; setActiveBoss(boss) }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [game, bosses])

  if (!started) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex justify-between items-center px-4 py-2 bg-black/60 backdrop-blur-sm">
        <div className="text-white font-bold text-sm md:text-lg">
          <span className="text-yellow-400">SCORE</span>
          <br />
          <span className="text-white">{String(score).padStart(6, '0')}</span>
        </div>
        <div className="text-white font-bold text-sm md:text-lg">
          <span className="text-yellow-400">COINS</span>
          <br />
          <span className="text-yellow-300">×{String(coins).padStart(2, '0')}</span>
        </div>
        <div className="text-white font-bold text-sm md:text-lg">
          <span className="text-yellow-400">WORLD</span>
          <br />
          <span>{world}</span>
        </div>
        <div className="text-white font-bold text-sm md:text-lg">
          <span className="text-yellow-400">TIME</span>
          <br />
          <span className={time < 60 ? 'text-red-400' : 'text-white'}>{time}</span>
        </div>
        <div className="text-white font-bold text-sm md:text-lg">
          <span className="text-yellow-400">LIVES</span>
          <br />
          <span className="text-green-400">×{lives}</span>
        </div>
        {combo > 1 && (
          <div className="text-white font-bold text-sm md:text-lg animate-pulse">
            <span className="text-orange-400">COMBO</span>
            <br />
            <span className="text-orange-300">×{combo}</span>
          </div>
        )}
      </div>

      {/* Boss Health Bar */}
      {activeBoss && (
        <div className="flex flex-col items-center mt-1">
          <div className="text-xs font-bold mb-1" style={{ color: activeBoss.colorScheme.glow }}>
            {activeBoss.name} - {activeBoss.title}
          </div>
          <div className="w-48 md:w-64 h-4 bg-gray-900/80 rounded-full border border-white/20 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(activeBoss.health / activeBoss.maxHealth) * 100}%`,
                background: `linear-gradient(to right, ${activeBoss.colorScheme.accent}, ${activeBoss.colorScheme.glow})`,
                boxShadow: `0 0 10px ${activeBoss.colorScheme.glow}`,
              }}
            />
          </div>
          <div className="text-xs text-white/60 mt-0.5">
            {activeBoss.health}/{activeBoss.maxHealth}
          </div>
        </div>
      )}

      {(gameOver || levelComplete || showNameEntry) && !showVictory && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-auto" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="text-center bg-gradient-to-b from-purple-900/80 to-black/80 p-8 rounded-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
            {showNameEntry ? (
              <NameEntry score={score} level={game.current.level} onSubmit={onHighscoreSave} />
            ) : levelComplete ? (
              <>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">LEVEL COMPLETE!</h2>
                <p className="text-base text-white/60 italic mb-3">
                  {game.current.level === 1 && "Fang surveys the destruction. The meadows will never be the same. Probably fine."}
                  {game.current.level === 2 && "The storm passes. Fang wrings out his cape. It squelches ominously."}
                  {game.current.level === 3 && "Fresh air at last. Fang kisses the ground. It's slimy, but he doesn't care."}
                  {game.current.level === 4 && "He made it through the sky. The clouds tasted like defeat. Mostly the enemies'."}
                  {game.current.level === 5 && "The castle crumbles. Fang dusts off his cape. It's mostly ash at this point."}
                  {game.current.level === 6 && "The lava fortress falls. Fang is officially done with fire. And castles. And everything."}
                  {game.current.level >= 7 && "The Shadow Master has fallen. Fang retrieves the Shadow Blade. And his mug. Priorities."}
                </p>
                <p className="text-xl text-yellow-400 mb-1">SCORE: {String(score).padStart(6, '0')}</p>
                <p className="text-lg text-green-400 mb-2">TIME BONUS: +{time * 10}</p>
                {game.current.level >= 7 && (
                  <p className="text-sm text-yellow-200/70 italic mb-2">"Somebody get this man a vacation." — The Narrator</p>
                )}
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">GAME OVER</h2>
                <p className="text-base text-white/60 italic mb-3">
                  {lives <= 0
                    ? "Fang has run out of extra lives. And patience. Mostly patience."
                    : "Gravity: 1, Fang: 0. A tragic tale."}
                </p>
                <p className="text-xl text-yellow-400 mb-2">SCORE: {String(score).padStart(6, '0')}</p>
                <p className="text-sm text-white/40 italic mb-1">The Shadow Master laughs. This isn't over.</p>
              </>
            )}

            {highscores.length > 0 && (
              <div className="mt-4 bg-black/40 rounded-xl p-4 border border-white/10">
                <h3 className="text-yellow-400 font-bold text-lg mb-2">HIGHSCORES</h3>
                <HighscoreTable entries={highscores} />
              </div>
            )}

            {!showNameEntry && (
              <button
                onClick={onRestart}
                className="mt-4 px-8 py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-lg font-bold rounded-xl transition-all active:scale-95 shadow-xl"
              >
                {levelComplete && game.current.level >= 7 ? 'PLAY AGAIN' : levelComplete ? 'NEXT LEVEL' : 'TRY AGAIN'}
              </button>
            )}
          </div>
        </div>
      )}

      {showVictory && (
        <VictoryScreen
          score={game.current.score}
          coins={game.current.coins}
          lives={game.current.lives}
          time={game.current.time}
          onContinue={onVictoryContinue}
        />
      )}

      {paused && !gameOver && !levelComplete && !showVictory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 pointer-events-auto">
          <div className="text-center bg-gradient-to-b from-blue-900/80 to-black/80 p-8 rounded-2xl border border-white/10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">PAUSED</h2>
            <p className="text-sm text-white/50 italic mb-6">"Even ninjas need a breather." — Ancient Proverb (probably)</p>
            <button
              onClick={onResume}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white text-xl font-bold rounded-xl transition-all active:scale-95 shadow-xl"
            >
              RESUME
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function TouchControls({
  setButton,
  onPause,
  started
}: {
  setButton: (button: 'left' | 'right' | 'jump' | 'attack', pressed: boolean) => void
  onPause: () => void
  started: boolean
}) {
  const handleTouchStart = useCallback((button: 'left' | 'right' | 'jump' | 'attack') => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    setButton(button, true)
  }, [setButton])

  const handleTouchEnd = useCallback((button: 'left' | 'right' | 'jump' | 'attack') => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    setButton(button, false)
  }, [setButton])

  if (!started) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-8 flex justify-between items-end pointer-events-none">
      <div className="flex gap-3 pointer-events-auto">
        <button
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/15 border-2 border-white/30 active:bg-white/35 active:scale-90 flex items-center justify-center text-white text-2xl select-none backdrop-blur-sm transition-all shadow-lg"
          onTouchStart={handleTouchStart('left')}
          onTouchEnd={handleTouchEnd('left')}
          onMouseDown={handleTouchStart('left')}
          onMouseUp={handleTouchEnd('left')}
          onMouseLeave={handleTouchEnd('left')}
        >
          ◀
        </button>
        <button
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/15 border-2 border-white/30 active:bg-white/35 active:scale-90 flex items-center justify-center text-white text-2xl select-none backdrop-blur-sm transition-all shadow-lg"
          onTouchStart={handleTouchStart('right')}
          onTouchEnd={handleTouchEnd('right')}
          onMouseDown={handleTouchStart('right')}
          onMouseUp={handleTouchEnd('right')}
          onMouseLeave={handleTouchEnd('right')}
        >
          ▶
        </button>
      </div>

      <div className="flex gap-3 pointer-events-auto">
        <button
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 border border-white/25 active:bg-white/25 flex items-center justify-center text-white text-lg select-none backdrop-blur-sm"
          onClick={onPause}
        >
          ⏸
        </button>
        <button
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange-500/25 border-2 border-orange-400/50 active:bg-orange-500/45 active:scale-90 flex items-center justify-center text-white text-sm font-bold select-none backdrop-blur-sm transition-all shadow-lg shadow-orange-500/20"
          onTouchStart={handleTouchStart('attack')}
          onTouchEnd={handleTouchEnd('attack')}
          onMouseDown={handleTouchStart('attack')}
          onMouseUp={handleTouchEnd('attack')}
          onMouseLeave={handleTouchEnd('attack')}
        >
          🔥
        </button>
        <button
          className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-red-500/25 border-2 border-red-400/50 active:bg-red-500/45 active:scale-90 flex items-center justify-center text-white text-xl font-bold select-none backdrop-blur-sm transition-all shadow-lg shadow-red-500/20"
          onTouchStart={handleTouchStart('jump')}
          onTouchEnd={handleTouchEnd('jump')}
          onMouseDown={handleTouchStart('jump')}
          onMouseUp={handleTouchEnd('jump')}
          onMouseLeave={handleTouchEnd('jump')}
        >
          JUMP
        </button>
      </div>
    </div>
  )
}

export function HighscoreTable({ entries, highlight }: { entries: HighscoreEntry[]; highlight?: number }) {
  if (entries.length === 0) return <p className="text-white/40 text-sm">No highscores yet. Be the first!</p>
  return (
    <div className="w-full max-w-md">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-yellow-400 border-b border-white/20">
            <th className="py-1 text-left">#</th>
            <th className="py-1 text-left">NAME</th>
            <th className="py-1 text-right">SCORE</th>
            <th className="py-1 text-right">LVL</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr
              key={i}
              className={`border-b border-white/5 ${i === highlight ? 'text-yellow-300 font-bold' : 'text-white/80'}`}
            >
              <td className="py-0.5">{i + 1}.</td>
              <td className="py-0.5">{e.name}</td>
              <td className="py-0.5 text-right">{String(e.score).padStart(6, '0')}</td>
              <td className="py-0.5 text-right">{e.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function NameEntry({ score, level, onSubmit }: { score: number; level: number; onSubmit: (name: string) => void }) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    const trimmed = name.trim().slice(0, 12)
    if (trimmed.length > 0) onSubmit(trimmed)
  }

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-yellow-400 mb-1">NEW HIGHSCORE!</h3>
      <p className="text-white/60 text-sm italic mb-3">The Shadow Master acknowledges your skill. He's also terrified.</p>
      <p className="text-xl text-yellow-400 mb-1">SCORE: {String(score).padStart(6, '0')}</p>
      <p className="text-sm text-white/40 mb-4">Carved your name into legend, warrior.</p>
      <div className="flex gap-2 justify-center mb-4">
        <input
          ref={inputRef}
          type="text"
          maxLength={12}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          placeholder="YOUR NAME"
          className="px-4 py-2 bg-black/60 border border-white/30 rounded-lg text-white text-xl font-bold text-center w-48 focus:outline-none focus:border-yellow-400 placeholder:text-white/30"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={name.trim().length === 0}
        className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-500 hover:to-orange-400 disabled:from-gray-600 disabled:to-gray-500 disabled:opacity-50 text-white text-lg font-bold rounded-xl transition-all active:scale-95 shadow-xl"
      >
        ENTER LEGEND NAME
      </button>
    </div>
  )
}

export function StartScreen({ onStart, highscores }: { onStart: () => void; highscores: HighscoreEntry[] }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-gradient-to-b from-blue-900 via-purple-900 to-black">
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
              backgroundColor: `hsl(${Math.random() * 60 + 200}, 80%, 80%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl px-4">
        <h1 className="text-5xl md:text-8xl font-bold mb-2 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
          SHADOW
        </h1>
        <h1 className="text-5xl md:text-8xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
          FANG
        </h1>
        <h2 className="text-xl md:text-3xl text-red-300 font-bold mb-6 tracking-widest">
          RISE OF THE SHADOW BLADE
        </h2>

        <div className="text-5xl md:text-7xl mb-6 animate-bounce">🌀</div>

        <div className="text-white/70 text-sm md:text-base mb-6 italic max-w-lg mx-auto hidden md:block">
          <p>Once, the Shadow Dojo trained the most feared warriors in all the realm.</p>
          <p>But the Shadow Master betrayed his own students, stole the legendary Shadow Blade,</p>
          <p>and unleashed an army of chaos upon the land.</p>
          <p className="text-yellow-300/80 mt-2 not-italic font-semibold">Only one ninja escaped. His name... is <span className="text-yellow-400 not-italic">Fang</span>.</p>
          <p className="text-white/50 text-xs mt-1">(He also happens to be really, <em>really</em> angry about his broken favorite mug.)</p>
        </div>

        <div className="text-white/70 text-sm mb-4 italic max-w-xs mx-auto md:hidden">
          <p className="text-yellow-300/80 not-italic font-semibold">Only one ninja survived. His name... is <span className="text-yellow-400 not-italic">Fang</span>.</p>
          <p className="text-white/50 text-xs mt-1">(He's really angry about his favorite mug.)</p>
        </div>

        <button
          onClick={onStart}
          className="px-12 py-5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-2xl font-bold rounded-xl transition-all active:scale-95 shadow-xl shadow-red-500/30 border-2 border-white/20"
        >
          START GAME
        </button>

        <div className="mt-6 text-white/50 text-sm md:text-base space-y-1 hidden md:block">
          <p>🎮 Arrow Keys / WASD to move</p>
          <p>⬆️ Space / Up to jump (double jump!)</p>
          <p>🔥 Z / X to throw fireballs</p>
          <p>📱 Touch controls on mobile</p>
          <p>🎵 Heavy Metal Synth Soundtrack</p>
        </div>

        <div className="mt-4 text-white/50 text-xs space-y-0.5 md:hidden">
          <p>🎮 Move · Jump · Throw fireballs</p>
          <p>📱 Touch controls on mobile</p>
        </div>

        {highscores.length > 0 && (
          <div className="mt-6 bg-black/40 rounded-xl p-4 border border-white/10">
            <h3 className="text-yellow-400 font-bold text-lg mb-2">HIGHSCORES</h3>
            <HighscoreTable entries={highscores} />
          </div>
        )}
      </div>
    </div>
  )
}

export function CoinSoundTrigger({
  game,
  audio
}: {
  game: React.RefObject<GameState>
  audio: React.RefObject<AudioEngine>
}) {
  const prevCoinsRef = useRef<number>(0)

  useEffect(() => {
    let raf: number
    const tick = () => {
      const totalCoins = game.current.coins
      if (totalCoins > prevCoinsRef.current) {
        audio.current.playCoin()
      }
      prevCoinsRef.current = totalCoins
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [game, audio])

  return null
}
