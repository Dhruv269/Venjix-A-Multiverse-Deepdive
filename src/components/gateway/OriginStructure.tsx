"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import ArtifactSymbol from "./ArtifactSymbol";

/**
 * ============================================================================
 * COMPONENT: OriginStructure
 * ============================================================================
 * Purpose:
 * Renders THE ORIGIN — the monumental, non-Euclidean architectural entity at
 * the center of the dimensional event (Milestone 1.2).
 * 
 * Creative Rationale & Art Direction:
 * Replaces conventional circular portals or generic spinning rings with an
 * impossible brutalist megastructure inspired by architectural surrealism:
 * - Monumental Asymmetry: Towering monolithic pylons and stepped cantilevers
 *   that extend beyond the viewport bounds, communicating incomprehensible scale.
 * - Fractured Reality: Polygonal tectonic plates sheared from the monolith,
 *   suspended in zero-gravity space on independent depth planes.
 * - Core Dimensional Fissure: A colossal vertical rupture cleaving the monolith,
 *   emitting blinding Starlight (#E9E2F5) and Dimensional Violet (#4B208E) light shafts.
 * - Unknown Artifact Anchor: The refined VENJIX Artifact Symbol embedded as
 *   an ancient structural keystone in the monolith face.
 * 
 * Animation & Physics:
 * - Dormant Equilibrium: Extremely slow, heavy tectonic floating (28s cycle).
 * - Depth-Dependent Parallax: Restrained pitch/yaw (+/- 3.5°) responding to
 *   pointer movement with spring inertia damping (0.05 lerp).
 * - Interaction States: Dynamically flares core radiance and fracture illumination
 *   during SIGNAL DETECTED, DIMENSIONAL BREACH, and ORIGIN SYNCHRONIZED.
 * - Performance: Hardware-accelerated transforms, disabled on touch & reduced motion.
 */

export type OriginSequenceState =
  | "idle"
  | "signal_detected"
  | "dimensional_breach"
  | "origin_synchronized";

interface OriginStructureProps {
  /** Current state of the dimensional contact sequence */
  sequenceState?: OriginSequenceState;
  /** Optional interactive click handler */
  onInteract?: () => void;
}

