"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { CosmicSequenceState } from "./CosmicPhenomenon";

/**
 * ============================================================================
 * COMPONENT: InitiateContactButton
 * ============================================================================
 * Purpose:
 * Renders the primary functional interaction trigger: "INITIATE DISCOVERY".
 * 
 * Creative Rationale (Cosmic Ethereal Direction):
 * A quiet, restrained, cinematic celestial trigger inviting the visitor to
 * commune with the unknown cosmic dimension:
 * 
 * 3-Stage Awakening Progression:
 * - Stage 1: SIGNAL DETECTED
 *   Cosmic currents stir; internal illumination spreads through the domain-warped plasma.
 * - Stage 2: DIMENSIONAL RESONANCE
 *   Celestial waves surge with radiant white-violet luminescence and starlight.
 * - Stage 3: ORIGIN SYNCHRONIZED
 *   The phenomenon reaches harmonic equilibrium:
 *   DIMENSIONAL EVENT: ACKNOWLEDGED
 *   COSMIC HARMONIC: SYNCHRONIZED
 *   ACCESS STATUS: GRANTED
 * 
 * Safety & Accessibility:
 * - Skippable at any time with a visible button or ESC key.
 * - Clean timer lifecycle (no memory leaks or orphaned async updates).
 * - In-page confirmation with reset capability to return to dormant state.
 */

interface InitiateContactButtonProps {
  /** Callback notifying parent of sequence state changes */
  onSequenceChange?: (stage: CosmicSequenceState) => void;
}

