"use client";

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import ObservatoryNavbar from "./ObservatoryNavbar";
import RealityConstellation from "./RealityConstellation";
import RealityInspector from "./RealityInspector";
import EnigmaCommunion, {
  CrystallizeDivergencePayload,
} from "./EnigmaCommunion";
import {
  CUSTOM_REALITIES_STORAGE_KEY,
  DEFAULT_OBSERVATORY_SPECTRUM,
  MAX_CUSTOM_REALITIES,
  REALITY_NODES,
  SYNAPTIC_LINKS,
  RealityNode,
  SynapticLink,
  synthesizeCustomRealityNode,
} from "./realityData";
import type { EnigmaActivityState } from "../gateway/AtmosphericCanvas";

/**
 * ============================================================================
 * COMPONENT: CosmicObservatory
 * ============================================================================
 * MILESTONE 2 + MILESTONE 3 + MILESTONE 4:
 * Living Reality Orbs, Synaptic Threads, Enigma Communion & Custom Divergence Spawning
 *
 * Coordinates the interactive Multiverse Network suspended in deep space:
 * - Floating translucent navigation bar with quick reality switching & Enigma entry.
 * - Full-viewport organic SVG constellation connecting 5 foundational + up to 3
 *   user-crystallized Reality Orbs via luminous Cubic Bezier synaptic threads.
 * - Right-sanctuary border-minimal Reality Deep-Dive inspection overlay.
 * - Full-screen Harmonic Singularity Communion interface ("The Enigma").
 * - Live spectral RGB & harmonic activity telemetry streamed upstream into WebGL2.
 */

interface CosmicObservatoryProps {
  /** Controls visibility & zoom entrance state */
  isActive: boolean;
  /** Returns visitor smoothly back to the Gateway */
  onExitGateway: () => void;
  /** Broadcasts smoothly hovered/selected reality RGB spectrum toward WebGL2 */
  onSpectrumChange?: (spectrum: [number, number, number]) => void;
  /** Broadcasts Enigma consciousness state ("idle" | "synthesizing" | "transmitting") */
  onEnigmaStateChange?: (state: EnigmaActivityState) => void;
}

