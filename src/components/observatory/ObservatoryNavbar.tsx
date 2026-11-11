"use client";

import React from "react";
import ArtifactSymbol from "@/components/gateway/ArtifactSymbol";

/**
 * ============================================================================
 * COMPONENT: ObservatoryNavbar
 * ============================================================================
 * Floating, translucent orbital navigation capsule integrated directly into
 * the Cosmic Observatory deep-space environment.
 *
 * Design Philosophy (Cosmic Ethereal):
 * - Avoids heavy SaaS top-bars, opaque boxed headers, or rigid dividers.
 * - Uses an ultra-light smoked glass capsule with hairline violet refraction
 *   and starlight active indicators.
 */

export type ObservatorySector =
  | "realities"
  | "resonance"
  | "chronicles"
  | "origins";

interface ObservatoryNavbarProps {
  /** Currently focused observatory module */
  activeSector: ObservatorySector;
  /** Callback when switching observatory sectors */
  onSelectSector: (sector: ObservatorySector) => void;
  /** Callback to smoothly collapse back into the Cosmic Gateway */
  onExitGateway: () => void;
  /** Controls keyboard focusability while faded out */
  isInteractive?: boolean;
}

const OBSERVATORY_SECTORS: Array<{
  id: ObservatorySector;
  label: string;
  code: string;
}> = [
  { id: "realities", label: "REALITIES", code: "01" },
  { id: "resonance", label: "RESONANCE", code: "02" },
  { id: "chronicles", label: "CHRONICLES", code: "03" },
  { id: "origins", label: "ORIGINS", code: "04" },
];

export default function ObservatoryNavbar({
  activeSector,
  onSelectSector,
  onExitGateway,
  isInteractive = true,
}: ObservatoryNavbarProps) {
  const tabIndex = isInteractive ? 0 : -1;

  return (
    <nav
      aria-label="Cosmic Observatory Navigation"
      className="relative z-30 w-full max-w-4xl mx-auto pt-4 sm:pt-7 px-3 sm:px-6 flex flex-col items-center gap-2"
    >
      {/* Primary Floating Translucent Capsule */}
      <div className="relative w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#0A0618]/55 border border-[#B69AFF]/20 backdrop-blur-xl shadow-[0_12px_40px_rgba(3,2,6,0.75),0_0_28px_rgba(113,54,217,0.16)]">
        {/* Hairline Top Specular Rim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#B69AFF]/45 to-transparent"
        />

        {/* Brand Anchor & Observatory Designation */}
        <button
          type="button"
          onClick={onExitGateway}
          tabIndex={tabIndex}
          title="Return to Cosmic Gateway"
          className="group flex items-center gap-2.5 text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B69AFF]/60 rounded-full pr-2"
        >
          <ArtifactSymbol className="w-6 h-6 sm:w-7 sm:h-7 opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-orbitron)] text-xs sm:text-sm font-bold tracking-[0.26em] text-[#FFFFFF] drop-shadow-[0_0_12px_rgba(113,54,217,0.45)]">
              VENJIX
            </span>
            <span className="hidden lg:inline font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.26em] text-[#9F95B3]/75 uppercase">
              / OBSERVATORY
            </span>
          </div>
        </button>

        {/* Desktop Centered Sector Links */}
        <div className="hidden md:flex items-center gap-1.5">
          {OBSERVATORY_SECTORS.map((sector) => {
            const isSelected = activeSector === sector.id;
            return (
              <button
                key={sector.id}
                type="button"
                tabIndex={tabIndex}
                onClick={() => onSelectSector(sector.id)}
                aria-current={isSelected ? "page" : undefined}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B69AFF]/60 ${
                  isSelected
                    ? "bg-[#7136D9]/25 text-[#FFFFFF] border border-[#B69AFF]/45 shadow-[0_0_18px_rgba(113,54,217,0.32)]"
                    : "text-[#9F95B3]/80 hover:text-[#F3F0FA] hover:bg-[#160C33]/50 border border-transparent"
                }`}
              >
                <span
                  className={`w-1 h-1 rounded-full transition-opacity ${
                    isSelected
                      ? "bg-[#F6F3FE] shadow-[0_0_8px_#FFFFFF] opacity-100"
                      : "bg-[#B69AFF] opacity-0"
                  }`}
                />
                <span>{sector.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Telemetry Status & Return Action */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.24em] text-[#B69AFF]/85 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B69AFF] animate-pulse shadow-[0_0_8px_#B69AFF]" />
            <span>HARMONIC</span>
          </div>

          <button
            type="button"
            onClick={onExitGateway}
            tabIndex={tabIndex}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#160C33]/65 hover:bg-[#2A1F45]/75 border border-[#B69AFF]/25 hover:border-[#B69AFF]/55 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.22em] text-[#E9E2F5]/90 hover:text-[#FFFFFF] uppercase transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B69AFF]/60"
          >
            <span>GATEWAY</span>
          </button>
        </div>
      </div>

      {/* Mobile Compact Translucent Sector Pill Bar */}
      <div className="flex md:hidden items-center justify-center flex-wrap gap-1 px-2.5 py-1.5 rounded-full bg-[#0A0618]/50 border border-[#B69AFF]/15 backdrop-blur-lg">
        {OBSERVATORY_SECTORS.map((sector) => {
          const isSelected = activeSector === sector.id;
          return (
            <button
              key={sector.id}
              type="button"
              tabIndex={tabIndex}
              onClick={() => onSelectSector(sector.id)}
              aria-current={isSelected ? "page" : undefined}
              className={`px-2.5 py-1 rounded-full font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "bg-[#7136D9]/30 text-[#FFFFFF] border border-[#B69AFF]/45"
                  : "text-[#9F95B3]/80 hover:text-[#F3F0FA] border border-transparent"
              }`}
            >
              {sector.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

