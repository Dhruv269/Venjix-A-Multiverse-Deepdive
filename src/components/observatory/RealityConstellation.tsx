"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
  REALITY_NODES,
  SYNAPTIC_LINKS,
  RealityNode,
  SynapticLink,
  getConnectedNodeIds,
} from "./realityData";

/**
 * ============================================================================
 * COMPONENT: RealityConstellation
 * ============================================================================
 * Renders the living Multiverse Network inside the Cosmic Observatory:
 * - Curved SVG Cubic Bezier synaptic threads with flowing starlight packets.
 * - Living Reality Orbs (5 foundational + user-crystallized divergences) with
 *   breathing coronas, razor-thin orbital rings, incandescent spectral cores,
 *   and floating whisper labels.
 * - Smooth spring-damped cursor parallax across deep space.
 */

interface RealityConstellationProps {
  nodes?: RealityNode[];
  links?: SynapticLink[];
  selectedId: string | null;
  hoveredId: string | null;
  newlyBornId?: string | null;
  onSelect: (realityId: string) => void;
  onHover: (realityId: string | null) => void;
  isInteractive: boolean;
}

function buildCubicSynapticPath(
  source: RealityNode,
  target: RealityNode,
  curveOffset: number
): string {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;

  const cx1 = source.x + dx * 0.32 + nx * curveOffset * 0.9;
  const cy1 = source.y + dy * 0.32 + ny * curveOffset * 0.9;
  const cx2 = source.x + dx * 0.68 + nx * curveOffset;
  const cy2 = source.y + dy * 0.68 + ny * curveOffset;

  return `M ${source.x.toFixed(1)},${source.y.toFixed(1)} C ${cx1.toFixed(1)},${cy1.toFixed(1)} ${cx2.toFixed(1)},${cy2.toFixed(1)} ${target.x.toFixed(1)},${target.y.toFixed(1)}`;
}