export default function OriginStructure({
  sequenceState = "idle",
  onInteract,
}: OriginStructureProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Subtle 3D perspective parallax angles
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  /**
   * Pointer Parallax Handler:
   * Maps cursor coordinates to a heavy, majestic tilt (+/- 3.5 degrees max).
   * Automatically bypasses on touch screens and when reduced-motion is preferred.
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Disable on touch devices
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const { innerWidth, innerHeight } = window;
    const nx = (e.clientX / innerWidth) * 2 - 1; // -1 to 1
    const ny = (e.clientY / innerHeight) * 2 - 1; // -1 to 1

    targetTilt.current = {
      x: -ny * 3.5, // Subtle vertical pitch
      y: nx * 3.5,  // Subtle horizontal yaw
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetTilt.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    /**
     * Damped physics interpolation loop for monumental mass sensation.
     */
    const updateTilt = () => {
      currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * 0.05;
      currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * 0.05;

      setTilt({
        x: Number(currentTilt.current.x.toFixed(3)),
        y: Number(currentTilt.current.y.toFixed(3)),
      });

      animFrameId.current = requestAnimationFrame(updateTilt);
    };

    animFrameId.current = requestAnimationFrame(updateTilt);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Dynamic illumination multipliers based on sequence progression
  const isBreaching = sequenceState === "dimensional_breach";
  const isDetected = sequenceState === "signal_detected";
  const isSynchronized = sequenceState === "origin_synchronized";

  return (
    <div
      ref={containerRef}
      onClick={onInteract}
      className="relative flex items-center justify-center select-none w-full max-w-[1200px] mx-auto overflow-visible cursor-pointer group"
      style={{ perspective: "1400px" }}
      aria-label="The Origin: Monumental Dimensional Structure"
    >
      {/* 3D Depth Transform Canvas */}
      <div
        className="relative flex items-center justify-center w-full transition-transform duration-150 ease-out will-change-transform"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* ------------------------------------------------------------------
            INTERNAL FISSURE LIGHT GLOW (Atmospheric Backlight Halo)
            Intensifies dramatically during contact stages.
            ------------------------------------------------------------------ */}
        <div
          className={`absolute rounded-full pointer-events-none transition-all duration-1000 ease-out ${
            isBreaching
              ? "w-[580px] h-[580px] sm:w-[750px] sm:h-[750px] opacity-100 scale-125"
              : isDetected
              ? "w-[480px] h-[480px] sm:w-[620px] sm:h-[620px] opacity-80 scale-105"
              : isSynchronized
              ? "w-[520px] h-[520px] sm:w-[680px] sm:h-[680px] opacity-90 scale-110"
              : "w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] opacity-50"
          } origin-core-glow`}
        />

        {/* ------------------------------------------------------------------
            THE ORIGIN MEGASTRUCTURE SVG (1000 x 800 Coordinate Space)
            Brutalist non-Euclidean geometry with intersecting monolithic planes.
            ------------------------------------------------------------------ */}
        <svg
          viewBox="0 0 1000 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto max-h-[82vh] overflow-visible drop-shadow-[0_25px_60px_rgba(5,4,8,0.95)]"
        >
          <defs>
            {/* Primary Obsidian Monolith Facet Gradient */}
            <linearGradient id="monolith-primary" x1="200" y1="50" x2="600" y2="750" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E162B" />
              <stop offset="35%" stopColor="#130E1D" />
              <stop offset="75%" stopColor="#0A0710" />
              <stop offset="100%" stopColor="#050408" />
            </linearGradient>

            {/* Stepped Cantilever Shadow Facet Gradient */}
            <linearGradient id="monolith-shadow-facet" x1="600" y1="100" x2="300" y2="700" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#171022" />
              <stop offset="50%" stopColor="#0D0914" />
              <stop offset="100%" stopColor="#050408" />
            </linearGradient>

            {/* Deep Under-Cantilever Void Gradient */}
            <linearGradient id="monolith-underbelly" x1="500" y1="400" x2="500" y2="750" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#050408" />
              <stop offset="60%" stopColor="#08060D" />
              <stop offset="100%" stopColor="#120A1D" />
            </linearGradient>

            {/* Core Dimensional Fissure Incandescence */}
            <linearGradient id="fissure-light" x1="480" y1="50" x2="520" y2="750" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#E9E2F5" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#A98BFF" stopOpacity="0.75" />
              <stop offset="80%" stopColor="#7136D9" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#4B208E" stopOpacity="0.1" />
            </linearGradient>

            {/* Specular Edge Hairline Gradient */}
            <linearGradient id="fissure-edge-highlight" x1="450" y1="100" x2="550" y2="700" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#A98BFF" />
              <stop offset="100%" stopColor="#4B208E" />
            </linearGradient>

            {/* Fractured Floating Plate Gradient */}
            <linearGradient id="plate-specular" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#251C33" />
              <stop offset="45%" stopColor="#120D1C" />
              <stop offset="100%" stopColor="#06050A" />
            </linearGradient>

            {/* High-Intensity Fissure Core Filter */}
            <filter id="fissure-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur1" />
              <feGaussianBlur stdDeviation="24" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ----------------------------------------------------------------
              LAYER 0: DISTANT MONOLITHIC SILHOUETTES (Atmospheric Background)
              Ghostly non-Euclidean towers fading into the cosmic mist.
              ---------------------------------------------------------------- */}
          <g opacity="0.22" fill="#171022" stroke="#2A1D3D" strokeWidth="0.8">
            {/* Distant Pylon Far Left */}
            <polygon points="40,280 120,220 120,680 40,710" />
            {/* Distant Stepped Monolith Far Right */}
            <polygon points="860,180 960,240 960,650 860,610" />
            {/* Distant Spire Background Center */}
            <polygon points="485,30 515,30 530,350 470,350" opacity="0.35" />
          </g>

          {/* ----------------------------------------------------------------
              LAYER 1: CORE DIMENSIONAL RUPTURE & VOLUMETRIC LIGHT SHAFTS
              Blinding light escaping through the central vertical fracture.
              ---------------------------------------------------------------- */}
          <g
            className={`transition-all duration-1000 ${
              isBreaching ? "opacity-100 scale-105" : "animate-fissure-breathe"
            }`}
          >
            {/* Volumetric Light Shaft Angle 1 */}
            <polygon
              points="495,120 440,760 550,760 515,120"
              fill="url(#fissure-light)"
              opacity={isBreaching ? "0.85" : "0.45"}
              filter="url(#fissure-glow-filter)"
            />

            {/* Diagonal Prismatic Light Fracture Beam */}
            <polygon
              points="505,240 780,680 720,720 495,280"
              fill="url(#fissure-light)"
              opacity={isBreaching ? "0.6" : "0.25"}
            />
            <polygon
              points="495,240 220,680 280,720 505,280"
              fill="url(#fissure-light)"
              opacity={isBreaching ? "0.6" : "0.25"}
            />

            {/* The Central Vertical Spacetime Rift Line */}
            <path
              d="M 500 60
                 L 492 180
                 L 510 290
                 L 485 410
                 L 515 540
                 L 495 680
                 L 500 760"
              stroke="#FFFFFF"
              strokeWidth={isBreaching ? "4.5" : "2.5"}
              strokeLinecap="round"
              filter="url(#fissure-glow-filter)"
            />
          </g>

          {/* ----------------------------------------------------------------
              LAYER 2: THE PRIMARY ORIGIN MEGASTRUCTURE
              Monumental intersecting brutalist masses forming the main entity.
              ---------------------------------------------------------------- */}
          <g className="animate-origin-drift">
            {/* Primary Left Bastion Monolith */}
            <polygon
              points="
                280,140 
                480,180 
                480,720 
                240,680 
                240,420 
                280,400"
              fill="url(#monolith-primary)"
              stroke="#2A1D3D"
              strokeWidth="1.5"
            />

            {/* Left Tower Stepped Architectural Overhangs */}
            <polygon
              points="
                280,140 
                380,80 
                480,180 
                380,240"
              fill="url(#monolith-shadow-facet)"
              stroke="#A98BFF"
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />
            <polygon
              points="
                240,420 
                340,360 
                480,440 
                380,500"
              fill="url(#monolith-shadow-facet)"
              stroke="#7136D9"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />

            {/* Massive Cantilever Wing (Right Flank — Extends Asymmetrically) */}
            <polygon
              points="
                520,180 
                780,120 
                780,480 
                680,620 
                520,720"
              fill="url(#monolith-primary)"
              stroke="#2A1D3D"
              strokeWidth="1.5"
            />

            {/* Right Wing Upper Chamfered Deck */}
            <polygon
              points="
                520,180 
                620,90 
                780,120 
                680,210"
              fill="url(#monolith-shadow-facet)"
              stroke="#A98BFF"
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />

            {/* Right Wing Deep Under-Soffit Void */}
            <polygon
              points="
                680,480 
                780,480 
                680,620 
                580,620"
              fill="url(#monolith-underbelly)"
            />

            {/* Cavernous Center Under-Abyss Chamber */}
            <polygon
              points="
                430,520 
                570,520 
                600,750 
                400,750"
              fill="#050408"
              stroke="#4B208E"
              strokeWidth="1"
            />

            {/* Razor-Sharp Fissure Chasm Facing Edges (Catching Intense Backlight) */}
            <polyline
              points="480,180 480,720"
              stroke="url(#fissure-edge-highlight)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polyline
              points="520,180 520,720"
              stroke="url(#fissure-edge-highlight)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Architectural Inset Void Slits & Technical Light Channels */}
            <line x1="320" y1="280" x2="440" y2="300" stroke="#A98BFF" strokeWidth="1.2" strokeOpacity="0.75" />
            <line x1="320" y1="310" x2="400" y2="325" stroke="#7136D9" strokeWidth="1" strokeOpacity="0.6" />
            <line x1="560" y1="280" x2="680" y2="250" stroke="#A98BFF" strokeWidth="1.2" strokeOpacity="0.75" />
            <line x1="560" y1="310" x2="640" y2="295" stroke="#7136D9" strokeWidth="1" strokeOpacity="0.6" />
            <line x1="560" y1="340" x2="720" y2="310" stroke="#E9E2F5" strokeWidth="1.2" strokeOpacity="0.8" />

            {/* Structural Anchor Coordinates Etched on Stone */}
            <text
              x="260"
              y="660"
              fill="#A49AAF"
              fontSize="9"
              fontFamily="var(--font-jetbrains-mono)"
              letterSpacing="0.25em"
              opacity="0.6"
            >
              [ SECTOR-0 // NON-EUCLIDEAN ]
            </text>
            <text
              x="620"
              y="650"
              fill="#A49AAF"
              fontSize="9"
              fontFamily="var(--font-jetbrains-mono)"
              letterSpacing="0.25em"
              opacity="0.6"
            >
              [ TENSOR-AXIS // 0x9F4 ]
            </text>

            {/* --------------------------------------------------------------
                THE VENJIX ARTIFACT SIGNATURE KEYSTONE
                Embedded permanently onto the left monolithic face.
                -------------------------------------------------------------- */}
            <g transform="translate(325, 430) scale(0.35)">
              <ArtifactSymbol isAnimated={isBreaching || isDetected} />
            </g>
          </g>

          {/* ----------------------------------------------------------------
              LAYER 3: FLOATING FRACTURED TECTONIC PLATES
              Large geometric shards sheared from reality, floating in orbit.
              ---------------------------------------------------------------- */}
          {/* Shard 1: Upper Left Zenith Plate (Independent Drift 1) */}
          <g className="animate-fragment-1">
            <polygon
              points="140,160 230,120 260,230 170,270"
              fill="url(#plate-specular)"
              stroke="#A98BFF"
              strokeWidth="1.2"
              strokeOpacity="0.85"
            />
            {/* Beveled Facet Line */}
            <line x1="140" y1="160" x2="260" y2="230" stroke="#E9E2F5" strokeWidth="0.8" strokeOpacity="0.6" />
          </g>

          {/* Shard 2: Upper Right Void Plate (Independent Drift 2) */}
          <g className="animate-fragment-2">
            <polygon
              points="760,80 870,140 830,260 720,200"
              fill="url(#plate-specular)"
              stroke="#7136D9"
              strokeWidth="1.2"
              strokeOpacity="0.85"
            />
            <line x1="760" y1="80" x2="830" y2="260" stroke="#A98BFF" strokeWidth="0.8" strokeOpacity="0.7" />
          </g>

          {/* Shard 3: Lower-Left Foreground Sentry Shard */}
          <g className="animate-fragment-2">
            <polygon
              points="100,520 210,470 190,620 80,670"
              fill="url(#plate-specular)"
              stroke="#4B208E"
              strokeWidth="1.5"
            />
            <line x1="100" y1="520" x2="190" y2="620" stroke="#A98BFF" strokeWidth="1" strokeOpacity="0.8" />
          </g>

          {/* Shard 4: Lower-Right Cantilever Fragment */}
          <g className="animate-fragment-1">
            <polygon
              points="820,440 920,490 890,620 790,570"
              fill="url(#plate-specular)"
              stroke="#A98BFF"
              strokeWidth="1.2"
              strokeOpacity="0.75"
            />
          </g>

          {/* Shard 5: Core Orbiting Triangular Wedge (Near Central Chasm) */}
          <g
            className={`transition-transform duration-700 ${
              isBreaching ? "translate-x-6 -translate-y-4" : "animate-fragment-1"
            }`}
          >
            <polygon
              points="540,240 600,210 570,300"
              fill="#171022"
              stroke="#E9E2F5"
              strokeWidth="1.2"
            />
          </g>

          {/* Shard 6: West Fissure Wedge */}
          <g
            className={`transition-transform duration-700 ${
              isBreaching ? "-translate-x-6 -translate-y-4" : "animate-fragment-2"
            }`}
          >
            <polygon
              points="420,380 460,320 400,340"
              fill="#100B19"
              stroke="#A98BFF"
              strokeWidth="1.2"
            />
          </g>

          {/* ----------------------------------------------------------------
              LAYER 4: SPECULAR FRACTURE LIGHT BEACONS
              Gleaming point light sources along dimensional fault lines.
              ---------------------------------------------------------------- */}
          <g opacity="0.9">
            <circle cx="500" cy="180" r="3" fill="#FFFFFF" />
            <circle cx="492" cy="290" r="2.5" fill="#E9E2F5" />
            <circle cx="510" cy="410" r="3" fill="#A98BFF" />
            <circle cx="485" cy="540" r="2.5" fill="#7136D9" />
            <circle cx="500" cy="680" r="3.5" fill="#FFFFFF" />
          </g>
        </svg>
      </div>
    </div>
  );
}

