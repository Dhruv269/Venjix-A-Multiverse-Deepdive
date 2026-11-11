"use client";

import { useSyncExternalStore } from "react";

/**
 * ============================================================================
 * VENJIX PROCEDURAL COSMIC AUDIO ENGINE (Web Audio API)
 * ============================================================================
 * Zero-dependency procedural soundscape synthesizer:
 * - Warm low-pass filtered ambient void drone (55Hz A1 fundamental + detuned 5th)
 *   whose cutoff frequency and harmonic shimmer smoothly track Reality RGB spectra.
 * - Crystalline orb hover harmonic pings (880Hz - 1320Hz exponential decay).
 * - Deep gravitational sweep on Dimensional Breach entry or Timeline Forge.
 * - Ultra-subtle telemetry tick pulses during Enigma text materialization.
 *
 * Strictly complies with browser autoplay policies:
 * `AudioContext` is NEVER created or resumed until an explicit user gesture
 * (clicking INITIATE DISCOVERY or clicking the Sound toggle pill).
 */

const SOUND_MUTED_PREF_KEY = "venjix_sound_muted_v1";

export interface CosmicAudioState {
  /** True only when unlocked via gesture AND unmuted */
  isActive: boolean;
  /** True if visitor explicitly silenced audio (or reduced-motion suppressed auto-start) */
  isMuted: boolean;
  /** True once Web Audio context has been constructed */
  isUnlocked: boolean;
  isReducedMotion: boolean;
}

const SERVER_SNAPSHOT: CosmicAudioState = {
  isActive: false,
  isMuted: true,
  isUnlocked: false,
  isReducedMotion: false,
};

type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: typeof AudioContext;
};

interface DroneNodes {
  fundamentalOsc: OscillatorNode;
  fifthOsc: OscillatorNode;
  octaveOsc: OscillatorNode;
  lfoOsc: OscillatorNode | null;
  lfoGain: GainNode | null;
  filter: BiquadFilterNode;
  droneGain: GainNode;
}

class CosmicAudioController {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private drone: DroneNodes | null = null;

  private isMuted = false;
  private hasExplicitMutePref = false;
  private isUnlocked = false;
  private isReducedMotion = false;
  private prefHydrated = false;

  private currentSpectrum: [number, number, number] = [0.52, 0.24, 0.95];
  private lastHoverAt = 0;
  private lastTickAt = 0;
  private hoverStep = 0;
  private tickStep = 0;

  private listeners = new Set<() => void>();
  private snapshot: CosmicAudioState = {
    isActive: false,
    isMuted: true,
    isUnlocked: false,
    isReducedMotion: false,
  };

  private hydratePreferencesIfNeeded(): void {
    if (this.prefHydrated || typeof window === "undefined") return;
    this.prefHydrated = true;

    try {
      this.isReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    } catch {
      this.isReducedMotion = false;
    }

    try {
      const stored = window.localStorage.getItem(SOUND_MUTED_PREF_KEY);
      if (stored === "true") {
        this.isMuted = true;
        this.hasExplicitMutePref = true;
      } else if (stored === "false") {
        this.isMuted = false;
        this.hasExplicitMutePref = true;
      } else if (this.isReducedMotion) {
        // Motion-sensitive users start silently unless they explicitly toggle sound on
        this.isMuted = true;
      }
    } catch {
      if (this.isReducedMotion) {
        this.isMuted = true;
      }
    }

    this.refreshSnapshot(false);
  }

  private refreshSnapshot(notify = true): void {
    const nextActive = this.isUnlocked && !this.isMuted;
    if (
      this.snapshot.isActive === nextActive &&
      this.snapshot.isMuted === !nextActive &&
      this.snapshot.isUnlocked === this.isUnlocked &&
      this.snapshot.isReducedMotion === this.isReducedMotion
    ) {
      return;
    }

    this.snapshot = {
      isActive: nextActive,
      isMuted: !nextActive,
      isUnlocked: this.isUnlocked,
      isReducedMotion: this.isReducedMotion,
    };

    if (notify) {
      this.listeners.forEach((listener) => listener());
    }
  }

