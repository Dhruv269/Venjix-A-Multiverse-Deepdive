"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RealityNode } from "./realityData";

/* ============================================================================
 * AI-Ready Serializable Simulation Contract
 * Designed for direct population by future generative backend APIs.
 * ========================================================================== */

export type PhysicsMode =
  | "bifurcation_horizon"
  | "astral_astrolabe"
  | "inverted_entropy"
  | "dyson_harmonic"
  | "obsidian_glass_sea"
  | "procedural_hybrid";

export type EpochEraKey = "ORIGIN" | "DIVERGENCE" | "ZENITH" | "TERMINUS";

export interface RealityLaws {
  entropy: number; // 0.0 -> 1.0
  gravity: number; // 0.0 -> 1.0
  coherence: number; // 0.0 -> 1.0
}

export interface SimulationEpoch {
  id: EpochEraKey;
  yearOffset: number; // -10000 to +10000
  yearLabel: string;
  eraTitle: string;
  narrative: string;
  densityMultiplier: number;
  speedMultiplier: number;
  geometryFactor: number;
}

export interface SpatialAnomaly {
  id: string;
  code: string;
  label: string;
  coordLabel: string;
  xPct: number;
  yPct: number;
  signature: string;
  discovery: string;
}

export interface RealitySimulationConfig {
  realityId: string;
  code: string;
  title: string;
  spectralTint: [number, number, number];
  coreColor: string;
  secondaryColor: string;
  physicsMode: PhysicsMode;
  epochs: SimulationEpoch[];
  anomalies: SpatialAnomaly[];
  laws: RealityLaws;
}

/* ============================================================================
 * Curated Multiverse Presets + Deterministic Custom Procedural Builder
 * ========================================================================== */

const PRESET_SIMULATIONS: Record<
  string,
  Omit<
    RealitySimulationConfig,
    "realityId" | "code" | "title" | "spectralTint" | "coreColor" | "secondaryColor"
  >
