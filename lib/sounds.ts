let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function playTaskCompleteSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.3);
    });
  } catch {
    // Audio not available
  }
}

export function playFanfareSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const chord = (freqs: number[], start: number, duration: number) => {
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      });
    };

    chord([261.63, 329.63, 392.0], now, 1.5);
    chord([293.66, 369.99, 440.0], now + 0.4, 1.5);
    chord([349.23, 440.0, 523.25], now + 0.8, 1.5);
    chord([392.0, 493.88, 587.33], now + 1.2, 2.0);
    chord([523.25, 659.25, 783.99], now + 1.6, 2.5);
  } catch {
    // Audio not available
  }
}
