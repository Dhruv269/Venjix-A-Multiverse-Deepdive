"use client";

import React, { useState, useCallback } from "react";
import AtmosphericCanvas from "@/components/gateway/AtmosphericCanvas";
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
 * Product: VENJIX
 * Subtitle: A Multiverse Deepdive
 * Tagline: BEYOND THE BOUNDARIES OF REALITY.
 * 
 * Visual Architecture:
 * - Native WebGL2 Domain-Warped Volumetric Nebula (AtmosphericCanvas).
 * - Refined, lightweight cinematic typography integrated seamlessly into deep space.
 * - Restrained perimeter telemetry without visual collision.
 * - Approved CTA: INITIATE DISCOVERY.
 */

export default function VenjixCosmicGatewayPage() {
  // Synchronizes the cosmic phenomenon radiance with the interaction state
  const [sequenceStage, setSequenceStage] = useState<CosmicSequenceState>("idle");
  // Controls the seamless cosmic camera zoom transition into the Observatory
  const [isObservatoryActive, setIsObservatoryActive] = useState<boolean>(false);
  // Resets internal button state cleanly when returning from the Observatory
  const [gatewayResetKey, setGatewayResetKey] = useState<number>(0);

  const handleStageChange = useCallback((stage: CosmicSequenceState) => {
    setSequenceStage(stage);
  }, []);

  const handleEnterObservatory = useCallback(() => {
    setIsObservatoryActive(true);
  }, []);

  const handleExitObservatory = useCallback(() => {
    setIsObservatoryActive(false);
    setSequenceStage("idle");
    setGatewayResetKey((prev) => prev + 1);
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between items-center bg-[#030206] text-[#F3F0FA] overflow-hidden select-none">
      {/* --------------------------------------------------------------------
          LAYER 0: NATIVE GPU DOMAIN-WARPED VOLUMETRIC NEBULA (WebGL2)
          Continuously mounted across both Gateway & Observatory states so
          camera fly-in zoom and dimensional expansion occur with zero hard cuts.
          -------------------------------------------------------------------- */}
      <AtmosphericCanvas
        sequenceStage={sequenceStage}
        isObservatoryActive={isObservatoryActive}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-0 cosmic-vignette transition-opacity duration-[1200ms] ${
          isObservatoryActive ? "opacity-75" : "opacity-100"
        }`}
      />

      {/* --------------------------------------------------------------------
          GATEWAY UI SHELL (Fades & scales past the camera on synchronization)
          -------------------------------------------------------------------- */}
      <div
        aria-hidden={isObservatoryActive}
        inert={isObservatoryActive || undefined}
        className={`relative z-10 w-full min-h-screen flex flex-col justify-between items-center transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity motion-reduce:transform-none ${
          isObservatoryActive
            ? "opacity-0 scale-110 blur-[2px] pointer-events-none"
            : "opacity-100 scale-100 pointer-events-auto"
        }`}
      >
        {/* LAYER 1: RESTRAINED CELESTIAL TELEMETRY */}
        <TelemetryHUD />

        {/* LAYER 2: CINEMATIC REFINED BRAND HEADER */}
        <header className="relative z-20 w-full max-w-7xl pt-8 sm:pt-12 md:pt-14 px-6 sm:px-10 md:px-14 flex flex-col items-start">
          {/* Celestial Anomaly Registry Indicator */}
          <div className="flex items-center gap-2.5 mb-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.38em] text-[#9F95B3]/80 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BFA8FF] animate-pulse shadow-[0_0_8px_#BFA8FF]" />
            <span>[ DIMENSION // UNKNOWN HARMONIC : ETHEREAL ]</span>
          </div>

          {/* Style 02 Razor-Sharp Sci-Fi Display Wordmark */}
          <h1 className="font-[family-name:var(--font-orbitron)] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.25em] sm:tracking-[0.32em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#E9E2F5] to-[#B69AFF] drop-shadow-[0_0_22px_rgba(113,54,217,0.45)] select-none">
            VENJIX
          </h1>

          {/* Monospace Cinematic Subtitle */}
          <p className="mt-1.5 sm:mt-2.5 font-[family-name:var(--font-jetbrains-mono)] text-xs sm:text-sm tracking-[0.42em] sm:tracking-[0.52em] text-[#BFA8FF]/75 uppercase font-light">
            A Multiverse Deepdive
          </p>
        </header>

        {/* LAYER 3: EXPANSIVE DIMENSIONAL NEGATIVE SPACE */}
        <section
          aria-label="The Cosmic Ethereal Environment"
          className="relative z-10 flex flex-1 items-center justify-center w-full my-auto px-2 sm:px-6 py-2 sm:py-6 pointer-events-none"
        />

        {/* LAYER 4: TAGLINE & CELESTIAL COMMUNION TRIGGER */}
        <footer className="relative z-20 flex flex-col items-center text-center pb-8 sm:pb-12 md:pb-14 px-4 w-full max-w-2xl">
          {/* Brand Tagline */}
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xs sm:text-sm tracking-[0.32em] sm:tracking-[0.42em] text-[#F3F0FA]/90 uppercase font-light mb-6 sm:mb-8 text-glow-celestial">
            BEYOND THE BOUNDARIES OF REALITY.
          </h2>

          {/* Ethereal Initiate Discovery Trigger */}
          <InitiateContactButton
            key={gatewayResetKey}
            onSequenceChange={handleStageChange}
            onComplete={handleEnterObservatory}
          />
        </footer>
      </div>

      {/* --------------------------------------------------------------------
          COSMIC OBSERVATORY SHELL (Milestone 2: Smooth Canvas Expansion Target)
          -------------------------------------------------------------------- */}
      <CosmicObservatory
        isActive={isObservatoryActive}
        onExitGateway={handleExitObservatory}
      />
    </main>
  );
}
