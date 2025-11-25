// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { logger } from "../../shared/logger";
import { generateShootSound, generateHitSound, generateHurtSound } from "../../shared/audioSynth";

export class AudioResource {
  private context: AudioContext;
  private sounds: Map<string, AudioBuffer> = new Map();
  private gainNode: GainNode;

  constructor() {
    // AudioContext suspended until user interaction ;-;
    this.context = new AudioContext();
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.context.destination);

    // Resume context on first user interaction
    document.addEventListener("click", () => {
      if (this.context.state === "suspended") {
        this.context.resume();
      }
    }, { once: true });

    // Load synthesized sounds
    this.loadSynthesizedSounds();
  }

  private loadSynthesizedSounds(): void {
    // Generate sounds using Web Audio API - no files needed!
    this.sounds.set("shoot", generateShootSound(this.context));
    this.sounds.set("hit", generateHitSound(this.context));
    this.sounds.set("hurt", generateHurtSound(this.context));
    logger("info", "Synthesized sounds loaded: shoot, hit, hurt");
  }

  async loadSound(name: string, url: string): Promise<void> {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.sounds.set(name, audioBuffer);
    } catch (error) {
      logger("error", `Failed to load sound ${name} from ${url}: ${error}`);
    }
  }

  playSound(name: string, volume: number = 1.0): void {
    const buffer = this.sounds.get(name);
    if (!buffer) {
      logger("warn", `Sound not found: ${name}`);
      return;
    }

    // Create source (one-time use ;-;)
    const source = this.context.createBufferSource();
    source.buffer = buffer;

    // Create gain for this sound
    const soundGain = this.context.createGain();
    soundGain.gain.value = volume;

    // Connect: source → gain → master gain → destination
    source.connect(soundGain);
    soundGain.connect(this.gainNode);

    // Play (can only play once per source ;-;)
    source.start(0);
  }

  setMasterVolume(volume: number): void {
    this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
  }
}