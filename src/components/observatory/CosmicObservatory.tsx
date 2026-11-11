"use client";

import React, { useState } from "react";
import ArtifactSymbol from "@/components/gateway/ArtifactSymbol";
import ObservatoryNavbar, { ObservatorySector } from "./ObservatoryNavbar";

/**
 * ============================================================================
 * COMPONENT: CosmicObservatory
 * ============================================================================
 * MILESTONE 2 (STEP 1): Cosmic Observatory View Shell & Reality Orbs Placeholder
 *
 * Visual Architecture:
 * - Emerges seamlessly from the WebGL2 gateway camera zoom without a hard cut.
 * - Floating translucent navigation capsule (ObservatoryNavbar) integrated
 *   cleanly into open cosmic negative space.
 * - Centered Multiverse Network / Reality Orbs placeholder constellation ready
 *   for interactive reality cluster binding in subsequent Milestone 2 phases.
 */

interface CosmicObservatoryProps {
  /** Controls visibility & zoom entrance state */
  isActive: boolean;
  /** Returns visitor smoothly back to the Gateway */
  onExitGateway: () => void;
}

interface RealityOrbPlaceholder {
  id: string;
  designation: string;
  harmonic: string;
  x: number; // Coordinate in 640x440 constellation space
  y: number;
  sizeClass: string;
  coreColor: string;
  auraColor: string;
}

const REALITY_ORBS: RealityOrbPlaceholder[] = [
  {
    id: "orb-prime",
    designation: "REALITY // α-01",
    harmonic: "ETHEREAL PRIME",
    x: 150,
    y: 128,
    sizeClass: "w-9 h-9 sm:w-11 sm:h-11",
    coreColor: "#F6F3FE",
    auraColor: "rgba(182, 154, 255, 0.45)",
  },
  {
    id: "orb-astral",
    designation: "REALITY // β-02",
    harmonic: "ASTRAL DRIFT",
    x: 492,
    y: 114,
    sizeClass: "w-8 h-8 sm:w-10 sm:h-10",
    coreColor: "#E0F2FE",
    auraColor: "rgba(2, 132, 199, 0.40)",
  },
  {
    id: "orb-ethereal",
    designation: "REALITY // γ-03",
    harmonic: "LUMINOUS VEIL",
    x: 540,
    y: 248,
    sizeClass: "w-10 h-10 sm:w-12 sm:h-12",
    coreColor: "#FFFFFF",
    auraColor: "rgba(113, 54, 217, 0.50)",
  },
  {
    id: "orb-abyssal",
    designation: "REALITY // δ-04",
    harmonic: "DEEP HORIZON",
    x: 446,
    y: 336,
    sizeClass: "w-8 h-8 sm:w-9 sm:h-9",
    coreColor: "#DDD6FE",
    auraColor: "rgba(113, 54, 217, 0.38)",
  },
  {
    id: "orb-nexus",
    designation: "REALITY // ε-05",
    harmonic: "CHROMA ION",
    x: 188,
    y: 326,
    sizeClass: "w-9 h-9 sm:w-11 sm:h-11",
    coreColor: "#FAE8FF",
    auraColor: "rgba(184, 34, 156, 0.42)",
  },
  {
    id: "orb-echo",
    designation: "REALITY // ζ-06",
    harmonic: "VOID ECHO",
    x: 104,
    y: 232,
    sizeClass: "w-7 h-7 sm:w-9 sm:h-9",
    coreColor: "#E9E2F5",
    auraColor: "rgba(191, 168, 255, 0.35)",
  },
];

const SECTOR_COPY: Record<
  ObservatorySector,
  { heading: string; subline: string }
> = {
  realities: {
    heading: "MULTIVERSE NETWORK // REALITY ORBS MATRIX",
    subline: "CALIBRATING DIMENSIONAL COORDINATES • SELECT AN ORB NODE TO INSPECT TELEMETRY",
  },
  resonance: {
    heading: "HARMONIC RESONANCE // FREQUENCY CONVERGENCE",
    subline: "PHASE-LOCKED COSMIC CURRENTS • SPECTRAL OBSERVATION STANDBY",
  },
  chronicles: {
    heading: "TIMELINE CHRONICLES // BRANCH TOPOLOGY",
    subline: "DIVERGENT CONTINUUM THREADS • ARCHIVAL PROJECTION INITIALIZED",
  },
  origins: {
    heading: "ORIGIN SINGULARITY // ARTIFACT ARCHIVE",
    subline: "TRANSDIMENSIONAL CORE KEYSTONE • EQUILIBRIUM CONFIRMED",
  },
};