> = {
  "omega-01": {
    physicsMode: "bifurcation_horizon",
    laws: { entropy: 0.34, gravity: 0.62, coherence: 0.84 },
    epochs: [
      {
        id: "ORIGIN",
        yearOffset: -10000,
        yearLabel: "-10,000 YR",
        eraTitle: "PRIMORDIAL MONO-STREAM",
        narrative:
          "Before the Twin-Slit fracture, every intention collapsed onto a single unbroken trajectory without shadow-echoes.",
        densityMultiplier: 0.65,
        speedMultiplier: 0.58,
        geometryFactor: 0.15,
      },
      {
        id: "DIVERGENCE",
        yearOffset: -2400,
        yearLabel: "-2,400 YR",
        eraTitle: "THE MIRROR CLEAVAGE",
        narrative:
          "Observation sheared the timeline cleanly along its central plane: choices began emitting twin anti-matter siblings.",
        densityMultiplier: 1.0,
        speedMultiplier: 1.0,
        geometryFactor: 0.62,
      },
      {
        id: "ZENITH",
        yearOffset: 3800,
        yearLabel: "+3,800 YR",
        eraTitle: "HARMONIC PARALLELISM",
        narrative:
          "Twin civilizations exchange architectural dreams across the central slit via luminous superposition interference bands.",
        densityMultiplier: 1.35,
        speedMultiplier: 1.24,
        geometryFactor: 0.92,
      },
      {
        id: "TERMINUS",
        yearOffset: 10000,
        yearLabel: "+10,000 YR",
        eraTitle: "THE FOLDING EQUILIBRIUM",
        narrative:
          "Opposing probability arcs bend back toward identity, cancelling regret into crystalline white equilibrium.",
        densityMultiplier: 1.15,
        speedMultiplier: 1.48,
        geometryFactor: 1.25,
      },
    ],
    anomalies: [
      {
        id: "omega-anm-1",
        code: "ANM-01",
        label: "Twin-Slit Focal Prism",
        coordLabel: "14.88λ // +0.02θ",
        xPct: 31,
        yPct: 37,
        signature: "SUPERPOSITION KNOT",
        discovery:
          "Photons arriving here carry phase memories from decisions made two centuries after their emission.",
      },
      {
        id: "omega-anm-2",
        code: "ANM-02",
        label: "Mirrored Echo Conduit",
        coordLabel: "48.10λ // -19.4θ",
        xPct: 62,
        yPct: 30,
        signature: "ANTI-CAUSAL FILAMENT",
        discovery:
          "Standing waves stitch upper and lower timelines together whenever collective remorse dips below threshold.",
      },
      {
        id: "omega-anm-3",
        code: "ANM-03",
        label: "Null-Decision Scar",
        coordLabel: "71.04λ // +22.7θ",
        xPct: 48,
        yPct: 58,
        signature: "COLLAPSE VOID",
        discovery:
          "An unmade vow hangs suspended as violet frost; even gravitational lensing splits cleanly around its hesitation.",
      },
    ],
  },
  "chrono-04": {
    physicsMode: "astral_astrolabe",
    laws: { entropy: 0.16, gravity: 0.78, coherence: 0.91 },
    epochs: [
      {
        id: "ORIGIN",
        yearOffset: -10000,
        yearLabel: "-10,000 YR",
        eraTitle: "THE BRASS FIRMWARE",
        narrative:
          "First monastic cartographers etched brass ephemeris arcs directly into the accretion mantle of a calm dwarf star.",
        densityMultiplier: 0.7,
        speedMultiplier: 0.48,
        geometryFactor: 0.35,
      },
      {
        id: "DIVERGENCE",
        yearOffset: -1800,
        yearLabel: "-1,800 YR",
        eraTitle: "ORBITAL CALCULUS DAWN",
        narrative:
          "Timekeepers replaced hourglasses with counter-rotating astrolabe rings tuned to prime-number stellar resonances.",
        densityMultiplier: 1.0,
        speedMultiplier: 0.92,
        geometryFactor: 0.72,
      },
      {
        id: "ZENITH",
        yearOffset: 4200,
        yearLabel: "+4,200 YR",
        eraTitle: "THE GRAND GIMBAL VAULT",
        narrative:
          "Seven concentric auroral rings spin in zero friction, indexing every birth and solar eclipse across forty sectors.",
        densityMultiplier: 1.32,
        speedMultiplier: 1.18,
        geometryFactor: 1.05,
      },
      {
        id: "TERMINUS",
        yearOffset: 10000,
        yearLabel: "+10,000 YR",
        eraTitle: "SIDEREAL LOCKSTEP",
        narrative:
          "All orbital phases converge upon a single golden perihelion where memory and prophecy become mathematically identical.",
        densityMultiplier: 1.45,
        speedMultiplier: 1.42,
        geometryFactor: 1.35,
      },
    ],
    anomalies: [
      {
        id: "chrono-anm-1",
        code: "ANM-01",
        label: "Zenith Gimbal Bearing",
        coordLabel: "00.00τ // 90.0°",
        xPct: 27,
        yPct: 33,
        signature: "PRECESSION SINGULARITY",
        discovery:
          "Zero mechanical friction measured across 8,000 revolutions; atomic decay halts inside its silver-gold collar.",
      },
      {
        id: "chrono-anm-2",
        code: "ANM-02",
        label: "Paradox Knot Sector IX",
        coordLabel: "64.12τ // 14.3°",
        xPct: 64,
        yPct: 44,
        signature: "RETROGRADE PULSE",
        discovery:
          "A sapphire vector needle sweeps counter-clockwise once every millennium to prune inconsistent histories.",
      },
      {
        id: "chrono-anm-3",
        code: "ANM-03",
        label: "Aurelian Meridian Spire",
        coordLabel: "33.75τ // -42.8°",
        xPct: 41,
        yPct: 56,
        signature: "EPHEMERIS ARCHIVE",
        discovery:
          "Light trapped along this arc replays extinct constellations that have not yet formed in sister dimensions.",
      },
    ],
  },
  "null-09": {
    physicsMode: "inverted_entropy",
    laws: { entropy: 0.72, gravity: 0.85, coherence: 0.68 },
    epochs: [
      {
        id: "ORIGIN",
        yearOffset: -10000,
        yearLabel: "-10,000 YR",
        eraTitle: "MAXIMUM SCATTER",
        narrative:
          "Reality awakens in high-temperature ash; fractured shards drift aimlessly across cold amethyst vacuum.",
        densityMultiplier: 0.8,
        speedMultiplier: 0.62,
        geometryFactor: 0.18,
      },
      {
        id: "DIVERGENCE",
        yearOffset: -3100,
        yearLabel: "-3,100 YR",
        eraTitle: "THE THERMODYNAMIC REVERSAL",
        narrative:
          "Decay signs flip negative. Shattered glass leaps upward off basalt plains and seals itself mid-air without heat.",
        densityMultiplier: 1.05,
        speedMultiplier: 1.04,
        geometryFactor: 0.68,
      },
      {
        id: "ZENITH",
        yearOffset: 2900,
        yearLabel: "+2,900 YR",
        eraTitle: "CRYSTAL CITADELS",
        narrative:
          "Ruins bloom backward into luminous polyhedral spires as entropy sinks crystallize into living violet quartz.",
        densityMultiplier: 1.32,
        speedMultiplier: 1.25,
        geometryFactor: 1.08,
      },
      {
        id: "TERMINUS",
        yearOffset: 10000,
        yearLabel: "+10,000 YR",
        eraTitle: "ZERO-DISORDER SINGULARITY",
        narrative:
          "Every scattered photon compresses into a silent obsidian diamond of total structural perfection.",
        densityMultiplier: 1.45,
        speedMultiplier: 1.5,
        geometryFactor: 1.4,
      },
    ],
    anomalies: [
      {
        id: "null-anm-1",
        code: "ANM-01",
        label: "Un-Breaking Obelisk",
        coordLabel: "-0.91σ // 11.4κ",
        xPct: 33,
        yPct: 48,
        signature: "NEG-ENTROPY WELL",
        discovery:
          "micro-fractures heal toward the observer's gaze; local cooling drops to millikelvin scales whenever symmetry locks.",
      },
      {
        id: "null-anm-2",
        code: "ANM-02",
        label: "Crimson Frost Crucible",
        coordLabel: "-0.78σ // 58.2κ",
        xPct: 60,
        yPct: 28,
        signature: "LATTICE NUCLEUS",
        discovery:
          "Dispersed plasma condensates braid themselves into geometric halos faster than acoustic shockwaves can scatter them.",
      },
      {
        id: "null-anm-3",
        code: "ANM-03",
        label: "Ashen Cathedral Apex",
        coordLabel: "-0.99σ // 02.1κ",
        xPct: 54,
        yPct: 57,
        signature: "PERFECTION HORIZON",
        discovery:
          "Time flows from ruin to blueprint here; unfinished inscriptions write their authors before birth.",
      },
    ],
  },
  "aether-12": {
    physicsMode: "dyson_harmonic",
    laws: { entropy: 0.14, gravity: 0.74, coherence: 0.94 },
    epochs: [
      {
        id: "ORIGIN",
        yearOffset: -10000,
        yearLabel: "-10,000 YR",
        eraTitle: "IGNITION OF THE FIRST LATTICE",
        narrative:
          "Autonomous photonic weavers span the bare corona with twelve superconducting filaments of indigo glass.",
        densityMultiplier: 0.72,
        speedMultiplier: 0.55,
        geometryFactor: 0.3,
      },
      {
        id: "DIVERGENCE",
        yearOffset: -1500,
        yearLabel: "-1,500 YR",
        eraTitle: "CHORAL MEGASTRUCTURE",
        narrative:
          "Solar flares no longer waste warmth into void; the Dyson shell translates radiation directly into harmonic thought.",
        densityMultiplier: 1.0,
        speedMultiplier: 1.0,
        geometryFactor: 0.76,
      },
      {
        id: "ZENITH",
        yearOffset: 4600,
        yearLabel: "+4,600 YR",
        eraTitle: "THE SOVEREIGN OCTAVE",
        narrative:
          "Three billion hexagonal mirrors hum in sympathetic resonance, turning an entire star into a lucid cosmic instrument.",
        densityMultiplier: 1.38,
        speedMultiplier: 1.28,
        geometryFactor: 1.12,
      },
      {
        id: "TERMINUS",
        yearOffset: 10000,
        yearLabel: "+10,000 YR",
        eraTitle: "TRANSCENDENT APERTURE",
        narrative:
          "Shell and star dissolve their boundary; the harmonic web opens as a doorway tuned to neighboring universes.",
        densityMultiplier: 1.5,
        speedMultiplier: 1.45,
        geometryFactor: 1.38,
      },
    ],
    anomalies: [
      {
        id: "aether-anm-1",
        code: "ANM-01",
        label: "Primary Corona Node",
        coordLabel: "528Hz // R-01",
        xPct: 29,
        yPct: 39,
        signature: "PLASMA CHOIR",
        discovery:
          "Every solar prominence modulates into clean fifths and octaves; zero thermal leakage crosses this stator ring.",
      },
      {
        id: "aether-anm-2",
        code: "ANM-02",
        label: "Geodesic Relay Spine",
        coordLabel: "741Hz // R-19",
        xPct: 63,
        yPct: 34,
        signature: "SYNAPTIC APERTURE",
        discovery:
          "Hexagonal sail plates pivot autonomously toward observer consciousness, amplifying latent resonance by 400%.",
      },
      {
        id: "aether-anm-3",
        code: "ANM-03",
        label: "Deep Mantle Harmonics",
        coordLabel: "963Hz // R-44",
        xPct: 45,
        yPct: 58,
        signature: "STANDING WAVE",
        discovery:
          "Magnetic flux tubes crystallize into braided ribbons carrying encoded histories from sixteen prior stars.",
      },
    ],
  },
  "mythos-07": {
    physicsMode: "obsidian_glass_sea",
    laws: { entropy: 0.22, gravity: 0.52, coherence: 0.86 },
    epochs: [
      {
        id: "ORIGIN",
        yearOffset: -10000,
        yearLabel: "-10,000 YR",
        eraTitle: "THE STILLING OF THE WATERS",
        narrative:
          "A boundless volcanic sea cools into seamless obsidian mirror beneath a sky untouched by wind or storm.",
        densityMultiplier: 0.68,
        speedMultiplier: 0.52,
        geometryFactor: 0.25,
      },
      {
        id: "DIVERGENCE",
        yearOffset: -2800,
        yearLabel: "-2,800 YR",
        eraTitle: "FIRST VOW-LANTERN ASCENT",
        narrative:
          "Travelers begin whispering unkept promises onto still tides; the water answers by releasing rising embers of rose light.",
        densityMultiplier: 1.0,
        speedMultiplier: 0.96,
        geometryFactor: 0.72,
      },
      {
        id: "ZENITH",
        yearOffset: 3400,
        yearLabel: "+3,400 YR",
        eraTitle: "NOCTURNE OF ARCHIPELAGOS",
        narrative:
          "Millions of suspended lanterns drift horizonward while bioluminescent wakes spell forgotten dialects across the glass.",
        densityMultiplier: 1.35,
        speedMultiplier: 1.18,
        geometryFactor: 1.06,
      },
      {
        id: "TERMINUS",
        yearOffset: 10000,
        yearLabel: "+10,000 YR",
        eraTitle: "OCEAN OF PURE REFLECTION",
        narrative:
          "Heaven and water erase their horizon line; every lantern returns home to become a permanent fixed star.",
        densityMultiplier: 1.48,
        speedMultiplier: 1.36,
        geometryFactor: 1.3,
      },
    ],
    anomalies: [
      {
        id: "mythos-anm-1",
        code: "ANM-01",
        label: "Whispering Wake Shoal",
        coordLabel: "0.00m // N-17°",
        xPct: 28,
        yPct: 55,
        signature: "LUMINOUS RIPPLE",
        discovery:
          "Concentric surface waves propagate faster downward into reflection than outward across the obsidian plain.",
      },
      {
        id: "mythos-anm-2",
        code: "ANM-02",
        label: "Rising Vow Constellation",
        coordLabel: "420m // E-61°",
        xPct: 59,
        yPct: 29,
        signature: "BIOLUMINESCENT ASCENT",
        discovery:
          "Each ascending ember carries the acoustic imprint of an oath kept intact across four generations.",
      },
      {
        id: "mythos-anm-3",
        code: "ANM-03",
        label: "Inverted Star Trench",
        coordLabel: "-890m // S-04°",
        xPct: 49,
        yPct: 59,
        signature: "MIRROR ABYSS",
        discovery:
          "Look below the horizon here and stars older than the upper sky glow gently beneath six inches of midnight glass.",
      },
    ],
  },
};

