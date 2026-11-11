"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { CosmicSequenceState } from "./CosmicPhenomenon";
import { cosmicAudio } from "@/lib/cosmicAudio";

/**
 * ============================================================================
 * COMPONENT: InitiateContactButton
 * ============================================================================
 * Purpose:
 * Renders the primary Gateway trigger ("INITIATE DISCOVERY") and expands it
 * into a 3-phase luminous starlight filament progress gauge during communion:
 *
 * - Phase 01 (0% – 33%):  SIGNAL DETECTED
 * - Phase 02 (33% – 66%): DIMENSIONAL RESONANCE
 * - Phase 03 (66% – 100%): ORIGIN SYNCHRONIZED
 *
 * Architectural Fix:
 * Parent callbacks (`onSequenceChange`, `onComplete`) are stored in refs so
 * parent re-renders NEVER trigger useEffect cleanups or freeze Phase 01 timers.
 */

interface InitiateContactButtonProps {
  /** Notifies parent when the cosmic sequence phase transitions */
  onSequenceChange?: (stage: CosmicSequenceState) => void;
  /** Emits normalized warp/progression values (0.0 -> 1.0) during sequence */
  onProgressChange?: (progress01: number) => void;
  /** Invoked at 100% completion (after a brief hold) or immediately on Skip */
  onComplete?: () => void;
}

const TOTAL_SEQUENCE_MS = 4200;
const COMPLETION_HOLD_MS = 500;

interface PhaseMeta {
  index: 1 | 2 | 3;
  fraction: string;
  header: string;
  substatus: string;
}

const PHASE_METADATA: Record<Exclude<CosmicSequenceState, "idle">, PhaseMeta> = {
  signal_detected: {
    index: 1,
    fraction: "[ 01 / 03 ]",
    header: "PHASE 01 // SIGNAL DETECTED",
    substatus: "Cosmic currents stirring through void filaments...",
  },
  dimensional_resonance: {
    index: 2,
    fraction: "[ 02 / 03 ]",
    header: "PHASE 02 // DIMENSIONAL RESONANCE",
    substatus: "Luminescent plasma waves expanding across the horizon...",
  },
  origin_synchronized: {
    index: 3,
    fraction: "[ 03 / 03 ]",
    header: "PHASE 03 // ORIGIN SYNCHRONIZED",
    substatus: "ACCESS STATUS: GRANTED // Entering Observatory...",
  },
};

const STEPPER_NODES: Array<{
  step: 1 | 2 | 3;
  label: string;
  milestonePct: number;
}> = [
  { step: 1, label: "01. SIGNAL", milestonePct: 33 },
  { step: 2, label: "02. RESONANCE", milestonePct: 66 },
  { step: 3, label: "03. SYNCHRONIZED", milestonePct: 100 },
];

