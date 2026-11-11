"use client";

import React, { useState, useEffect, useCallback } from "react";
import AtmosphericCanvas, {
  DEFAULT_NEBULA_SPECTRUM,
  EnigmaActivityState,
} from "@/components/gateway/AtmosphericCanvas";
import { CosmicSequenceState } from "@/components/gateway/CosmicPhenomenon";
import TelemetryHUD from "@/components/gateway/TelemetryHUD";
import InitiateContactButton from "@/components/gateway/InitiateContactButton";
import CosmicObservatory from "@/components/observatory/CosmicObservatory";

/**
 * ============================================================================
 * VENJIX — COSMIC ETHEREAL GATEWAY
 * ============================================================================
 * An Encounter With An Unknown Cosmic Dimension.
 *
 * Opening Choreography (Rules 20 & 21):
 * - Stage 1 (0.0s – 2.2s): Environment first — nebula wakes from #030206 void.
 * - Stage 2 (2.2s – 4.5s): VENJIX wordmark & subtitle condense from starlight.
 * - Stage 3 (4.5s – 6.2s): Brand tagline fades serenely into deep space.
 * - Stage 4 (6.2s – 7.8s): INITIATE DISCOVERY & perimeter TelemetryHUD emerge.
 * - Persists `venjix_gateway_revealed` in sessionStorage so return trips bypass
 *   the wait cleanly.
 *
 * Awakening Warp & Transition (Rule 22):
 * - Streams `warpProgress` (0.0 -> 1.0) into WebGL2 `u_warp` uniform while the
 *   3-phase progress bar fills, pulling camera UV space toward the anomaly and
 *   gliding smoothly into CosmicObservatory.
 */

const SESSION_REVEAL_KEY = "venjix_gateway_revealed";