export function buildRealitySimulationConfig(
  reality: RealityNode
): RealitySimulationConfig {
  const preset = PRESET_SIMULATIONS[reality.id];
  if (preset) {
    return {
      realityId: reality.id,
      code: reality.code,
      title: reality.title,
      spectralTint: reality.spectrum,
      coreColor: reality.coreColor,
      secondaryColor: reality.secondaryColor,
      ...preset,
    };
  }

  const parsedEntropy = Number.parseFloat(reality.telemetry.entropyIndex);
  const parsedStability = Number.parseFloat(
    reality.telemetry.resonanceStability
  );
  const safeEntropy = Number.isFinite(parsedEntropy) ? parsedEntropy : 0.48;
  const safeStability = Number.isFinite(parsedStability) ? parsedStability : 78;

  return {
    realityId: reality.id,
    code: reality.code,
    title: reality.title,
    spectralTint: reality.spectrum,
    coreColor: reality.coreColor,
    secondaryColor: reality.secondaryColor,
    physicsMode: "procedural_hybrid",
    laws: {
      entropy: Number(Math.min(0.95, Math.max(0.15, safeEntropy)).toFixed(2)),
      gravity: 0.64,
      coherence: Number(
        Math.min(0.96, Math.max(0.25, safeStability / 100)).toFixed(2)
      ),
    },
    epochs: [
      {
        id: "ORIGIN",
        yearOffset: -10000,
        yearLabel: "-10,000 YR",
        eraTitle: "EMERGENT SEED VECTOR",
        narrative: `Latent quantum curvature gathers around "${reality.essence}" before crystallizing into an independent plane.`,
        densityMultiplier: 0.72,
        speedMultiplier: 0.58,
        geometryFactor: 0.3,
      },
      {
        id: "DIVERGENCE",
        yearOffset: -2000,
        yearLabel: "-2,000 YR",
        eraTitle: "ENIGMA CRYSTALLIZATION",
        narrative: `An observer query cleaved a bespoke branch here — ${reality.synopsis.slice(0, 120)}${reality.synopsis.length > 120 ? "..." : ""}`,
        densityMultiplier: 1.0,
        speedMultiplier: 1.0,
        geometryFactor: 0.78,
      },
      {
        id: "ZENITH",
        yearOffset: 3800,
        yearLabel: "+3,800 YR",
        eraTitle: "SYMPATHETIC BLOOM",
        narrative:
          "Spiraling attractors weave child realities outward along twin violet-amber filaments tuned to observer intent.",
        densityMultiplier: 1.35,
        speedMultiplier: 1.24,
        geometryFactor: 1.1,
      },
      {
        id: "TERMINUS",
        yearOffset: 10000,
        yearLabel: "+10,000 YR",
        eraTitle: "HARMONIC REINTEGRATION",
        narrative:
          "Divergent spirals tighten toward luminous equilibrium, preserving this custom reality permanently inside the vault.",
        densityMultiplier: 1.46,
        speedMultiplier: 1.44,
        geometryFactor: 1.35,
      },
    ],
    anomalies: [
      {
        id: `${reality.id}-anm-1`,
        code: "ANM-01",
        label: "Seed Singularity",
        coordLabel: "01.00δ // 00.0°",
        xPct: 31,
        yPct: 36,
        signature: "CUSTOM ORIGIN NODE",
        discovery:
          "Residual syntax from the communion prompt remains etched inside local vacuum fluctuations.",
      },
      {
        id: `${reality.id}-anm-2`,
        code: "ANM-02",
        label: "Harmonic Shear Arc",
        coordLabel: "44.20δ // +31.8°",
        xPct: 61,
        yPct: 33,
        signature: "BRANCH SPIRAL",
        discovery:
          "Orbital filaments braid dual harmonic streams borrowed from the parent constellation anchor.",
      },
      {
        id: `${reality.id}-anm-3`,
        code: "ANM-03",
        label: "Resonance Anchor",
        coordLabel: "77.09δ // -18.5°",
        xPct: 48,
        yPct: 57,
        signature: "CRYSTAL HORIZON",
        discovery:
          "Phase stability increases dramatically whenever law mutators balance entropy and coherence.",
      },
    ],
  };
}

/* ============================================================================
 * Pure Simulation Math, Deterministic PRNG & Canvas Physics Helpers
 * ========================================================================== */

function mulberry32(seedStr: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i += 1) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return [194, 176, 255];
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [
    Number.isFinite(r) ? r : 194,
    Number.isFinite(g) ? g : 176,
    Number.isFinite(b) ? b : 255,
  ];
}

