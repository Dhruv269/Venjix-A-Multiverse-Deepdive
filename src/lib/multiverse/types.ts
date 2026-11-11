/**
 * ============================================================================
 * VENJIX MULTIVERSE DATA CONTRACTS
 * ============================================================================
 * Shared pure TypeScript contracts spanning Next.js Route Handlers and client
 * components for the Personal Life-Choice Multiverse Engine & Simulation HUD.
 */

export type PhysicsMode =
  | "bifurcation_horizon"
  | "astral_astrolabe"
  | "inverted_entropy"
  | "dyson_harmonic"
  | "obsidian_glass_sea"
  | "procedural_hybrid";

export type EpochEraKey = "ORIGIN" | "DIVERGENCE" | "ZENITH" | "TERMINUS";

export type LifeEpochKey =
  | "CROSSROADS"
  | "EMERGENCE"
  | "CONVERGENCE"
  | "DESTINY";

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
 * Phase 2: Personal Life-Choice Multiverse Timeline Types
 * ========================================================================== */

export interface DecisionImpactMetrics {
  fulfillmentDelta: number;
  riskEntropyDelta: number;
  divergenceDelta: number;
  coherenceDelta: number;
}

export interface DecisionChoice {
  id: string;
  label: string;
  consequencePreview: string;
  impactMetrics: DecisionImpactMetrics;
}

export interface DecisionCrossroad {
  id: string;
  code: string;
  label: string;
  coordLabel: string;
  xPct: number;
  yPct: number;
  dilemma: string;
  choices: DecisionChoice[];
}

export interface LifeEpoch {
  id: LifeEpochKey;
  yearOffset: number; // 0, 1, 5, 10
  yearLabel: string; // "DAY 01", "+1 YEAR", "+5 YEARS", "+10 YEARS"
  stageLabel: string; // e.g., "THE CROSSROADS // DAY 01"
  eraTitle: string;
  whoYouBecome: string;
  whereYouLive: string;
  whatYouBuild: string;
  whatYouSacrificed: string;
  narrative: string;
  densityMultiplier: number;
  speedMultiplier: number;
  geometryFactor: number;
}

export interface MultiverseMetrics {
  fulfillment: number; // 0..100
  riskEntropy: number; // 0.0..1.0
  divergence: number; // 0..100
  temporalCoherence: number; // 0..100
}

export interface ParallelProbe {
  id: string;
  label: string;
  oracleAnswer: string;
  futureSelfAnswer: string;
}

export interface ParallelSelfPersona {
  openingFromFutureSelf: string;
  enigmaTradeoffAnalysis: string;
  parallelProbes: ParallelProbe[];
}

export type GeneratorSource = "gemini" | "mistral" | "openai" | "fallback";

export interface PersonalTimelineBranch {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  parentTimelineTitle?: string;
  currentSelfContext: string;
  pivotalChoice: string;
  chosenOption?: string;
  spectralTint: [number, number, number];
  coreColor: string;
  secondaryColor: string;
  physicsMode: PhysicsMode;
  epochs: LifeEpoch[];
  decisionNodes: DecisionCrossroad[];
  metrics: MultiverseMetrics;
  laws: RealityLaws;
  parallelPersona: ParallelSelfPersona;
  generatorSource: GeneratorSource;
}

export interface BranchRequestPayload {
  currentSelfContext: string;
  pivotalChoice: string;
  parentTimelineTitle?: string;
  currentEpoch?: string;
  chosenOption?: string;
  mode?: "branch" | "commune";
  question?: string;
  personaMode?: "oracle" | "parallel_self";
  timelineSnapshot?: {
    title: string;
    subtitle?: string;
    pivotalChoice: string;
    epochsSummary?: string;
    metrics?: MultiverseMetrics;
  };
}

export interface CommuneResponsePayload {
  transmission: string;
  telemetry: {
    temporalCoherence: string;
    entropyDelta: string;
    divergenceProbability: string;
  };
  generatorSource: GeneratorSource;
}

