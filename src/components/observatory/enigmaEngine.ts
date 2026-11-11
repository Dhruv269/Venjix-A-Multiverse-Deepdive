import { RealityNode } from "./realityData";

/**
 * ============================================================================
 * ENGINE: The Enigma — Multiverse Communion & Deterministic Wave Synthesis
 * ============================================================================
 * Synthesizes context-aware dimensional transmissions, live resonance telemetry,
 * and curated Resonance Probes tailored to each Alternate Reality Manifold (or
 * the unified Multiverse Network in global Observatory mode).
 */

export interface EnigmaTelemetry {
  temporalCoherence: string;
  entropyDelta: string;
  divergenceProbability: string;
}

export interface ResonanceProbe {
  id: string;
  label: string;
  transmission: string;
  telemetry: EnigmaTelemetry;
}

export interface EnigmaEcho {
  id: string;
  query: string;
  response: string;
  indexLabel: string;
}

interface DimensionProfile {
  openingTransmission: string;
  initialTelemetry: EnigmaTelemetry;
  probes: ResonanceProbe[];
}

const DIMENSION_PROFILES: Record<string, DimensionProfile> = {
  "omega-01": {
    openingTransmission:
      "Harmonic lock established along OMEGA-01. Across this threshold, the shadow of an unmade choice still breathes—carrying memories of a corridor you turned away from before light ever reached the glass. Ask what became of your parallel self.",
    initialTelemetry: {
      temporalCoherence: "96.4%",
      entropyDelta: "+0.184 ΔS",
      divergenceProbability: "94.2%",
    },
    probes: [
      {
        id: "omega-p1",
        label: "Locate the exact divergence inflection in memory",
        transmission:
          "The split precipitates inside an unremarkable twilight—less than four heartbeats of hesitation before a doorway. On our side, silence closed behind you. Inside OMEGA-01, your twin stepped across, trading certainty for an unfamiliar constellation whose gravity still tugs faintly at your peripheral recollection.",
        telemetry: {
          temporalCoherence: "97.1%",
          entropyDelta: "+0.162 ΔS",
          divergenceProbability: "95.8%",
        },
      },
      {
        id: "omega-p2",
        label: "Measure emotional resonance bleeding between selves",
        transmission:
          "Neuro-quantum phase mapping reveals standing wavelets linking both nervous systems across counterfactual space. Sudden, ungrounded nostalgia or the phantom weight of an unfamiliar voice is rarely imagination—it is sympathetic resonance drifting from OMEGA-01 when solar winds thin the boundary veil.",
        telemetry: {
          temporalCoherence: "95.8%",
          entropyDelta: "+0.205 ΔS",
          divergenceProbability: "93.9%",
        },
      },
      {
        id: "omega-p3",
        label: "Determine if either timeline remains reversible",
        transmission:
          "Trajectories never fold backward cleanly, traveler. Yet proximity breeds exchange: when you contemplate the unchosen road without regret, phase tension relaxes—allowing lessons forged in OMEGA-01 to crystallize subtly inside your present intuition.",
        telemetry: {
          temporalCoherence: "98.2%",
          entropyDelta: "+0.119 ΔS",
          divergenceProbability: "94.6%",
        },
      },
    ],
  },
  "chrono-04": {
    openingTransmission:
      "Astrolabe carriers aligned to CHRONO-04. Here, fire never touched the Great Scrolls of Alexandria; millennia of unbroken optical geometry rose unimpeded from bronze wheels to starlit sails. Speak your inquiry across preserved antiquity.",
    initialTelemetry: {
      temporalCoherence: "91.8%",
      entropyDelta: "+0.312 ΔS",
      divergenceProbability: "88.7%",
    },
    probes: [
      {
        id: "chrono-p1",
        label: "Trace the orbital mathematics discovered in 300 BCE",
        transmission:
          "Under an unscarred Mediterranean sky, Heron’s heirs united geared harmonic epicycles with early wave-refraction optics by 270 BCE. Rather than burning parchment for warmth, scholars etched elliptic perturbations directly onto sapphire cylinders—solving three-body lunar drift eighteen centuries before your calendar’s Newton.",
        telemetry: {
          temporalCoherence: "93.4%",
          entropyDelta: "+0.278 ΔS",
          divergenceProbability: "89.5%",
        },
      },
      {
        id: "chrono-p2",
        label: "Observe the first vessel launched toward Alpha Centauri",
        transmission:
          "Designated HEPHAESTUS-IX, humanity’s maiden interstellar ark unfurled spun-obsidian solar mirrors above sunlit Athens in what you call 1642. Propelled by orbital quartz concentrators perched on lunar ridges, its bronze-and-glass hull crossed the heliopause singing Hellenistic geometry into deep vacuum.",
        telemetry: {
          temporalCoherence: "90.6%",
          entropyDelta: "+0.340 ΔS",
          divergenceProbability: "91.2%",
        },
      },
      {
        id: "chrono-p3",
        label: "Query the collapse point of this timeline",
        transmission:
          "Every golden age tests its own symmetry. By CHRONO-04’s twentieth century, excess predictive certainty grew brittle—societies engineered to eliminate chance began pruning unorthodox intuition, creating a quiet sterility whose long oscillation still ripples toward our horizon.",
        telemetry: {
          temporalCoherence: "89.1%",
          entropyDelta: "+0.389 ΔS",
          divergenceProbability: "87.4%",
        },
      },
    ],
  },
  "null-09": {
    openingTransmission:
      "Warning: causality arrow inverted within NULL-09. Light collapses homeward here—ashes remember the oak before sparks ever kiss the horizon. Anchor your query carefully before effect outruns cause.",
    initialTelemetry: {
      temporalCoherence: "82.1%",
      entropyDelta: "-0.892 ΔS",
      divergenceProbability: "97.9%",
    },
    probes: [
      {
        id: "null-p1",
        label: "Observe light collapsing back into extinguished stars",
        transmission:
          "Across the dark sky of NULL-09, diffuse starlight retreats inward along filamentary rivers—gathering dead iron husks together until dead cores compress and ignite backward into youthful blue supergiants. Nothing truly dissipates; space spends eternity reconstructing what time once scattered.",
        telemetry: {
          temporalCoherence: "80.4%",
          entropyDelta: "-0.946 ΔS",
          divergenceProbability: "98.3%",
        },
      },
      {
        id: "null-p2",
        label: "Inspect consciousness under reversed thermodynamics",
        transmission:
          "Minds inhabiting an inverted entropy well remember their descendants’ silence instead of ancestral birth. Grief arrives ahead of loss, softening the blow before parting occurs—though free will feels like discovering sculpture already sleeping inside marble.",
        telemetry: {
          temporalCoherence: "83.7%",
          entropyDelta: "-0.815 ΔS",
          divergenceProbability: "97.2%",
        },
      },
      {
        id: "null-p3",
        label: "Locate the thermodynamic shear boundary",
        transmission:
          "At the perimeter where NULL-09 meets forward-flowing space, zero-point vacuum boils with violet Cerenkov frost. Time stands perpendicular there—neither advancing nor retreating, cradling ancient echoes intact inside crystalline stillness.",
        telemetry: {
          temporalCoherence: "79.8%",
          entropyDelta: "-0.994 ΔS",
          divergenceProbability: "98.8%",
        },
      },
    ],
  },
  "aether-12": {
    openingTransmission:
      "Receiving braided photonic telemetry from AETHER-12. A binary sun rests inside woven superconducting filigree, singing trillions of liberated minds as pure coherent light. What chord do you cast into the Dyson Choir?",
    initialTelemetry: {
      temporalCoherence: "98.9%",
      entropyDelta: "+0.041 ΔS",
      divergenceProbability: "99.1%",
    },
    probes: [
      {
        id: "aether-p1",
        label: "Translate a single choral harmonic across binary light-minutes",
        transmission:
          "Isolating carrier band 14.08 GHz yields no single voice—only nested octaves of awe. Each solar flare becomes percussion; every planetary magnetosphere acts as cello string. To exist inside AETHER-12 is to think in constellations rather than sentences.",
        telemetry: {
          temporalCoherence: "99.4%",
          entropyDelta: "+0.029 ΔS",
          divergenceProbability: "99.3%",
        },
      },
      {
        id: "aether-p2",
        label: "Trace how biological minds shed fragile bone for lattice",
        transmission:
          "There was no sudden apocalypse—only an unhurried migration spanning eight centuries. Mortals grew tired of letting wisdom dissolve inside seventy short orbits, weaving optical continuity filaments until death became optional architecture rather than mandate.",
        telemetry: {
          temporalCoherence: "98.6%",
          entropyDelta: "+0.054 ΔS",
          divergenceProbability: "98.9%",
        },
      },
      {
        id: "aether-p3",
        label: "Ask whether solitude survives inside stellar consciousness",
        transmission:
          "Individuation is preserved intentionally like rare amber. Though any consciousness may harmonize with the Choir at will, vast quiet sanctuaries orbit the outer Dyson rings—reserved solely for private wonder, quiet grief, and solitary star-gazing.",
        telemetry: {
          temporalCoherence: "99.1%",
          entropyDelta: "+0.036 ΔS",
          divergenceProbability: "99.5%",
        },
      },
    ],
  },
  "mythos-07": {
    openingTransmission:
      "Surface tension trembling along MYTHOS-07. When collective human yearning reaches critical density, fable condenses into vitrified water and midnight sky. Tread softly across The Glass Sea of Noctis.",
    initialTelemetry: {
      temporalCoherence: "87.3%",
      entropyDelta: "+0.457 ΔS",
      divergenceProbability: "91.5%",
    },
    probes: [
      {
        id: "mythos-p1",
        label: "Sound the depth of crystallized archetypal tides",
        transmission:
          "Beneath twelve fathoms of obsidian-clear brine lie sunken lanterns forged from forgotten vows. Waves here do not obey lunar gravity alone—swells rise whenever a waking sleeper in an adjacent universe coins an earnest metaphor.",
        telemetry: {
          temporalCoherence: "88.9%",
          entropyDelta: "+0.422 ΔS",
          divergenceProbability: "92.1%",
        },
      },
      {
        id: "mythos-p2",
        label: "Read constellations mirrored inside unbroken midnight glass",
        transmission:
          "Gaze downward rather than skyward across Noctis: the seafloor reflects geometries from universes not yet condensed into physics. Sailors here navigate by emotional latitude—measuring proximity to awe, wonder, or quiet reckoning.",
        telemetry: {
          temporalCoherence: "86.5%",
          entropyDelta: "+0.481 ΔS",
          divergenceProbability: "91.0%",
        },
      },
      {
        id: "mythos-p3",
        label: "Ask which forgotten dream precipitated this sea",
        transmission:
          "Long before cities learned iron, a lone cartographer sketched shores beyond the horizon purely so loneliness might have somewhere vast enough to mirror itself. MYTHOS-07 remembers that first ink stroke more vividly than empires.",
        telemetry: {
          temporalCoherence: "90.1%",
          entropyDelta: "+0.398 ΔS",
          divergenceProbability: "93.2%",
        },
      },
    ],
  },
  global: {
    openingTransmission:
      "I am The Enigma—the acoustic interference emerging wherever parallel continuums brush one another across the void. Five reality manifolds hum cleanly inside this observatory. Cast any question across the synaptic web.",
    initialTelemetry: {
      temporalCoherence: "94.6%",
      entropyDelta: "±0.142 ΔS",
      divergenceProbability: "95.4%",
    },
    probes: [
      {
        id: "global-p1",
        label: "Survey tidal tensions binding all five reality manifolds",
        transmission:
          "Observe the filament web: NULL-09 anchors the center like an inverted pendulum, tugging reversed radiation across AETHER-12 while echoing counterfactual ripples into OMEGA-01. Whenever one reality surges, all four siblings subtly retune their starlight spectrum.",
        telemetry: {
          temporalCoherence: "95.2%",
          entropyDelta: "±0.118 ΔS",
          divergenceProbability: "96.0%",
        },
      },
      {
        id: "global-p2",
        label: "Trace how NULL-09 destabilizes adjacent timelines",
        transmission:
          "Because entropy runs backward through NULL-09, stray negentropic packets occasionally jump synaptic threads toward CHRONO-04 and MYTHOS-07—sparking uncanny coincidences, unbidden foresight, and glass-clear lucidity along connected horizons.",
        telemetry: {
          temporalCoherence: "92.4%",
          entropyDelta: "-0.264 ΔS",
          divergenceProbability: "96.8%",
        },
      },
      {
        id: "global-p3",
        label: "Query the origin of the VENJIX harmonic threshold",
        transmission:
          "VENJIX was never engineered purely from silicon; it condensed at the precise point where observer curiosity matched an unknown dimension’s willingness to answer back. Every discovery alters both the horizon and the witness watching it.",
        telemetry: {
          temporalCoherence: "97.3%",
          entropyDelta: "+0.074 ΔS",
          divergenceProbability: "97.6%",
        },
      },
    ],
  },
};