export default function VenjixCosmicGatewayPage() {
  // Synchronizes the cosmic phenomenon radiance with the interaction state
  const [sequenceStage, setSequenceStage] = useState<CosmicSequenceState>("idle");
  // Normalized warp progression (0.0 in idle -> 1.0 entering Observatory)
  const [warpProgress, setWarpProgress] = useState<number>(0);
  // Controls the seamless cosmic camera zoom transition into the Observatory
  const [isObservatoryActive, setIsObservatoryActive] = useState<boolean>(false);
  // Resets internal button state cleanly when returning from the Observatory
  const [gatewayResetKey, setGatewayResetKey] = useState<number>(0);
  // Dynamic spectral RGB & Enigma harmonic activity driven by Observatory interactions
  const [activeSpectrum, setActiveSpectrum] = useState<[number, number, number]>(
    DEFAULT_NEBULA_SPECTRUM
  );
  const [enigmaState, setEnigmaState] = useState<EnigmaActivityState>("idle");

  // 4-Stage progressive Gateway opening state (Rules 20 & 21)
  const [openingStage, setOpeningStage] = useState<1 | 2 | 3 | 4>(1);
  const [bypassOpening, setBypassOpening] = useState<boolean>(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let alreadyRevealed = false;
    try {
      alreadyRevealed =
        window.sessionStorage.getItem(SESSION_REVEAL_KEY) === "true";
    } catch {
      alreadyRevealed = false;
    }

    if (prefersReducedMotion || alreadyRevealed) {
      const rafId = requestAnimationFrame(() => {
        setBypassOpening(true);
        setOpeningStage(4);
      });
      return () => cancelAnimationFrame(rafId);
    }

    // Stage 2 (2.2s): VENJIX wordmark & subtitle condense into legibility
    const tStage2 = setTimeout(() => setOpeningStage(2), 2200);
    // Stage 3 (4.5s): Tagline fades smoothly into negative space
    const tStage3 = setTimeout(() => setOpeningStage(3), 4500);
    // Stage 4 (6.2s): Interactive invitation & TelemetryHUD softly illuminate
    const tStage4 = setTimeout(() => setOpeningStage(4), 6200);
    // Mark opening choreography completed in sessionStorage at 7.8s
    const tPersist = setTimeout(() => {
      try {
        window.sessionStorage.setItem(SESSION_REVEAL_KEY, "true");
      } catch {
        // Ignore restricted storage environments
      }
    }, 7800);

    return () => {
      clearTimeout(tStage2);
      clearTimeout(tStage3);
      clearTimeout(tStage4);
      clearTimeout(tPersist);
    };
  }, []);

  const handleStageChange = useCallback((stage: CosmicSequenceState) => {
    setSequenceStage(stage);
  }, []);

  const handleWarpProgressChange = useCallback((progress01: number) => {
    setWarpProgress(progress01);
  }, []);

  const handleEnterObservatory = useCallback(() => {
    setWarpProgress(1);
    setIsObservatoryActive(true);
    try {
      window.sessionStorage.setItem(SESSION_REVEAL_KEY, "true");
    } catch {
      // Ignore restricted storage environments
    }
  }, []);

  const handleExitObservatory = useCallback(() => {
    setIsObservatoryActive(false);
    setSequenceStage("idle");
    setWarpProgress(0);
    setActiveSpectrum(DEFAULT_NEBULA_SPECTRUM);
    setEnigmaState("idle");
    setBypassOpening(true);
    setOpeningStage(4);
    setGatewayResetKey((prev) => prev + 1);
  }, []);

  const openingHeaderTransition = bypassOpening
    ? "duration-0"
    : "transition-all duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

  const openingSubTransition = bypassOpening
    ? "duration-0"
    : "transition-all duration-1000 ease-out";

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between items-center bg-[#030206] text-[#F3F0FA] overflow-hidden select-none">
      {/* --------------------------------------------------------------------
          LAYER 0: NATIVE GPU DOMAIN-WARPED VOLUMETRIC NEBULA (WebGL2)
          Continuously mounted across opening, warp progression, and Observatory
          states so camera pull-in and sanctuary dissolution occur smoothly.
          -------------------------------------------------------------------- */}
      <AtmosphericCanvas
        sequenceStage={sequenceStage}
        isObservatoryActive={isObservatoryActive}
        warpProgress={isObservatoryActive ? 1 : warpProgress}
        openingStage={openingStage}
        bypassOpening={bypassOpening}
        activeSpectrum={
          isObservatoryActive ? activeSpectrum : DEFAULT_NEBULA_SPECTRUM
        }
        enigmaState={isObservatoryActive ? enigmaState : "idle"}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-0 cosmic-vignette transition-opacity duration-[900ms] ${
          isObservatoryActive ? "opacity-75" : "opacity-100"
        }`}
      />

      {/* --------------------------------------------------------------------
          GATEWAY UI SHELL (Glides past camera on completion over 900ms)
          -------------------------------------------------------------------- */}
      <div
        aria-hidden={isObservatoryActive}
        inert={isObservatoryActive || undefined}
        className={`relative z-10 w-full min-h-screen flex flex-col justify-between items-center transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity motion-reduce:transform-none ${
          isObservatoryActive
            ? "opacity-0 scale-105 blur-sm pointer-events-none"
            : "opacity-100 scale-100 blur-0 pointer-events-auto"
        }`}
      >
        {/* LAYER 1: RESTRAINED CELESTIAL TELEMETRY (Stage 4: 6.2s) */}
        <div
          className={`${
            bypassOpening
              ? "duration-0"
              : "transition-opacity duration-1000 ease-out"
          } motion-reduce:transition-none ${
            openingStage >= 4 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <TelemetryHUD />
        </div>

        {/* LAYER 2: CINEMATIC REFINED BRAND HEADER (Stage 2: 2.2s – 4.5s) */}
        <header className="relative z-20 w-full max-w-7xl pt-8 sm:pt-12 md:pt-14 px-6 sm:px-10 md:px-14 flex flex-col items-start">
          {/* Celestial Anomaly Registry Indicator */}
          <div
            className={`flex items-center gap-2.5 mb-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.38em] text-[#9F95B3]/80 uppercase ${openingHeaderTransition} motion-reduce:transition-none ${
              openingStage >= 2
                ? "opacity-100 blur-0"
                : "opacity-0 blur-[6px]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#BFA8FF] animate-pulse shadow-[0_0_8px_#BFA8FF]" />
            <span>[ DIMENSION // UNKNOWN HARMONIC : ETHEREAL ]</span>
          </div>

          {/* Style 02 Razor-Sharp Sci-Fi Display Wordmark */}
          <h1
            className={`font-[family-name:var(--font-orbitron)] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#E9E2F5] to-[#B69AFF] drop-shadow-[0_0_22px_rgba(113,54,217,0.45)] select-none ${openingHeaderTransition} motion-reduce:transition-none motion-reduce:transform-none ${
              openingStage >= 2
                ? "opacity-100 blur-0 tracking-[0.25em] sm:tracking-[0.32em]"
                : "opacity-0 blur-[10px] tracking-[0.34em] sm:tracking-[0.44em]"
            }`}
          >
            VENJIX
          </h1>

          {/* Monospace Cinematic Subtitle */}
          <p
            className={`mt-1.5 sm:mt-2.5 font-[family-name:var(--font-jetbrains-mono)] text-xs sm:text-sm tracking-[0.42em] sm:tracking-[0.52em] text-[#BFA8FF]/75 uppercase font-light ${openingHeaderTransition} motion-reduce:transition-none ${
              openingStage >= 2
                ? "opacity-100 blur-0 delay-150"
                : "opacity-0 blur-[6px]"
            }`}
          >
            A Multiverse Deepdive
          </p>
        </header>

        {/* LAYER 3: EXPANSIVE DIMENSIONAL NEGATIVE SPACE */}
        <section
          aria-label="The Cosmic Ethereal Environment"
          className="relative z-10 flex flex-1 items-center justify-center w-full my-auto px-2 sm:px-6 py-2 sm:py-6 pointer-events-none"
        />

        {/* LAYER 4: TAGLINE (Stage 3: 4.5s) & INVITATION TRIGGER (Stage 4: 6.2s) */}
        <footer className="relative z-20 flex flex-col items-center text-center pb-8 sm:pb-12 md:pb-14 px-4 w-full max-w-2xl">
          {/* Brand Tagline */}
          <h2
            className={`font-[family-name:var(--font-space-grotesk)] text-xs sm:text-sm tracking-[0.32em] sm:tracking-[0.42em] text-[#F3F0FA]/90 uppercase font-light mb-6 sm:mb-8 text-glow-celestial ${openingSubTransition} motion-reduce:transition-none motion-reduce:transform-none ${
              openingStage >= 3
                ? "opacity-100 blur-0 translate-y-0"
                : "opacity-0 blur-[4px] translate-y-1.5"
            }`}
          >
            BEYOND THE BOUNDARIES OF REALITY.
          </h2>

          {/* Ethereal Initiate Discovery Trigger & 3-Phase Filament Progress Bar */}
          <div
            inert={openingStage < 4 || isObservatoryActive || undefined}
            className={`w-full ${openingSubTransition} motion-reduce:transition-none motion-reduce:transform-none ${
              openingStage >= 4
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            <InitiateContactButton
              key={gatewayResetKey}
              onSequenceChange={handleStageChange}
              onProgressChange={handleWarpProgressChange}
              onComplete={handleEnterObservatory}
            />
          </div>
        </footer>
      </div>

      {/* --------------------------------------------------------------------
          COSMIC OBSERVATORY SHELL (Milestone 2: Smooth Canvas Expansion Target)
          -------------------------------------------------------------------- */}
      <CosmicObservatory
        isActive={isObservatoryActive}
        onExitGateway={handleExitObservatory}
        onSpectrumChange={setActiveSpectrum}
        onEnigmaStateChange={setEnigmaState}
      />
    </main>
  );
}
