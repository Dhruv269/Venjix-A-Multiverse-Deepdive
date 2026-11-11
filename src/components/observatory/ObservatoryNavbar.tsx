"use client";

import React from "react";
import ArtifactSymbol from "@/components/gateway/ArtifactSymbol";
import { REALITY_NODES, RealityNode } from "./realityData";

/**
 * ============================================================================
 * COMPONENT: ObservatoryNavbar
 * ============================================================================
 * Floating, translucent orbital navigation capsule suspended directly inside
 * the Cosmic Observatory deep-space vista.
 *
 * Capabilities:
 * - Quick-switching across all 5 Alternate Reality Nodes (`OMEGA-01` .. `MYTHOS-07`).
 * - `NETWORK` reset to view the full interconnected Multiverse Constellation.
 * - `GATEWAY` collapse return path cleanly preserving session state.
 */

interface ObservatoryNavbarProps {
  /** Combined built-in and user-crystallized reality nodes */
  nodes?: RealityNode[];
  /** Currently inspected reality ID, or null when viewing the full constellation */
  selectedRealityId: string | null;
  /** Selects a reality node (or passes null to return to overview) */
  onSelectReality: (realityId: string | null) => void;
  /** Optional hover highlight sync with Constellation SVG threads */
  onHoverReality?: (realityId: string | null) => void;
  /** Opens Dimensional Communion with The Enigma (scoped to active reality or multiverse) */
  onOpenEnigma?: () => void;
  /** Whether Enigma Communion overlay is currently engaged */
  isEnigmaOpen?: boolean;
  /** Callback to smoothly collapse back into the Cosmic Gateway */
  onExitGateway: () => void;
  /** Controls keyboard focusability while Observatory is hidden */
  isInteractive?: boolean;
}