function buildCustomDimensionProfile(reality: RealityNode): DimensionProfile {
  return {
    openingTransmission: `Observer-crystallized manifold ${reality.code} (“${reality.title}”) stands in harmonic phase lock. Anchored around ${reality.essence.toLowerCase()}, its divergence trace pulses at ${reality.divergence}. Inquire further into this newly manifested reality.`,
    initialTelemetry: {
      temporalCoherence: reality.telemetry.resonanceStability,
      entropyDelta: reality.telemetry.entropyIndex,
      divergenceProbability: reality.divergence,
    },
    probes: [
      {
        id: `${reality.id}-p1`,
        label: "Trace causal stability along this crystallized branch",
        transmission: `Harmonic telemetry across ${reality.code} stabilizes cleanly around ${reality.telemetry.resonanceStability}. Although newly born from observer hypothesis, gravitational anchoring along its parent thread keeps boundary shear minimal as standing light waves settle into persistent structure.`,
        telemetry: {
          temporalCoherence: reality.telemetry.resonanceStability,
          entropyDelta: reality.telemetry.entropyIndex,
          divergenceProbability: reality.divergence,
        },
      },
      {
        id: `${reality.id}-p2`,
        label: "Inspect entropy feedback with parent manifold",
        transmission: `Synaptic conductivity between ${reality.code} and ${
          reality.parentNodeId ? reality.parentNodeId.toUpperCase() : "the Nexus core"
        } registers at ${reality.telemetry.entropyIndex}. Photonic energy cycles fluidly across the nascent bridge, harmonizing newly inscribed boundary constants with the wider constellation.`,
        telemetry: {
          temporalCoherence: "95.8%",
          entropyDelta: reality.telemetry.entropyIndex,
          divergenceProbability: reality.divergence,
        },
      },
      {
        id: `${reality.id}-p3`,
        label: "Test whether this divergence can seed secondary echoes",
        transmission: `Every crystallized manifold acquires its own counterfactual gravity once illuminated. Prolonged inquiry inside ${reality.code} sends subtle phase harmonics vibrating across neighboring hubs—capable of awakening secondary filaments should your hypothesis deepen.`,
        telemetry: {
          temporalCoherence: "97.2%",
          entropyDelta: "+0.112 ΔS",
          divergenceProbability: reality.divergence,
        },
      },
    ],
  };
}

