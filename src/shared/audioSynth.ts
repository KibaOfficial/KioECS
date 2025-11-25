// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Generate synthesized sound effects using Web Audio API
 * No external sound files needed!
 */

export function generateShootSound(context: AudioContext): AudioBuffer {
  const sampleRate = context.sampleRate;
  const duration = 0.15; // 150ms
  const buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  // Laser/pew sound: quick frequency sweep
  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    const freq = 800 - (t * 4000); // Sweep from 800Hz to lower
    const envelope = Math.exp(-t * 20); // Quick decay
    data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
  }

  return buffer;
}

export function generateHitSound(context: AudioContext): AudioBuffer {
  const sampleRate = context.sampleRate;
  const duration = 0.2; // 200ms
  const buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  // Impact sound: noise burst with quick decay
  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 15);
    const noise = (Math.random() * 2 - 1) * envelope;
    const tone = Math.sin(2 * Math.PI * 150 * t) * envelope;
    data[i] = (noise * 0.5 + tone * 0.5) * 0.4;
  }

  return buffer;
}

export function generateHurtSound(context: AudioContext): AudioBuffer {
  const sampleRate = context.sampleRate;
  const duration = 0.25; // 250ms
  const buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  // Hurt sound: descending tone with vibrato
  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    const freq = 400 - (t * 600); // Descend from 400Hz
    const vibrato = Math.sin(2 * Math.PI * 8 * t) * 20; // 8Hz vibrato
    const envelope = Math.exp(-t * 8);
    data[i] = Math.sin(2 * Math.PI * (freq + vibrato) * t) * envelope * 0.3;
  }

  return buffer;
}
