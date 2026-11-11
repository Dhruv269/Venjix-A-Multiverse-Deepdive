import { RealityNode } from "./realityData";
import { buildRealitySimulationConfig } from "./RealityBreachView";

/**
 * ============================================================================
 * COMPARISON ENGINE: Quantum Superposition Timeline Normalization & Verdict
 * ============================================================================
 * Normalizes both Personal Life-Choice branches and built-in Cosmic Manifold
 * realities into a shared 4-epoch, 4-metric structure so any two constellation
 * realities can be compared side-by-side.
 */

export interface ComparisonEpochSlot {
  index: 0 | 1 | 2 | 3;
  key: "DAY_01" | "YEAR_01" | "YEAR_05" | "YEAR_10";
  shortLabel: string;
  titleLabel: string;
}

export const COMPARISON_EPOCH_SLOTS: ComparisonEpochSlot[] = [
  { index: 0, key: "DAY_01", shortLabel: "DAY 01", titleLabel: "THE CROSSROADS // DAY 01" },
  { index: 1, key: "YEAR_01", shortLabel: "+1 YR", titleLabel: "EMERGENCE // +1 YEAR" },
  { index: 2, key: "YEAR_05", shortLabel: "+5 YRS", titleLabel: "CONVERGENCE // +5 YEARS" },
  { index: 3, key: "YEAR_10", shortLabel: "+10 YRS", titleLabel: "DESTINY // +10 YEARS" },
];

export interface ComparableMetrics {
  fulfillment: number; // 0..100
  riskEntropy: number; // 0..100 (0..1 entropy scaled)
  riskEntropyRaw: number; // 0.0..1.0
  divergence: number; // 0..100
  coherence: number; // 0..100
}

export interface ComparableEpochStage {
  slotIndex: 0 | 1 | 2 | 3;
  stageBadge: string;
  eraTitle: string;
  identityOrState: string;
  environmentOrAnchor: string;
  creationOrShift: string;
  sacrificeOrCost: string;
  narrative: string;
}

export interface ComparableTimeline {
  node: RealityNode;
  isPersonal: boolean;
  code: string;
  title: string;
  subtitle: string;
  pivotalSeed: string;
  coreColor: string;
  secondaryColor: string;
  metrics: ComparableMetrics;
  epochs: [
    ComparableEpochStage,
    ComparableEpochStage,
    ComparableEpochStage,
    ComparableEpochStage,
  ];
  coreReward: string;
  coreSacrifice: string;
}

export interface MetricDeltaItem {
  key: "fulfillment" | "riskEntropy" | "divergence" | "coherence";
  label: string;
  sublabel: string;
  alphaVal: number;
  betaVal: number;
  alphaDisplay: string;
  betaDisplay: string;
  /** beta - alpha */
  delta: number;
  deltaDisplay: string;
  leader: "alpha" | "beta" | "tied";
  higherIsBetter: boolean;
}

export interface NexusVerdict {
  headline: string;
  alphaReward: string;
  alphaSacrifice: string;
  betaReward: string;
  betaSacrifice: string;
  synthesis: string;
  deltas: MetricDeltaItem[];
}

function clampPct(value: number, fallback = 50): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function parsePctString(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback;
  const parsed = Number.parseFloat(raw.replace(/[^0-9.-]/g, ""));
  return clampPct(parsed, fallback);
}