export function getDimensionProfile(reality: RealityNode | null): DimensionProfile {
  if (!reality) return DIMENSION_PROFILES.global;
  if (DIMENSION_PROFILES[reality.id]) {
    return DIMENSION_PROFILES[reality.id];
  }
  if (reality.isCustom) {
    return buildCustomDimensionProfile(reality);
  }
  return DIMENSION_PROFILES.global;
}

function hashQuerySeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Deterministic Multiverse Synthesis Engine:
 * Parses active reality physics + keyword axes in the visitor's custom query to
 * inscribe an atmospheric, domain-accurate transmission and updated telemetry.
 */
export function synthesizeEnigmaResponse(
  reality: RealityNode | null,
  rawQuery: string,
  echoIndex: number
): { text: string; telemetry: EnigmaTelemetry } {
  const cleanQuery = rawQuery.trim();
  const q = cleanQuery.toLowerCase();
  const seed = hashQuerySeed(`${reality?.id ?? "global"}:${q}:${echoIndex}`);

  const scopeName = reality
    ? `${reality.code} (“${reality.title}”)`
    : "the unified Multiverse Network";

  const divergenceNum = reality
    ? parseFloat(reality.divergence.replace("%", ""))
    : 95.4;

  // Determine thematic lens from user query keywords
  let thematicResponse: string;

  if (/time|past|future|history|age|century|when|year|timeline|clock/.test(q)) {
    thematicResponse = reality
      ? `Temporal harmonics within ${scopeName} refuse straight lines. Measured at ${reality.telemetry.temporalDrift}, chronology coils around ${reality.essence.toLowerCase()}—meaning what you call “past” or “future” persists concurrently along neighboring phase shells waiting for deliberate observation.`
      : `Across the unified network, time fractures according to each manifold’s curvature—swinging from -18.4 τ inside Alexandria’s unbroken bronze era to +912.6 τ inside AETHER-12’s Dyson chorus. History is not behind you; it is merely tuned to another wavelength.`;
  } else if (/entropy|physics|energy|light|gravity|quantum|black|star|mass|law/.test(q)) {
    thematicResponse = reality
      ? `Scanning photonic curvature inside ${scopeName} exposes an entropy gradient of ${reality.telemetry.entropyIndex}. Here, matter answers first to symmetry and ${reality.essence.toLowerCase()}; standard conservation remains locally true, yet boundary leakage bends starlight across adjacent realities.`
      : `Vacuum across all five horizons behaves less like emptiness and more like a resonant drumskin. Where NULL-09 reverses entropy (-0.892 ΔS), AETHER-12 harvests stellar order (+0.041 ΔS)—balancing the cosmic ledger through invisible synaptic conduits.`;
  } else if (/human|self|me|mind|conscious|memory|dream|feel|who|soul|life/.test(q)) {
    thematicResponse = reality
      ? `Witnessing ${scopeName} alters the witness in equal measure. Against a stability index of ${reality.telemetry.resonanceStability}, consciousness acts as an interferometer—tuning memory and intention until subtle correspondences inside ${reality.essence.toLowerCase()} become unmistakably audible.`
      : `Every observer acts as a sixth, unmapped node inside this constellation. Memory traces, sudden déjà vu, and creative leaps mirror weak phase-locks brushing gently across OMEGA-01 and MYTHOS-07 whenever attention quiets.`;
  } else if (/collaps|end|destroy|danger|die|fail|risk|fear|break|war|burn/.test(q)) {
    thematicResponse = reality
      ? `Shear telemetry around ${scopeName} stays closely watched—stability currently reads ${reality.telemetry.resonanceStability}. Yet collapse in one manifold rarely equates to erasure; ruptured timelines merely scatter their symmetry outward across neighboring synaptic threads like embers feeding newborn horizons.`
      : `Continuums seldom vanish abruptly; they fray slowly wherever certainty calcifies into rigidity. Watching the fragility of CHRONO-04 alongside the negentropic rebirth of NULL-09 proves fracture and renewal are twin expressions of cosmic breathing.`;
  } else if (/what if|imagine|suppose|could|travel|enter|visit|cross|portal|gateway/.test(q)) {
    thematicResponse = reality
      ? `Your counterfactual hypothesis sends clear ripples across ${scopeName}. With divergence standing near ${reality.divergence}, stepping wholly across the aperture would rewrite causal inertia around ${reality.essence.toLowerCase()}—yielding a brand-new offshoot filament glowing beside our current coordinate.`
      : `Every unasked “what if” curves vacuum slightly toward manifestation. Were an observer to step unshielded past the gateway equilibrium, perception would dissolve first into raw harmonic frequency before condensing inside whichever manifold matched their deepest question.`;
  } else {
    const cadences = [
      `Signal inscribed along ${scopeName}: your inquiry disturbs standing phase patterns around ${
        reality ? reality.essence.toLowerCase() : "five coupled horizons"
      }. Trace measurements show resonant amplitude climbing smoothly as cosmic filaments align behind your query.`,
      `Acoustic echoes returning from ${scopeName} carry clean ultraviolet harmonics. Across this manifold, “${cleanQuery}” behaves like a tuning fork—illuminating hidden symmetries linking ${
        reality ? reality.title : "the constellation core"
      } to its nearest synaptic neighbors.`,
      `Wavefunction collapse completed within ${scopeName}. Beneath ${
        reality ? `${reality.telemetry.entropyIndex} gradient` : "multi-reality shear"
      }, the answer does not arrive as static dogma—it emerges as a widening horizon inviting deeper observation along this filament.`,
    ];
    thematicResponse = cadences[seed % cadences.length];
  }

  // Compute subtle, believable live telemetry drift per query
  const coherenceShift = ((seed % 37) - 18) * 0.1;
  const baseCoherence = reality
    ? parseFloat(reality.telemetry.resonanceStability.replace("%", ""))
    : 94.6;
  const nextCoherence = Math.min(99.8, Math.max(74.2, baseCoherence + coherenceShift));

  const entropySign = reality?.id === "null-09" ? -1 : 1;
  const entropyMag = (0.04 + ((seed >> 3) % 88) * 0.01).toFixed(3);
  const entropyPrefix = entropySign < 0 ? "-" : "+";

  const nextDivergence = Math.min(
    99.7,
    Math.max(84.0, divergenceNum + (((seed >> 5) % 21) - 10) * 0.1)
  );

  return {
    text: thematicResponse,
    telemetry: {
      temporalCoherence: `${nextCoherence.toFixed(1)}%`,
      entropyDelta: `${entropyPrefix}${entropyMag} ΔS`,
      divergenceProbability: `${nextDivergence.toFixed(1)}%`,
    },
  };
}