export default function InitiateContactButton({
  onSequenceChange,
}: InitiateContactButtonProps) {
  const [stage, setStage] = useState<CosmicSequenceState>("idle");

  const timer1Ref = useRef<NodeJS.Timeout | null>(null);
  const timer2Ref = useRef<NodeJS.Timeout | null>(null);

  /**
   * Cleans active timers deterministically.
   */
  const clearTimers = useCallback(() => {
    if (timer1Ref.current) clearTimeout(timer1Ref.current);
    if (timer2Ref.current) clearTimeout(timer2Ref.current);
  }, []);

  /**
   * Instantly skips to the synchronized confirmation state.
   */
  const handleSkip = useCallback(() => {
    clearTimers();
    setStage("origin_synchronized");
    onSequenceChange?.("origin_synchronized");
  }, [clearTimers, onSequenceChange]);

  /**
   * Resets the cosmic phenomenon back to its calm dormant equilibrium.
   */
  const handleReset = useCallback(() => {
    clearTimers();
    setStage("idle");
    onSequenceChange?.("idle");
  }, [clearTimers, onSequenceChange]);

  /**
   * Triggers the celestial awakening sequence.
   */
  const handleInitiate = () => {
    if (stage !== "idle") return;

    clearTimers();

    // Stage 1: Signal Detected
    setStage("signal_detected");
    onSequenceChange?.("signal_detected");

    // Transition to Stage 2: Dimensional Resonance after 1.5s
    timer1Ref.current = setTimeout(() => {
      setStage("dimensional_resonance");
      onSequenceChange?.("dimensional_resonance");

      // Transition to Stage 3: Synchronized after 1.8s
      timer2Ref.current = setTimeout(() => {
        setStage("origin_synchronized");
        onSequenceChange?.("origin_synchronized");
      }, 1800);
    }, 1500);
  };

  /**
   * Keyboard accessibility: ESC key skips running sequences.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (stage === "signal_detected" || stage === "dimensional_resonance")) {
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimers();
    };
  }, [stage, handleSkip, clearTimers]);

  return (
    <div className="relative flex flex-col items-center justify-center z-20 w-full max-w-lg mx-auto">
      {/* --------------------------------------------------------------------
          STATE 0: DORMANT CELESTIAL TRIGGER (INITIATE DISCOVERY)
          Translucent, luminous pill floating serenely in deep space.
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          {/* Quiet Sub-label */}
          <span className="mt-3 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.32em] text-[#9F95B3]/55 uppercase">
            [ COMMUNE WITH UNKNOWN DIMENSION ]
          </span>
        </div>
      )}

      {/* --------------------------------------------------------------------
          STATE 1 & 2: THE AWAKENING SEQUENCE (Signal / Resonance)
          -------------------------------------------------------------------- */}
      {(stage === "signal_detected" || stage === "dimensional_resonance") && (
        <div className="w-full p-5 sm:p-6 rounded-2xl bg-[#0A0618]/90 border border-[#B69AFF]/45 backdrop-blur-2xl shadow-[0_0_45px_rgba(113,54,217,0.35)] flex flex-col gap-3 animate-fadeIn">
          {/* Phase Header */}
          <div className="flex items-center justify-between font-[family-name:var(--font-jetbrains-mono)] text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#B69AFF] animate-pulse" />
              <span className="text-[#F3F0FA] font-medium tracking-[0.22em]">
                {stage === "signal_detected"
                  ? "PHASE 01: SIGNAL DETECTED"
                  : "PHASE 02: DIMENSIONAL RESONANCE"}
              </span>
            </div>
            <span className="text-[#B69AFF] font-mono text-[11px] tracking-wider">
              {stage === "signal_detected" ? "AWAKENING" : "RESONATING"}
            </span>
          </div>

          {/* Ethereal Narrative Feedback */}
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#9F95B3] tracking-wider leading-relaxed font-light">
            {stage === "signal_detected"
              ? "Cosmic currents stirring. Luminous plasma spreading through domain-warped spacetime..."
              : "Celestial plasma surging with radiant starlight. Volumetric aurora waves expanding outward..."}
          </p>

          {/* Skip Sequence Option */}
          <button
            type="button"
            onClick={handleSkip}
            className="self-end mt-1 text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-[#B69AFF] hover:text-[#F3F0FA] tracking-[0.25em] uppercase underline underline-offset-4 cursor-pointer"
          >
            SKIP SEQUENCE [ESC]
          </button>
        </div>
      )}

      {/* --------------------------------------------------------------------
          STATE 3: ORIGIN SYNCHRONIZED (Harmonic Confirmation State)
          -------------------------------------------------------------------- */}
      {stage === "origin_synchronized" && (
        <div className="w-full p-6 sm:p-7 rounded-2xl bg-[#0A0618]/95 border border-[#B69AFF]/60 backdrop-blur-3xl shadow-[0_0_60px_rgba(182,154,255,0.40)] flex flex-col gap-4 animate-fadeIn">
          {/* Confirmation Header */}
          <div className="flex items-center justify-between border-b border-[#2A1F45] pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F6F3FE] shadow-[0_0_12px_#FFFFFF]" />
              <span className="font-[family-name:var(--font-space-grotesk)] text-xs sm:text-sm font-semibold text-[#F3F0FA] tracking-[0.25em] uppercase">
                PHENOMENON SYNCHRONIZED
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[9px] font-mono bg-[#7136D9]/30 text-[#B69AFF] border border-[#7136D9]">
              COHERENCE: HARMONIC
            </span>
          </div>

          {/* Confirmation Copy Block */}
          <div className="p-4 rounded-xl bg-[#030206]/85 border border-[#2A1F45] font-[family-name:var(--font-jetbrains-mono)] text-xs text-[#F3F0FA] space-y-2 tracking-[0.20em]">
            <div className="flex items-center gap-2">
              <span className="text-[#9F95B3]">DIMENSIONAL EVENT:</span>
              <span className="text-[#FFFFFF] font-medium text-glow-celestial">ACKNOWLEDGED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#9F95B3]">COSMIC HARMONIC:</span>
              <span className="text-[#B69AFF] font-medium">SYNCHRONIZED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#9F95B3]">ACCESS STATUS:</span>
              <span className="text-[#7136D9] font-semibold tracking-widest">GRANTED</span>
            </div>
          </div>

          {/* Reset Action */}
          <div className="flex items-center justify-between pt-1 font-[family-name:var(--font-jetbrains-mono)] text-[10px]">
            <span className="text-[#9F95B3]/60 tracking-wider">
              DIMENSIONAL COMMUNION ACTIVE
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-full bg-[#160C33] hover:bg-[#2A1F45] border border-[#B69AFF]/40 text-[#B69AFF] hover:text-[#FFFFFF] tracking-[0.2em] transition-colors cursor-pointer"
            >
              RESET PHENOMENON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