export function buildComparableTimeline(node: RealityNode): ComparableTimeline {
  const branch = node.personalTimeline;

  if (branch && branch.epochs.length >= 4) {
    const riskRaw = Math.max(0, Math.min(1, branch.metrics.riskEntropy));
    const stages = [0, 1, 2, 3].map((idx): ComparableEpochStage => {
      const ep = branch.epochs[idx] ?? branch.epochs[branch.epochs.length - 1];
      return {
        slotIndex: idx as 0 | 1 | 2 | 3,
        stageBadge: ep.stageLabel || COMPARISON_EPOCH_SLOTS[idx].titleLabel,
        eraTitle: ep.eraTitle,
        identityOrState: ep.whoYouBecome,
        environmentOrAnchor: ep.whereYouLive,
        creationOrShift: ep.whatYouBuild,
        sacrificeOrCost: ep.whatYouSacrificed,
        narrative: ep.narrative,
      };
    }) as [
      ComparableEpochStage,
      ComparableEpochStage,
      ComparableEpochStage,
      ComparableEpochStage,
    ];

    const peakEpoch = stages[2];
    const destinyEpoch = stages[3];

    return {
      node,
      isPersonal: true,
      code: node.code,
      title: node.title,
      subtitle: branch.chosenOption
        ? `Fork: ${branch.chosenOption}`
        : branch.subtitle || node.essence,
      pivotalSeed: branch.pivotalChoice,
      coreColor: node.coreColor,
      secondaryColor: node.secondaryColor,
      metrics: {
        fulfillment: clampPct(branch.metrics.fulfillment, 74),
        riskEntropy: clampPct(riskRaw * 100, 42),
        riskEntropyRaw: Number(riskRaw.toFixed(2)),
        divergence: clampPct(branch.metrics.divergence, 65),
        coherence: clampPct(branch.metrics.temporalCoherence, 80),
      },
      epochs: stages,
      coreReward: `${peakEpoch.identityOrState} — building ${destinyEpoch.creationOrShift.toLowerCase()}`,
      coreSacrifice: destinyEpoch.sacrificeOrCost || peakEpoch.sacrificeOrCost,
    };
  }

  // Cosmic manifold reality adapter (CHRONO-04, NULL-09, AETHER-12, MYTHOS-07, custom divergences)
  const sim = buildRealitySimulationConfig(node);
  const parsedStability = parsePctString(node.telemetry.resonanceStability, 84);
  const parsedDivergence = parsePctString(node.divergence, 88);
  const rawEntropy = Math.min(
    1,
    Math.max(0.05, Math.abs(sim.laws.entropy))
  );
  const fulfillmentProxy = clampPct(
    sim.laws.coherence * 58 + parsedStability * 0.36 - rawEntropy * 14,
    72
  );

  const stages = [0, 1, 2, 3].map((idx): ComparableEpochStage => {
    const ep = sim.epochs[idx] ?? sim.epochs[sim.epochs.length - 1];
    const anomaly = sim.anomalies[idx % Math.max(1, sim.anomalies.length)];
    return {
      slotIndex: idx as 0 | 1 | 2 | 3,
      stageBadge: `${COMPARISON_EPOCH_SLOTS[idx].shortLabel} // ${ep.yearLabel}`,
      eraTitle: ep.eraTitle,
      identityOrState: `${node.category} // ${ep.eraTitle}`,
      environmentOrAnchor: anomaly
        ? `${anomaly.label} (${anomaly.coordLabel})`
        : node.classification,
      creationOrShift: `${ep.densityMultiplier.toFixed(2)}x Matter Density // ${ep.geometryFactor.toFixed(2)}x Field Curvature`,
      sacrificeOrCost:
        anomaly?.signature
          ? `Bound by ${anomaly.signature} — irreversibly sheds unchosen classical symmetries.`
          : "Conventional spacetime continuity dissolves beyond this fold.",
      narrative: ep.narrative,
    };
  }) as [
    ComparableEpochStage,
    ComparableEpochStage,
    ComparableEpochStage,
    ComparableEpochStage,
  ];

  return {
    node,
    isPersonal: false,
    code: node.code,
    title: node.title,
    subtitle: node.essence,
    pivotalSeed: node.synopsis,
    coreColor: node.coreColor,
    secondaryColor: node.secondaryColor,
    metrics: {
      fulfillment: fulfillmentProxy,
      riskEntropy: clampPct(rawEntropy * 100, 45),
      riskEntropyRaw: Number(rawEntropy.toFixed(2)),
      divergence: parsedDivergence,
      coherence: parsedStability,
    },
    epochs: stages,
    coreReward: `${node.essence} anchored at ${parsedStability}% resonance stability`,
    coreSacrifice:
      stages[3].sacrificeOrCost ||
      `${Math.round(rawEntropy * 100)}% entropy turbulence across deep horizon folds`,
  };
}

