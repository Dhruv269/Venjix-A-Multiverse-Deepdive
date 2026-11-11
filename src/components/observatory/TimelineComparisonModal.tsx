"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cosmicAudio } from "@/lib/cosmicAudio";
import { RealityNode } from "./realityData";
import {
  COMPARISON_EPOCH_SLOTS,
  ComparableTimeline,
  buildComparableTimeline,
  pickDefaultComparisonPair,
  synthesizeNexusVerdict,
} from "./comparisonEngine";

/**
 * ============================================================================
 * COMPONENT: TimelineComparisonModal
 * ============================================================================
 * "Quantum Superposition" Parallel Life Comparison Matrix:
 * Allows comparing any two constellation timelines (TIMELINE ALPHA vs BETA)
 * across a 4-axis Radar Overlay, Metric Delta Bars, a synchronized 4-stage
 * Epoch Scrubber (DAY 01 -> +1 YR -> +5 YRS -> +10 YRS), and "The Nexus Verdict"
 * philosophical synthesis with direct Reality Breach launch triggers.
 */

interface TimelineComparisonModalProps {
  isOpen: boolean;
  nodes: RealityNode[];
  selectedRealityId: string | null;
  onClose: () => void;
  onEnterBreachForReality: (realityId: string) => void;
}

function buildRadarPoints(
  metrics: ComparableTimeline["metrics"],
  cx: number,
  cy: number,
  radius: number
): string {
  // Top: Fulfillment, Right: Divergence, Bottom: Risk/Entropy, Left: Coherence
  const axes = [
    { angle: -Math.PI / 2, ratio: Math.max(0.08, metrics.fulfillment / 100) },
    { angle: 0, ratio: Math.max(0.08, metrics.divergence / 100) },
    { angle: Math.PI / 2, ratio: Math.max(0.08, metrics.riskEntropy / 100) },
    { angle: Math.PI, ratio: Math.max(0.08, metrics.coherence / 100) },
  ];

  return axes
    .map(({ angle, ratio }) => {
      const r = radius * ratio;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function buildRadarVertices(
  metrics: ComparableTimeline["metrics"],
  cx: number,
  cy: number,
  radius: number
): Array<{ key: string; x: number; y: number }> {
  const specs = [
    { key: "fulfillment", angle: -Math.PI / 2, ratio: Math.max(0.08, metrics.fulfillment / 100) },
    { key: "divergence", angle: 0, ratio: Math.max(0.08, metrics.divergence / 100) },
    { key: "risk", angle: Math.PI / 2, ratio: Math.max(0.08, metrics.riskEntropy / 100) },
    { key: "coherence", angle: Math.PI, ratio: Math.max(0.08, metrics.coherence / 100) },
  ];

  return specs.map(({ key, angle, ratio }) => ({
    key,
    x: cx + Math.cos(angle) * radius * ratio,
    y: cy + Math.sin(angle) * radius * ratio,
  }));
}

export default function TimelineComparisonModal({
  isOpen,
  nodes,
  selectedRealityId,
  onClose,
  onEnterBreachForReality,
}: TimelineComparisonModalProps) {
  const defaultPair = useMemo(
    () => pickDefaultComparisonPair(nodes, selectedRealityId),
    [nodes, selectedRealityId]
  );

  const [alphaId, setAlphaId] = useState<string>(defaultPair.alphaId);
  const [betaId, setBetaId] = useState<string>(defaultPair.betaId);
  const [activeEpochIndex, setActiveEpochIndex] = useState<0 | 1 | 2 | 3>(2);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const alphaNode = useMemo(
    () => nodes.find((n) => n.id === alphaId) ?? nodes[0],
    [nodes, alphaId]
  );

  const betaNode = useMemo(
    () => nodes.find((n) => n.id === betaId) ?? nodes[1] ?? nodes[0],
    [nodes, betaId]
  );

  const alphaComp = useMemo(
    () => (alphaNode ? buildComparableTimeline(alphaNode) : null),
    [alphaNode]
  );

  const betaComp = useMemo(
    () => (betaNode ? buildComparableTimeline(betaNode) : null),
    [betaNode]
  );

  const verdict = useMemo(() => {
    if (!alphaComp || !betaComp) return null;
    return synthesizeNexusVerdict(alphaComp, betaComp);
  }, [alphaComp, betaComp]);

  if (!isOpen || !alphaComp || !betaComp || !verdict) {
    return null;
  }

  const activeSlot = COMPARISON_EPOCH_SLOTS[activeEpochIndex];
  const alphaStage = alphaComp.epochs[activeEpochIndex];
  const betaStage = betaComp.epochs[activeEpochIndex];

  const handleSwapTimelines = () => {
    cosmicAudio.playOrbHover();
    setAlphaId(betaComp.node.id);
    setBetaId(alphaComp.node.id);
  };

  const handleSelectEpoch = (idx: 0 | 1 | 2 | 3) => {
    if (idx !== activeEpochIndex) {
      cosmicAudio.playOrbHover();
      setActiveEpochIndex(idx);
    }
  };

  const radarCx = 135;
  const radarCy = 135;
  const radarRadius = 88;
  const alphaPolyPoints = buildRadarPoints(
    alphaComp.metrics,
    radarCx,
    radarCy,
    radarRadius
  );
  const betaPolyPoints = buildRadarPoints(
    betaComp.metrics,
    radarCx,
    radarCy,
    radarRadius
  );
  const alphaVertices = buildRadarVertices(
    alphaComp.metrics,
    radarCx,
    radarCy,
    radarRadius
  );
  const betaVertices = buildRadarVertices(
    betaComp.metrics,
    radarCx,
    radarCy,
    radarRadius
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quantum Superposition Timeline Comparison Matrix"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-[#030206]/86 backdrop-blur-2xl"
    >
      {/* Split-Horizon Dual Spectral Atmospheric Bloom */}
      <div
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle at 18% 20%, ${alphaComp.coreColor}18 0%, transparent 48%), radial-gradient(circle at 82% 20%, ${betaComp.coreColor}18 0%, transparent 48%)`,
        }}
        className="pointer-events-none fixed inset-0"
      />

      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#070412]/90 border border-[#C2B0FF]/25 shadow-[0_0_80px_rgba(3,2,6,0.95),0_0_48px_rgba(113,54,217,0.18)] p-4 sm:p-7 md:p-8 [scrollbar-width:thin] [scrollbar-color:rgba(194,176,255,0.28)_transparent]">
        {/* Hairline Starlight Specular Rim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-[#C2B0FF]/65 to-transparent"
        />

        {/* ------------------------------------------------------------------
            HEADER: Title & Dismiss Action
            ------------------------------------------------------------------ */}
        <header className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#C2B0FF]/12">
          <div>
            <div className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.28em] text-[#C2B0FF]/85 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse shadow-[0_0_8px_#38BDF8]" />
              <span>QUANTUM SUPERPOSITION {"//"} PARALLEL COMPARISON MATRIX</span>
            </div>
            <h2 className="mt-1.5 font-[family-name:var(--font-orbitron)] text-lg sm:text-2xl font-bold tracking-[0.12em] text-[#F6F3FE] uppercase">
              Timeline Alpha vs. Timeline Beta
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-full bg-[#120A2A]/75 hover:bg-[#1E1145] border border-[#C2B0FF]/30 hover:border-[#F6F3FE]/65 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.20em] text-[#E9E2F5] uppercase transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]"
          >
            [ ESC {"//"} CLOSE MATRIX ]
          </button>
        </header>

        {/* ------------------------------------------------------------------
            SELECTOR BAY: TIMELINE ALPHA <-> SWAP <-> TIMELINE BETA
            ------------------------------------------------------------------ */}
        <section
          aria-label="Timeline Branch Selectors"
          className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4"
        >
          {/* TIMELINE ALPHA SELECTOR */}
          <div className="relative rounded-2xl bg-[#0B061B]/75 border border-[#C2B0FF]/20 px-4 py-3">
            <div className="flex items-center justify-between gap-2 mb-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.22em] uppercase">
              <span className="flex items-center gap-2 text-[#C2B0FF]">
                <span
                  style={{
                    backgroundColor: alphaComp.coreColor,
                    boxShadow: `0 0 10px ${alphaComp.coreColor}`,
                  }}
                  className="w-2 h-2 rounded-full"
                />
                TIMELINE ALPHA
              </span>
              <span className="text-[#9F95B3]/75">
                {alphaComp.isPersonal ? "PERSONAL STREAM" : alphaComp.node.category}
              </span>
            </div>
            <select
              aria-label="Select Timeline Alpha"
              value={alphaComp.node.id}
              onChange={(e) => {
                cosmicAudio.playOrbHover();
                setAlphaId(e.target.value);
              }}
              className="w-full rounded-xl bg-[#04020B] border border-[#C2B0FF]/25 hover:border-[#C2B0FF]/55 focus:border-[#F6F3FE]/70 px-3 py-2 font-[family-name:var(--font-space-grotesk)] text-sm text-[#F6F3FE] focus:outline-none cursor-pointer"
            >
              {nodes.map((node) => (
                <option key={`alpha-${node.id}`} value={node.id} className="bg-[#070412] text-[#F6F3FE]">
                  {node.code} — {node.title}
                  {node.isCustom ? " [FORGED]" : ""}
                </option>
              ))}
            </select>
            <p className="mt-1.5 truncate font-[family-name:var(--font-inter)] text-[11px] text-[#9F95B3]/85">
              {alphaComp.subtitle}
            </p>
          </div>

          {/* SWAP MERIDIAN BUTTON */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleSwapTimelines}
              title="Swap Timeline Alpha and Timeline Beta"
              className="px-3 py-2 rounded-full bg-[#140B2E]/80 hover:bg-[#22144C] border border-[#C2B0FF]/35 hover:border-[#F6F3FE]/70 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.20em] text-[#E9E2F5] uppercase shadow-[0_0_20px_rgba(113,54,217,0.2)] transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]"
            >
              ⇄ SWAP
            </button>
          </div>

          {/* TIMELINE BETA SELECTOR */}
          <div className="relative rounded-2xl bg-[#0B061B]/75 border border-[#C2B0FF]/20 px-4 py-3">
            <div className="flex items-center justify-between gap-2 mb-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.22em] uppercase">
              <span className="flex items-center gap-2 text-[#7DD3FC]">
                <span
                  style={{
                    backgroundColor: betaComp.coreColor,
                    boxShadow: `0 0 10px ${betaComp.coreColor}`,
                  }}
                  className="w-2 h-2 rounded-full"
                />
                TIMELINE BETA
              </span>
              <span className="text-[#9F95B3]/75">
                {betaComp.isPersonal ? "PERSONAL STREAM" : betaComp.node.category}
              </span>
            </div>
            <select
              aria-label="Select Timeline Beta"
              value={betaComp.node.id}
              onChange={(e) => {
                cosmicAudio.playOrbHover();
                setBetaId(e.target.value);
              }}
              className="w-full rounded-xl bg-[#04020B] border border-[#C2B0FF]/25 hover:border-[#C2B0FF]/55 focus:border-[#F6F3FE]/70 px-3 py-2 font-[family-name:var(--font-space-grotesk)] text-sm text-[#F6F3FE] focus:outline-none cursor-pointer"
            >
              {nodes.map((node) => (
                <option key={`beta-${node.id}`} value={node.id} className="bg-[#070412] text-[#F6F3FE]">
                  {node.code} — {node.title}
                  {node.isCustom ? " [FORGED]" : ""}
                </option>
              ))}
            </select>
            <p className="mt-1.5 truncate font-[family-name:var(--font-inter)] text-[11px] text-[#9F95B3]/85">
              {betaComp.subtitle}
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            METRIC SUPERPOSITION: RADAR OVERLAY + DELTA BARS
            ------------------------------------------------------------------ */}
        <section
          aria-label="Metric Differential Overlay"
          className="mt-6 grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-6 items-center rounded-2xl bg-[#090516]/65 border border-[#C2B0FF]/16 p-4 sm:p-5"
        >
          {/* SVG 4-Axis Celestial Radar Overlay */}
          <div className="flex flex-col items-center">
            <svg
              viewBox="0 0 270 270"
              className="w-56 h-56 sm:w-64 sm:h-64 overflow-visible"
              aria-label="Four-axis radar overlay comparing Fulfillment, Divergence, Risk Entropy, and Coherence"
            >
              {/* Concentric Diamond Orbital Rings */}
              {[0.25, 0.5, 0.75, 1].map((scale) => {
                const r = radarRadius * scale;
                const ringPts = [
                  `${radarCx},${radarCy - r}`,
                  `${radarCx + r},${radarCy}`,
                  `${radarCx},${radarCy + r}`,
                  `${radarCx - r},${radarCy}`,
                ].join(" ");
                return (
                  <polygon
                    key={`ring-${scale}`}
                    points={ringPts}
                    fill="none"
                    stroke="rgba(194, 176, 255, 0.16)"
                    strokeWidth={scale === 1 ? 1 : 0.75}
                    strokeDasharray={scale === 0.5 ? "3 3" : undefined}
                  />
                );
              })}

              {/* Crosshair Axes */}
              <line
                x1={radarCx}
                y1={radarCy - radarRadius}
                x2={radarCx}
                y2={radarCy + radarRadius}
                stroke="rgba(194, 176, 255, 0.2)"
                strokeWidth="0.8"
              />
              <line
                x1={radarCx - radarRadius}
                y1={radarCy}
                x2={radarCx + radarRadius}
                y2={radarCy}
                stroke="rgba(194, 176, 255, 0.2)"
                strokeWidth="0.8"
              />

              {/* Alpha Polygon */}
              <polygon
                points={alphaPolyPoints}
                fill={alphaComp.coreColor}
                fillOpacity={0.22}
                stroke={alphaComp.coreColor}
                strokeWidth="1.75"
              />

              {/* Beta Polygon */}
              <polygon
                points={betaPolyPoints}
                fill={betaComp.coreColor}
                fillOpacity={0.22}
                stroke={betaComp.coreColor}
                strokeDasharray="4 2"
                strokeWidth="1.75"
              />

              {/* Alpha Vertices */}
              {alphaVertices.map((pt) => (
                <circle
                  key={`av-${pt.key}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={3.2}
                  fill={alphaComp.coreColor}
                  stroke="#030206"
                  strokeWidth="1"
                />
              ))}

              {/* Beta Vertices */}
              {betaVertices.map((pt) => (
                <circle
                  key={`bv-${pt.key}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={3.2}
                  fill={betaComp.coreColor}
                  stroke="#030206"
                  strokeWidth="1"
                />
              ))}

              {/* Cardinal Metric Labels */}
              <text
                x={radarCx}
                y={radarCy - radarRadius - 12}
                textAnchor="middle"
                className="fill-[#E9E2F5] font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.18em] uppercase"
              >
                FULFILLMENT
              </text>
              <text
                x={radarCx + radarRadius + 10}
                y={radarCy + 3}
                textAnchor="start"
                className="fill-[#E9E2F5] font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.16em] uppercase"
              >
                DIVERGE
              </text>
              <text
                x={radarCx}
                y={radarCy + radarRadius + 20}
                textAnchor="middle"
                className="fill-[#E9E2F5] font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.18em] uppercase"
              >
                RISK / ENTROPY
              </text>
              <text
                x={radarCx - radarRadius - 10}
                y={radarCy + 3}
                textAnchor="end"
                className="fill-[#E9E2F5] font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.16em] uppercase"
              >
                COHERE
              </text>
            </svg>

            {/* Legend */}
            <div className="mt-1 flex items-center gap-4 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.16em] uppercase">
              <span className="flex items-center gap-1.5 text-[#E9E2F5]">
                <span
                  style={{ backgroundColor: alphaComp.coreColor }}
                  className="w-3 h-0.5 inline-block"
                />
                {alphaComp.code}
              </span>
              <span className="flex items-center gap-1.5 text-[#E9E2F5]">
                <span
                  style={{ borderBottomColor: betaComp.coreColor }}
                  className="w-3 h-0 border-b-2 border-dashed inline-block"
                />
                {betaComp.code}
              </span>
            </div>
          </div>

          {/* Comparative +/- Delta Bars */}
          <div className="flex flex-col gap-3.5">
            {verdict.deltas.map((item) => {
              const deltaPositiveGood = item.higherIsBetter
                ? item.delta > 0
                : item.delta < 0;
              const deltaAccentClass =
                item.delta === 0
                  ? "text-[#9F95B3] border-[#C2B0FF]/20"
                  : deltaPositiveGood
                    ? "text-[#7DD3FC] border-[#38BDF8]/40 bg-[#0284C7]/12"
                    : "text-[#E879F9] border-[#E879F9]/35 bg-[#B829A0]/10";

              return (
                <div
                  key={item.key}
                  className="rounded-xl bg-[#05030C]/80 border border-[#C2B0FF]/12 px-3.5 py-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.20em] text-[#F6F3FE] uppercase">
                        {item.label}
                      </span>
                      <span className="hidden sm:inline ml-2 font-[family-name:var(--font-inter)] text-[11px] text-[#9F95B3]/70">
                        {item.sublabel}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full border font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.16em] uppercase tabular-nums ${deltaAccentClass}`}
                    >
                      β−α {item.deltaDisplay}
                    </span>
                  </div>

                  {/* Dual Proportional Tracks */}
                  <div className="grid grid-cols-[64px_1fr_64px] items-center gap-2.5 font-[family-name:var(--font-jetbrains-mono)] text-[10px] tabular-nums">
                    <span className="text-left text-[#E9E2F5]">
                      {item.alphaDisplay}
                    </span>

                    <div className="flex flex-col gap-1">
                      <div className="h-1.5 w-full rounded-full bg-[#C2B0FF]/10 overflow-hidden">
                        <div
                          style={{
                            width: `${item.alphaVal}%`,
                            backgroundColor: alphaComp.coreColor,
                            boxShadow: `0 0 10px ${alphaComp.coreColor}88`,
                          }}
                          className="h-full rounded-full transition-all duration-500"
                        />
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#C2B0FF]/10 overflow-hidden">
                        <div
                          style={{
                            width: `${item.betaVal}%`,
                            backgroundColor: betaComp.coreColor,
                            boxShadow: `0 0 10px ${betaComp.coreColor}88`,
                          }}
                          className="h-full rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>

                    <span className="text-right text-[#E9E2F5]">
                      {item.betaDisplay}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------------------------
            SYNCHRONIZED EPOCH SCRUBBER (DAY 01 -> +1 YR -> +5 YRS -> +10 YRS)
            ------------------------------------------------------------------ */}
        <section
          aria-label="Synchronized Epoch Scrubber"
          className="mt-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.22em] uppercase">
            <span className="text-[#C2B0FF]/85">
              SYNCHRONIZED EPOCH SCRUBBER {"//"} SAME AGE ACROSS PARALLEL LIVES
            </span>
            <span className="text-[#F6F3FE]">
              ACTIVE LOCK: {activeSlot.shortLabel}
            </span>
          </div>

          <div
            role="tablist"
            aria-label="Parallel Epoch Milestones"
            className="relative grid grid-cols-4 gap-2 sm:gap-3 p-1.5 rounded-2xl bg-[#0B061B]/80 border border-[#C2B0FF]/18"
          >
            {COMPARISON_EPOCH_SLOTS.map((slot) => {
              const isSelected = activeEpochIndex === slot.index;
              return (
                <button
                  key={slot.key}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => handleSelectEpoch(slot.index)}
                  className={`relative flex flex-col items-center justify-center py-2.5 px-2 rounded-xl font-[family-name:var(--font-jetbrains-mono)] transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF] ${
                    isSelected
                      ? "bg-[#7136D9]/32 border border-[#C2B0FF]/55 text-[#FFFFFF] shadow-[0_0_22px_rgba(113,54,217,0.34)]"
                      : "bg-transparent border border-transparent text-[#9F95B3]/80 hover:text-[#F6F3FE] hover:bg-[#160D33]/45"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-[10px] sm:text-xs tracking-[0.18em] font-medium">
                    <span
                      className={`w-1.5 h-1.5 rotate-45 border transition-colors ${
                        isSelected
                          ? "bg-[#F6F3FE] border-[#C2B0FF] shadow-[0_0_8px_#C2B0FF]"
                          : "bg-transparent border-[#C2B0FF]/45"
                      }`}
                    />
                    {slot.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Split-Horizon Synchronized Age Cards */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { tag: "TIMELINE ALPHA", comp: alphaComp, stage: alphaStage },
              { tag: "TIMELINE BETA", comp: betaComp, stage: betaStage },
            ].map(({ tag, comp, stage }) => (
              <div
                key={`${tag}-${comp.node.id}`}
                style={{ borderColor: `${comp.coreColor}38` }}
                className="relative rounded-2xl bg-[#080414]/85 border p-4 sm:p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.20em] uppercase">
                    <span
                      style={{ color: comp.coreColor }}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        style={{ backgroundColor: comp.coreColor }}
                        className="w-1.5 h-1.5 rounded-full"
                      />
                      {tag} {"//"} {comp.code}
                    </span>
                    <span className="text-[#9F95B3]/80">
                      {stage.stageBadge}
                    </span>
                  </div>

                  <h3 className="mt-2 font-[family-name:var(--font-orbitron)] text-sm sm:text-base font-bold tracking-[0.10em] text-[#F6F3FE] uppercase">
                    {stage.eraTitle}
                  </h3>

                  <p className="mt-2 font-[family-name:var(--font-inter)] text-xs sm:text-[13px] leading-relaxed text-[#E9E2F5]/90">
                    {stage.narrative}
                  </p>

                  <dl className="mt-4 grid grid-cols-1 gap-2.5 text-xs border-t border-[#C2B0FF]/12 pt-3">
                    <div>
                      <dt className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.22em] text-[#9F95B3]/75 uppercase">
                        {comp.isPersonal ? "WHO YOU BECOME" : "MANIFEST STATE"}
                      </dt>
                      <dd className="mt-0.5 text-[#F6F3FE]">
                        {stage.identityOrState}
                      </dd>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <dt className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.22em] text-[#9F95B3]/75 uppercase">
                          {comp.isPersonal ? "WHERE YOU LIVE" : "ANCHOR COORDINATE"}
                        </dt>
                        <dd className="mt-0.5 text-[#E9E2F5]/90">
                          {stage.environmentOrAnchor}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.22em] text-[#9F95B3]/75 uppercase">
                          {comp.isPersonal ? "WHAT YOU BUILD" : "FIELD OUTPUT"}
                        </dt>
                        <dd className="mt-0.5 text-[#E9E2F5]/90">
                          {stage.creationOrShift}
                        </dd>
                      </div>
                    </div>
                    <div>
                      <dt className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.22em] text-[#E879F9]/80 uppercase">
                        IRREVERSIBLE SACRIFICE
                      </dt>
                      <dd className="mt-0.5 text-[#F3D8FB]/90">
                        {stage.sacrificeOrCost}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------------
            THE NEXUS VERDICT: TRADE-OFF SYNTHESIS & BREACH LAUNCHERS
            ------------------------------------------------------------------ */}
        <section
          aria-label="The Nexus Verdict Trade-Off Synthesis"
          className="mt-6 rounded-2xl bg-[linear-gradient(135deg,rgba(19,11,44,0.88)_0%,rgba(7,4,18,0.92)_100%)] border border-[#C2B0FF]/25 p-4 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#C2B0FF]/12">
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.26em] text-[#C2B0FF] uppercase">
              THE NEXUS VERDICT {"//"} TRADE-OFF SYNTHESIS
            </span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.18em] text-[#38BDF8] uppercase">
              {verdict.headline}
            </span>
          </div>

          <p className="mt-3 font-[family-name:var(--font-space-grotesk)] text-sm sm:text-[15px] leading-relaxed text-[#F6F3FE]">
            {verdict.synthesis}
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-[#05030C]/75 border border-[#C2B0FF]/15 p-3">
              <div className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.20em] text-[#C2B0FF] uppercase">
                {alphaComp.code} CORE REWARD & COST
              </div>
              <p className="mt-1 text-[#E9E2F5]/95">
                <span className="text-[#7DD3FC]">Gain:</span> {verdict.alphaReward}
              </p>
              <p className="mt-1 text-[#F3D8FB]/85">
                <span className="text-[#E879F9]">Cost:</span> {verdict.alphaSacrifice}
              </p>
            </div>

            <div className="rounded-xl bg-[#05030C]/75 border border-[#C2B0FF]/15 p-3">
              <div className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.20em] text-[#7DD3FC] uppercase">
                {betaComp.code} CORE REWARD & COST
              </div>
              <p className="mt-1 text-[#E9E2F5]/95">
                <span className="text-[#7DD3FC]">Gain:</span> {verdict.betaReward}
              </p>
              <p className="mt-1 text-[#F3D8FB]/85">
                <span className="text-[#E879F9]">Cost:</span> {verdict.betaSacrifice}
              </p>
            </div>
          </div>

          {/* Direct Breach Entry Triggers */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#C2B0FF]/12">
            <button
              type="button"
              onClick={() => onEnterBreachForReality(alphaComp.node.id)}
              style={{ borderColor: `${alphaComp.coreColor}66` }}
              className="flex-1 min-w-[210px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#130A2C]/85 hover:bg-[#201247] border font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.18em] text-[#F6F3FE] uppercase transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]"
            >
              <span
                style={{ backgroundColor: alphaComp.coreColor }}
                className="w-1.5 h-1.5 rounded-full"
              />
              <span>
                {alphaComp.code}: [ ENTER BREACH → ]
              </span>
            </button>

            <button
              type="button"
              onClick={() => onEnterBreachForReality(betaComp.node.id)}
              style={{ borderColor: `${betaComp.coreColor}66` }}
              className="flex-1 min-w-[210px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#09182D]/85 hover:bg-[#10294A] border font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.18em] text-[#F6F3FE] uppercase transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#38BDF8]"
            >
              <span
                style={{ backgroundColor: betaComp.coreColor }}
                className="w-1.5 h-1.5 rounded-full"
              />
              <span>
                {betaComp.code}: [ ENTER BREACH → ]
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

