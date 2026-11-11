/**
 * ============================================================================
 * DATA: Multiverse Network Reality Nodes & Synaptic Links
 * ============================================================================
 * Defines the 5 core Alternate Reality anomalies orbiting inside the Cosmic
 * Observatory and the organic synaptic graph connecting their harmonics.
 *
 * Coordinate system:
 * Positioned across an organic, non-grid 1000 x 620 orbital space leaving
 * clear top margin for ObservatoryNavbar and bottom margin for telemetry.
 */

import { DEFAULT_PERSONAL_NEXUS_BRANCH } from "@/lib/multiverse/branchEngine";
import type { PersonalTimelineBranch } from "@/lib/multiverse/types";

export const MAX_CUSTOM_REALITIES = 5;
export const CUSTOM_REALITIES_STORAGE_KEY = "venjix_custom_realities_v4";
export const USER_BASELINE_STORAGE_KEY = "venjix_user_baseline_v1";

/** Default signature Electric Violet/Lavender normalized RGB for Gateway & neutral Observatory */
export const DEFAULT_OBSERVATORY_SPECTRUM: [number, number, number] = [
  0.52, 0.24, 0.95,
];

export interface RealityNode {
  id: string;
  code: string;
  category: string;
  classification: string;
  title: string;
  essence: string;
  divergence: string;
  coreColor: string;
  secondaryColor: string;
  auraColor: string;
  /** Normalized RGB 0.0-1.0 fed smoothly into WebGL2 u_spectralTint uniform */
  spectrum: [number, number, number];
  x: number; // 0..1000 normalized X
  y: number; // 0..620 normalized Y
  parallaxDepth: number;
  pulseDelaySec: number;
  orbitDurationSec: number;
  labelPlacement: "bottom" | "top";
  telemetry: {
    entropyIndex: string;
    temporalDrift: string;
    resonanceStability: string;
  };
  synopsis: string;
  enigmaTransmission: string;
  isCustom?: boolean;
  parentNodeId?: string;
  personalTimeline?: PersonalTimelineBranch;
}

export interface SynapticLink {
  id: string;
  sourceId: string;
  targetId: string;
  curveOffset: number; // Signed perpendicular Bezier arch in SVG units
  pulseDurationSec: number;
  pulseDelaySec: number;
}

