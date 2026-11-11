"use client";

import React, { useEffect, useMemo } from "react";
import {
  REALITY_NODES,
  SYNAPTIC_LINKS,
  RealityNode,
  SynapticLink,
  getConnectedNodeIds,
} from "./realityData";

/**
 * ============================================================================
 * COMPONENT: RealityInspector
 * ============================================================================
 * Ethereal, border-minimal Deep-Dive Inspection Overlay emerging smoothly in
 * the right/center-right cosmic sanctuary when a Reality Orb is selected.
 *
 * Design Discipline:
 * - Zero rectangular box borders or opaque card headers.
 * - Uses radial atmospheric scrims, 1px starlight gradient hairlines, and
 *   open cosmic typography to suspend telemetry directly inside deep space.
 */

interface RealityInspectorProps {
  reality: RealityNode | null;
  allNodes?: RealityNode[];
  allLinks?: SynapticLink[];
  onClose: () => void;
  onSelectReality: (realityId: string) => void;
  onCommune: () => void;
  isObservatoryActive: boolean;
}

export default function RealityInspector({
  reality,
  allNodes = REALITY_NODES,
  allLinks = SYNAPTIC_LINKS,
  onClose,
  onSelectReality,
  onCommune,
  isObservatoryActive,
}: RealityInspectorProps) {
  const isVisible = Boolean(reality) && isObservatoryActive;

  const nodeById = useMemo(
    () => Object.fromEntries(allNodes.map((node) => [node.id, node])),
    [allNodes]
  );

  // Close deep-dive inspector cleanly on Escape key while active
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, onClose]);

  const tabIndex = isVisible ? 0 : -1;

  const connectedPeers = reality
    ? Array.from(getConnectedNodeIds(reality.id, allLinks))
        .filter((id) => id !== reality.id)
        .map((id) => nodeById[id])
        .filter(Boolean)
    : [];

  return (
    <aside
      aria-label={
        reality ? `Deep-dive inspection for ${reality.title}` : "Reality Inspector"
      }
      aria-hidden={!isVisible}
      inert={!isVisible || undefined}
      className={`fixed z-30 inset-x-4 bottom-12 sm:bottom-14 md:inset-x-auto md:bottom-auto md:right-8 lg:right-14 md:top-1/2 md:-translate-y-1/2 md:w-[410px] lg:w-[450px] transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity motion-reduce:transform-none ${
        isVisible
          ? "opacity-100 translate-y-0 md:translate-x-0 pointer-events-auto"
          : "opacity-0 translate-y-4 md:translate-y-0 md:translate-x-8 pointer-events-none"
      }`}
    >
      {/* Atmospheric Radial Scrim & Hairline Light Architecture (No Boxed Card) */}
      <div className="relative pl-5 sm:pl-6 pr-4 py-6 sm:py-7 bg-[radial-gradient(ellipse_at_right,rgba(10,6,24,0.88)_0%,rgba(3,2,6,0.74)_68%,rgba(3,2,6,0.30)_100%)] backdrop-blur-xl md:backdrop-blur-md">
        {/* Vertical Left Hairline Filament */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 inset-y-4 w-px bg-gradient-to-b from-transparent via-[#C2B0FF]/45 to-transparent"
        />

        {/* Top Starlight Hairline Horizon */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 right-6 h-px bg-gradient-to-r from-[#C2B0FF]/55 via-[#7136D9]/25 to-transparent"
        />

        {reality && (
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Return Action & Live Divergence Fraction */}
            <div className="flex items-center justify-between gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px]">
              <button
                type="button"
                tabIndex={tabIndex}
                onClick={onClose}
                className="tracking-[0.22em] text-[#C2B0FF]/85 hover:text-[#F6F3FE] uppercase transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]/60"
              >
                [ &larr; RETURN TO CONSTELLATION ]
              </button>

              <span className="tracking-[0.20em] text-[#9F95B3]/80 uppercase">
                DIV // {reality.divergence}
              </span>
            </div>

            {/* Reality Classification & Monumental Header */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.24em] text-[#C2B0FF] uppercase">
                <span
                  style={{
                    backgroundColor: reality.coreColor,
                    boxShadow: `0 0 10px ${reality.coreColor}`,
                  }}
                  className="w-2 h-2 rounded-full"
                />
                <span>{reality.classification}</span>
              </div>

              <h2 className="font-[family-name:var(--font-orbitron)] text-xl sm:text-2xl lg:text-[26px] font-bold tracking-[0.12em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#F6F3FE] to-[#C2B0FF] drop-shadow-[0_0_18px_rgba(113,54,217,0.45)]">
                {reality.title}
              </h2>

              <p className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] sm:text-[11px] tracking-[0.20em] text-[#9F95B3] uppercase">
                {reality.essence}
              </p>
            </div>

            {/* Hairline Starlight Divider */}
            <div
              aria-hidden="true"
              className="h-px w-full bg-gradient-to-r from-[#C2B0FF]/40 via-[#7136D9]/20 to-transparent"
            />

            {/* Harmonic Telemetry Metrics (Floating Open Columns) */}
            <div className="grid grid-cols-3 gap-3 font-[family-name:var(--font-jetbrains-mono)]">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] sm:text-[9px] tracking-[0.20em] text-[#9F95B3]/70 uppercase">
                  ENTROPY INDEX
                </span>
                <span className="text-xs sm:text-sm text-[#F6F3FE] font-medium tracking-wider">
                  {reality.telemetry.entropyIndex}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[8px] sm:text-[9px] tracking-[0.20em] text-[#9F95B3]/70 uppercase">
                  TEMPORAL DRIFT
                </span>
                <span className="text-xs sm:text-sm text-[#C2B0FF] font-medium tracking-wider">
                  {reality.telemetry.temporalDrift}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[8px] sm:text-[9px] tracking-[0.20em] text-[#9F95B3]/70 uppercase">
                  RESONANCE
                </span>
                <span className="text-xs sm:text-sm text-[#F6F3FE] font-medium tracking-wider">
                  {reality.telemetry.resonanceStability}
                </span>
              </div>
            </div>

            {/* Dimensional Lore Synopsis */}
            <p className="font-[family-name:var(--font-inter)] text-xs sm:text-[13px] leading-relaxed text-[#E9E2F5]/85 font-light">
              {reality.synopsis}
            </p>

            {/* Synaptic Thread Connected Neighbor Links */}
            {connectedPeers.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.18em] uppercase">
                <span className="text-[#9F95B3]/65">SYNAPTIC THREADS:</span>
                {connectedPeers.map((peer) => (
                  <button
                    key={peer.id}
                    type="button"
                    tabIndex={tabIndex}
                    onClick={() => onSelectReality(peer.id)}
                    className="flex items-center gap-1.5 text-[#C2B0FF]/85 hover:text-[#FFFFFF] underline underline-offset-4 decoration-[#C2B0FF]/35 hover:decoration-[#F6F3FE] transition-colors cursor-pointer"
                  >
                    <span
                      style={{ backgroundColor: peer.coreColor }}
                      className="w-1 h-1 rounded-full"
                    />
                    <span>{peer.code}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Primary Enigma Communion Trigger */}
            <div className="pt-1 flex items-center justify-between gap-3">
              <button
                type="button"
                tabIndex={tabIndex}
                onClick={onCommune}
                className="group relative flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0A0618]/70 hover:bg-[#160C33]/85 border border-[#C2B0FF]/40 hover:border-[#F6F3FE]/70 font-[family-name:var(--font-jetbrains-mono)] text-[10px] sm:text-xs tracking-[0.22em] text-[#F6F3FE] uppercase shadow-[0_0_22px_rgba(113,54,217,0.32)] hover:shadow-[0_0_32px_rgba(194,176,255,0.48)] transition-all duration-400 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]/70"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2B0FF] group-hover:bg-[#F6F3FE] group-hover:shadow-[0_0_10px_#F6F3FE] transition-all" />
                <span>[ COMMUNE WITH THE ENIGMA -&gt; ]</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Starlight Hairline Horizon */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-12 h-px bg-gradient-to-r from-[#7136D9]/45 via-[#C2B0FF]/20 to-transparent"
        />
      </div>
    </aside>
  );
}