export default function CosmicObservatory({
  isActive,
  onExitGateway,
}: CosmicObservatoryProps) {
  const [activeSector, setActiveSector] =
    useState<ObservatorySector>("realities");
  const [focusedOrbId, setFocusedOrbId] = useState<string | null>(null);

  const handleSelectSector = (sector: ObservatorySector) => {
    setActiveSector(sector);
    setFocusedOrbId(null);
  };

  const selectedOrb = REALITY_ORBS.find((orb) => orb.id === focusedOrbId) ?? null;
  const sectorInfo = SECTOR_COPY[activeSector];

  return (
    <section
      aria-label="Cosmic Observatory"
      aria-hidden={!isActive}
      inert={!isActive || undefined}
      className={`fixed inset-0 z-20 flex flex-col justify-between items-center transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity motion-reduce:transform-none ${
        isActive
          ? "opacity-100 scale-100 delay-200 pointer-events-auto"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* Floating Translucent Cosmic Navigation Capsule */}
      <ObservatoryNavbar
        activeSector={activeSector}
        onSelectSector={handleSelectSector}
        onExitGateway={onExitGateway}
        isInteractive={isActive}
      />

      {/* Central Multiverse Network / Reality Orbs Placeholder Constellation */}
      <div className="relative flex-1 w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center">
        {/* Ambient Soft Cosmic Nexus Halo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[radial-gradient(circle,rgba(113,54,217,0.16)_0%,rgba(10,6,24,0.06)_55%,transparent_75%)] blur-2xl"
        />

        {/* Proportional 16:11 Constellation Stage (640x440 aligned SVG + Nodes) */}
        <div className="relative w-full max-w-[640px] aspect-[16/11] flex items-center justify-center">
          {/* SVG Orbital Geometry & Gossamer Filament Links */}
          <svg
            viewBox="0 0 640 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient
                id="observatory-link-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#F6F3FE" stopOpacity="0.40" />
                <stop offset="50%" stopColor="#B69AFF" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#7136D9" stopOpacity="0.14" />
              </linearGradient>
            </defs>

            {/* Concentric Tilted Orbital Harmonics */}
            <ellipse
              cx="320"
              cy="220"
              rx="236"
              ry="136"
              transform="rotate(-10 320 220)"
              stroke="#B69AFF"
              strokeOpacity="0.14"
              strokeWidth="1"
              strokeDasharray="2 7"
            />
            <ellipse
              cx="320"
              cy="220"
              rx="178"
              ry="104"
              transform="rotate(14 320 220)"
              stroke="#7136D9"
              strokeOpacity="0.20"
              strokeWidth="1"
            />
            <circle
              cx="320"
              cy="220"
              r="72"
              stroke="#F3F0FA"
              strokeOpacity="0.10"
              strokeWidth="0.75"
              strokeDasharray="1 5"
            />

            {/* Primary Filaments from Singularity Nexus (320, 220) to Reality Orbs */}
            {REALITY_ORBS.map((orb) => {
              const isHighlighted = focusedOrbId === orb.id;
              return (
                <line
                  key={`link-${orb.id}`}
                  x1="320"
                  y1="220"
                  x2={orb.x}
                  y2={orb.y}
                  stroke={isHighlighted ? "#F6F3FE" : "url(#observatory-link-grad)"}
                  strokeOpacity={isHighlighted ? 0.65 : 0.45}
                  strokeWidth={isHighlighted ? "1.35" : "0.9"}
                />
              );
            })}

            {/* Subtle Peripheral Ring Tethers */}
            <g stroke="#B69AFF" strokeOpacity="0.12" strokeWidth="0.75">
              <line x1="150" y1="128" x2="492" y2="114" />
              <line x1="492" y1="114" x2="540" y2="248" />
              <line x1="540" y1="248" x2="446" y2="336" />
              <line x1="446" y1="336" x2="188" y2="326" />
              <line x1="188" y1="326" x2="104" y2="232" />
              <line x1="104" y1="232" x2="150" y2="128" />
            </g>
          </svg>

          {/* Central Singularity Anchor */}
          <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0A0618]/50 border border-[#B69AFF]/25 backdrop-blur-md shadow-[0_0_45px_rgba(113,54,217,0.35)]">
              <ArtifactSymbol className="w-12 h-12 sm:w-14 sm:h-14" isAnimated />
            </div>
          </div>

          {/* Suspended Reality Orb Placeholder Nodes */}
          {REALITY_ORBS.map((orb) => {
            const isSelected = focusedOrbId === orb.id;
            return (
              <button
                key={orb.id}
                type="button"
                tabIndex={isActive ? 0 : -1}
                onClick={() =>
                  setFocusedOrbId((prev) => (prev === orb.id ? null : orb.id))
                }
                aria-label={`${orb.designation} ${orb.harmonic}`}
                style={{
                  left: `${(orb.x / 640) * 100}%`,
                  top: `${(orb.y / 440) * 100}%`,
                }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B69AFF] rounded-full"
              >
                {/* Translucent Reality Sphere */}
                <span
                  style={{
                    boxShadow: isSelected
                      ? `0 0 28px ${orb.auraColor}, inset 0 0 14px rgba(255,255,255,0.45)`
                      : `0 0 18px ${orb.auraColor}, inset 0 0 10px rgba(255,255,255,0.22)`,
                  }}
                  className={`${orb.sizeClass} relative flex items-center justify-center rounded-full bg-[#0A0618]/65 backdrop-blur-md border transition-all duration-500 ${
                    isSelected
                      ? "border-[#FFFFFF]/75 scale-115"
                      : "border-[#B69AFF]/30 group-hover:border-[#B69AFF]/70 group-hover:scale-110"
                  }`}
                >
                  <span
                    style={{ backgroundColor: orb.coreColor }}
                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full animate-filament-shimmer"
                  />
                </span>

                {/* Subtle Micro Designation Tag */}
                <span
                  className={`mt-1.5 px-2 py-0.5 rounded-full bg-[#030206]/70 border border-[#B69AFF]/15 font-[family-name:var(--font-jetbrains-mono)] text-[8px] sm:text-[9px] tracking-[0.20em] uppercase whitespace-nowrap transition-opacity duration-300 ${
                    isSelected
                      ? "text-[#F6F3FE] opacity-100 border-[#B69AFF]/45"
                      : "text-[#9F95B3]/80 opacity-65 group-hover:opacity-100 group-hover:text-[#F3F0FA]"
                  }`}
                >
                  {orb.harmonic}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quiet Editorial Constellation Readout */}
        <div className="mt-2 sm:mt-4 flex flex-col items-center text-center px-4">
          <p className="font-[family-name:var(--font-space-grotesk)] text-xs sm:text-sm tracking-[0.28em] sm:tracking-[0.34em] text-[#F3F0FA]/90 uppercase font-light text-glow-celestial">
            {selectedOrb
              ? `${selectedOrb.designation} // ${selectedOrb.harmonic}`
              : sectorInfo.heading}
          </p>
          <p className="mt-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.24em] text-[#9F95B3]/75 uppercase max-w-xl">
            {selectedOrb
              ? "ORBITAL REALITY NODE LOCKED • FULL MULTIVERSE CARTOGRAPHY INCOMING IN NEXT STEP"
              : sectorInfo.subline}
          </p>
        </div>
      </div>

      {/* Subtle Bottom Observatory Perimeter Readout */}
      <footer className="pointer-events-none w-full flex items-center justify-between px-4 sm:px-8 pb-4 sm:pb-6 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.26em] text-[#9F95B3]/55 uppercase">
        <span>NEXUS // SYNCHRONIZED</span>
        <span className="hidden sm:inline">MULTIVERSE NETWORK SHELL</span>
        <span>COHERENCE // 100%</span>
      </footer>
    </section>
  );
}