export function synthesizeNexusVerdict(
  alpha: ComparableTimeline,
  beta: ComparableTimeline
): NexusVerdict {
  const isSame = alpha.node.id === beta.node.id;

  const deltas: MetricDeltaItem[] = [
    {
      key: "fulfillment",
      label: "Fulfillment",
      sublabel: "Long-horizon depth & vital alignment",
      alphaVal: alpha.metrics.fulfillment,
      betaVal: beta.metrics.fulfillment,
      alphaDisplay: `${alpha.metrics.fulfillment}%`,
      betaDisplay: `${beta.metrics.fulfillment}%`,
      delta: beta.metrics.fulfillment - alpha.metrics.fulfillment,
      deltaDisplay:
        beta.metrics.fulfillment === alpha.metrics.fulfillment
          ? "0%"
          : `${beta.metrics.fulfillment > alpha.metrics.fulfillment ? "+" : ""}${
              beta.metrics.fulfillment - alpha.metrics.fulfillment
            }%`,
      leader:
        beta.metrics.fulfillment > alpha.metrics.fulfillment
          ? "beta"
          : alpha.metrics.fulfillment > beta.metrics.fulfillment
            ? "alpha"
            : "tied",
      higherIsBetter: true,
    },
    {
      key: "riskEntropy",
      label: "Risk / Entropy",
      sublabel: "Volatility, burn-rate & irreversible bets",
      alphaVal: alpha.metrics.riskEntropy,
      betaVal: beta.metrics.riskEntropy,
      alphaDisplay: `${alpha.metrics.riskEntropyRaw.toFixed(2)} ΔS`,
      betaDisplay: `${beta.metrics.riskEntropyRaw.toFixed(2)} ΔS`,
      delta: beta.metrics.riskEntropy - alpha.metrics.riskEntropy,
      deltaDisplay:
        beta.metrics.riskEntropy === alpha.metrics.riskEntropy
          ? "0.00 ΔS"
          : `${beta.metrics.riskEntropy > alpha.metrics.riskEntropy ? "+" : ""}${(
              beta.metrics.riskEntropyRaw - alpha.metrics.riskEntropyRaw
            ).toFixed(2)} ΔS`,
      leader:
        beta.metrics.riskEntropy > alpha.metrics.riskEntropy
          ? "beta"
          : alpha.metrics.riskEntropy > beta.metrics.riskEntropy
            ? "alpha"
            : "tied",
      higherIsBetter: false,
    },
    {
      key: "divergence",
      label: "Divergence Index",
      sublabel: "Distance from expected baseline momentum",
      alphaVal: alpha.metrics.divergence,
      betaVal: beta.metrics.divergence,
      alphaDisplay: `${alpha.metrics.divergence}%`,
      betaDisplay: `${beta.metrics.divergence}%`,
      delta: beta.metrics.divergence - alpha.metrics.divergence,
      deltaDisplay:
        beta.metrics.divergence === alpha.metrics.divergence
          ? "0%"
          : `${beta.metrics.divergence > alpha.metrics.divergence ? "+" : ""}${
              beta.metrics.divergence - alpha.metrics.divergence
            }%`,
      leader:
        beta.metrics.divergence > alpha.metrics.divergence
          ? "beta"
          : alpha.metrics.divergence > beta.metrics.divergence
            ? "alpha"
            : "tied",
      higherIsBetter: true,
    },
    {
      key: "coherence",
      label: "Coherence",
      sublabel: "Identity continuity & structural stability",
      alphaVal: alpha.metrics.coherence,
      betaVal: beta.metrics.coherence,
      alphaDisplay: `${alpha.metrics.coherence}%`,
      betaDisplay: `${beta.metrics.coherence}%`,
      delta: beta.metrics.coherence - alpha.metrics.coherence,
      deltaDisplay:
        beta.metrics.coherence === alpha.metrics.coherence
          ? "0%"
          : `${beta.metrics.coherence > alpha.metrics.coherence ? "+" : ""}${
              beta.metrics.coherence - alpha.metrics.coherence
            }%`,
      leader:
        beta.metrics.coherence > alpha.metrics.coherence
          ? "beta"
          : alpha.metrics.coherence > beta.metrics.coherence
            ? "alpha"
            : "tied",
      higherIsBetter: true,
    },
  ];

  if (isSame) {
    return {
      headline: `SUPERPOSITION LOCKED ON ${alpha.code} // ZERO DIFFERENTIAL`,
      alphaReward: alpha.coreReward,
      alphaSacrifice: alpha.coreSacrifice,
      betaReward: beta.coreReward,
      betaSacrifice: beta.coreSacrifice,
      synthesis:
        "Select two distinct constellation branches above to measure the irreversible cost and reward vector separating them.",
      deltas,
    };
  }

  const fulfillDiff = beta.metrics.fulfillment - alpha.metrics.fulfillment;
  const riskDiffPct = beta.metrics.riskEntropy - alpha.metrics.riskEntropy;
  const coherenceDiff = beta.metrics.coherence - alpha.metrics.coherence;
  const divergenceDiff = beta.metrics.divergence - alpha.metrics.divergence;

  let headline = "";
  if (Math.abs(fulfillDiff) >= 6) {
    const winner = fulfillDiff > 0 ? beta.code : alpha.code;
    const margin = Math.abs(fulfillDiff);
    const riskTag =
      Math.abs(riskDiffPct) >= 5
        ? ` AT ${riskDiffPct > 0 ? "+" : ""}${riskDiffPct}% ENTROPY SHIFT`
        : "";
    headline = `${winner} LEADS BY +${margin}% FULFILLMENT${riskTag}`;
  } else if (Math.abs(divergenceDiff) >= 12) {
    const radical = divergenceDiff > 0 ? beta.code : alpha.code;
    headline = `${radical} BENDS +${Math.abs(divergenceDiff)}% FURTHER FROM CONVENTIONAL INERTIA`;
  } else if (Math.abs(coherenceDiff) >= 6) {
    const steady = coherenceDiff > 0 ? beta.code : alpha.code;
    headline = `${steady} HOLDS +${Math.abs(coherenceDiff)}% STRONGER TEMPORAL COHERENCE`;
  } else {
    headline = `NEAR-SYMMETRIC SUPERPOSITION // DIVERGENT COST TEXTURES`;
  }

  const synthesisParts: string[] = [];
  if (fulfillDiff > 4 && riskDiffPct > 4) {
    synthesisParts.push(
      `${beta.title} purchases a +${fulfillDiff}% surge in fulfillment strictly by embracing +${riskDiffPct}% higher uncertainty and volatility than ${alpha.title}.`
    );
  } else if (fulfillDiff < -4 && riskDiffPct < -4) {
    synthesisParts.push(
      `${alpha.title} sustains +${Math.abs(fulfillDiff)}% deeper fulfillment with +${Math.abs(riskDiffPct)}% higher risk appetite, whereas ${beta.title} prioritizes structural steadiness.`
    );
  } else if (coherenceDiff > 5) {
    synthesisParts.push(
      `${beta.title} anchors stronger identity coherence (+${coherenceDiff}%), while ${alpha.title} trades predictability for uncharted divergence.`
    );
  } else if (coherenceDiff < -5) {
    synthesisParts.push(
      `${alpha.title} preserves +${Math.abs(coherenceDiff)}% tighter continuity across epochs, whereas ${beta.title} tears open a wider rupture (${beta.metrics.divergence}% divergence).`
    );
  } else {
    synthesisParts.push(
      `${alpha.title} and ${beta.title} reach comparable equilibrium amplitudes through fundamentally different sacrifices.`
    );
  }

  synthesisParts.push(
    `Standing in Epoch +10 YRS, choosing ${alpha.code} crystallizes "${alpha.epochs[3].creationOrShift}" at the price of "${alpha.epochs[3].sacrificeOrCost}", while ${beta.code} becomes "${beta.epochs[3].identityOrState}".`
  );

  return {
    headline,
    alphaReward: alpha.coreReward,
    alphaSacrifice: alpha.coreSacrifice,
    betaReward: beta.coreReward,
    betaSacrifice: beta.coreSacrifice,
    synthesis: synthesisParts.join(" "),
    deltas,
  };
}