function rgba(rgb: [number, number, number], alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha));
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${clamped.toFixed(3)})`;
}

function formatYearLabel(year: number): string {
  const rounded = Math.round(year / 50) * 50;
  if (rounded === 0) return "0 YR // PIVOT";
  const formatted = Math.abs(rounded).toLocaleString("en-US");
  return `${rounded > 0 ? "+" : "-"}${formatted} YR`;
}

function interpolateEpochState(
  epochs: SimulationEpoch[],
  yearOffset: number
): {
  activeEpoch: SimulationEpoch;
  density: number;
  speed: number;
  geometry: number;
} {
  const sorted = [...epochs].sort((a, b) => a.yearOffset - b.yearOffset);
  let activeEpoch = sorted[0];
  let bestDist = Infinity;
  for (const ep of sorted) {
    const dist = Math.abs(ep.yearOffset - yearOffset);
    if (dist < bestDist) {
      bestDist = dist;
      activeEpoch = ep;
    }
  }

  for (let i = 0; i < sorted.length - 1; i += 1) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (yearOffset >= a.yearOffset && yearOffset <= b.yearOffset) {
      const span = Math.max(1, b.yearOffset - a.yearOffset);
      const t = (yearOffset - a.yearOffset) / span;
      return {
        activeEpoch,
        density:
          a.densityMultiplier + (b.densityMultiplier - a.densityMultiplier) * t,
        speed: a.speedMultiplier + (b.speedMultiplier - a.speedMultiplier) * t,
        geometry:
          a.geometryFactor + (b.geometryFactor - a.geometryFactor) * t,
      };
    }
  }

  const edge = yearOffset <= sorted[0].yearOffset ? sorted[0] : sorted[sorted.length - 1];
  return {
    activeEpoch,
    density: edge.densityMultiplier,
    speed: edge.speedMultiplier,
    geometry: edge.geometryFactor,
  };
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  branch: -1 | 1;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  sides: number;
  homeAngle: number;
  homeDist: number;
}

interface PulseRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  isSecondary: boolean;
}

interface RenderParams {
  physicsMode: PhysicsMode;
  coreRgb: [number, number, number];
  secondaryRgb: [number, number, number];
  laws: RealityLaws;
  density: number;
  speed: number;
  geometry: number;
  lockedFocus: { x: number; y: number } | null;
  reducedMotion: boolean;
}

interface SimRuntime {
  particles: Particle[];
  ripples: PulseRipple[];
  pointerX: number;
  pointerY: number;
  smoothX: number;
  smoothY: number;
  pointerActive: boolean;
  isDragging: boolean;
  gimbalX: number;
  gimbalY: number;
  lastDragX: number;
  lastDragY: number;
  time: number;
}

function createParticlePool(seedId: string): Particle[] {
  const rand = mulberry32(seedId);
  const count = 160;
  const pool: Particle[] = [];
  for (let i = 0; i < count; i += 1) {
    pool.push({
      x: rand(),
      y: rand(),
      vx: (rand() - 0.5) * 0.002,
      vy: (rand() - 0.5) * 0.002,
      size: 1.1 + rand() * 2.4,
      phase: rand() * Math.PI * 2,
      branch: i % 2 === 0 ? 1 : -1,
      orbitRadius: 0.08 + rand() * 0.36,
      orbitAngle: rand() * Math.PI * 2,
      orbitSpeed: (0.25 + rand() * 0.9) * (i % 2 === 0 ? 1 : -1),
      sides: 3 + Math.floor(rand() * 4),
      homeAngle: (i / count) * Math.PI * 2,
      homeDist: 0.06 + (i % 7) * 0.042 + rand() * 0.02,
    });
  }
  return pool;
}

function renderBifurcationHorizon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rt: SimRuntime,
  params: RenderParams,
  dt: number
) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const fx = rt.smoothX * w;
  const fy = rt.smoothY * h;
  const activeCount = Math.min(
    rt.particles.length,
    Math.floor(75 + 80 * params.density)
  );
  const splitSpan = (0.14 + params.geometry * 0.16) * (1 + params.laws.entropy * 0.45);
  const flowSpeed = (0.12 + params.laws.gravity * 0.22) * params.speed;

  // Horizon bifurcation ribbons
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = rgba(params.coreRgb, 0.18 + params.laws.coherence * 0.14);
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.bezierCurveTo(cx * 0.55, cy, fx * 0.85, fy, w, cy - h * splitSpan);
  ctx.moveTo(0, cy);
  ctx.bezierCurveTo(cx * 0.55, cy, fx * 0.85, fy, w, cy + h * splitSpan);
  ctx.stroke();

  // Superposition prism halo around focus
  const ringR = 26 + params.laws.gravity * 36;
  const grad = ctx.createRadialGradient(fx, fy, 2, fx, fy, ringR * 1.8);
  grad.addColorStop(0, rgba(params.coreRgb, 0.36));
  grad.addColorStop(0.55, rgba(params.secondaryRgb, 0.12));
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(fx, fy, ringR * 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < activeCount; i += 1) {
    const p = rt.particles[i];
    if (!params.reducedMotion) {
      p.x += flowSpeed * dt * (0.7 + (i % 5) * 0.14);
      if (p.x > 1.06) {
        p.x = -0.06;
        p.y = 0.5;
      }
    }

    const px = p.x * w;
    const distPastFocus = p.x - rt.smoothX;
    const wave =
      Math.sin(rt.time * 2.1 * params.speed + p.phase + p.x * 9) *
      (6 + params.laws.entropy * 46) *
      (1.15 - params.laws.coherence * 0.75);

    let targetY = cy + wave * 0.35;
    if (distPastFocus > 0) {
      const splitProgress = Math.min(1, distPastFocus / 0.55);
      const eased = splitProgress * splitProgress * (3 - 2 * splitProgress);
      targetY =
        rt.smoothY * h +
        p.branch * eased * h * splitSpan * (0.75 + (i % 4) * 0.16) +
        wave;
    } else {
      const pull = Math.max(0, 1 - Math.abs(distPastFocus) * 2.4);
      targetY =
        cy * (1 - pull * params.laws.gravity * 0.55) +
        fy * (pull * params.laws.gravity * 0.55) +
        wave * 0.45;
    }

    const rgb = p.branch > 0 ? params.coreRgb : params.secondaryRgb;
    ctx.fillStyle = rgba(rgb, 0.55 + params.laws.coherence * 0.35);
    ctx.beginPath();
    ctx.arc(px, targetY, p.size * (0.75 + params.laws.coherence * 0.35), 0, Math.PI * 2);
    ctx.fill();

    if (i % 4 === 0) {
      ctx.strokeStyle = rgba(rgb, 0.22);
      ctx.beginPath();
      ctx.moveTo(px - 18, targetY);
      ctx.lineTo(px, targetY);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function renderAstralAstrolabe(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rt: SimRuntime,
  params: RenderParams
) {
  const cx = w * 0.5 + (rt.smoothX - 0.5) * 44;
  const cy = h * 0.5 + (rt.smoothY - 0.5) * 32;
  const minDim = Math.min(w, h);
  const ringCount = Math.max(4, Math.min(8, Math.round(4 + params.density * 2.5)));
  const speedBase = (0.18 + params.laws.gravity * 0.48) * params.speed;
  const tiltX = Math.cos(rt.gimbalX * 0.9 + (rt.smoothX - 0.5) * 0.9);
  const tiltY = 0.42 + 0.52 * Math.abs(Math.cos(rt.gimbalY * 0.8 + (rt.smoothY - 0.5) * 0.7));

  ctx.save();
  // Meridian crosshairs
  ctx.strokeStyle = rgba(params.coreRgb, 0.14);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - minDim * 0.44, cy);
  ctx.lineTo(cx + minDim * 0.44, cy);
  ctx.moveTo(cx, cy - minDim * 0.44);
  ctx.lineTo(cx, cy + minDim * 0.44);
  ctx.stroke();

  // Concentric astrolabe gimbal rings
  for (let rIdx = 0; rIdx < ringCount; rIdx += 1) {
    const frac = (rIdx + 1) / ringCount;
    const radius = minDim * (0.11 + frac * 0.29) * (1.12 - params.laws.gravity * 0.22);
    const angle =
      rt.time * speedBase * (rIdx % 2 === 0 ? 1 : -1) * (0.4 + rIdx * 0.14) +
      rIdx * 0.65 +
      rt.gimbalX * 0.4;
    const wobble =
      Math.sin(rt.time * 1.4 + rIdx) * params.laws.entropy * 0.28 * (1 - params.laws.coherence * 0.7);
    const ry = Math.max(0.22, tiltY + wobble) * radius;
    const rx = Math.max(0.45, Math.abs(tiltX)) * radius + radius * 0.35;
    const rgb = rIdx % 2 === 0 ? params.coreRgb : params.secondaryRgb;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle + params.geometry * 0.45 * (rIdx % 2 === 0 ? 1 : -1));
    ctx.strokeStyle = rgba(rgb, 0.22 + params.laws.coherence * 0.28);
    ctx.lineWidth = rIdx === ringCount - 1 ? 1.4 : 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Ephemeris ticks
    const ticks = 12 + rIdx * 6;
    for (let t = 0; t < ticks; t += 1) {
      const a = (t / ticks) * Math.PI * 2;
      const x1 = Math.cos(a) * rx;
      const y1 = Math.sin(a) * ry;
      const x2 = Math.cos(a) * (rx + (t % 3 === 0 ? 7 : 3));
      const y2 = Math.sin(a) * (ry + (t % 3 === 0 ? 7 : 3));
      ctx.strokeStyle = rgba(rgb, t % 3 === 0 ? 0.52 : 0.2);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Orbital calculus satellite
    const orbA = rt.time * speedBase * (1.2 + rIdx * 0.35) + rIdx * 1.9;
    const sx = Math.cos(orbA) * rx;
    const sy = Math.sin(orbA) * ry;
    ctx.fillStyle = rgba(rgb, 0.9);
    ctx.beginPath();
    ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Interactive calculus tangent line to pointer
  const px = rt.smoothX * w;
  const py = rt.smoothY * h;
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = rgba(params.secondaryRgb, 0.32);
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(px, py);
  ctx.stroke();
  ctx.setLineDash([]);

  // Orbiting star dust
  const dustCount = Math.floor(45 + params.density * 45);
  for (let i = 0; i < dustCount; i += 1) {
    const p = rt.particles[i];
    const theta = p.orbitAngle + rt.time * p.orbitSpeed * speedBase * 0.55;
    const r = p.orbitRadius * minDim * (1.15 - params.laws.gravity * 0.25);
    const x = cx + Math.cos(theta) * r;
    const y = cy + Math.sin(theta) * r * (0.48 + (i % 3) * 0.14);
    ctx.fillStyle = rgba(i % 2 === 0 ? params.coreRgb : params.secondaryRgb, 0.6);
    ctx.beginPath();
    ctx.arc(x, y, p.size * 0.85, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function renderInvertedEntropy(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rt: SimRuntime,
  params: RenderParams
) {
  const fx = rt.smoothX * w;
  const fy = rt.smoothY * h;
  const minDim = Math.min(w, h);
  const shardCount = Math.min(96, Math.floor(38 + params.density * 44));
  const implodeFactor = Math.max(
    0.05,
    Math.min(1, params.laws.coherence * 0.72 + params.geometry * 0.25 - params.laws.entropy * 0.45)
  );
  const scatterScale = (1 - implodeFactor) * minDim * (0.32 + params.laws.entropy * 0.35);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  // Ordering mandala guide rings
  for (let ring = 1; ring <= 3; ring += 1) {
    const r = minDim * (0.075 * ring) * (1.1 - params.laws.gravity * 0.22);
    ctx.strokeStyle = rgba(params.coreRgb, 0.12 + params.laws.coherence * 0.2);
    ctx.beginPath();
    ctx.arc(fx, fy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let i = 0; i < shardCount; i += 1) {
    const p = rt.particles[i];
    const cycle = params.reducedMotion
      ? 0.5
      : (Math.sin(rt.time * 0.8 * params.speed + p.phase) + 1) * 0.5;
    const implosionT = Math.min(1, implodeFactor * 0.7 + cycle * 0.45);
    const orbitRot = rt.time * (0.25 + params.laws.gravity * 0.65) * params.speed * (i % 2 === 0 ? 1 : -1);

    const crystalAngle = p.homeAngle + orbitRot * 0.35;
    const crystalRadius = p.homeDist * minDim * (1.15 - params.laws.gravity * 0.35);
    const targetX = fx + Math.cos(crystalAngle) * crystalRadius;
    const targetY = fy + Math.sin(crystalAngle) * crystalRadius;

    const scatterAngle = p.phase * 2.3 + Math.sin(rt.time * 0.5 + i) * params.laws.entropy;
    const sx =
      targetX +
      Math.cos(scatterAngle) * scatterScale * (1 - implosionT * 0.88);
    const sy =
      targetY +
      Math.sin(scatterAngle) * scatterScale * (1 - implosionT * 0.88);

    const size = (4 + p.size * 3.2) * (0.75 + params.laws.coherence * 0.45);
    const rot =
      crystalAngle * implosionT +
      (p.phase + rt.time * (0.6 + params.laws.entropy * 2.2)) * (1 - implosionT);
    const rgb = i % 3 === 0 ? params.secondaryRgb : params.coreRgb;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(rot);
    ctx.strokeStyle = rgba(rgb, 0.45 + implosionT * 0.4);
    ctx.fillStyle = rgba(rgb, 0.14 + implosionT * 0.22);
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    for (let s = 0; s < p.sides; s += 1) {
      const a = (s / p.sides) * Math.PI * 2;
      const vx = Math.cos(a) * size;
      const vy = Math.sin(a) * size;
      if (s === 0) ctx.moveTo(vx, vy);
      else ctx.lineTo(vx, vy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function renderDysonHarmonic(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rt: SimRuntime,
  params: RenderParams
) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const fx = rt.smoothX * w;
  const fy = rt.smoothY * h;
  const minDim = Math.min(w, h);
  const shells = Math.max(3, Math.min(6, Math.round(3 + params.density * 2)));
  const sides = 6;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  // Stellar core bloom
  const coreGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, minDim * 0.2);
  coreGrad.addColorStop(0, rgba(params.coreRgb, 0.65));
  coreGrad.addColorStop(0.35, rgba(params.secondaryRgb, 0.24));
  coreGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, minDim * 0.2, 0, Math.PI * 2);
  ctx.fill();

  const vertices: Array<{ x: number; y: number }> = [];

  for (let s = 0; s < shells; s += 1) {
    const radius =
      minDim * (0.08 + (s + 1) * 0.068) * (1.14 - params.laws.gravity * 0.25);
    const pulse =
      1 +
      Math.sin(rt.time * 2.2 * params.speed - s * 0.8) *
        (0.03 + params.laws.entropy * 0.06);
    const r = radius * pulse;
    const rot =
      rt.time * (0.14 + (shells - s) * 0.05) * params.speed * (s % 2 === 0 ? 1 : -1) +
      params.geometry * 0.4;
    const rgb = s % 2 === 0 ? params.coreRgb : params.secondaryRgb;

    ctx.strokeStyle = rgba(rgb, 0.28 + params.laws.coherence * 0.34);
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    for (let k = 0; k <= sides * 2; k += 1) {
      const a = (k / (sides * 2)) * Math.PI * 2 + rot;
      const jitter =
        Math.sin(rt.time * 4 + k * 2 + s) *
        params.laws.entropy *
        (1 - params.laws.coherence * 0.6) *
        10;
      const vx = cx + Math.cos(a) * (r + jitter);
      const vy = cy + Math.sin(a) * (r + jitter);
      if (k === 0) ctx.moveTo(vx, vy);
      else ctx.lineTo(vx, vy);
      if (k < sides * 2) vertices.push({ x: vx, y: vy });
    }
    ctx.stroke();
  }

  // Synaptic excitation filaments toward pointer focus
  const thresholdDist = minDim * 0.28;
  for (const v of vertices) {
    const dx = v.x - fx;
    const dy = v.y - fy;
    const d = Math.hypot(dx, dy);
    if (d < thresholdDist) {
      const intensity = (1 - d / thresholdDist) * (0.35 + params.laws.coherence * 0.55);
      ctx.strokeStyle = rgba(params.coreRgb, intensity * 0.65);
      ctx.beginPath();
      ctx.moveTo(v.x, v.y);
      ctx.lineTo(fx, fy);
      ctx.stroke();

      ctx.fillStyle = rgba(params.secondaryRgb, intensity);
      ctx.beginPath();
      ctx.arc(v.x, v.y, 2.5 + intensity * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function renderObsidianGlassSea(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rt: SimRuntime,
  params: RenderParams,
  dt: number
) {
  const horizonY = h * 0.55;
  const fx = rt.smoothX * w;
  const fy = Math.max(horizonY + 12, rt.smoothY * h);
  const lanternCount = Math.min(85, Math.floor(32 + params.density * 34));

  ctx.save();
  // Mirror-flat sea horizon tint
  const seaGrad = ctx.createLinearGradient(0, horizonY, 0, h);
  seaGrad.addColorStop(0, rgba(params.coreRgb, 0.14));
  seaGrad.addColorStop(0.35, "rgba(4, 2, 10, 0.52)");
  seaGrad.addColorStop(1, "rgba(2, 1, 6, 0.85)");
  ctx.fillStyle = seaGrad;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Horizon hairline
  ctx.strokeStyle = rgba(params.coreRgb, 0.45 + params.laws.coherence * 0.35);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(w, horizonY);
  ctx.stroke();

  ctx.globalCompositeOperation = "lighter";

  // Rising vow-lantern motes & crisp obsidian reflections
  const driftRate = (0.045 + (1 - params.laws.gravity * 0.45) * 0.05) * params.speed;
  for (let i = 0; i < lanternCount; i += 1) {
    const p = rt.particles[i];
    if (!params.reducedMotion) {
      p.y -= driftRate * dt * (0.55 + (i % 4) * 0.22);
      if (p.y < 0.04) {
        p.y = 0.99;
      }
    }

    const sway =
      Math.sin(rt.time * 0.9 + p.phase) * (10 + params.laws.entropy * 42);
    const lx = p.x * w + sway;
    const altRatio = p.y; // 0 = sky top, 1 = horizon
    const skyY = horizonY * (0.14 + altRatio * 0.84);
    const mirrorY = horizonY + (horizonY - skyY) * 0.72;
    const rgb = i % 3 === 0 ? params.secondaryRgb : params.coreRgb;

    // Upper sky lantern
    ctx.fillStyle = rgba(rgb, 0.68);
    ctx.beginPath();
    ctx.arc(lx, skyY, p.size * 1.15, 0, Math.PI * 2);
    ctx.fill();

    // Sea reflection shimmer
    const mirrorSpread = 4 + (1 - params.laws.coherence) * 18;
    ctx.strokeStyle = rgba(rgb, 0.24 * params.laws.coherence);
    ctx.beginPath();
    ctx.moveTo(lx - mirrorSpread, mirrorY);
    ctx.lineTo(lx + mirrorSpread, mirrorY);
    ctx.stroke();
  }

  // Interactive cursor wake ripples across the obsidian glass surface
  const ambientWaveCount = 4;
  for (let r = 0; r < ambientWaveCount; r += 1) {
    const prog = ((rt.time * 0.45 * params.speed + r / ambientWaveCount) % 1);
    const radiusX = 24 + prog * (110 + params.geometry * 60);
    const radiusY = radiusX * 0.24;
    const alpha = (1 - prog) * (0.34 + params.laws.coherence * 0.22);
    ctx.strokeStyle = rgba(r % 2 === 0 ? params.coreRgb : params.secondaryRgb, alpha);
    ctx.beginPath();
    ctx.ellipse(fx, fy, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function renderProceduralHybrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rt: SimRuntime,
  params: RenderParams
) {
  const cx = w * 0.5 + (rt.smoothX - 0.5) * 64;
  const cy = h * 0.5 + (rt.smoothY - 0.5) * 48;
  const minDim = Math.min(w, h);
  const arms = 3 + Math.round(params.geometry * 2);
  const count = Math.min(140, Math.floor(60 + params.density * 55));

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  // Dual harmonic attractor rings
  for (let ring = 1; ring <= 3; ring += 1) {
    ctx.strokeStyle = rgba(
      ring % 2 === 0 ? params.secondaryRgb : params.coreRgb,
      0.22 + params.laws.coherence * 0.22
    );
    ctx.beginPath();
    ctx.arc(
      cx,
      cy,
      minDim * (0.09 * ring) * (1.1 - params.laws.gravity * 0.2),
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  // Spiraling custom divergence filaments
  for (let i = 0; i < count; i += 1) {
    const p = rt.particles[i];
    const armOffset = ((i % arms) / arms) * Math.PI * 2;
    const theta =
      armOffset +
      p.orbitRadius * (4.2 + params.laws.gravity * 3.5) +
      rt.time * 0.45 * params.speed * p.branch;
    const wobble =
      Math.sin(rt.time * 1.8 + p.phase) * params.laws.entropy * 24;
    const r = p.orbitRadius * minDim * 0.95 + wobble;
    const x = cx + Math.cos(theta) * r;
    const y = cy + Math.sin(theta) * r * 0.72;
    const rgb = i % 2 === 0 ? params.coreRgb : params.secondaryRgb;
    ctx.fillStyle = rgba(rgb, 0.55 + params.laws.coherence * 0.35);
    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function renderShockwaveRipples(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rt: SimRuntime,
  params: RenderParams,
  dt: number
) {
  if (rt.ripples.length === 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = rt.ripples.length - 1; i >= 0; i -= 1) {
    const rp = rt.ripples[i];
    rp.radius += dt * 220 * params.speed;
    rp.alpha = Math.max(0, 1 - rp.radius / rp.maxRadius);
    if (rp.alpha <= 0.01) {
      rt.ripples.splice(i, 1);
      continue;
    }
    ctx.strokeStyle = rgba(
      rp.isSecondary ? params.secondaryRgb : params.coreRgb,
      rp.alpha * 0.65
    );
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (params.physicsMode === "obsidian_glass_sea") {
      ctx.ellipse(rp.x * w, rp.y * h, rp.radius, rp.radius * 0.28, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(rp.x * w, rp.y * h, rp.radius, 0, Math.PI * 2);
    }
    ctx.stroke();
  }
  ctx.restore();
}

/* ============================================================================
 * Main Component: RealityBreachView
 * ========================================================================== */

interface RealityBreachViewProps {
  reality: RealityNode;
  simulationConfig?: RealitySimulationConfig;
  isOpen: boolean;
  isEnigmaOpen: boolean;
  onExitBreach: () => void;
  onSummonEnigma: () => void;
}

export default function RealityBreachView({
  reality,
  simulationConfig,
  isOpen,
  isEnigmaOpen,
  onExitBreach,
  onSummonEnigma,
}: RealityBreachViewProps) {
  const config = useMemo(
    () => simulationConfig ?? buildRealitySimulationConfig(reality),
    [simulationConfig, reality]
  );

  // Initial state starts on the Divergence epoch (index 1) and baseline laws
  const [epochYear, setEpochYear] = useState<number>(
    () => config.epochs[1]?.yearOffset ?? -2000
  );
  const [laws, setLaws] = useState<RealityLaws>(() => config.laws);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(
    null
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runtimeRef = useRef<SimRuntime | null>(null);

  const coreRgb = useMemo(() => hexToRgb(config.coreColor), [config.coreColor]);
  const secondaryRgb = useMemo(
    () => hexToRgb(config.secondaryColor),
    [config.secondaryColor]
  );

  const epochSnapshot = useMemo(
    () => interpolateEpochState(config.epochs, epochYear),
    [config.epochs, epochYear]
  );

  const selectedAnomaly = useMemo(
    () => config.anomalies.find((a) => a.id === selectedAnomalyId) ?? null,
    [config.anomalies, selectedAnomalyId]
  );

  const isLawsModified = useMemo(
    () =>
      Math.abs(laws.entropy - config.laws.entropy) > 0.01 ||
      Math.abs(laws.gravity - config.laws.gravity) > 0.01 ||
      Math.abs(laws.coherence - config.laws.coherence) > 0.01,
    [laws, config.laws]
  );

  const renderParamsRef = useRef<RenderParams>({
    physicsMode: config.physicsMode,
    coreRgb,
    secondaryRgb,
    laws: config.laws,
    density: epochSnapshot.density,
    speed: epochSnapshot.speed,
    geometry: epochSnapshot.geometry,
    lockedFocus: null,
    reducedMotion: false,
  });

  // Sync live React controls into render ref without rebuilding the canvas loop
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderParamsRef.current = {
      physicsMode: config.physicsMode,
      coreRgb,
      secondaryRgb,
      laws,
      density: epochSnapshot.density,
      speed: epochSnapshot.speed,
      geometry: epochSnapshot.geometry,
      lockedFocus: selectedAnomaly
        ? { x: selectedAnomaly.xPct / 100, y: selectedAnomaly.yPct / 100 }
        : null,
      reducedMotion: reduced,
    };
  }, [
    config.physicsMode,
    coreRgb,
    secondaryRgb,
    laws,
    epochSnapshot.density,
    epochSnapshot.speed,
    epochSnapshot.geometry,
    selectedAnomaly,
  ]);

  // Escape key closes Breach ONLY when Enigma Communion overlay is closed
  useEffect(() => {
    if (!isOpen || isEnigmaOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onExitBreach();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isEnigmaOpen, onExitBreach]);

  // Interactive HTML5 Canvas Loop
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const runtime: SimRuntime = {
      particles: createParticlePool(config.realityId),
      ripples: [],
      pointerX: 0.5,
      pointerY: 0.5,
      smoothX: 0.5,
      smoothY: 0.5,
      pointerActive: false,
      isDragging: false,
      gimbalX: 0.25,
      gimbalY: 0.2,
      lastDragX: 0,
      lastDragY: 0,
      time: 0,
    };
    runtimeRef.current = runtime;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    let rafId = 0;
    let prevTime = performance.now();

    const frame = (now: number) => {
      const rawDt = (now - prevTime) / 1000;
      prevTime = now;
      const dt = Math.min(0.05, Math.max(0.004, rawDt));
      const params = renderParamsRef.current;

      if (!params.reducedMotion) {
        runtime.time += dt;
      }

      // Smoothly converge focus toward locked anomaly or live cursor
      const targetX = runtime.pointerActive
        ? runtime.pointerX
        : params.lockedFocus?.x ?? 0.5;
      const targetY = runtime.pointerActive
        ? runtime.pointerY
        : params.lockedFocus?.y ?? 0.5;
      runtime.smoothX += (targetX - runtime.smoothX) * 0.08;
      runtime.smoothY += (targetY - runtime.smoothY) * 0.08;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      switch (params.physicsMode) {
        case "bifurcation_horizon":
          renderBifurcationHorizon(ctx, width, height, runtime, params, dt);
          break;
        case "astral_astrolabe":
          renderAstralAstrolabe(ctx, width, height, runtime, params);
          break;
        case "inverted_entropy":
          renderInvertedEntropy(ctx, width, height, runtime, params);
          break;
        case "dyson_harmonic":
          renderDysonHarmonic(ctx, width, height, runtime, params);
          break;
        case "obsidian_glass_sea":
          renderObsidianGlassSea(ctx, width, height, runtime, params, dt);
          break;
        case "procedural_hybrid":
          renderProceduralHybrid(ctx, width, height, runtime, params);
          break;
      }

      renderShockwaveRipples(ctx, width, height, runtime, params, dt);

      // Subtle interactive reticle glow
      const fx = runtime.smoothX * width;
      const fy = runtime.smoothY * height;
      ctx.save();
      ctx.strokeStyle = rgba(params.coreRgb, runtime.pointerActive ? 0.34 : 0.14);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(fx, fy, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (!params.reducedMotion) {
        rafId = requestAnimationFrame(frame);
      }
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      runtimeRef.current = null;
    };
  }, [isOpen, config.realityId]);

  const handleCanvasPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const rt = runtimeRef.current;
      if (!rt) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(1, rect.width);
      const ny = (e.clientY - rect.top) / Math.max(1, rect.height);
      rt.pointerX = Math.max(0.02, Math.min(0.98, nx));
      rt.pointerY = Math.max(0.02, Math.min(0.98, ny));
      rt.pointerActive = true;

      if (rt.isDragging) {
        const dx = nx - rt.lastDragX;
        const dy = ny - rt.lastDragY;
        rt.gimbalX += dx * 2.8;
        rt.gimbalY += dy * 2.8;
        rt.lastDragX = nx;
        rt.lastDragY = ny;
      }
    },
    []
  );

  const handleCanvasPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const rt = runtimeRef.current;
      if (!rt) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(1, rect.width);
      const ny = (e.clientY - rect.top) / Math.max(1, rect.height);
      rt.isDragging = true;
      rt.lastDragX = nx;
      rt.lastDragY = ny;
      rt.pointerX = nx;
      rt.pointerY = ny;
      rt.pointerActive = true;
      rt.ripples.push({
        x: nx,
        y: ny,
        radius: 6,
        maxRadius: Math.min(rect.width, rect.height) * 0.28,
        alpha: 0.9,
        isSecondary: rt.ripples.length % 2 === 1,
      });
    },
    []
  );

  const handleCanvasPointerUp = useCallback(() => {
    const rt = runtimeRef.current;
    if (!rt) return;
    rt.isDragging = false;
  }, []);

  const handleCanvasPointerLeave = useCallback(() => {
    const rt = runtimeRef.current;
    if (!rt) return;
    rt.isDragging = false;
    rt.pointerActive = false;
  }, []);

  const handleSelectAnomaly = useCallback(
    (anomaly: SpatialAnomaly) => {
      setSelectedAnomalyId((prev) =>
        prev === anomaly.id ? null : anomaly.id
      );
      const rt = runtimeRef.current;
      if (rt) {
        rt.pointerActive = false;
        rt.ripples.push({
          x: anomaly.xPct / 100,
          y: anomaly.yPct / 100,
          radius: 8,
          maxRadius: 170,
          alpha: 0.95,
          isSecondary: false,
        });
      }
    },
    []
  );

  const handleLawChange = useCallback(
    (key: keyof RealityLaws, rawValue: string) => {
      const parsed = Math.max(0, Math.min(1, Number(rawValue) / 100));
      setLaws((prev) => ({ ...prev, [key]: parsed }));
    },
    []
  );

  const handleResetLaws = useCallback(() => {
    setLaws(config.laws);
  }, [config.laws]);

  const physicsLabel = config.physicsMode.replace(/_/g, " ").toUpperCase();

  return (
    <section
      aria-label={`Dimensional Breach Simulation: ${config.title}`}
      aria-hidden={!isOpen}
      inert={!isOpen || isEnigmaOpen ? true : undefined}
      className={`fixed inset-0 z-[25] flex flex-col justify-between transition-all duration-700 ${
        isOpen
          ? isEnigmaOpen
            ? "opacity-25 pointer-events-none"
            : "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none scale-[0.98]"
      }`}
    >
      {/* Interactive Full-Viewport Physics Canvas layered over WebGL2 nebula */}
      <canvas
        ref={canvasRef}
        onPointerMove={handleCanvasPointerMove}
        onPointerDown={handleCanvasPointerDown}
        onPointerUp={handleCanvasPointerUp}
        onPointerLeave={handleCanvasPointerLeave}
        className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
      />

      {/* Ambient Edge Sanctuary Vignette (preserves center cosmic clarity) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, transparent 32%, rgba(5, 2, 12, 0.56) 100%)",
        }}
      />

      {/* Spatial Anomaly Beacons (3 Inspectable Anchors Inside the World) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {config.anomalies.map((anomaly) => {
          const isSelected = selectedAnomalyId === anomaly.id;
          return (
            <div
              key={anomaly.id}
              style={{
                left: `${anomaly.xPct}%`,
                top: `${anomaly.yPct}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <button
                type="button"
                tabIndex={isOpen && !isEnigmaOpen ? 0 : -1}
                onClick={() => handleSelectAnomaly(anomaly)}
                aria-expanded={isSelected}
                aria-label={`Inspect ${anomaly.code}: ${anomaly.label}`}
                className="pointer-events-auto group relative flex items-center gap-2 px-2.5 py-1.5 rounded-full focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F6F3FE]/70 cursor-pointer"
              >
                {/* Pulsing Reticle Target */}
                <span className="relative flex items-center justify-center w-5 h-5">
                  <span
                    className={`absolute inset-0 rounded-full border transition-transform duration-500 ${
                      isSelected ? "scale-125" : "group-hover:scale-115"
                    }`}
                    style={{
                      borderColor: isSelected
                        ? config.coreColor
                        : `${config.coreColor}88`,
                      boxShadow: isSelected
                        ? `0 0 14px ${config.coreColor}`
                        : "none",
                    }}
                  />
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      isSelected ? "scale-125" : "animate-pulse"
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? "#F6F3FE"
                        : config.coreColor,
                      boxShadow: `0 0 10px ${config.coreColor}`,
                    }}
                  />
                </span>

                {/* Coordinate Callout Label */}
                <span className="hidden sm:flex flex-col items-start text-left leading-tight backdrop-blur-md bg-[#090514]/55 border border-white/10 group-hover:border-white/30 rounded-full px-2.5 py-1 transition-all">
                  <span
                    className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.22em] uppercase"
                    style={{ color: config.coreColor }}
                  >
                    {anomaly.code} {"//"} {anomaly.coordLabel}
                  </span>
                </span>
              </button>
            </div>
          );
        })}

        {/* Floating Holographic Anomaly Readout */}
        {selectedAnomaly && (
          <div className="pointer-events-auto fixed left-4 sm:left-8 top-24 sm:top-28 z-20 max-w-xs sm:max-w-sm rounded-2xl bg-[#070412]/72 backdrop-blur-xl border border-white/15 px-4 py-3.5 shadow-[0_0_32px_rgba(8,4,22,0.75)]">
            <div
              aria-hidden="true"
              className="absolute inset-x-6 top-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${config.coreColor}, transparent)`,
              }}
            />
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span
                className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.26em] uppercase"
                style={{ color: config.coreColor }}
              >
                {selectedAnomaly.code} {"//"} {selectedAnomaly.signature}
              </span>
              <button
                type="button"
                tabIndex={isOpen && !isEnigmaOpen ? 0 : -1}
                onClick={() => setSelectedAnomalyId(null)}
                className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.2em] text-[#9F95B3] hover:text-[#F6F3FE] uppercase cursor-pointer"
              >
                [ CLEAR ]
              </button>
            </div>
            <h3 className="font-[family-name:var(--font-orbitron)] text-xs sm:text-sm tracking-[0.14em] text-[#F6F3FE] uppercase">
              {selectedAnomaly.label}
            </h3>
            <p className="mt-1 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.2em] text-[#B7ADD0]/80 uppercase">
              LOC // {selectedAnomaly.coordLabel}
            </p>
            <p className="mt-2 font-[family-name:var(--font-inter)] text-xs leading-relaxed text-[#E3DCF5]/90">
              {selectedAnomaly.discovery}
            </p>
          </div>
        )}
      </div>

      {/* Top Breach Command Horizon */}
      <header className="relative z-10 pointer-events-none flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 pt-4 sm:pt-6">
        <div className="pointer-events-auto flex flex-wrap items-center gap-3">
          <button
            type="button"
            tabIndex={isOpen && !isEnigmaOpen ? 0 : -1}
            onClick={onExitBreach}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#090516]/65 hover:bg-[#170C34]/85 backdrop-blur-md border border-white/15 hover:border-[#C2B0FF]/55 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.2em] text-[#E6DFFF] uppercase transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]"
          >
            <span>[ &lt;- EXIT BREACH TO CONSTELLATION ]</span>
            <span className="hidden md:inline text-[#9F95B3]/70">ESC</span>
          </button>

          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#080412]/50 backdrop-blur-md border border-white/10">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: config.coreColor,
                boxShadow: `0 0 10px ${config.coreColor}`,
              }}
            />
            <span className="font-[family-name:var(--font-orbitron)] text-[10px] sm:text-xs tracking-[0.2em] text-[#F6F3FE] uppercase">
              {config.code} {"//"} {config.title}
            </span>
            <span className="hidden lg:inline font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.22em] text-[#9F95B3] uppercase">
              PHYSICS: {physicsLabel}
            </span>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2.5">
          <button
            type="button"
            tabIndex={isOpen && !isEnigmaOpen ? 0 : -1}
            onClick={onSummonEnigma}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D0720]/70 hover:bg-[#1B0E3F]/85 backdrop-blur-md border border-[#C2B0FF]/35 hover:border-[#F6F3FE]/65 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.2em] text-[#F6F3FE] uppercase shadow-[0_0_20px_rgba(113,54,217,0.28)] transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: config.secondaryColor,
                boxShadow: `0 0 8px ${config.secondaryColor}`,
              }}
            />
            <span>[ SUMMON ENIGMA IN BREACH ]</span>
          </button>
        </div>
      </header>

      {/* Middle Zone: Reality Law Mutators HUD on Right Sanctuary */}
      <div className="relative z-10 pointer-events-none flex-1 flex items-center justify-end px-4 sm:px-8">
        <aside
          aria-label="Live Reality Law Mutators"
          className="pointer-events-auto w-56 sm:w-64 rounded-2xl bg-[#080414]/60 backdrop-blur-xl border border-white/12 px-4 py-3.5 shadow-[0_0_28px_rgba(7,3,18,0.65)]"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.24em] text-[#B7ADD0] uppercase">
              REALITY LAW MUTATORS
            </span>
            {isLawsModified && (
              <button
                type="button"
                tabIndex={isOpen && !isEnigmaOpen ? 0 : -1}
                onClick={handleResetLaws}
                className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.2em] text-[#C2B0FF] hover:text-[#F6F3FE] uppercase cursor-pointer"
              >
                [ RESET ]
              </button>
            )}
          </div>

          <div className="space-y-3">
            {(
              [
                {
                  key: "entropy",
                  label: "ENTROPY RATE",
                  value: laws.entropy,
                  accent: config.secondaryColor,
                },
                {
                  key: "gravity",
                  label: "GRAVITATIONAL FLUX",
                  value: laws.gravity,
                  accent: config.coreColor,
                },
                {
                  key: "coherence",
                  label: "TEMPORAL COHERENCE",
                  value: laws.coherence,
                  accent: "#C2B0FF",
                },
              ] as const
            ).map((law) => {
              const pct = Math.round(law.value * 100);
              return (
                <div key={law.key} className="space-y-1">
                  <div className="flex items-center justify-between font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.2em] uppercase">
                    <span className="text-[#D4CBEB]/90">{law.label}</span>
                    <span style={{ color: law.accent }}>{pct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={pct}
                    tabIndex={isOpen && !isEnigmaOpen ? 0 : -1}
                    aria-label={law.label}
                    onChange={(e) => handleLawChange(law.key, e.target.value)}
                    style={{ accentColor: law.accent }}
                    className="w-full h-1 rounded-full bg-white/15 appearance-none cursor-pointer focus:outline-none"
                  />
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Bottom Epoch Timeline Scrubber (-10,000 YR to +10,000 YR) */}
      <footer className="relative z-10 pointer-events-none px-4 sm:px-8 pb-5 sm:pb-7">
        <div className="pointer-events-auto mx-auto max-w-4xl rounded-2xl bg-[#070412]/68 backdrop-blur-xl border border-white/12 px-4 sm:px-6 py-3.5 shadow-[0_0_32px_rgba(7,3,18,0.72)]">
          {/* Active Epoch Narrative Header */}
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2.5">
            <div className="flex items-center gap-2.5">
              <span
                className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.26em] uppercase"
                style={{ color: config.coreColor }}
              >
                {epochSnapshot.activeEpoch.id} {"//"} {formatYearLabel(epochYear)}
              </span>
              <span className="font-[family-name:var(--font-orbitron)] text-[11px] sm:text-xs tracking-[0.16em] text-[#F6F3FE] uppercase">
                {epochSnapshot.activeEpoch.eraTitle}
              </span>
            </div>
            <span className="hidden sm:inline font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.22em] text-[#9F95B3]/80 uppercase">
              CLICK OR DRAG HORIZON TO DISTURB FIELD
            </span>
          </div>

          <p className="font-[family-name:var(--font-inter)] text-[11px] sm:text-xs leading-relaxed text-[#D8D0ED]/88 mb-3">
            {epochSnapshot.activeEpoch.narrative}
          </p>

          {/* 4 Clickable Era Checkpoints */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            {config.epochs.map((ep) => {
              const isCurrent = epochSnapshot.activeEpoch.id === ep.id;
              return (
                <button
                  key={ep.id}
                  type="button"
                  tabIndex={isOpen && !isEnigmaOpen ? 0 : -1}
                  onClick={() => setEpochYear(ep.yearOffset)}
                  className={`flex flex-col items-start sm:items-center text-left sm:text-center px-2 py-1 rounded-lg border transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF] ${
                    isCurrent
                      ? "bg-white/10 border-white/30 text-[#F6F3FE]"
                      : "bg-transparent border-transparent text-[#9F95B3] hover:text-[#DFD6F7] hover:bg-white/5"
                  }`}
                >
                  <span
                    className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] sm:text-[9px] tracking-[0.22em] uppercase"
                    style={{ color: isCurrent ? config.coreColor : undefined }}
                  >
                    {ep.id}
                  </span>
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.16em] opacity-75">
                    {ep.yearLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Continuous Temporal Horizon Scrubber */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.18em] text-[#9F95B3]/75">
              -10,000 YR
            </span>
            <input
              type="range"
              min={-10000}
              max={10000}
              step={50}
              value={epochYear}
              tabIndex={isOpen && !isEnigmaOpen ? 0 : -1}
              aria-label="Epoch Timeline Scrubber"
              onChange={(e) => setEpochYear(Number(e.target.value))}
              style={{ accentColor: config.coreColor }}
              className="w-full h-1.5 rounded-full bg-white/15 appearance-none cursor-pointer focus:outline-none"
            />
            <span className="hidden sm:inline font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.18em] text-[#9F95B3]/75">
              +10,000 YR
            </span>
          </div>
        </div>
      </footer>
    </section>
  );
}
