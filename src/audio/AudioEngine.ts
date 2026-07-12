export class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private musicGain: GainNode | null = null
  private sfxGain: GainNode | null = null
  private musicPlaying = false
  private musicInterval: ReturnType<typeof setInterval> | null = null
  private currentBeat = 0
  private bpm = 170
  private barIndex = 0
  private sectionIndex = 0

  init() {
    if (this.ctx) return
    this.ctx = new AudioContext()
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0.5
    this.masterGain.connect(this.ctx.destination)

    this.musicGain = this.ctx.createGain()
    this.musicGain.gain.value = 0.35
    this.musicGain.connect(this.masterGain)

    this.sfxGain = this.ctx.createGain()
    this.sfxGain.gain.value = 0.55
    this.sfxGain.connect(this.masterGain)
  }

  resume() {
    this.ctx?.resume()
  }

  private getCtx(): AudioContext {
    if (!this.ctx) throw new Error('Audio not initialized')
    return this.ctx
  }

  private createOsc(type: OscillatorType, freq: number, duration: number, gain: GainNode, detune = 0) {
    const ctx = this.getCtx()
    const osc = ctx.createOscillator()
    osc.type = type
    osc.frequency.value = freq
    osc.detune.value = detune
    osc.connect(gain)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
    return osc
  }

  private createNoise(duration: number, gain: GainNode, filterFreq = 4000) {
    const ctx = this.getCtx()
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = filterFreq
    source.connect(filter)
    filter.connect(gain)
    source.start(ctx.currentTime)
    return source
  }

  playJump() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.3, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)
  }

  playCoin() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    const osc1 = ctx.createOscillator()
    osc1.type = 'square'
    osc1.frequency.value = 988
    const osc2 = ctx.createOscillator()
    osc2.type = 'square'
    osc2.frequency.value = 1319
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.25, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    osc1.connect(g)
    osc2.connect(g)
    g.connect(this.sfxGain)
    osc1.start(ctx.currentTime)
    osc1.stop(ctx.currentTime + 0.1)
    osc2.start(ctx.currentTime + 0.1)
    osc2.stop(ctx.currentTime + 0.3)
  }

  playStomp() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    this.createNoise(0.15, this.sfxGain, 2000)
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.35, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
  }

  playPowerUp() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    const notes = [523, 659, 784, 1047, 1319]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.08)
      g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.08 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.15)
      osc.connect(g)
      g.connect(this.sfxGain!)
      osc.start(ctx.currentTime + i * 0.08)
      osc.stop(ctx.currentTime + i * 0.08 + 0.15)
    })
  }

  playDeath() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.8)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.35, ctx.currentTime)
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.8)
  }

  playBump() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    this.createNoise(0.08, this.sfxGain, 3000)
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(150, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.3, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.1)
  }

  playBreak() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    this.createNoise(0.25, this.sfxGain, 5000)
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(120, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.3, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.25)
  }

  playLevelComplete() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    const melody = [523, 659, 784, 1047, 784, 1047, 1319, 1568]
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.value = freq
      const g = ctx.createGain()
      const start = ctx.currentTime + i * 0.12
      g.gain.setValueAtTime(0, start)
      g.gain.linearRampToValueAtTime(0.2, start + 0.02)
      g.gain.exponentialRampToValueAtTime(0.01, start + 0.2)
      osc.connect(g)
      g.connect(this.sfxGain!)
      osc.start(start)
      osc.stop(start + 0.2)
    })
  }

  playEnemyHit() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    this.createNoise(0.1, this.sfxGain, 6000)
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(500, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.12)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.25, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.12)
  }

  playBossHit() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    this.createNoise(0.2, this.sfxGain, 4000)
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.25)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.4, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.25)
  }

  playBossDefeat() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    const notes = [440, 554, 659, 880, 1109, 1319, 1760]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = freq
      const g = ctx.createGain()
      const start = ctx.currentTime + i * 0.1
      g.gain.setValueAtTime(0, start)
      g.gain.linearRampToValueAtTime(0.25, start + 0.03)
      g.gain.exponentialRampToValueAtTime(0.01, start + 0.25)
      osc.connect(g)
      g.connect(this.sfxGain!)
      osc.start(start)
      osc.stop(start + 0.25)
    })
    this.createNoise(0.6, this.sfxGain, 3000)
  }

  playStarPower() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    const notes = [523, 784, 1047, 1568, 2093]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      const g = ctx.createGain()
      const start = ctx.currentTime + i * 0.06
      g.gain.setValueAtTime(0, start)
      g.gain.linearRampToValueAtTime(0.15, start + 0.02)
      g.gain.exponentialRampToValueAtTime(0.01, start + 0.2)
      osc.connect(g)
      g.connect(this.sfxGain!)
      osc.start(start)
      osc.stop(start + 0.2)
    })
  }

  playShurikenThrow() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.2, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.12)
  }

  playFireball() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.08)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.2)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.15, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)
  }

  playCombo() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    const notes = [523, 659, 784]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.value = freq
      const g = ctx.createGain()
      const start = ctx.currentTime + i * 0.06
      g.gain.setValueAtTime(0.12, start)
      g.gain.exponentialRampToValueAtTime(0.01, start + 0.12)
      osc.connect(g)
      g.connect(this.sfxGain!)
      osc.start(start)
      osc.stop(start + 0.12)
    })
  }

  playGameOver() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    const melody = [440, 392, 330, 262, 220, 175]
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.value = freq
      const g = ctx.createGain()
      const start = ctx.currentTime + i * 0.2
      g.gain.setValueAtTime(0, start)
      g.gain.linearRampToValueAtTime(0.2, start + 0.02)
      g.gain.exponentialRampToValueAtTime(0.01, start + 0.35)
      osc.connect(g)
      g.connect(this.sfxGain!)
      osc.start(start)
      osc.stop(start + 0.35)
    })
  }

  playDoubleJump() {
    const ctx = this.getCtx()
    if (!this.sfxGain) return
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(500, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.1)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.2, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.12)
  }

  startMusic() {
    if (this.musicPlaying) return
    this.init()
    this.musicPlaying = true
    this.currentBeat = 0
    this.barIndex = 0
    this.sectionIndex = 0

    const beatDuration = 60000 / this.bpm

    this.musicInterval = setInterval(() => {
      this.playBeat(this.currentBeat)
      this.currentBeat++
      if (this.currentBeat % 16 === 0) {
        this.barIndex++
        if (this.barIndex % 4 === 0) {
          this.sectionIndex++
        }
      }
      this.currentBeat = this.currentBeat % 16
    }, beatDuration / 2)
  }

  stopMusic() {
    this.musicPlaying = false
    if (this.musicInterval) {
      clearInterval(this.musicInterval)
      this.musicInterval = null
    }
  }

  private playBeat(beat: number) {
    const ctx = this.getCtx()
    if (!this.musicGain) return
    const t = ctx.currentTime

    const section = this.sectionIndex % 4
    const isBreakdown = section === 3

    this.playKick(t, beat, isBreakdown)
    this.playSnare(t, beat, isBreakdown)
    this.playHiHat(t, beat, isBreakdown)
    this.playBassRiff(t, beat, isBreakdown)

    if (beat % 4 === 0 || (isBreakdown && beat % 2 === 0)) {
      this.playLeadSynth(t, beat, isBreakdown)
    }
    if (beat === 0 || beat === 6 || (isBreakdown && beat % 4 === 2)) {
      this.playPowerChord(t, beat, isBreakdown)
    }
    if (!isBreakdown && beat % 8 === 7) {
      this.playDrumFill(t)
    }
  }

  private playKick(t: number, beat: number, isBreakdown: boolean) {
    const ctx = this.getCtx()
    if (!this.musicGain) return

    const kickPatterns = [
      [1,0,1,0,1,0,1,1, 1,0,1,1,0,1,1,0],
      [1,0,1,0,1,0,1,1, 1,0,1,0,1,0,1,1],
      [1,1,0,1,1,0,1,0, 1,1,0,1,1,0,1,1],
      [1,0,0,1,0,0,1,0, 1,0,0,1,0,0,1,0],
    ]
    const pattern = isBreakdown ? kickPatterns[3] : kickPatterns[this.barIndex % 3]
    if (!pattern[beat]) return

    const freq = isBreakdown ? 100 : 150
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.1)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.6, t)
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.1)
    osc.connect(g)
    g.connect(this.musicGain)
    osc.start(t)
    osc.stop(t + 0.1)

    if (pattern[beat] && !isBreakdown) {
      const click = ctx.createOscillator()
      click.type = 'square'
      click.frequency.value = 800
      const gc = ctx.createGain()
      gc.gain.setValueAtTime(0.12, t)
      gc.gain.exponentialRampToValueAtTime(0.01, t + 0.015)
      click.connect(gc)
      gc.connect(this.musicGain)
      click.start(t)
      click.stop(t + 0.02)
    }
  }

  private playSnare(t: number, beat: number, isBreakdown: boolean) {
    const ctx = this.getCtx()
    if (!this.musicGain) return

    const isSnare = isBreakdown ? (beat === 4 || beat === 12) : (beat % 2 === 1)
    if (!isSnare) return

    const dur = isBreakdown ? 0.2 : 0.12
    const bufferSize = ctx.sampleRate * dur
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 1200
    const g = ctx.createGain()
    g.gain.setValueAtTime(isBreakdown ? 0.35 : 0.28, t)
    g.gain.exponentialRampToValueAtTime(0.01, t + dur)
    source.connect(filter)
    filter.connect(g)
    g.connect(this.musicGain)
    source.start(t)

    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(220, t)
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.04)
    const g2 = ctx.createGain()
    g2.gain.setValueAtTime(isBreakdown ? 0.3 : 0.22, t)
    g2.gain.exponentialRampToValueAtTime(0.01, t + 0.04)
    osc.connect(g2)
    g2.connect(this.musicGain)
    osc.start(t)
    osc.stop(t + 0.05)
  }

  private playHiHat(t: number, beat: number, isBreakdown: boolean) {
    const ctx = this.getCtx()
    if (!this.musicGain) return

    const isOpen = beat % 4 === 3
    const dur = isOpen ? 0.06 : 0.02
    const vol = isBreakdown ? (isOpen ? 0.06 : 0.03) : (isOpen ? 0.1 : 0.06)

    const bufferSize = ctx.sampleRate * dur
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 8000
    const g = ctx.createGain()
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + dur)
    source.connect(filter)
    filter.connect(g)
    g.connect(this.musicGain)
    source.start(t)
  }

  private playDrumFill(t: number) {
    const ctx = this.getCtx()
    if (!this.musicGain) return

    for (let i = 0; i < 4; i++) {
      const offset = i * 0.035
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(200 - i * 30, t + offset)
      osc.frequency.exponentialRampToValueAtTime(40, t + offset + 0.035)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.25, t + offset)
      g.gain.exponentialRampToValueAtTime(0.01, t + offset + 0.035)
      osc.connect(g)
      g.connect(this.musicGain)
      osc.start(t + offset)
      osc.stop(t + offset + 0.04)
    }

    const bufLen = ctx.sampleRate * 0.12
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = 3000
    f.Q.value = 2
    const g2 = ctx.createGain()
    g2.gain.setValueAtTime(0.15, t)
    g2.gain.exponentialRampToValueAtTime(0.01, t + 0.12)
    src.connect(f)
    f.connect(g2)
    g2.connect(this.musicGain)
    src.start(t)
  }

  private playBassRiff(t: number, beat: number, isBreakdown: boolean) {
    const ctx = this.getCtx()
    if (!this.musicGain) return

    // Phrygian mode - darker, more metal
    const phrygianRiffs = [
      // Chug pattern A - palm-muted tremolo
      [55,55,0,55, 55,55,0,55, 55,0,55,55, 55,55,55,0],
      // Phrygian descent
      [55,0,52,0, 49,0,52,0, 55,0,52,0, 49,52,55,0],
      // Gallop
      [55,55,55,0, 55,55,55,0, 52,52,52,0, 49,49,49,0],
      // Heavy chug with drop D feel
      [41,0,41,41, 0,41,0,41, 41,41,0,41, 0,41,41,41],
      // Alternate picking pattern
      [55,0,55,0, 66,0,55,0, 55,0,55,0, 49,0,55,0],
    ]

    const riffIdx = isBreakdown ? 3 : this.barIndex % 4
    const riff = phrygianRiffs[riffIdx]
    const note = riff[beat]
    if (note === 0) return

    const noteDur = isBreakdown ? 0.2 : 0.09

    const osc1 = ctx.createOscillator()
    osc1.type = 'sawtooth'
    osc1.frequency.value = note

    const osc2 = ctx.createOscillator()
    osc2.type = 'sawtooth'
    osc2.frequency.value = note * 1.003
    osc2.detune.value = isBreakdown ? 30 : 18

    const osc3 = ctx.createOscillator()
    osc3.type = 'square'
    osc3.frequency.value = note * 0.5
    osc3.detune.value = -10

    const dist = ctx.createWaveShaper()
    const curve = new Float32Array(256)
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1
      curve[i] = Math.tanh(x * (isBreakdown ? 6 : 4))
    }
    dist.curve = curve

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = isBreakdown ? 300 : 500
    filter.Q.value = isBreakdown ? 8 : 4

    const g = ctx.createGain()
    g.gain.setValueAtTime(isBreakdown ? 0.22 : 0.17, t)
    g.gain.exponentialRampToValueAtTime(isBreakdown ? 0.15 : 0.08, t + noteDur)

    osc1.connect(dist)
    osc2.connect(dist)
    osc3.connect(dist)
    dist.connect(filter)
    filter.connect(g)
    g.connect(this.musicGain)

    osc1.start(t)
    osc1.stop(t + noteDur + 0.01)
    osc2.start(t)
    osc2.stop(t + noteDur + 0.01)
    osc3.start(t)
    osc3.stop(t + noteDur + 0.01)
  }

  private playLeadSynth(t: number, beat: number, isBreakdown: boolean) {
    const ctx = this.getCtx()
    if (!this.musicGain) return

    // Phrygian dominant melodies - darker, more aggressive
    const darkMelodies = [
      [440,0,0,523, 0,0,440,0, 392,0,0,440, 0,0,330,0],
      [523,0,523,0, 440,0,392,0, 330,0,392,0, 440,0,523,0],
      [660,0,523,0, 440,0,523,0, 660,0,0,660, 523,0,440,0],
      [330,330,0,440, 0,523,0,0, 440,440,0,392, 0,330,0,0],
    ]

    const melody = isBreakdown ? darkMelodies[3] : darkMelodies[this.barIndex % 3]
    const freq = melody[beat]
    if (freq === 0) return

    const dur = isBreakdown ? 0.3 : 0.15
    const vol = isBreakdown ? 0.1 : 0.09

    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = freq

    const osc2 = ctx.createOscillator()
    osc2.type = 'square'
    osc2.frequency.value = freq * 1.007

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(isBreakdown ? 2000 : 4000, t)
    filter.frequency.exponentialRampToValueAtTime(isBreakdown ? 600 : 1200, t + dur)
    filter.Q.value = isBreakdown ? 12 : 6

    const g = ctx.createGain()
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + dur)

    osc.connect(filter)
    osc2.connect(filter)
    filter.connect(g)
    g.connect(this.musicGain)

    osc.start(t)
    osc.stop(t + dur + 0.01)
    osc2.start(t)
    osc2.stop(t + dur + 0.01)
  }

  private playPowerChord(t: number, beat: number, isBreakdown: boolean) {
    const ctx = this.getCtx()
    if (!this.musicGain) return
    const mg = this.musicGain

    // Darker chord progressions - Phrygian feel
    const chordSets = [
      [[110,165,220], [104,156,208], [98,147,196], [110,165,220]],
      [[131,196,262], [123,185,247], [110,165,220], [131,196,262]],
    ]

    const chordGroup = chordSets[this.barIndex % 2]
    const chord = chordGroup[(this.barIndex + (isBreakdown ? 2 : 0)) % chordGroup.length]

    const dur = isBreakdown ? 0.35 : 0.16
    const vol = isBreakdown ? 0.1 : 0.07

    chord.forEach((freq) => {
      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = freq

      const osc2 = ctx.createOscillator()
      osc2.type = 'sawtooth'
      osc2.frequency.value = freq
      osc2.detune.value = isBreakdown ? 35 : 22

      const dist = ctx.createWaveShaper()
      const curve = new Float32Array(256)
      for (let i = 0; i < 256; i++) {
        const x = (i * 2) / 256 - 1
        curve[i] = Math.tanh(x * (isBreakdown ? 8 : 5))
      }
      dist.curve = curve

      const g = ctx.createGain()
      g.gain.setValueAtTime(vol, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + dur)

      osc.connect(dist)
      osc2.connect(dist)
      dist.connect(g)
      g.connect(mg)

      osc.start(t)
      osc.stop(t + dur + 0.01)
      osc2.start(t)
      osc2.stop(t + dur + 0.01)
    })
  }

  setMusicVolume(vol: number) {
    if (this.musicGain) {
      this.musicGain.gain.value = vol
    }
  }

  setSfxVolume(vol: number) {
    if (this.sfxGain) {
      this.sfxGain.gain.value = vol
    }
  }

  destroy() {
    this.stopMusic()
    this.ctx?.close()
    this.ctx = null
  }
}

let engineInstance: AudioEngine | null = null

export function getAudioEngine(): AudioEngine {
  if (!engineInstance) {
    engineInstance = new AudioEngine()
  }
  return engineInstance
}
