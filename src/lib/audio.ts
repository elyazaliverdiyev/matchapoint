// Web Audio API generator for Matcha Point acoustic notifications
// Generates warm, crystalline zen bell sounds without external mp3 files

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioCtx = new AudioContextClass()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Plays a soft, crystalline Japanese tea bell chime (Order Ready Notification)
 */
export function playOrderReadySound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // Two harmonics for a warm singing-bowl / chime sensation (E5 and B5)
    const freqs = [659.25, 987.77, 1318.51]

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      // Soft attack and slow organic decay
      const startTime = now + idx * 0.08
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(0.25 / (idx + 1), startTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.2)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(startTime)
      osc.stop(startTime + 2.3)
    })
  } catch (e) {
    console.warn('Audio not allowed or supported', e)
  }
}

/**
 * Plays a subtle tactile tap confirmation sound (Added to cart / status change)
 */
export function playTapSound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.09)
  } catch (e) {
    // silently ignore
  }
}