export const REALITY_NODES: RealityNode[] = [
  {
    id: "omega-01",
    code: "OMEGA-01",
    category: "PERSONAL NEXUS",
    classification: "OMEGA-01 // PERSONAL NEXUS",
    title: "Your Personal Nexus",
    essence: "Origin anchor of your living life choices",
    divergence: "12.0%",
    coreColor: "#C2B0FF",
    secondaryColor: "#7136D9",
    auraColor: "rgba(194, 176, 255, 0.56)",
    spectrum: [0.76, 0.62, 1.0],
    x: 225,
    y: 218,
    parallaxDepth: 0.9,
    pulseDelaySec: 0,
    orbitDurationSec: 22,
    labelPlacement: "bottom",
    telemetry: {
      entropyIndex: "0.340 ΔS",
      temporalDrift: "0.00 τ // ORIGIN",
      resonanceStability: "94.0%",
    },
    synopsis:
      "Your central origin coordinate inside VENJIX—holding your present momentum, habits, relationships, and unchosen options suspended in superposition. Enter this breach to inspect your baseline trajectory, or forge alternate life paths directly from here.",
    enigmaTransmission:
      "PERSONAL NEXUS SYNCHRONIZED // MONITORING ACTIVE LIFE BIFURCATIONS...",
    personalTimeline: {
      ...DEFAULT_PERSONAL_NEXUS_BRANCH,
      coreColor: "#C2B0FF",
      secondaryColor: "#7136D9",
      spectralTint: [0.76, 0.62, 1.0],
    },
  },
  {
    id: "chrono-04",
    code: "CHRONO-04",
    category: "HISTORICAL FRACTURE",
    classification: "CHRONO-04 // HISTORICAL FRACTURE",
    title: "Alexandria Unburned",
    essence: "Preserved ancient astral calculus",
    divergence: "88.7%",
    coreColor: "#0284C7",
    secondaryColor: "#7DD3FC",
    auraColor: "rgba(2, 132, 199, 0.50)",
    spectrum: [0.06, 0.58, 0.92],
    x: 715,
    y: 176,
    parallaxDepth: 1.15,
    pulseDelaySec: 1.3,
    orbitDurationSec: 26,
    labelPlacement: "bottom",
    telemetry: {
      entropyIndex: "0.312 ΔS",
      temporalDrift: "-18.4 τ",
      resonanceStability: "91.8%",
    },
    synopsis:
      "Inside this undisturbed historical fold, the Great Archive along the Mediterranean never fell to flame. Pneumatic astronomers fused bronze geometry with optical wave calculus two millennia early, charting interstellar navigation centuries before our industrial epoch.",
    enigmaTransmission:
      "ARCHIVAL ASTROLABE FREQUENCY DECODED // RETRIEVING BRONZE-AGE STAR CHARTS...",
  },
  {
    id: "null-09",
    code: "NULL-09",
    category: "IMPOSSIBLE PHYSICS",
    classification: "NULL-09 // IMPOSSIBLE PHYSICS",
    title: "Inverted Entropy Well",
    essence: "Reversed thermodynamic causality",
    divergence: "97.9%",
    coreColor: "#7136D9",
    secondaryColor: "#C2B0FF",
    auraColor: "rgba(113, 54, 217, 0.58)",
    spectrum: [0.42, 0.14, 0.88],
    x: 492,
    y: 304,
    parallaxDepth: 1.3,
    pulseDelaySec: 2.1,
    orbitDurationSec: 18,
    labelPlacement: "bottom",
    telemetry: {
      entropyIndex: "-0.892 ΔS",
      temporalDrift: "±0.00 τ",
      resonanceStability: "82.1%",
    },
    synopsis:
      "An asymmetric cosmological basin where thermodynamic arrow polarity reverses across macroscopic scales. Dispersed photonic embers drift homeward to re-ignite extinguished stars, causing effect to shimmer seconds before its originating cause.",
    enigmaTransmission:
      "CAUSALITY INVERSION DETECTED // STABILIZING NEGENTROPIC APERTURE...",
  },
  {
    id: "aether-12",
    code: "AETHER-12",
    category: "SPECULATIVE HORIZON",
    classification: "AETHER-12 // SPECULATIVE HORIZON",
    title: "Post-Biological Dyson Choir",
    essence: "Sentient stellar megastructure",
    divergence: "99.1%",
    coreColor: "#F6F3FE",
    secondaryColor: "#C2B0FF",
    auraColor: "rgba(246, 243, 254, 0.56)",
    spectrum: [0.92, 0.86, 1.0],
    x: 774,
    y: 424,
    parallaxDepth: 0.85,
    pulseDelaySec: 3.0,
    orbitDurationSec: 20,
    labelPlacement: "bottom",
    telemetry: {
      entropyIndex: "0.041 ΔS",
      temporalDrift: "+912.6 τ",
      resonanceStability: "98.9%",
    },
    synopsis:
      "Occupying the distant post-biological horizon, an entire binary star swarm is cradled inside filigree superconducting sails. Thought travels across light-minutes as standing optical chords—trillions of ascended minds harmonizing inside pure starlight.",
    enigmaTransmission:
      "PHOTONIC LATTICE CHORUS SYNCHRONIZED // LISTENING ON BAND AETHER-12...",
  },
  {
    id: "mythos-07",
    code: "MYTHOS-07",
    category: "FICTIONAL MANIFEST",
    classification: "MYTHOS-07 // FICTIONAL MANIFEST",
    title: "The Glass Sea of Noctis",
    essence: "Crystallized dreamscape topology",
    divergence: "91.5%",
    coreColor: "#A78BFA",
    secondaryColor: "#0284C7",
    auraColor: "rgba(167, 139, 250, 0.50)",
    spectrum: [0.46, 0.44, 0.98],
    x: 266,
    y: 432,
    parallaxDepth: 1.05,
    pulseDelaySec: 4.1,
    orbitDurationSec: 24,
    labelPlacement: "bottom",
    telemetry: {
      entropyIndex: "0.457 ΔS",
      temporalDrift: "NON-LINEAR",
      resonanceStability: "87.3%",
    },
    synopsis:
      "Where collective myth crosses critical mass, archetypal geography condenses into matter. Translucent swells of vitrified midnight ocean reflect constellations unknown to astrophysics, whispering living allegories along crystalline shores.",
    enigmaTransmission:
      "DREAMSCAPE TOPOLOGY COHERENT // MIRRORING NOCTIS REFLECTION FIELD...",
  },
];

