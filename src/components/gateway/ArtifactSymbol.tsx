import React from "react";

/**
 * ============================================================================
 * COMPONENT: ArtifactSymbol
 * ============================================================================
 * Purpose:
 * Renders the refined, ethereal VENJIX Celestial Cipher Seal.
 * 
 * Creative Rationale (Cosmic Ethereal Direction):
 * Strips all brutalist slabs, blocky monoliths, and mechanical borders.
 * Refines the symbol into an ancient, organic celestial seal composed of
 * interwoven luminous filaments, non-Euclidean energy arcs, and radiant starlight nodes:
 * 
 * Architecture:
 * - Tri-Axial Celestial Loops: Three gossamer energy paths intertwining in fluid harmony.
 * - Central Singularity Keystone: A delicate starlight aperture radiating soft lavender light.
 * - Constellation Filaments: Hairline energetic rays anchoring the seal to the cosmos.
 * - Perfectly balanced: Can be rendered as a subtle watermark or standalone emblem.
 */

interface ArtifactSymbolProps {
  className?: string;
  isAnimated?: boolean;
  size?: number | string;
  onClick?: () => void;
  title?: string;
}

export default function ArtifactSymbol({
  className = "w-24 h-24 md:w-32 md:h-32",
  isAnimated = false,
  size,
  onClick,
  title = "VENJIX Celestial Cipher Seal",
}: ArtifactSymbolProps) {
  const styleOverride = size
    ? { width: typeof size === "number" ? `${size}px` : size, height: typeof size === "number" ? `${size}px` : size }
    : undefined;

  return (
    <div
      onClick={onClick}
      style={styleOverride}
      className={`relative flex items-center justify-center select-none ${
        isAnimated ? "animate-filament-shimmer" : ""
      } ${className}`}
      role="img"
      aria-label={title}
    >
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Ethereal Ribbon Stroke Gradient */}
          <linearGradient id="ethereal-seal-grad" x1="40" y1="40" x2="260" y2="260" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F3F0FA" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#BFA8FF" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#6E32E3" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#B829A0" stopOpacity="0.4" />
          </linearGradient>

          {/* Core Singularity Radiance */}
          <radialGradient id="seal-core-glow" cx="150" cy="150" r="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#BFA8FF" stopOpacity="0.35" />
            <stop offset="80%" stopColor="#6E32E3" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#030206" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ------------------------------------------------------------------
            LAYER 0: Atmospheric Celestial Core Aura
            ------------------------------------------------------------------ */}
        <circle cx="150" cy="150" r="75" fill="url(#seal-core-glow)" className="pointer-events-none" />

        {/* ------------------------------------------------------------------
            LAYER 1: Sinuous Tri-Axial Interlocking Loops
            Fluid, organic curved paths intertwining without physical blockiness.
            ------------------------------------------------------------------ */}
        {/* Loop Alpha: Zenith Flow */}
        <path
          d="M 150,45 
             C 185,95 210,135 170,175 
             C 140,205 105,175 125,125 
             C 135,100 150,45 150,45 Z"
          stroke="url(#ethereal-seal-grad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* Loop Beta: South-East Flow */}
        <path
          d="M 245,210 
             C 195,190 145,180 145,230 
             C 145,270 195,260 215,220 
             C 225,200 245,210 245,210 Z"
          stroke="url(#ethereal-seal-grad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* Loop Gamma: South-West Flow */}
        <path
          d="M 55,210 
             C 105,190 155,180 155,230 
             C 155,270 105,260 85,220 
             C 75,200 55,210 55,210 Z"
          stroke="url(#ethereal-seal-grad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* ------------------------------------------------------------------
            LAYER 2: Delicate Gossamer Rays & Constellation Beads
            ------------------------------------------------------------------ */}
        {/* Fine gossamer connecting filaments */}
        <g stroke="#BFA8FF" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.65">
          <line x1="150" y1="45" x2="245" y2="210" />
          <line x1="245" y1="210" x2="55" y2="210" />
          <line x1="55" y1="210" x2="150" y2="45" />
        </g>

        {/* Central Luminous Starlight Aperture */}
        <circle cx="150" cy="150" r="4" fill="#FFFFFF" />
        <circle cx="150" cy="150" r="1.5" fill="#6E32E3" />

        {/* Peripheral Star Nodes */}
        <circle cx="150" cy="45" r="2.5" fill="#F3F0FA" />
        <circle cx="245" cy="210" r="2.5" fill="#BFA8FF" />
        <circle cx="55" cy="210" r="2.5" fill="#BFA8FF" />
      </svg>
    </div>
  );
}