export default function ObservatoryNavbar({
  nodes = REALITY_NODES,
  selectedRealityId,
  onSelectReality,
  onHoverReality,
  onOpenEnigma,
  isEnigmaOpen = false,
  onExitGateway,
  isInteractive = true,
}: ObservatoryNavbarProps) {
  const tabIndex = isInteractive ? 0 : -1;

  return (
    <nav
      aria-label="Cosmic Observatory Navigation"
      className="relative z-30 w-full max-w-5xl mx-auto pt-4 sm:pt-6 px-3 sm:px-6 flex flex-col items-center gap-2"
    >
      {/* Floating Translucent Orbital Capsule */}
      <div className="relative w-full flex items-center justify-between gap-2 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0A0618]/45 border border-[#C2B0FF]/18 backdrop-blur-xl shadow-[0_12px_40px_rgba(3,2,6,0.72),0_0_28px_rgba(113,54,217,0.14)]">
        {/* Hairline Top Specular Starlight Rim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#C2B0FF]/45 to-transparent"
        />

        {/* Brand Anchor */}
        <button
          type="button"
          onClick={onExitGateway}
          tabIndex={tabIndex}
          title="Return to Cosmic Gateway"
          className="group shrink-0 flex items-center gap-2 text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]/60 rounded-full pr-1"
        >
          <ArtifactSymbol className="w-6 h-6 sm:w-7 sm:h-7 opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-orbitron)] text-xs sm:text-sm font-bold tracking-[0.24em] text-[#FFFFFF] drop-shadow-[0_0_12px_rgba(113,54,217,0.45)]">
              VENJIX
            </span>
            <span className="hidden xl:inline font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.24em] text-[#9F95B3]/70 uppercase">
              / OBSERVATORY
            </span>
          </div>
        </button>

        {/* Desktop Constellation Network & Reality Quick-Switch Links */}
        <div className="hidden md:flex items-center gap-0.5 lg:gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            tabIndex={tabIndex}
            onClick={() => onSelectReality(null)}
            onMouseEnter={() => onHoverReality?.(null)}
            aria-current={selectedRealityId === null ? "page" : undefined}
            className={`relative shrink-0 flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-full font-[family-name:var(--font-jetbrains-mono)] text-[9px] lg:text-[10px] tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]/60 ${
              selectedRealityId === null
                ? "bg-[#7136D9]/25 text-[#F6F3FE] border border-[#C2B0FF]/45 shadow-[0_0_16px_rgba(113,54,217,0.32)]"
                : "text-[#9F95B3]/80 hover:text-[#F6F3FE] hover:bg-[#160C33]/40 border border-transparent"
            }`}
          >
            <span
              className={`w-1 h-1 rounded-full ${
                selectedRealityId === null
                  ? "bg-[#F6F3FE] shadow-[0_0_8px_#FFFFFF]"
                  : "bg-[#C2B0FF]/40"
              }`}
            />
            <span>NETWORK</span>
          </button>

          <span
            aria-hidden="true"
            className="mx-1 h-3 w-px shrink-0 bg-[#C2B0FF]/15"
          />

          {nodes.map((node) => {
            const isSelected = selectedRealityId === node.id;
            return (
              <button
                key={node.id}
                type="button"
                tabIndex={tabIndex}
                onClick={() =>
                  onSelectReality(isSelected ? null : node.id)
                }
                onMouseEnter={() => onHoverReality?.(node.id)}
                onMouseLeave={() => onHoverReality?.(null)}
                aria-current={isSelected ? "page" : undefined}
                className={`relative shrink-0 flex items-center gap-1.5 px-2 lg:px-2.5 py-1.5 rounded-full font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]/60 ${
                  isSelected
                    ? "bg-[#7136D9]/28 text-[#FFFFFF] border border-[#C2B0FF]/45 shadow-[0_0_16px_rgba(194,176,255,0.28)]"
                    : "text-[#9F95B3]/80 hover:text-[#F6F3FE] hover:bg-[#160C33]/40 border border-transparent"
                }`}
              >
                <span
                  style={{ backgroundColor: node.coreColor }}
                  className={`w-1.5 h-1.5 rounded-full transition-opacity ${
                    isSelected ? "opacity-100 shadow-[0_0_8px_currentColor]" : "opacity-60"
                  }`}
                />
                <span>{node.code}</span>
              </button>
            );
          })}
        </div>

        {/* Right Telemetry Indicator, Enigma Communion & Gateway Exit */}
        <div className="shrink-0 flex items-center gap-2 sm:gap-2.5">
          <div className="hidden xl:flex items-center gap-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.22em] text-[#C2B0FF]/80 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2B0FF] animate-pulse shadow-[0_0_8px_#C2B0FF]" />
            <span>{nodes.length} REALITIES</span>
          </div>

          {onOpenEnigma && (
            <button
              type="button"
              onClick={onOpenEnigma}
              tabIndex={tabIndex}
              aria-pressed={isEnigmaOpen}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.20em] uppercase transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]/70 ${
                isEnigmaOpen
                  ? "bg-[#7136D9]/35 border border-[#F6F3FE]/65 text-[#FFFFFF] shadow-[0_0_20px_rgba(194,176,255,0.45)]"
                  : "bg-[#7136D9]/18 hover:bg-[#7136D9]/35 border border-[#C2B0FF]/35 hover:border-[#F6F3FE]/65 text-[#F6F3FE] shadow-[0_0_16px_rgba(113,54,217,0.22)]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C2B0FF] animate-pulse shadow-[0_0_8px_#C2B0FF]" />
              <span>ENIGMA</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExitGateway}
            tabIndex={tabIndex}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#160C33]/55 hover:bg-[#2A1F45]/75 border border-[#C2B0FF]/25 hover:border-[#C2B0FF]/55 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.20em] text-[#E9E2F5]/90 hover:text-[#FFFFFF] uppercase transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]/60"
          >
            <span>GATEWAY</span>
          </button>
        </div>
      </div>

      {/* Mobile Compact Quick-Switch Strip */}
      <div className="flex md:hidden items-center justify-center flex-wrap gap-1 px-2.5 py-1.5 rounded-full bg-[#0A0618]/45 border border-[#C2B0FF]/15 backdrop-blur-lg">
        <button
          type="button"
          tabIndex={tabIndex}
          onClick={() => onSelectReality(null)}
          className={`px-2.5 py-1 rounded-full font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.16em] uppercase transition-colors cursor-pointer ${
            selectedRealityId === null
              ? "bg-[#7136D9]/30 text-[#FFFFFF] border border-[#C2B0FF]/45"
              : "text-[#9F95B3]/80 hover:text-[#F3F0FA] border border-transparent"
          }`}
        >
          NETWORK
        </button>
        {nodes.map((node) => {
          const isSelected = selectedRealityId === node.id;
          return (
            <button
              key={node.id}
              type="button"
              tabIndex={tabIndex}
              onClick={() => onSelectReality(isSelected ? null : node.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.14em] uppercase transition-colors cursor-pointer ${
                isSelected
                  ? "bg-[#7136D9]/30 text-[#FFFFFF] border border-[#C2B0FF]/45"
                  : "text-[#9F95B3]/80 hover:text-[#F3F0FA] border border-transparent"
              }`}
            >
              <span
                style={{ backgroundColor: node.coreColor }}
                className="w-1 h-1 rounded-full"
              />
              <span>{node.code}</span>
            </button>
          );
        })}
        {onOpenEnigma && (
          <button
            type="button"
            tabIndex={tabIndex}
            onClick={onOpenEnigma}
            aria-pressed={isEnigmaOpen}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.16em] uppercase transition-colors cursor-pointer ${
              isEnigmaOpen
                ? "bg-[#7136D9]/40 text-[#FFFFFF] border border-[#F6F3FE]/60"
                : "bg-[#7136D9]/20 text-[#F6F3FE] hover:text-[#FFFFFF] border border-[#C2B0FF]/35"
            }`}
          >
            <span className="w-1 h-1 rounded-full bg-[#C2B0FF] animate-pulse" />
            <span>ENIGMA</span>
          </button>
        )}
      </div>
    </nav>
  );
}