export default function RealityConstellation({
  nodes = REALITY_NODES,
  links = SYNAPTIC_LINKS,
  selectedId,
  hoveredId,
  newlyBornId = null,
  onSelect,
  onHover,
  isInteractive,
}: RealityConstellationProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);

  const nodeLookup = useMemo(
    () => Object.fromEntries(nodes.map((node) => [node.id, node])),
    [nodes]
  );

  // Determine spatial focus node (hover preview takes priority over selection, or combines cleanly)
  const activeFocusId = hoveredId ?? selectedId;
  const connectedSet = activeFocusId
    ? getConnectedNodeIds(activeFocusId, links)
    : null;

  /**
   * Subtle 3D cursor parallax via direct CSS variables to avoid React re-renders.
   */
  useEffect(() => {
    if (!isInteractive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const stage = stageRef.current;
    if (!stage) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = -nx * 14;
      targetY = -ny * 10;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;
      stage.style.setProperty("--parallax-x", `${currentX.toFixed(2)}px`);
      stage.style.setProperty("--parallax-y", `${currentY.toFixed(2)}px`);
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
      stage.style.setProperty("--parallax-x", "0px");
      stage.style.setProperty("--parallax-y", "0px");
    };
  }, [isInteractive]);

  const tabIndex = isInteractive ? 0 : -1;

  return (
    <div
      className={`relative w-full max-w-5xl h-[min(430px,62vh)] sm:h-[min(510px,68vh)] md:h-[min(560px,72vh)] mx-auto flex items-center justify-center transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity motion-reduce:transform-none ${
        selectedId
          ? "opacity-20 scale-95 pointer-events-none md:opacity-100 md:pointer-events-auto md:-translate-x-[15%] lg:-translate-x-[17%] md:scale-[0.90]"
          : "opacity-100 scale-100 translate-x-0"
      }`}
    >
      {/* Parallax-Suspended Constellation Field */}
      <div
        ref={stageRef}
        style={{
          transform:
            "translate3d(var(--parallax-x, 0px), var(--parallax-y, 0px), 0)",
        }}
        className="relative w-full h-full will-change-transform"
      >
        {/* Scoped Pure-CSS Keyframes for Synaptic Energy Packets & Staggered Orb Coronas */}
        <style href="venjix-constellation-keyframes" precedence="default">{`
          @keyframes synaptic-flow {
            from {
              stroke-dashoffset: 100;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes orb-corona-breathe {
            0%, 100% {
              transform: scale(0.90);
              opacity: 0.44;
            }
            50% {
              transform: scale(1.16);
              opacity: 0.88;
            }
          }
          .synaptic-packet {
            animation: synaptic-flow var(--pulse-dur, 5s) linear var(--pulse-delay, 0s) infinite;
          }
          .orb-corona {
            animation: orb-corona-breathe 5.8s ease-in-out var(--corona-delay, 0s) infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .synaptic-packet,
            .orb-corona {
              animation: none !important;
            }
          }
        `}</style>

        {/* LAYER A: LUMINOUS SYNAPTIC THREADS (SVG Underlay) */}
        <svg
          viewBox="0 0 1000 620"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
        >
          <defs>
            <filter
              id="synaptic-glow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient
              id="synaptic-packet-grad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#7136D9" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#C2B0FF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F6F3FE" stopOpacity="1" />
            </linearGradient>
          </defs>

          {links.map((link) => {
            const source = nodeLookup[link.sourceId];
            const target = nodeLookup[link.targetId];
            if (!source || !target) return null;

            const pathD = buildCubicSynapticPath(source, target, link.curveOffset);
            const isHighlighted =
              activeFocusId !== null &&
              (link.sourceId === activeFocusId ||
                link.targetId === activeFocusId);
            const isDimmed = activeFocusId !== null && !isHighlighted;

            const baseStroke = isHighlighted
              ? "rgba(246, 243, 254, 0.65)"
              : isDimmed
              ? "rgba(194, 176, 255, 0.05)"
              : "rgba(194, 176, 255, 0.14)";

            return (
              <g key={link.id}>
                {/* Base Curved Filament */}
                <path
                  d={pathD}
                  stroke={baseStroke}
                  strokeWidth={isHighlighted ? 1.55 : 1}
                  filter={isHighlighted ? "url(#synaptic-glow)" : undefined}
                  className="transition-all duration-500"
                />

                {/* Animated Starlight Energy Packet */}
                <path
                  d={pathD}
                  pathLength={100}
                  stroke={
                    isHighlighted
                      ? "#F6F3FE"
                      : "url(#synaptic-packet-grad)"
                  }
                  strokeWidth={isHighlighted ? 2 : 1.35}
                  strokeOpacity={isDimmed ? 0.12 : isHighlighted ? 0.92 : 0.55}
                  strokeDasharray={isHighlighted ? "18 82" : "12 88"}
                  strokeLinecap="round"
                  filter="url(#synaptic-glow)"
                  style={
                    {
                      "--pulse-dur": `${
                        isHighlighted
                          ? Math.max(2.6, link.pulseDurationSec * 0.62)
                          : link.pulseDurationSec
                      }s`,
                      "--pulse-delay": `${link.pulseDelaySec}s`,
                    } as React.CSSProperties
                  }
                  className="synaptic-packet transition-opacity duration-500"
                />
              </g>
            );
          })}
        </svg>

        {/* LAYER B: LIVING REALITY ORBS (BUILT-IN + USER-CRYSTALLIZED) */}
        {nodes.map((node) => {
          const isSelected = selectedId === node.id;
          const isHovered = hoveredId === node.id;
          const isNewlyBorn = newlyBornId === node.id;
          const isHighlighted = isSelected || isHovered || isNewlyBorn;
          const isConnectedNeighbor =
            connectedSet !== null && connectedSet.has(node.id) && !isHighlighted;
          const isDimmed = connectedSet !== null && !connectedSet.has(node.id);

          const depthFactor = (node.parallaxDepth - 1) * 0.35;

          return (
            <button
              key={node.id}
              type="button"
              tabIndex={tabIndex}
              onClick={() => onSelect(node.id)}
              onMouseEnter={() => onHover(node.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(node.id)}
              onBlur={() => onHover(null)}
              aria-pressed={isSelected}
              aria-label={`${node.classification}: ${node.title}`}
              style={{
                left: `${(node.x / 1000) * 100}%`,
                top: `${(node.y / 620) * 100}%`,
              }}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]/75 rounded-full transition-all duration-500 ${
                isDimmed
                  ? "opacity-30 scale-92"
                  : isConnectedNeighbor
                  ? "opacity-85 scale-100"
                  : isHighlighted
                  ? "opacity-100 scale-112 z-20"
                  : "opacity-100 scale-100"
              }`}
            >
              {/* Spatial Multi-Layered Anomaly Sphere */}
              <span
                style={{
                  transform: `translate3d(calc(var(--parallax-x, 0px) * ${depthFactor.toFixed(
                    2
                  )}), calc(var(--parallax-y, 0px) * ${depthFactor.toFixed(
                    2
                  )}), 0)`,
                }}
                className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20"
              >
                {/* Layer 1: Staggered Breathing Outer Corona */}
                <span
                  aria-hidden="true"
                  style={
                    {
                      background: `radial-gradient(circle, ${node.auraColor} 0%, transparent 72%)`,
                      "--corona-delay": `-${node.pulseDelaySec}s`,
                    } as React.CSSProperties
                  }
                  className="orb-corona pointer-events-none absolute -inset-4 sm:-inset-5 rounded-full blur-md transition-transform duration-700 group-hover:scale-125"
                />

                {/* Genesis Shockwave Pulse when freshly crystallized by user */}
                {isNewlyBorn && (
                  <span
                    aria-hidden="true"
                    style={{ borderColor: node.coreColor }}
                    className="pointer-events-none absolute -inset-3 rounded-full border-2 opacity-75 animate-ping motion-reduce:hidden"
                  />
                )}

                {/* Layer 2: Razor-Thin Rotating Dashed Orbital Ring */}
                <span
                  aria-hidden="true"
                  style={{
                    borderColor: isHighlighted ? "#F6F3FE" : node.coreColor,
                    animationDuration: `${node.orbitDurationSec}s`,
                  }}
                  className={`pointer-events-none absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-dashed animate-spin motion-reduce:animate-none transition-all duration-500 ${
                    isHighlighted
                      ? "opacity-80 scale-110"
                      : "opacity-30 group-hover:opacity-75 group-hover:scale-110"
                  }`}
                />

                {/* Layer 3: Delicate Hairline Tilted Resonance Ring */}
                <span
                  aria-hidden="true"
                  style={{
                    borderColor: node.secondaryColor,
                  }}
                  className={`pointer-events-none absolute w-11 h-11 sm:w-13 sm:h-13 rounded-full border transition-all duration-700 ${
                    isHighlighted
                      ? "opacity-75 scale-120 rotate-45"
                      : "opacity-25 scale-95 group-hover:opacity-70 group-hover:scale-120 group-hover:rotate-45"
                  }`}
                />

                {/* Layer 4: Incandescent Celestial Core */}
                <span
                  style={{
                    background: `radial-gradient(circle at 38% 36%, #F6F3FE 0%, ${node.coreColor} 44%, ${node.secondaryColor} 92%)`,
                    boxShadow: isHighlighted
                      ? `0 0 26px ${node.auraColor}, 0 0 12px #F6F3FE`
                      : `0 0 16px ${node.auraColor}, inset 0 0 8px rgba(246,243,254,0.65)`,
                  }}
                  className={`relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-transform duration-500 ${
                    isHighlighted ? "scale-120" : "group-hover:scale-115"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#F6F3FE] shadow-[0_0_8px_#FFFFFF]" />
                </span>
              </span>

              {/* Floating Whisper Labels */}
              <span className="mt-1 sm:mt-1.5 flex flex-col items-center text-center pointer-events-none select-none">
                <span
                  className={`font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.24em] uppercase transition-colors duration-300 ${
                    isHighlighted
                      ? "text-[#F6F3FE] text-glow-celestial"
                      : "text-[#C2B0FF]/85 group-hover:text-[#F6F3FE]"
                  }`}
                >
                  {node.code}
                </span>

                <span
                  className={`mt-0.5 font-[family-name:var(--font-space-grotesk)] text-[10px] sm:text-xs tracking-[0.12em] font-light whitespace-nowrap transition-colors duration-300 ${
                    isHighlighted
                      ? "text-[#FFFFFF]"
                      : "text-[#E9E2F5]/70 group-hover:text-[#F6F3FE]"
                  }`}
                >
                  {node.title}
                </span>

                <span
                  className={`mt-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.20em] uppercase whitespace-nowrap transition-opacity duration-300 ${
                    isHighlighted
                      ? "text-[#C2B0FF] opacity-100"
                      : "text-[#9F95B3]/65 opacity-75 group-hover:opacity-100 group-hover:text-[#C2B0FF]"
                  }`}
                >
                  DIVERGENCE // {node.divergence}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