export default function CosmicObservatory({
  isActive,
  onExitGateway,
  onSpectrumChange,
  onEnigmaStateChange,
}: CosmicObservatoryProps) {
  const [customNodes, setCustomNodes] = useState<RealityNode[]>([]);
  const [customLinks, setCustomLinks] = useState<SynapticLink[]>([]);
  const [selectedRealityId, setSelectedRealityId] = useState<string | null>(
    null
  );
  const [hoveredRealityId, setHoveredRealityId] = useState<string | null>(null);
  const [isEnigmaOpen, setIsEnigmaOpen] = useState<boolean>(false);
  const [newlyBornId, setNewlyBornId] = useState<string | null>(null);

  const bornTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate session-persisted custom user divergences safely after mount
  useEffect(() => {
    let rafId = 0;
    try {
      const raw = window.sessionStorage.getItem(CUSTOM_REALITIES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          nodes?: RealityNode[];
          links?: SynapticLink[];
        };
        if (Array.isArray(parsed?.nodes) && Array.isArray(parsed?.links)) {
          const restoredNodes = parsed.nodes
            .filter(
              (n) =>
                Boolean(n?.id) &&
                typeof n.x === "number" &&
                typeof n.y === "number" &&
                Array.isArray(n.spectrum) &&
                n.spectrum.length === 3
            )
            .slice(0, MAX_CUSTOM_REALITIES);
          const validIds = new Set([
            ...REALITY_NODES.map((n) => n.id),
            ...restoredNodes.map((n) => n.id),
          ]);
          const restoredLinks = parsed.links.filter(
            (l) => validIds.has(l.sourceId) && validIds.has(l.targetId)
          );
          rafId = requestAnimationFrame(() => {
            setCustomNodes(restoredNodes);
            setCustomLinks(restoredLinks);
          });
        }
      }
    } catch {
      // Ignore restricted or malformed sessionStorage
    }
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (bornTimerRef.current !== null) {
        clearTimeout(bornTimerRef.current);
      }
    };
  }, []);

  const allNodes = useMemo(
    () => [...REALITY_NODES, ...customNodes],
    [customNodes]
  );

  const allLinks = useMemo(
    () => [...SYNAPTIC_LINKS, ...customLinks],
    [customLinks]
  );

  const selectedReality =
    allNodes.find((node) => node.id === selectedRealityId) ?? null;

  const hoveredReality =
    allNodes.find((node) => node.id === hoveredRealityId) ?? null;

  // Hovering an orb previews its spectral hue smoothly; otherwise hold selected reality or default violet
  const targetSpectrum =
    (hoveredReality ?? selectedReality)?.spectrum ??
    DEFAULT_OBSERVATORY_SPECTRUM;

  useEffect(() => {
    if (!isActive) return;
    onSpectrumChange?.(targetSpectrum);
  }, [isActive, targetSpectrum, onSpectrumChange]);

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

  const handleOpenEnigma = useCallback(() => {
    setIsEnigmaOpen(true);
  }, []);

  const handleToggleEnigma = useCallback(() => {
    setIsEnigmaOpen((prev) => !prev);
  }, []);

  const handleCloseEnigma = useCallback(() => {
    setIsEnigmaOpen(false);
  }, []);

  const handleCrystallizeDivergence = useCallback(
    (payload: CrystallizeDivergencePayload) => {
      if (customNodes.length >= MAX_CUSTOM_REALITIES) return;

      const parentReality =
        allNodes.find((n) => n.id === payload.parentRealityId) ?? null;

      const { node, link } = synthesizeCustomRealityNode({
        hypothesis: payload.hypothesis,
        transmission: payload.transmission,
        telemetry: payload.telemetry,
        parentReality,
        existingNodes: allNodes,
        customIndex: customNodes.length + 1,
      });

      const nextCustomNodes = [...customNodes, node];
      const nextCustomLinks = [...customLinks, link];

      setCustomNodes(nextCustomNodes);
      setCustomLinks(nextCustomLinks);

      try {
        window.sessionStorage.setItem(
          CUSTOM_REALITIES_STORAGE_KEY,
          JSON.stringify({
            nodes: nextCustomNodes,
            links: nextCustomLinks,
          })
        );
      } catch {
        // Ignore restricted sessionStorage
      }

      setIsEnigmaOpen(false);
      setHoveredRealityId(null);
      setSelectedRealityId(node.id);
      setNewlyBornId(node.id);

      if (bornTimerRef.current !== null) {
        clearTimeout(bornTimerRef.current);
      }
      bornTimerRef.current = setTimeout(() => {
        setNewlyBornId((curr) => (curr === node.id ? null : curr));
        bornTimerRef.current = null;
      }, 4500);
    },
    [allNodes, customNodes, customLinks]
  );

  const handleExit = useCallback(() => {
    setIsEnigmaOpen(false);
    setSelectedRealityId(null);
    setHoveredRealityId(null);
    setNewlyBornId(null);
    onSpectrumChange?.(DEFAULT_OBSERVATORY_SPECTRUM);
    onEnigmaStateChange?.("idle");
    onExitGateway();
  }, [onExitGateway, onSpectrumChange, onEnigmaStateChange]);

  const isObservatoryLayerInteractive = isActive && !isEnigmaOpen;

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
        nodes={allNodes}
        selectedRealityId={selectedRealityId}
        onSelectReality={handleToggleSelectReality}
        onHoverReality={setHoveredRealityId}
        onOpenEnigma={handleToggleEnigma}
        isEnigmaOpen={isEnigmaOpen}
        onExitGateway={handleExit}
        isInteractive={isObservatoryLayerInteractive}
      />

      {/* Interactive Multiverse Network Stage */}
      <div
        className={`relative flex-1 w-full flex flex-col items-center justify-center px-4 sm:px-8 overflow-visible transition-opacity duration-700 ${
          isEnigmaOpen ? "opacity-15 pointer-events-none" : "opacity-100"
        }`}
      >
        <RealityConstellation
          nodes={allNodes}
          links={allLinks}
          selectedId={selectedRealityId}
          hoveredId={hoveredRealityId}
          newlyBornId={newlyBornId}
          onSelect={(id) => handleToggleSelectReality(id)}
          onHover={setHoveredRealityId}
          isInteractive={isObservatoryLayerInteractive}
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
        allNodes={allNodes}
        allLinks={allLinks}
        onClose={handleClearSelection}
        onSelectReality={handleDirectSelectReality}
        onCommune={handleOpenEnigma}
        isObservatoryActive={isObservatoryLayerInteractive}
      />

      {/* Subtle Bottom Cosmic Telemetry Horizon */}
      <footer
        className={`pointer-events-none w-full flex items-center justify-between px-4 sm:px-8 pb-4 sm:pb-5 font-[family-name:var(--font-jetbrains-mono)] text-[8px] sm:text-[9px] tracking-[0.26em] text-[#9F95B3]/55 uppercase transition-opacity duration-500 ${
          isEnigmaOpen ? "opacity-0" : "opacity-100"
        }`}
      >
        <span>SYNAPTIC MATRIX // {allNodes.length} REALITIES ONLINE</span>
        <span className="hidden sm:inline">COSMIC OBSERVATORY // NEXUS</span>
        <span>
          {selectedReality
            ? `FOCUS // ${selectedReality.code}`
            : "COHERENCE // HARMONIC"}
        </span>
      </footer>

      {/* Dimensional Communion Interface ("The Enigma") */}
      <EnigmaCommunion
        key={selectedReality?.id ?? "global"}
        reality={selectedReality}
        isOpen={isActive && isEnigmaOpen}
        onClose={handleCloseEnigma}
        onPhaseChange={onEnigmaStateChange}
        onCrystallizeDivergence={handleCrystallizeDivergence}
        customNodeCount={customNodes.length}
        maxCustomNodes={MAX_CUSTOM_REALITIES}
      />
    </section>
  );
}