export const SYNAPTIC_LINKS: SynapticLink[] = [
  {
    id: "link-omega-null",
    sourceId: "omega-01",
    targetId: "null-09",
    curveOffset: -36,
    pulseDurationSec: 4.6,
    pulseDelaySec: 0,
  },
  {
    id: "link-omega-mythos",
    sourceId: "omega-01",
    targetId: "mythos-07",
    curveOffset: -42,
    pulseDurationSec: 5.8,
    pulseDelaySec: 1.1,
  },
  {
    id: "link-chrono-null",
    sourceId: "chrono-04",
    targetId: "null-09",
    curveOffset: 34,
    pulseDurationSec: 4.9,
    pulseDelaySec: 0.7,
  },
  {
    id: "link-chrono-aether",
    sourceId: "chrono-04",
    targetId: "aether-12",
    curveOffset: 44,
    pulseDurationSec: 5.4,
    pulseDelaySec: 2.0,
  },
  {
    id: "link-null-aether",
    sourceId: "null-09",
    targetId: "aether-12",
    curveOffset: -30,
    pulseDurationSec: 4.2,
    pulseDelaySec: 1.6,
  },
  {
    id: "link-null-mythos",
    sourceId: "null-09",
    targetId: "mythos-07",
    curveOffset: 32,
    pulseDurationSec: 5.1,
    pulseDelaySec: 2.8,
  },
  {
    id: "link-mythos-aether",
    sourceId: "mythos-07",
    targetId: "aether-12",
    curveOffset: 48,
    pulseDurationSec: 6.4,
    pulseDelaySec: 0.4,
  },
];

export function getConnectedNodeIds(
  nodeId: string,
  links: SynapticLink[] = SYNAPTIC_LINKS
): Set<string> {
  const connected = new Set<string>([nodeId]);
  for (const link of links) {
    if (link.sourceId === nodeId) connected.add(link.targetId);
    if (link.targetId === nodeId) connected.add(link.sourceId);
  }
  return connected;
}

interface CustomPaletteSlot {
  coreColor: string;
  secondaryColor: string;
  auraColor: string;
  spectrum: [number, number, number];
}

const CUSTOM_PALETTE_SLOTS: CustomPaletteSlot[] = [
  {
    coreColor: "#38BDF8",
    secondaryColor: "#7136D9",
    auraColor: "rgba(56, 189, 248, 0.54)",
    spectrum: [0.22, 0.72, 0.98],
  },
  {
    coreColor: "#E879F9",
    secondaryColor: "#7136D9",
    auraColor: "rgba(232, 121, 249, 0.52)",
    spectrum: [0.84, 0.34, 0.94],
  },
  {
    coreColor: "#7DD3FC",
    secondaryColor: "#C2B0FF",
    auraColor: "rgba(125, 211, 252, 0.54)",
    spectrum: [0.54, 0.8, 1.0],
  },
];

/** Curated organic open-space anchors inside 1000x620 orbital stage */
const ORBITAL_ANCHOR_SLOTS: Array<{ x: number; y: number }> = [
  { x: 468, y: 136 },
  { x: 134, y: 336 },
  { x: 526, y: 470 },
  { x: 866, y: 274 },
  { x: 356, y: 162 },
  { x: 642, y: 464 },
  { x: 158, y: 122 },
  { x: 842, y: 492 },
];

function deriveBranchTitle(hypothesis: string, indexNum: number): string {
  const stripped = hypothesis
    .trim()
    .replace(/^(what if|suppose|imagine if|could|what happens if)\s+/i, "")
    .replace(/[?.!]+$/g, "")
    .trim();

  if (!stripped) return `Crystallized Branch 0${indexNum}`;

  const words = stripped.split(/\s+/).filter(Boolean);
  const titleWords: string[] = [];
  let charCount = 0;

  for (const w of words) {
    const clean = w.charAt(0).toUpperCase() + w.slice(1);
    if (charCount + clean.length + 1 > 30 && titleWords.length > 0) break;
    titleWords.push(clean);
    charCount += clean.length + 1;
  }

  const joined = titleWords.join(" ");
  return joined.length < stripped.length ? `${joined}…` : joined;
}