export function pickDefaultComparisonPair(
  nodes: RealityNode[],
  selectedRealityId: string | null
): { alphaId: string; betaId: string } {
  if (nodes.length === 0) {
    return { alphaId: "omega-01", betaId: "omega-01" };
  }
  if (nodes.length === 1) {
    return { alphaId: nodes[0].id, betaId: nodes[0].id };
  }

  const forgedPersonal = nodes.filter(
    (n) => n.isCustom && Boolean(n.personalTimeline)
  );
  const omegaNode = nodes.find((n) => n.id === "omega-01");

  if (forgedPersonal.length >= 2) {
    const beta =
      selectedRealityId &&
      forgedPersonal.some((n) => n.id === selectedRealityId)
        ? selectedRealityId
        : forgedPersonal[forgedPersonal.length - 1].id;
    const alpha =
      forgedPersonal.find((n) => n.id !== beta)?.id ??
      omegaNode?.id ??
      nodes[0].id;
    return { alphaId: alpha, betaId: beta };
  }

  if (forgedPersonal.length === 1) {
    const alpha = omegaNode?.id ?? nodes.find((n) => n.id !== forgedPersonal[0].id)?.id ?? nodes[0].id;
    return { alphaId: alpha, betaId: forgedPersonal[0].id };
  }

  const customAny = nodes.filter((n) => n.isCustom);
  if (customAny.length >= 1) {
    const alpha = omegaNode?.id ?? nodes.find((n) => n.id !== customAny[0].id)?.id ?? nodes[0].id;
    return { alphaId: alpha, betaId: customAny[customAny.length - 1].id };
  }

  if (selectedRealityId && nodes.some((n) => n.id === selectedRealityId)) {
    const alpha =
      omegaNode && omegaNode.id !== selectedRealityId
        ? omegaNode.id
        : nodes.find((n) => n.id !== selectedRealityId)?.id ?? nodes[0].id;
    return { alphaId: alpha, betaId: selectedRealityId };
  }

  const alpha = omegaNode?.id ?? nodes[0].id;
  const beta = nodes.find((n) => n.id !== alpha)?.id ?? nodes[1].id;
  return { alphaId: alpha, betaId: beta };
}

