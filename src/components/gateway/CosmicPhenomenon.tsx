"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import ArtifactSymbol from "./ArtifactSymbol";

/**
 * ============================================================================
 * COMPONENT: CosmicPhenomenon
 * ============================================================================
 * Purpose:
 * Renders the new centerpiece for VENJIX: An unidentified cosmic dimensional
 * phenomenon composed of flowing luminous energy ribbons, translucent celestial
 * formations, delicate gossamer filaments, and radiant star nodes.
 * 
 * Creative Rationale (Cosmic Ethereal Direction):
 * Completely abandons brutalist architecture, physical monoliths, and mechanical portals.
 * Replaces them with an organic, fluid, boundless cosmic event inspired by celestial
 * auroras, interstellar nebula rivers, and radiant starlight convergences:
 * 
 * Visual Architecture:
 * 1. Primary Luminous Energy Ribbons: Sinuous multi-layered Bezier paths flowing
 *    across the viewport like silky cosmic veils, transitioning between Celestial
 *    White (#F3F0FA), Luminous Lavender (#BFA8FF), Electric Violet (#6E32E3), and
 *    restrained Magenta (#B829A0).
 * 2. Gossamer Filaments & Constellation Webs: Delicate, hair-thin energetic strands
 *    branching organically from the ribbons into deep space.
 * 3. Radiant Star Nodes: Luminous celestial beads and pearl-like energy points
 *    anchoring the filament network.
 * 4. Radiant Convergence Starburst: An incandescent focal burst where cosmic currents
 *    converge into an intense starlight aperture.
 * 5. Ethereal Artifact Seal: The refined VENJIX cipher embedded as a delicate
 *    harmonic resonance geometry.
 * 
 * Motion & Performance:
 * - Gentle fluid undulations (16s & 20s wave periods) mimicking zero-gravity currents.
 * - Restrained cursor parallax with spring inertia damping (0.04 lerp).
 * - Fully accessible: disables parallax on touch devices and for reduced-motion users.
 * - Reactive states: surges with celestial luminescence during contact sequences.
 */

export type CosmicSequenceState =
  | "idle"
  | "signal_detected"
  | "dimensional_resonance"
  | "origin_synchronized";

interface CosmicPhenomenonProps {
  /** Current state of the dimensional contact sequence */
  sequenceState?: CosmicSequenceState;
  /** Optional interactive click handler */
  onInteract?: () => void;
}