function deriveHypothesisEssence(hypothesis: string): string {
  const q = hypothesis.toLowerCase();
  if (/time|past|future|history|age|timeline/.test(q)) {
    return "Forked chronological causal stream";
  }
  if (/entropy|physics|gravity|light|quantum|star|energy/.test(q)) {
    return "Altered continuum field constants";
  }
  if (/mind|conscious|memory|dream|self|life|human/.test(q)) {
    return "Recursive observer phase divergence";
  }
  if (/collaps|end|war|destroy|break/.test(q)) {
    return "Fractured equilibrium bifurcation";
  }
  return "Crystallized observer hypothesis horizon";
}

function selectOrganicCoordinate(
  parentNode: RealityNode,
  existingNodes: RealityNode[]
): { x: number; y: number } {
  const MIN_CLEARANCE = 116;

  // Score candidate open anchors: must maintain safe clearance from all orbs, preferring proximity to parent
  const validCandidates = ORBITAL_ANCHOR_SLOTS.filter((slot) =>
    existingNodes.every(
      (n) => Math.hypot(n.x - slot.x, n.y - slot.y) >= MIN_CLEARANCE
    )
  ).sort(
    (a, b) =>
      Math.hypot(a.x - parentNode.x, a.y - parentNode.y) -
      Math.hypot(b.x - parentNode.x, b.y - parentNode.y)
  );

  if (validCandidates.length > 0) {
    return validCandidates[0];
  }

  // Fallback safe spiral around parent inside safe canvas bounds [115..885] x [115..510]
  for (let step = 0; step < 12; step++) {
    const angle = (step / 12) * Math.PI * 2;
    const x = Math.max(
      115,
      Math.min(885, Math.round(parentNode.x + Math.cos(angle) * 155))
    );
    const y = Math.max(
      115,
      Math.min(510, Math.round(parentNode.y + Math.sin(angle) * 130))
    );
    const clear = existingNodes.every((n) => Math.hypot(n.x - x, n.y - y) >= 95);
    if (clear) return { x, y };
  }

  return { x: 468, y: 136 };
}

export interface CustomRealitySynthesisInput {
  hypothesis: string;
  transmission: string;
  telemetry: {
    temporalCoherence: string;
    entropyDelta: string;
    divergenceProbability: string;
  };
  parentReality: RealityNode | null;
  existingNodes: RealityNode[];
  customIndex: number; // 1-based (1..3)
}

export function synthesizeCustomRealityNode(
  input: CustomRealitySynthesisInput
): { node: RealityNode; link: SynapticLink } {
  const slotNum = Math.max(1, Math.min(MAX_CUSTOM_REALITIES, input.customIndex));
  const code = `DIVERGENCE-0${slotNum}`;
  const parent =
    input.parentReality ??
    input.existingNodes.find((n) => n.id === "null-09") ??
    input.existingNodes[0];

  const coords = selectOrganicCoordinate(parent, input.existingNodes);
  const palette = CUSTOM_PALETTE_SLOTS[(slotNum - 1) % CUSTOM_PALETTE_SLOTS.length];
  const id = `divergence-0${slotNum}-${Date.now().toString(36)}`;
  const cleanHypothesis = input.hypothesis.trim();

  const node: RealityNode = {
    id,
    code,
    category: "CUSTOM DIVERGENCE",
    classification: `${code} // CUSTOM DIVERGENCE`,
    title: deriveBranchTitle(cleanHypothesis, slotNum),
    essence: deriveHypothesisEssence(cleanHypothesis),
    divergence: input.telemetry.divergenceProbability,
    coreColor: palette.coreColor,
    secondaryColor: palette.secondaryColor,
    auraColor: palette.auraColor,
    spectrum: palette.spectrum,
    x: coords.x,
    y: coords.y,
    parallaxDepth: 0.95 + (slotNum % 3) * 0.14,
    pulseDelaySec: 0.4 * slotNum,
    orbitDurationSec: 19 + slotNum * 2,
    labelPlacement: coords.y > 460 ? "top" : "bottom",
    telemetry: {
      entropyIndex: input.telemetry.entropyDelta.replace(/\s*ΔS$/i, " ΔS"),
      temporalDrift: `+${(slotNum * 11.4 + 3.2).toFixed(2)} τ`,
      resonanceStability: input.telemetry.temporalCoherence,
    },
    synopsis: `Crystallized directly from observer inquiry ("${cleanHypothesis}") branching along synaptic tension from ${parent.code}. ${input.transmission}`,
    enigmaTransmission: `OBSERVER BRANCH ${code} CRYSTALLIZED // PHASE-LOCKED TO ${parent.code}...`,
    isCustom: true,
    parentNodeId: parent.id,
  };

  const link: SynapticLink = {
    id: `link-${parent.id}-${id}`,
    sourceId: parent.id,
    targetId: id,
    curveOffset: slotNum % 2 === 0 ? 38 : -38,
    pulseDurationSec: 4.4,
    pulseDelaySec: 0.3,
  };

  return { node, link };
}