export default function InitiateContactButton({
  onSequenceChange,
  onProgressChange,
  onComplete,
}: InitiateContactButtonProps) {
  const [stage, setStage] = useState<CosmicSequenceState>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Isolate parent callbacks in refs so parent re-renders never cancel active progression
  const onSequenceChangeRef = useRef(onSequenceChange);
  const onProgressChangeRef = useRef(onProgressChange);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onSequenceChangeRef.current = onSequenceChange;
  }, [onSequenceChange]);
  useEffect(() => {
    onProgressChangeRef.current = onProgressChange;
  }, [onProgressChange]);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const rafIdRef = useRef<number | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearScheduledWork = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (holdTimerRef.current !== null) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  /**
   * Immediately jumps progress to 100% / origin_synchronized and completes.
   */
  const handleSkip = useCallback(() => {
    clearScheduledWork();
    cosmicAudio.unlockFromGesture();
    setIsRunning(false);
    setProgress(100);
    setStage("origin_synchronized");
    onProgressChangeRef.current?.(1);
    onSequenceChangeRef.current?.("origin_synchronized");
    onCompleteRef.current?.();
  }, [clearScheduledWork]);

  /**
   * Resets cleanly back to idle equilibrium (used in standalone preview contexts).
   */
  const handleReset = useCallback(() => {
    clearScheduledWork();
    setIsRunning(false);
    setProgress(0);
    setStage("idle");
    onProgressChangeRef.current?.(0);
    onSequenceChangeRef.current?.("idle");
  }, [clearScheduledWork]);

  /**
   * Initiates the 3-phase communion sequence cleanly from idle.
   */
  const handleInitiate = useCallback(() => {
    if (stage !== "idle") return;
    clearScheduledWork();
    cosmicAudio.unlockFromGesture();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Advance directly to 100% synchronized state for motion-sensitive users
      setProgress(100);
      setStage("origin_synchronized");
      onProgressChangeRef.current?.(1);
      onSequenceChangeRef.current?.("origin_synchronized");
      holdTimerRef.current = setTimeout(() => {
        onCompleteRef.current?.();
      }, 280);
      return;
    }

    setProgress(0);
    setStage("signal_detected");
    onProgressChangeRef.current?.(0);
    onSequenceChangeRef.current?.("signal_detected");
    setIsRunning(true);
  }, [stage, clearScheduledWork]);

  /**
   * Deterministic 3-Phase RAF Progression Effect:
   * Keyed strictly to `isRunning` so stage advances (Phase 1 -> 2 -> 3) and
   * parent state updates NEVER tear down or freeze the active sequence.
   */
  useEffect(() => {
    if (!isRunning) return;

    const startTime = performance.now();
    let currentNotifiedStage: CosmicSequenceState = "signal_detected";
    let lastEmittedPctStep = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / TOTAL_SEQUENCE_MS) * 100);
      setProgress(pct);

      const pctStep = Math.round(pct);
      if (pctStep !== lastEmittedPctStep) {
        lastEmittedPctStep = pctStep;
        onProgressChangeRef.current?.(pctStep / 100);
      }

      const nextStage: CosmicSequenceState =
        pct < 33.333
          ? "signal_detected"
          : pct < 66.666
          ? "dimensional_resonance"
          : "origin_synchronized";

      if (nextStage !== currentNotifiedStage) {
        currentNotifiedStage = nextStage;
        setStage(nextStage);
        onSequenceChangeRef.current?.(nextStage);
      }

      if (pct < 100) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        rafIdRef.current = null;
        setProgress(100);
        if (lastEmittedPctStep !== 100) {
          onProgressChangeRef.current?.(1);
        }

        holdTimerRef.current = setTimeout(() => {
          holdTimerRef.current = null;
          setIsRunning(false);
          onCompleteRef.current?.();
        }, COMPLETION_HOLD_MS);
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      clearScheduledWork();
    };
  }, [isRunning, clearScheduledWork]);

  /**
   * Keyboard Accessibility: ESC immediately skips the sequence cleanly.
   * Uses refs so binding/unbinding never disrupts active sequence timers.
   */
  const stageRef = useRef<CosmicSequenceState>(stage);
  const isRunningRef = useRef<boolean>(isRunning);
  useEffect(() => {
    stageRef.current = stage;
    isRunningRef.current = isRunning;
  }, [stage, isRunning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        (isRunningRef.current ||
          (stageRef.current !== "idle" &&
            stageRef.current !== "origin_synchronized"))
      ) {
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSkip]);

  // Final cleanup safety net on unmount
  useEffect(() => clearScheduledWork, [clearScheduledWork]);

  const activeMeta = stage !== "idle" ? PHASE_METADATA[stage] : null;
  const formattedPct = `${String(Math.round(progress)).padStart(2, "0")}%`;

  return (
    <div className="relative flex flex-col items-center justify-center z-20 w-full max-w-lg mx-auto">
      {/* --------------------------------------------------------------------
          STATE 0: DORMANT CELESTIAL TRIGGER (INITIATE DISCOVERY)
          -------------------------------------------------------------------- */}
      {stage === "idle" && (
        <div className="flex flex-col items-center group">
          {/* Ambient Ethereal Aura */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#7136D9] via-[#B69AFF] to-[#B8229C] opacity-25 blur-xl group-hover:opacity-70 transition duration-700 pointer-events-none" />

          {/* Primary Action Button: INITIATE DISCOVERY */}
          <button
            type="button"
            onClick={handleInitiate}
            aria-label="Initiate discovery with the cosmic phenomenon"
            className="relative flex items-center justify-center gap-3.5 px-8 sm:px-11 py-3.5 sm:py-4 rounded-full bg-[#0A0618]/75 border border-[#B69AFF]/25 hover:border-[#B69AFF]/65 hover:bg-[#160C33]/75 text-[#F3F0FA] hover:text-[#FFFFFF] transition-all duration-400 backdrop-blur-md shadow-[0_0_28px_rgba(113,54,217,0.25)] hover:shadow-[0_0_45px_rgba(182,154,255,0.45)] cursor-pointer active:scale-98"
          >
            {/* Luminous Star Beacon */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B69AFF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F6F3FE]" />
            </span>

            {/* Typography */}
            <span className="font-[family-name:var(--font-space-grotesk)] text-xs sm:text-sm tracking-[0.30em] font-light uppercase text-glow-celestial">
              INITIATE DISCOVERY
            </span>

            {/* Ethereal Arrow Ray */}
            <svg
              className="w-3.5 h-3.5 text-[#B69AFF] transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>

          {/* Quiet Sub-label */}
          <span className="mt-3 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.32em] text-[#9F95B3]/55 uppercase">
            [ COMMUNE WITH UNKNOWN DIMENSION ]
          </span>
        </div>
      )}

      {/* --------------------------------------------------------------------
          ACTIVE SEQUENCE & COMPLETION: 3-PHASE LUMINOUS FILAMENT GAUGE
          -------------------------------------------------------------------- */}
      {activeMeta && (
        <div className="relative w-full px-5 py-4 sm:px-6 sm:py-5 rounded-2xl bg-[#0A0618]/80 border border-[#C2B0FF]/25 backdrop-blur-2xl shadow-[0_0_48px_rgba(108,43,226,0.28)] flex flex-col gap-3.5">
          {/* Hairline Top Specular Rim */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#C2B0FF]/50 to-transparent"
          />

          {/* TOP ROW: Phase Header & Fraction + Percentage Counter */}
          <div className="flex items-center justify-between gap-2 font-[family-name:var(--font-jetbrains-mono)]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-[#F6F3FE] animate-pulse shadow-[0_0_8px_#C2B0FF]" />
              <span className="truncate text-[10px] sm:text-xs text-[#F6F3FE] font-medium tracking-[0.18em] sm:tracking-[0.22em]">
                {activeMeta.header}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-[10px] sm:text-xs tracking-[0.18em]">
              <span className="hidden sm:inline text-[#C2B0FF]/75">
                {activeMeta.fraction}
              </span>
              <span className="tabular-nums text-[#F6F3FE] font-medium text-glow-celestial">
                {formattedPct}
              </span>
            </div>
          </div>

          {/* MIDDLE ROW: Delicate Luminous Starlight Filament Track & 3 Diamond Nodes */}
          <div
            role="progressbar"
            aria-label="Cosmic synchronization progression"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-valuetext={`${activeMeta.header} (${formattedPct})`}
            className="relative w-full py-2 flex items-center"
          >
            {/* Outer Cosmic Filament Track */}
            <div className="relative w-full h-[2px] rounded-full bg-[#C2B0FF]/15">
              {/* Luminous Lavender-Violet Fill Bar */}
              <div
                style={{ width: `${progress}%` }}
                className="relative h-full rounded-full bg-gradient-to-r from-[#6C2BE2] via-[#C2B0FF] to-[#F6F3FE] shadow-[0_0_12px_rgba(194,176,255,0.8),0_0_24px_rgba(108,43,226,0.55)]"
              >
                {/* Celestial White Leading Spark */}
                <span
                  aria-hidden="true"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-[#F6F3FE] shadow-[0_0_10px_#F6F3FE,0_0_20px_#C2B0FF]"
                >
                  <span className="absolute -inset-1 rounded-full bg-[#C2B0FF]/40 blur-[2px]" />
                </span>
              </div>

              {/* 3 Diamond Milestone Markers at 33%, 66%, and 100% */}
              {STEPPER_NODES.map((node) => {
                const isReached = progress >= node.milestonePct - 0.5;
                return (
                  <span
                    key={`milestone-${node.step}`}
                    aria-hidden="true"
                    style={{ left: `${node.milestonePct}%` }}
                    className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[6px] h-[6px] rotate-45 border transition-all duration-300 ${
                      isReached
                        ? "bg-[#F6F3FE] border-[#C2B0FF] shadow-[0_0_10px_rgba(194,176,255,0.95)]"
                        : "bg-[#0A0618] border-[#C2B0FF]/35"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* BOTTOM ROW: 3-Stage Stepper Labels */}
          <div className="grid grid-cols-3 gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.20em] uppercase">
            {STEPPER_NODES.map((node) => {
              const isCurrent = activeMeta.index === node.step;
              const isCompleted = activeMeta.index > node.step;

              const alignment =
                node.step === 1
                  ? "text-left"
                  : node.step === 2
                  ? "text-center"
                  : "text-right";

              const tone = isCurrent
                ? "text-[#F6F3FE] opacity-100"
                : isCompleted
                ? "text-[#C2B0FF] opacity-85"
                : "text-[#9F95B3] opacity-35";

              return (
                <span key={node.step} className={`${alignment} ${tone} transition-opacity duration-300`}>
                  {node.label}
                </span>
              );
            })}
          </div>

          {/* Status Whisper + Skip Control */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#C2B0FF]/10 font-[family-name:var(--font-jetbrains-mono)]">
            <span className="truncate text-[9px] sm:text-[10px] text-[#9F95B3]/80 tracking-wider">
              {activeMeta.substatus}
            </span>

            {progress < 100 ? (
              <button
                type="button"
                onClick={handleSkip}
                className="shrink-0 text-[9px] sm:text-[10px] text-[#C2B0FF]/85 hover:text-[#F6F3FE] tracking-[0.20em] uppercase underline underline-offset-4 transition-colors cursor-pointer"
              >
                [ ESC // SKIP SEQUENCE ]
              </button>
            ) : !onComplete ? (
              <button
                type="button"
                onClick={handleReset}
                className="shrink-0 text-[9px] sm:text-[10px] text-[#C2B0FF]/85 hover:text-[#F6F3FE] tracking-[0.20em] uppercase underline underline-offset-4 transition-colors cursor-pointer"
              >
                RESET
              </button>
            ) : (
              <span className="shrink-0 text-[9px] sm:text-[10px] text-[#F6F3FE] tracking-[0.20em] uppercase text-glow-celestial">
                SYNCHRONIZED
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
