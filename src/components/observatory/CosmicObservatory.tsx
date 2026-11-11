"use client";

import React, { useState, useCallback } from "react";
import ObservatoryNavbar from "./ObservatoryNavbar";
import RealityConstellation from "./RealityConstellation";
import RealityInspector from "./RealityInspector";
import { REALITY_NODES } from "./realityData";

/**
 * ============================================================================
 * COMPONENT: CosmicObservatory
 * ============================================================================
 * MILESTONE 2 (STEP 2): Living Reality Orbs, Synaptic Threads & Spatial Deep-Dive
 *
 * Coordinates the interactive Multiverse Network suspended in deep space:
 * - Floating translucent navigation bar with quick reality switching.
 * - Full-viewport organic SVG constellation connecting 5 Alternate Realities.
 * - Right-sanctuary border-minimal Reality Deep-Dive inspection overlay.
 */

interface CosmicObservatoryProps {
  /** Controls visibility & zoom entrance state */
  isActive: boolean;
  /** Returns visitor smoothly back to the Gateway */
  onExitGateway: () => void;
}

export default function CosmicObservatory({
  isActive,
  onExitGateway,
}: CosmicObservatoryProps) {
  const [selectedRealityId, setSelectedRealityId] = useState<string | null>(
    null
  );
  const [hoveredRealityId, setHoveredRealityId] = useState<string | null>(null);

  const selectedReality =
    REALITY_NODES.find((node) => node.id === selectedRealityId) ?? null;

  const handleToggleSelectReality = useCallback((realityId: string | null) => {
    setSelectedRealityId((prev) =>
      realityId !== null && prev === realityId ? null : realityId
    );
  }, []);

  const handleDirectSelectReality = useCallback((realityId: string) => {
    setSelectedRealityId(realityId);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedRealityId(null);
  }, []);

  const handleExit = useCallback(() => {
    setSelectedRealityId(null);
    setHoveredRealityId(null);
    onExitGateway();
  }, [onExitGateway]);

  return (
    <section
      aria-label="Cosmic Observatory"
      aria-hidden={!isActive}
      inert={!isActive || undefined}
      className={`fixed inset-0 z-20 flex flex-col justify-between items-center transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity motion-reduce:transform-none ${
        isActive
          ? "opacity-100 scale-100 delay-150 pointer-events-auto"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* Floating Translucent Navigation Capsule */}
      <ObservatoryNavbar
        selectedRealityId={selectedRealityId}
        onSelectReality={handleToggleSelectReality}
        onHoverReality={setHoveredRealityId}
        onExitGateway={handleExit}
        isInteractive={isActive}
      />

      {/* Interactive Multiverse Network Stage */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 sm:px-8 overflow-visible">
        <RealityConstellation
          selectedId={selectedRealityId}
          hoveredId={hoveredRealityId}
          onSelect={(id) => handleToggleSelectReality(id)}
          onHover={setHoveredRealityId}
          isInteractive={isActive}
        />

        {/* Quiet Guidance Prompt When Exploring Constellation Overview */}
        <p
          className={`pointer-events-none mt-1 sm:mt-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.26em] text-[#9F95B3]/70 uppercase text-center transition-opacity duration-500 ${
            selectedReality ? "opacity-0" : "opacity-100"
          }`}
        >
          SELECT AN ALTERNATE REALITY ORB TO INSPECT ITS DIMENSIONAL HARMONICS
        </p>
      </div>

      {/* Ethereal Right-Sanctuary Reality Deep-Dive Overlay */}
      <RealityInspector
        reality={selectedReality}
        onClose={handleClearSelection}
        onSelectReality={handleDirectSelectReality}
        isObservatoryActive={isActive}
      />

      {/* Subtle Bottom Cosmic Telemetry Horizon */}
      <footer className="pointer-events-none w-full flex items-center justify-between px-4 sm:px-8 pb-4 sm:pb-5 font-[family-name:var(--font-jetbrains-mono)] text-[8px] sm:text-[9px] tracking-[0.26em] text-[#9F95B3]/55 uppercase">
        <span>SYNAPTIC MATRIX // 5 REALITIES ONLINE</span>
        <span className="hidden sm:inline">COSMIC OBSERVATORY // NEXUS</span>
        <span>
          {selectedReality
            ? `FOCUS // ${selectedReality.code}`
            : "COHERENCE // HARMONIC"}
        </span>
      </footer>
    </section>
  );
}