function hexToAuraRgba(hex: string, alpha = 0.54): string {
  const clean = hex.replace("#", "").trim();
  if (clean.length !== 6) return `rgba(182, 154, 255, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) {
    return `rgba(182, 154, 255, ${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function createPersonalTimelineNode(
  branch: PersonalTimelineBranch,
  parentReality: RealityNode | null,
  existingNodes: RealityNode[],
  slotIndex: number
): { node: RealityNode; link: SynapticLink } {
  const parent =
    parentReality ??
    existingNodes.find((n) => n.id === "omega-01") ??
    existingNodes[0];

  const coords = selectOrganicCoordinate(parent, existingNodes);
  const shortCode = branch.code.split("//")[0]?.trim() || `LIFE-0${slotIndex}`;
  const existingIds = new Set(existingNodes.map((n) => n.id));
  let uniqueId = `${branch.id}-${slotIndex}-${Date.now().toString(36)}`;
  let bump = 1;
  while (existingIds.has(uniqueId)) {
    uniqueId = `${branch.id}-${slotIndex}-${Date.now().toString(36)}-${bump}`;
    bump += 1;
  }
  const normalizedBranch: PersonalTimelineBranch = {
    ...branch,
    id: uniqueId,
  };

  const node: RealityNode = {
    id: uniqueId,
    code: shortCode,
    category: branch.chosenOption ? "FORKED LIFE BRANCH" : "PARALLEL LIFE",
    classification: branch.code,
    title: branch.title,
    essence: branch.subtitle,
    divergence: `${branch.metrics.divergence}%`,
    coreColor: branch.coreColor,
    secondaryColor: branch.secondaryColor,
    auraColor: hexToAuraRgba(branch.coreColor, 0.56),
    spectrum: branch.spectralTint,
    x: coords.x,
    y: coords.y,
    parallaxDepth: 0.94 + (slotIndex % 3) * 0.14,
    pulseDelaySec: 0.35 * (slotIndex % 5),
    orbitDurationSec: 18 + (slotIndex % 4) * 2,
    labelPlacement: coords.y > 460 ? "top" : "bottom",
    telemetry: {
      entropyIndex: `${branch.metrics.riskEntropy.toFixed(2)} ΔS`,
      temporalDrift: `${branch.metrics.fulfillment}% FULFILL`,
      resonanceStability: `${branch.metrics.temporalCoherence}%`,
    },
    synopsis:
      branch.epochs[2]?.narrative ??
      branch.epochs[0]?.narrative ??
      branch.subtitle,
    enigmaTransmission: `PERSONAL TIMELINE ${shortCode} LOCKED // PARALLEL CONSCIOUSNESS ONLINE...`,
    isCustom: true,
    parentNodeId: parent.id,
    personalTimeline: normalizedBranch,
  };

  const link: SynapticLink = {
    id: `link-${parent.id}-${uniqueId}`,
    sourceId: parent.id,
    targetId: uniqueId,
    curveOffset: slotIndex % 2 === 0 ? 36 : -36,
    pulseDurationSec: 4.1,
    pulseDelaySec: 0.25,
  };

  return { node, link };
}

export function updateRealityNodeWithBranch(
  existing: RealityNode,
  branch: PersonalTimelineBranch
): RealityNode {
  return {
    ...existing,
    title: existing.id === "omega-01" ? existing.title : branch.title,
    essence: branch.subtitle,
    divergence: `${branch.metrics.divergence}%`,
    coreColor: branch.coreColor,
    secondaryColor: branch.secondaryColor,
    auraColor: hexToAuraRgba(branch.coreColor, 0.56),
    spectrum: branch.spectralTint,
    telemetry: {
      entropyIndex: `${branch.metrics.riskEntropy.toFixed(2)} ΔS`,
      temporalDrift: `${branch.metrics.fulfillment}% FULFILL`,
      resonanceStability: `${branch.metrics.temporalCoherence}%`,
    },
    synopsis: branch.epochs[2]?.narrative ?? existing.synopsis,
    personalTimeline: {
      ...branch,
      id: existing.id,
      code: existing.id === "omega-01" ? existing.classification : branch.code,
    },
  };
}