  public subscribe = (listener: () => void): (() => void) => {
    this.hydratePreferencesIfNeeded();
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = (): CosmicAudioState => {
    this.hydratePreferencesIfNeeded();
    return this.snapshot;
  };

  public getServerSnapshot = (): CosmicAudioState => SERVER_SNAPSHOT;

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    this.hydratePreferencesIfNeeded();

    if (!this.ctx) {
      const AudioCtor =
        window.AudioContext ||
        (window as WindowWithWebkitAudio).webkitAudioContext;
      if (!AudioCtor) return null;

      try {
        this.ctx = new AudioCtor();
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(18, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.01, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.18, this.ctx.currentTime);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(
          this.isMuted ? 0 : 0.72,
          this.ctx.currentTime
        );

        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);
      } catch {
        this.ctx = null;
        this.masterGain = null;
        this.compressor = null;
        return null;
      }
    }

    return this.ctx;
  }

  private persistMutePreference(muted: boolean): void {
    try {
      window.localStorage.setItem(
        SOUND_MUTED_PREF_KEY,
        muted ? "true" : "false"
      );
    } catch {
      // Ignore restricted storage contexts
    }
  }

  private computeSpectrumParams(rgb: [number, number, number]): {
    cutoffHz: number;
    detuneCents: number;
  } {
    const [r, g, b] = rgb;
    const luminance = Math.max(0, Math.min(1, r * 0.28 + g * 0.44 + b * 0.28));
    const ceruleanTilt = Math.max(0, Math.min(1, g * 0.6 + b * 0.4 - r * 0.25));
    const cutoffHz = 195 + luminance * 210 + ceruleanTilt * 115;
    const detuneCents = 4 + (r - g) * 6;
    return {
      cutoffHz: Math.max(170, Math.min(540, cutoffHz)),
      detuneCents: Math.max(-8, Math.min(12, detuneCents)),
    };
  }

  /**
   * Called strictly from an explicit user interaction (e.g. clicking INITIATE DISCOVERY).
   * Respects explicit mute preference or reduced-motion silent default unless overridden.
   */
  public unlockFromGesture(forceUnmute = false): void {
    this.hydratePreferencesIfNeeded();

    if (forceUnmute) {
      this.isMuted = false;
      this.hasExplicitMutePref = true;
      this.persistMutePreference(false);
    } else if (this.hasExplicitMutePref && this.isMuted) {
      this.refreshSnapshot();
      return;
    } else if (this.isReducedMotion && !this.hasExplicitMutePref) {
      this.refreshSnapshot();
      return;
    } else {
      this.isMuted = false;
    }

    const ctx = this.ensureContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      void ctx.resume().catch(() => {
        // Context resume rejected cleanly
      });
    }

    this.isUnlocked = true;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(0.72, ctx.currentTime, 0.08);
    }
    this.startAmbientDrone();
    this.refreshSnapshot();
  }

  /**
   * Toggles mute/unmute directly on user click. Initializes AudioContext cleanly
   * if enabling audio for the first time.
   */
  public toggleMute(): boolean {
    this.hydratePreferencesIfNeeded();
    const currentlyActive = this.isUnlocked && !this.isMuted;

    if (!currentlyActive) {
      this.unlockFromGesture(true);
      return false; // not muted
    }

    this.isMuted = true;
    this.hasExplicitMutePref = true;
    this.persistMutePreference(true);

    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.06);
    }

    this.refreshSnapshot();
    return true;
  }

  /**
   * Starts the warm 55Hz cosmic void drone + detuned fifth harmonic if unlocked.
   */
  public startAmbientDrone(): void {
    const ctx = this.ctx;
    if (!ctx || !this.masterGain || this.drone) return;

    const now = ctx.currentTime;
    const { cutoffHz, detuneCents } = this.computeSpectrumParams(
      this.currentSpectrum
    );

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoffHz, now);
    filter.Q.setValueAtTime(1.35, now);

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.0001, now);
    droneGain.gain.setTargetAtTime(0.22, now, 0.75);

    // 55Hz (A1) warm fundamental
    const fundamentalOsc = ctx.createOscillator();
    fundamentalOsc.type = "sine";
    fundamentalOsc.frequency.setValueAtTime(55, now);
    const fundamentalGain = ctx.createGain();
    fundamentalGain.gain.setValueAtTime(0.62, now);
    fundamentalOsc.connect(fundamentalGain);
    fundamentalGain.connect(filter);

    // Detuned fifth harmonic (82.5Hz = 55 * 1.5)
    const fifthOsc = ctx.createOscillator();
    fifthOsc.type = "triangle";
    fifthOsc.frequency.setValueAtTime(82.5, now);
    fifthOsc.detune.setValueAtTime(detuneCents, now);
    const fifthGain = ctx.createGain();
    fifthGain.gain.setValueAtTime(0.24, now);
    fifthOsc.connect(fifthGain);
    fifthGain.connect(filter);

    // Whisper octave halo (110Hz A2)
    const octaveOsc = ctx.createOscillator();
    octaveOsc.type = "sine";
    octaveOsc.frequency.setValueAtTime(110, now);
    octaveOsc.detune.setValueAtTime(-5, now);
    const octaveGain = ctx.createGain();
    octaveGain.gain.setValueAtTime(0.11, now);
    octaveOsc.connect(octaveGain);
    octaveGain.connect(filter);

    // Gentle organic filter breath LFO unless reduced-motion is preferred
    let lfoOsc: OscillatorNode | null = null;
    let lfoGain: GainNode | null = null;
    if (!this.isReducedMotion) {
      lfoOsc = ctx.createOscillator();
      lfoOsc.type = "sine";
      lfoOsc.frequency.setValueAtTime(0.085, now);
      lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(28, now);
      lfoOsc.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfoOsc.start(now);
    }

    filter.connect(droneGain);
    droneGain.connect(this.masterGain);

    fundamentalOsc.start(now);
    fifthOsc.start(now);
    octaveOsc.start(now);

    this.drone = {
      fundamentalOsc,
      fifthOsc,
      octaveOsc,
      lfoOsc,
      lfoGain,
      filter,
      droneGain,
    };

    this.refreshSnapshot();
  }

  /**
   * Smoothly modulates lowpass filter cutoff and harmonic detune as hovered or
   * selected reality RGB spectra change.
   */
  public updateDroneSpectrum(rgb: [number, number, number]): void {
    this.currentSpectrum = rgb;
    if (!this.ctx || !this.drone || this.isMuted) return;

    const now = this.ctx.currentTime;
    const { cutoffHz, detuneCents } = this.computeSpectrumParams(rgb);
    this.drone.filter.frequency.setTargetAtTime(cutoffHz, now, 0.45);
    this.drone.fifthOsc.detune.setTargetAtTime(detuneCents, now, 0.45);
  }

  /**
   * Soft, crystalline high-frequency harmonic ping (880Hz - 1320Hz) on Reality Orb hover.
   */
  public playOrbHover(): void {
    if (!this.isUnlocked || this.isMuted || !this.ctx || !this.masterGain) {
      return;
    }
    if (this.ctx.state === "suspended") return;

    const nowMs = performance.now();
    if (nowMs - this.lastHoverAt < 55) return;
    this.lastHoverAt = nowMs;

    // Harmonic intervals spanning 880Hz -> 1320Hz
    const notes = [880, 987.77, 1100, 1174.66, 1320];
    const freq = notes[this.hoverStep % notes.length];
    this.hoverStep += 1;

    const now = this.ctx.currentTime;
    const peakGain = this.isReducedMotion ? 0.025 : 0.045;
    const decaySec = this.isReducedMotion ? 0.16 : 0.24;

    const oscSine = this.ctx.createOscillator();
    oscSine.type = "sine";
    oscSine.frequency.setValueAtTime(freq, now);

    const oscTri = this.ctx.createOscillator();
    oscTri.type = "triangle";
    oscTri.frequency.setValueAtTime(freq * 1.003, now);

    const triGain = this.ctx.createGain();
    triGain.gain.setValueAtTime(0.28, now);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(peakGain, now + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, now + decaySec);

    oscSine.connect(env);
    oscTri.connect(triGain);
    triGain.connect(env);
    env.connect(this.masterGain);

    oscSine.start(now);
    oscTri.start(now);
    oscSine.stop(now + decaySec + 0.03);
    oscTri.stop(now + decaySec + 0.03);

    oscSine.onended = () => {
      oscSine.disconnect();
      oscTri.disconnect();
      triGain.disconnect();
      env.disconnect();
    };
  }

  /**
   * Deep gravitational sweep triggered when entering a Reality Breach or forging a timeline.
   */
  public playBreachTransition(): void {
    if (!this.isUnlocked || this.isMuted || !this.ctx || !this.masterGain) {
      return;
    }
    if (this.ctx.state === "suspended") return;

    const now = this.ctx.currentTime;
    const sweepDuration = this.isReducedMotion ? 0.45 : 1.15;

    // Sub-gravitational core drop
    const subOsc = this.ctx.createOscillator();
    subOsc.type = "sine";
    if (this.isReducedMotion) {
      subOsc.frequency.setValueAtTime(55, now);
    } else {
      subOsc.frequency.setValueAtTime(118, now);
      subOsc.frequency.exponentialRampToValueAtTime(38, now + sweepDuration);
    }

    const bodyOsc = this.ctx.createOscillator();
    bodyOsc.type = "triangle";
    if (this.isReducedMotion) {
      bodyOsc.frequency.setValueAtTime(82.5, now);
    } else {
      bodyOsc.frequency.setValueAtTime(176, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(64, now + sweepDuration);
    }

    const sweepFilter = this.ctx.createBiquadFilter();
    sweepFilter.type = "lowpass";
    sweepFilter.Q.setValueAtTime(2.4, now);
    sweepFilter.frequency.setValueAtTime(420, now);
    sweepFilter.frequency.exponentialRampToValueAtTime(95, now + sweepDuration);

    const sweepEnv = this.ctx.createGain();
    sweepEnv.gain.setValueAtTime(0.0001, now);
    sweepEnv.gain.linearRampToValueAtTime(
      this.isReducedMotion ? 0.08 : 0.16,
      now + 0.06
    );
    sweepEnv.gain.exponentialRampToValueAtTime(0.0001, now + sweepDuration);

    subOsc.connect(sweepFilter);
    bodyOsc.connect(sweepFilter);
    sweepFilter.connect(sweepEnv);
    sweepEnv.connect(this.masterGain);

    subOsc.start(now);
    bodyOsc.start(now);
    subOsc.stop(now + sweepDuration + 0.05);
    bodyOsc.stop(now + sweepDuration + 0.05);

    subOsc.onended = () => {
      subOsc.disconnect();
      bodyOsc.disconnect();
      sweepFilter.disconnect();
      sweepEnv.disconnect();
    };

    // High-altitude harmonic horizon shimmer
    if (!this.isReducedMotion) {
      const haloOsc = this.ctx.createOscillator();
      haloOsc.type = "sine";
      haloOsc.frequency.setValueAtTime(660, now);
      haloOsc.frequency.exponentialRampToValueAtTime(990, now + 0.85);

      const haloEnv = this.ctx.createGain();
      haloEnv.gain.setValueAtTime(0.0001, now);
      haloEnv.gain.linearRampToValueAtTime(0.024, now + 0.12);
      haloEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      haloOsc.connect(haloEnv);
      haloEnv.connect(this.masterGain);

      haloOsc.start(now);
      haloOsc.stop(now + 0.94);
      haloOsc.onended = () => {
        haloOsc.disconnect();
        haloEnv.disconnect();
      };
    }
  }

  /**
   * Ultra-subtle harmonic telemetry pulse during Enigma / Parallel Self inscription.
   */
  public playTransmissionTick(): void {
    if (!this.isUnlocked || this.isMuted || !this.ctx || !this.masterGain) {
      return;
    }
    if (this.ctx.state === "suspended" || this.isReducedMotion) return;

    const nowMs = performance.now();
    if (nowMs - this.lastTickAt < 72) return;
    this.lastTickAt = nowMs;

    const tickNotes = [1046.5, 1174.66, 1318.51, 1100];
    const freq = tickNotes[this.tickStep % tickNotes.length];
    this.tickStep += 1;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.014, now + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.048);

    osc.connect(env);
    env.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.055);
    osc.onended = () => {
      osc.disconnect();
      env.disconnect();
    };
  }
}

export const cosmicAudio = new CosmicAudioController();

export function useCosmicAudioState(): CosmicAudioState {
  return useSyncExternalStore(
    cosmicAudio.subscribe,
    cosmicAudio.getSnapshot,
    cosmicAudio.getServerSnapshot
  );
}