export default function CosmicPhenomenon({
  sequenceState = "idle",
  onInteract,
}: CosmicPhenomenonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Subtle 3D cursor parallax angles
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const targetParallax = useRef({ x: 0, y: 0 });
  const currentParallax = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  /**
   * Pointer Parallax Handler:
   * Maps cursor coordinates to a very gentle spatial tilt (+/- 2.8 degrees max).
   * Automatically bypasses on touch devices and when reduced-motion is preferred.
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const { innerWidth, innerHeight } = window;
    const nx = (e.clientX / innerWidth) * 2 - 1; // -1 to 1
    const ny = (e.clientY / innerHeight) * 2 - 1; // -1 to 1

    targetParallax.current = {
      x: -ny * 2.8,
      y: nx * 2.8,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetParallax.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    /**
     * Damped physics interpolation loop for fluid celestial inertia.
     */
    const updatePhysics = () => {
      currentParallax.current.x += (targetParallax.current.x - currentParallax.current.x) * 0.04;
      currentParallax.current.y += (targetParallax.current.y - currentParallax.current.y) * 0.04;

      setParallax({
        x: Number(currentParallax.current.x.toFixed(3)),
        y: Number(currentParallax.current.y.toFixed(3)),
      });

      animFrameId.current = requestAnimationFrame(updatePhysics);
    };

    animFrameId.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Phase-specific radiance multipliers
  const isResonating = sequenceState === "dimensional_resonance";
  const isDetected = sequenceState === "signal_detected";
  const isSynchronized = sequenceState === "origin_synchronized";

  return (
    <div
      ref={containerRef}
      onClick={onInteract}
      className="relative flex items-center justify-center select-none w-full max-w-[1300px] mx-auto overflow-visible cursor-pointer group"
      style={{ perspective: "1200px" }}
      aria-label="Cosmic Phenomenon: Luminous Energy Ribbons and Celestial Formation"
    >
      {/* 3D Depth Transform Plane */}
      <div
        className="relative flex items-center justify-center w-full transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateX(${parallax.x}deg) rotateY(${parallax.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* ------------------------------------------------------------------
            ATMOSPHERIC AURA & GRAVITATIONAL LENSING GLOW
            Volumetric radial radiance pulsating behind the central ribbons.
            ------------------------------------------------------------------ */}
        <div
          className={`absolute rounded-full pointer-events-none transition-all duration-1000 ease-out ${
            isResonating
              ? "w-[650px] h-[450px] sm:w-[900px] sm:h-[600px] opacity-100 scale-120"
              : isDetected
              ? "w-[550px] h-[380px] sm:w-[750px] sm:h-[500px] opacity-85 scale-105"
              : isSynchronized
              ? "w-[600px] h-[420px] sm:w-[820px] sm:h-[550px] opacity-90 scale-110"
              : "w-[450px] h-[320px] sm:w-[680px] sm:h-[450px] opacity-60"
          } phenomenon-core-glow`}
        />

        {/* ------------------------------------------------------------------
            COSMIC PHENOMENON SVG (1200 x 700 Coordinate Canvas)
            Flowing ribbons, gossamer filaments, and incandescent starburst.
            ------------------------------------------------------------------ */}
        <svg
          viewBox="0 0 1200 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto max-h-[85vh] overflow-visible drop-shadow-[0_0_50px_rgba(110,50,227,0.4)]"
        >
          <defs>
            {/* Primary Energy Ribbon Gradient: White -> Lavender -> Violet -> Magenta */}
            <linearGradient id="ribbon-grad-primary" x1="100" y1="350" x2="1100" y2="250" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B081A" stopOpacity="0.1" />
              <stop offset="20%" stopColor="#6E32E3" stopOpacity="0.75" />
              <stop offset="45%" stopColor="#BFA8FF" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#F3F0FA" stopOpacity="0.98" />
              <stop offset="85%" stopColor="#BFA8FF" stopOpacity="0.8" />
              <stop offset="95%" stopColor="#B829A0" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#0B081A" stopOpacity="0.05" />
            </linearGradient>

            {/* Secondary Undulating Ribbon Gradient: Translucent Violet / Cyan-Lavender */}
            <linearGradient id="ribbon-grad-secondary" x1="150" y1="200" x2="1050" y2="450" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#181033" stopOpacity="0.05" />
              <stop offset="30%" stopColor="#BFA8FF" stopOpacity="0.4" />
              <stop offset="55%" stopColor="#6E32E3" stopOpacity="0.6" />
              <stop offset="75%" stopColor="#B829A0" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0B081A" stopOpacity="0" />
            </linearGradient>

            {/* Glowing Filament Stroke Gradient */}
            <linearGradient id="filament-grad" x1="200" y1="300" x2="1000" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6E32E3" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#F3F0FA" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#BFA8FF" stopOpacity="0.3" />
            </linearGradient>

            {/* Incandescent Starburst Convergence Radial Gradient */}
            <radialGradient id="starburst-core" cx="880" cy="260" r="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="25%" stopColor="#F3F0FA" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#BFA8FF" stopOpacity="0.75" />
              <stop offset="75%" stopColor="#6E32E3" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#030206" stopOpacity="0" />
            </radialGradient>

            {/* Secondary Golden/Starlight Accent Glow */}
            <radialGradient id="starburst-warmth" cx="880" cy="260" r="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#FFE0B2" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6E32E3" stopOpacity="0" />
            </radialGradient>

            {/* High-Luminescence Filter for Ethereal Core */}
            <filter id="ethereal-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur1" />
              <feGaussianBlur stdDeviation="18" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ----------------------------------------------------------------
              LAYER 0: VOLUMETRIC CELESTIAL MISTS & NEBULA FORMATIONS
              Background sweeping veil formations creating infinite depth.
              ---------------------------------------------------------------- */}
          <g className="animate-nebula-drift" opacity="0.45">
            {/* Deep background nebula veil 1 */}
            <path
              d="M 50,420 
                 C 250,220 450,480 700,320 
                 C 900,190 1050,340 1180,260 
                 C 1050,480 850,560 620,490 
                 C 380,420 220,540 50,420 Z"
              fill="url(#ribbon-grad-secondary)"
            />
            {/* Upper faint cosmic mist plume */}
            <path
              d="M 280,120 
                 C 420,80 580,220 740,160 
                 C 920,90 1020,180 1100,140 
                 C 980,280 820,310 660,260 
                 C 500,210 380,260 280,120 Z"
              fill="url(#ribbon-grad-secondary)"
              opacity="0.3"
            />
          </g>

          {/* ----------------------------------------------------------------
              LAYER 1: SECONDARY TRANSLUCENT ENERGY RIBBONS
              Silky counter-flowing wave undulation.
              ---------------------------------------------------------------- */}
          <g className="animate-ethereal-wave-2">
            <path
              d="M 80,460 
                 C 260,340 440,510 680,360 
                 C 880,240 1020,380 1140,300"
              stroke="url(#ribbon-grad-secondary)"
              strokeWidth="24"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M 120,440 
                 C 300,310 490,480 710,340 
                 C 900,220 1040,350 1150,280"
              stroke="#BFA8FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.45"
            />
          </g>

          {/* ----------------------------------------------------------------
              LAYER 2: THE PRIMARY LUMINOUS COSMIC RIBBON (Main Flow)
              The flowing, silky celestial river dominating the composition.
              ---------------------------------------------------------------- */}
          <g className="animate-ethereal-wave-1">
            {/* Volumetric Ribbon Body: Translucent Layer 1 */}
            <path
              d="M 60,380 
                 C 220,240 420,440 640,290 
                 C 820,160 980,310 1140,220"
              stroke="url(#ribbon-grad-primary)"
              strokeWidth="38"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
              filter="url(#ethereal-glow-filter)"
            />

            {/* Radiant Internal Energy Spine: Translucent Layer 2 */}
            <path
              d="M 80,375 
                 C 240,235 435,435 650,285 
                 C 830,158 985,305 1135,215"
              stroke="url(#ribbon-grad-primary)"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />

            {/* Intense Incandescent Starlight Core Filament */}
            <path
              d="M 100,370 
                 C 260,230 450,430 660,280 
                 C 840,155 990,300 1130,210"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />

            {/* Parallel Gossamer Harmonic Filaments */}
            <path
              d="M 110,390 
                 C 270,260 460,450 670,305 
                 C 850,180 1000,320 1120,235"
              stroke="#BFA8FF"
              strokeWidth="1.2"
              fill="none"
              opacity="0.7"
              strokeDasharray="180 8"
            />
            <path
              d="M 90,355 
                 C 245,215 440,415 645,268 
                 C 825,145 975,285 1110,200"
              stroke="#BFA8FF"
              strokeWidth="1"
              fill="none"
              opacity="0.65"
            />
          </g>

          {/* ----------------------------------------------------------------
              LAYER 3: GOSSAMER FILAMENTS & CELESTIAL CONSTELLATION WEB
              Delicate, branching energetic threads connecting floating star nodes.
              ---------------------------------------------------------------- */}
          <g className="animate-filament-shimmer" stroke="url(#filament-grad)" strokeWidth="0.8" opacity="0.65">
            {/* Branching Filament Web Left (Low Density) */}
            <path d="M 220,270 Q 200,180 160,150" fill="none" />
            <path d="M 250,250 Q 290,170 340,140" fill="none" />
            <path d="M 310,320 Q 300,420 260,470" fill="none" />

            {/* Branching Filament Web Center */}
            <path d="M 470,380 Q 520,490 560,540" fill="none" />
            <path d="M 520,340 Q 580,240 640,210" fill="none" />
            <path d="M 620,310 Q 670,440 730,480" fill="none" />

            {/* Branching Filament Web Right (Toward Convergence Burst) */}
            <path d="M 780,230 Q 820,120 880,100" fill="none" />
            <path d="M 840,250 Q 940,160 1020,150" fill="none" />
            <path d="M 880,270 Q 960,370 1050,410" fill="none" />
            <path d="M 750,330 Q 820,450 920,480" fill="none" />

            {/* Connecting Diagonal Veins */}
            <line x1="880" y1="260" x2="820" y2="120" stroke="#BFA8FF" strokeWidth="0.6" strokeDasharray="3 3" />
            <line x1="880" y1="260" x2="1020" y2="150" stroke="#BFA8FF" strokeWidth="0.6" strokeDasharray="3 3" />
            <line x1="880" y1="260" x2="940" y2="360" stroke="#BFA8FF" strokeWidth="0.6" strokeDasharray="3 3" />
            <line x1="660" y1="280" x2="640" y2="210" stroke="#BFA8FF" strokeWidth="0.6" strokeDasharray="3 3" />
          </g>

          {/* ----------------------------------------------------------------
              LAYER 4: CELESTIAL STAR NODES & LUMINOUS BEADS
              Gleaming pearl-like star nodes dotting the filaments.
              ---------------------------------------------------------------- */}
          <g>
            {/* Star Node Array */}
            {[
              [160, 150, 2.5],
              [340, 140, 3],
              [260, 470, 2.5],
              [560, 540, 3.5],
              [640, 210, 3],
              [730, 480, 3.5],
              [820, 120, 4],
              [880, 100, 3],
              [1020, 150, 4.5],
              [940, 360, 4],
              [1050, 410, 3],
              [920, 480, 3.5],
              [420, 410, 2.5],
              [520, 290, 3],
              [780, 200, 3],
            ].map(([x, y, r], idx) => (
              <g key={`star-node-${idx}`}>
                {/* Node ambient halo */}
                <circle cx={x} cy={y} r={r * 2.8} fill="#BFA8FF" opacity="0.25" />
                {/* Node solid core */}
                <circle cx={x} cy={y} r={r} fill="#FFFFFF" />
              </g>
            ))}
          </g>

          {/* ----------------------------------------------------------------
              LAYER 5: RADIANT CONVERGENCE STARBURST (The Phenomenon Anchor)
              The incandescent point where cosmic ribbons converge and flare.
              ---------------------------------------------------------------- */}
          <g className={`transition-all duration-700 ${isResonating ? "scale-115" : ""}`}>
            {/* Warm core starlight radiance */}
            <circle cx="880" cy="260" r="120" fill="url(#starburst-core)" opacity="0.85" />
            <circle cx="880" cy="260" r="60" fill="url(#starburst-warmth)" opacity="0.75" />

            {/* Searing White Core Center */}
            <circle cx="880" cy="260" r="14" fill="#FFFFFF" filter="url(#ethereal-glow-filter)" />
            <circle cx="880" cy="260" r="6" fill="#FFFBE8" />

            {/* Cross-Axial Radiant Starburst Rays */}
            <g stroke="#FFFFFF" opacity="0.9">
              {/* Primary Horizontal Ray */}
              <line x1="720" y1="260" x2="1040" y2="260" strokeWidth="1.8" />
              <line x1="800" y1="260" x2="960" y2="260" strokeWidth="3.5" filter="url(#ethereal-glow-filter)" />

              {/* Primary Vertical Ray */}
              <line x1="880" y1="120" x2="880" y2="400" strokeWidth="1.8" />
              <line x1="880" y1="180" x2="880" y2="340" strokeWidth="3.5" filter="url(#ethereal-glow-filter)" />

              {/* Diagonal Diamond Rays */}
              <line x1="780" y1="160" x2="980" y2="360" strokeWidth="1" opacity="0.6" />
              <line x1="780" y1="360" x2="980" y2="160" strokeWidth="1" opacity="0.6" />
            </g>
          </g>

          {/* ----------------------------------------------------------------
              LAYER 6: THE ETHEREAL VENJIX CIPHER (Artifact Signature)
              Embedded subtly near the energy convergence as a celestial seal.
              ---------------------------------------------------------------- */}
          <g transform="translate(480, 240) scale(0.35)" opacity="0.85">
            <ArtifactSymbol isAnimated={isResonating || isDetected} />
          </g>
        </svg>
      </div>
    </div>
  );
}

