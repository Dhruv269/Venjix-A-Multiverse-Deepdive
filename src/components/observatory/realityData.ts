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
    category: "PERSONAL DIVERGENCE",
    classification: "OMEGA-01 // PERSONAL DIVERGENCE",
    title: "The Unchosen Threshold",
    essence: "Counterfactual memory & parallel self",
    divergence: "94.2%",
    coreColor: "#C2B0FF",
    secondaryColor: "#7136D9",
    auraColor: "rgba(194, 176, 255, 0.52)",
    x: 225,
    y: 218,
    parallaxDepth: 0.9,
    pulseDelaySec: 0,
    orbitDurationSec: 22,
    labelPlacement: "bottom",
    telemetry: {
      entropyIndex: "0.184 ΔS",
      temporalDrift: "+4.72 τ",
      resonanceStability: "96.4%",
    },
    synopsis:
      "A nearby counterfactual continuum seeded at the exact moment an unmade decision forked cleanly away from consensus time. Residual emotional echoes bleed across the boundary—ghostly recollections of rooms never entered and futures lived by a twin consciousness.",
    enigmaTransmission:
      "COUNTERFACTUAL CARRIER LOCKED // ECHOING PARALLEL MEMORY SIGNATURE...",
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

export function getConnectedNodeIds(nodeId: string): Set<string> {
  const connected = new Set<string>([nodeId]);
  for (const link of SYNAPTIC_LINKS) {
    if (link.sourceId === nodeId) connected.add(link.targetId);
    if (link.targetId === nodeId) connected.add(link.sourceId);
  }
  return connected;
}

