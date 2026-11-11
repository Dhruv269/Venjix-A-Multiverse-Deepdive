"use client";

import React, { useState } from "react";
import AtmosphericCanvas from "@/components/gateway/AtmosphericCanvas";
import { CosmicSequenceState } from "@/components/gateway/CosmicPhenomenon";
import TelemetryHUD from "@/components/gateway/TelemetryHUD";
import InitiateContactButton from "@/components/gateway/InitiateContactButton";

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

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between items-center bg-[#030206] text-[#F3F0FA] overflow-hidden select-none">
      {/* --------------------------------------------------------------------
          LAYER 0: NATIVE GPU DOMAIN-WARPED VOLUMETRIC NEBULA (WebGL2)
          Continuous multi-octave domain-warped fBm with asymmetric gravitational
          folding and volumetric dark dust extinction.
          -------------------------------------------------------------------- */}
      <AtmosphericCanvas sequenceStage={sequenceStage} />
      <div className="pointer-events-none fixed inset-0 z-0 cosmic-vignette" />

      {/* --------------------------------------------------------------------
          LAYER 1: RESTRAINED CELESTIAL TELEMETRY
          Quiet, peripheral editorial markers with zero text collision.
          -------------------------------------------------------------------- */}
      <TelemetryHUD />

      {/* --------------------------------------------------------------------
          LAYER 2: CINEMATIC REFINED BRAND HEADER
          Lightweight, wide-tracked cinematic letterforms embedded into space.
          -------------------------------------------------------------------- */}
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

      {/* --------------------------------------------------------------------
          LAYER 3: EXPANSIVE DIMENSIONAL NEGATIVE SPACE
          Allows the viewer to be completely absorbed by the volumetric nebula.
          -------------------------------------------------------------------- */}
      <section
        aria-label="The Cosmic Ethereal Environment"
        className="relative z-10 flex flex-1 items-center justify-center w-full my-auto px-2 sm:px-6 py-2 sm:py-6 pointer-events-none"
      />

      {/* --------------------------------------------------------------------
          LAYER 4: TAGLINE & CELESTIAL COMMUNION TRIGGER
          Refined narrative tagline & the approved "INITIATE DISCOVERY" trigger.
          -------------------------------------------------------------------- */}
      <footer className="relative z-20 flex flex-col items-center text-center pb-8 sm:pb-12 md:pb-14 px-4 w-full max-w-2xl">
        {/* Brand Tagline */}
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xs sm:text-sm tracking-[0.32em] sm:tracking-[0.42em] text-[#F3F0FA]/90 uppercase font-light mb-6 sm:mb-8 text-glow-celestial">
          BEYOND THE BOUNDARIES OF REALITY.
        </h2>

        {/* Ethereal Initiate Discovery Trigger */}
        <InitiateContactButton
          onSequenceChange={(stage) => setSequenceStage(stage)}
        />
      </footer>
    </main>
  );
}
