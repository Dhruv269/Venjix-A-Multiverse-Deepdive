import type {
  BranchRequestPayload,
  CommuneResponsePayload,
  DecisionCrossroad,
  EnigmaConverseRequest,
  EnigmaConverseResponse,
  GeneratorSource,
  LifeEpoch,
  LifeEpochKey,
  MultiverseMetrics,
  ParallelProbe,
  PersonalTimelineBranch,
  PhysicsMode,
} from "./types";

/* ============================================================================
 * Palette & Deterministic Hash Helpers
 * ========================================================================== */

interface SpectrumPreset {
  spectralTint: [number, number, number];
  coreColor: string;
  secondaryColor: string;
  physicsMode: PhysicsMode;
}

const SPECTRUM_PRESETS: Record<string, SpectrumPreset> = {
  neonDrift: {
    spectralTint: [0.14, 0.72, 0.96],
    coreColor: "#38BDF8",
    secondaryColor: "#F472B6",
    physicsMode: "bifurcation_horizon",
  },
  solarForge: {
    spectralTint: [0.92, 0.56, 0.18],
    coreColor: "#F59E0B",
    secondaryColor: "#FDE68A",
    physicsMode: "dyson_harmonic",
  },
  crimsonPitch: {
    spectralTint: [0.88, 0.24, 0.44],
    coreColor: "#F43F5E",
    secondaryColor: "#FB7185",
    physicsMode: "inverted_entropy",
  },
  astrolabeGold: {
    spectralTint: [0.22, 0.58, 0.94],
    coreColor: "#60A5FA",
    secondaryColor: "#FBBF24",
    physicsMode: "astral_astrolabe",
  },
  obsidianVow: {
    spectralTint: [0.32, 0.78, 0.72],
    coreColor: "#2DD4BF",
    secondaryColor: "#C084FC",
    physicsMode: "obsidian_glass_sea",
  },
  violetNexus: {
    spectralTint: [0.68, 0.34, 0.98],
    coreColor: "#B69AFF",
    secondaryColor: "#F6F3FE",
    physicsMode: "bifurcation_horizon",
  },
};

function hashText(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function hexToRgbTuple(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  if (clean.length !== 6) return [0.56, 0.34, 0.96];
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) {
    return [0.56, 0.34, 0.96];
  }
  return [
    Number(r.toFixed(2)),
    Number(g.toFixed(2)),
    Number(b.toFixed(2)),
  ];
}

function rgbTupleToHex(rgb: [number, number, number]): string {
  const toHex = (v: number) =>
    clamp(Math.round(v * 255), 24, 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
  return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}

function extractPlaceAndFocus(choice: string, baseline: string) {
  const combined = `${choice} ${baseline}`.toLowerCase();

  let city = "a coastal orbital metropolis";
  let localeDetail = "rain-slick neon alleys and quiet studio lofts";
  let themeKey: keyof typeof SPECTRUM_PRESETS = "violetNexus";

  if (/\b(japan|tokyo|kyoto|osaka|shibuya)\b/.test(combined)) {
    city = "Shimokitazawa, Tokyo";
    localeDetail =
      "narrow cedar alleyways lit by vending-machine blue and late-night train hum";
    themeKey = "neonDrift";
  } else if (/\b(san francisco|sf|silicon valley|bay area|palo alto)\b/.test(combined)) {
    city = "San Francisco's Fog Corridor";
    localeDetail =
      "brick warehouse lofts glowing with whiteboard derivations past 2:00 AM";
    themeKey = "solarForge";
  } else if (/\b(london|berlin|europe|paris|zurich|amsterdam)\b/.test(combined)) {
    city = "Kreuzberg, Berlin";
    localeDetail =
      "vaulted brick courtyards blending avant-garde synthesis with deep research";
    themeKey = "astrolabeGold";
  } else if (/\b(new york|nyc|manhattan|brooklyn)\b/.test(combined)) {
    city = "Lower Manhattan, New York";
    localeDetail =
      "fire-escape studios vibrating with relentless ambition above subway thunder";
    themeKey = "crimsonPitch";
  } else if (/\b(mumbai|bengaluru|bangalore|delhi|india)\b/.test(combined)) {
    city = "Indiranagar, Bengaluru";
    localeDetail =
      "monsoon-washed banyan streets buzzing with midnight prototype deployments";
    themeKey = "solarForge";
  } else if (/\b(mountain|island|cabin|himalaya|monk|quiet|forest|sea)\b/.test(combined)) {
    city = "an alpine observatory ridge";
    localeDetail =
      "mist-bound pines, cold horizon glass, and undisturbed starlight";
    themeKey = "obsidianVow";
  }

  let craft = "an unorthodox frontier venture";
  let domainVerb = "forging nonlinear instruments";
  let sacrificeCore =
    "predictable linear credentials and effortless proximity to your old circle";

  if (/\b(cricket|sport|athlete|pro |olympic|football|tennis|boxing)\b/.test(combined)) {
    craft = "a relentless high-stakes athletic campaign";
    domainVerb = "breaking biomechanic limits under stadium floodlights";
    sacrificeCore =
      "the safety of a software desk track and every unscheduled weekend of your twenties";
    themeKey = "crimsonPitch";
  } else if (/\b(game|indie|sci-fi|film|cinema|director|art|music|novel|animate)\b/.test(combined)) {
    craft = "a cult interactive narrative universe";
    domainVerb = "directing atmospheric worlds no committee would ever greenlight";
    sacrificeCore =
      "early financial cushioning and clean, easily explained family milestones";
    if (themeKey === "violetNexus") themeKey = "obsidianVow";
  } else if (/\b(startup|founder|company|venture|saas|product|drop out|dropout|build)\b/.test(combined)) {
    craft = "a razor-focused frontier software company";
    domainVerb = "shipping category-defining AI systems from scratch";
    sacrificeCore =
      "sleep equilibrium, campus rituals, and the luxury of failing privately";
    if (themeKey === "violetNexus") themeKey = "solarForge";
  } else if (/\b(research|phd|physics|neuro|quantum|scientist|lab|math)\b/.test(combined)) {
    craft = "fundamental theoretical & experimental discovery";
    domainVerb = "hunting first-principles laws inside frontier laboratories";
    sacrificeCore =
      "rapid commercial wealth in favor of patient multi-decade inquiry";
    themeKey = "astrolabeGold";
  }

  return { city, localeDetail, craft, domainVerb, sacrificeCore, themeKey };
}

function deriveShortTitle(pivotalChoice: string, chosenOption?: string): string {
  const raw = (chosenOption || pivotalChoice)
    .replace(/^what if i\s+/i, "")
    .replace(/^if i\s+/i, "")
    .replace(/[?.!]+$/g, "")
    .trim();
  const words = raw.split(/\s+/).filter(Boolean).slice(0, 5);
  if (words.length === 0) return "THE UNCHOSEN HORIZON";
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function sanitizeChoiceSnippet(text: string): string {
  return text
    .replace(/^what if i\s+/i, "")
    .replace(/\?+$/, "")
    .trim();
}

/* ============================================================================
 * Default Baseline Starter for OMEGA-01 (User's Personal Nexus)
 * ========================================================================== */

export const DEFAULT_PERSONAL_NEXUS_BRANCH: PersonalTimelineBranch = {
  id: "omega-01",
  code: "OMEGA-01 // PERSONAL NEXUS",
  title: "Your Personal Nexus",
  subtitle: "The living origin point where every parallel version of you bifurcates",
  currentSelfContext:
    "Standing at the edge of major early-life decisions in craft, ambition, geography, and identity",
  pivotalChoice:
    "Hold steady inside your current trajectory vs fracture outward along an unmade leap",
  spectralTint: [0.76, 0.42, 0.98],
  coreColor: "#B69AFF",
  secondaryColor: "#F6F3FE",
  physicsMode: "bifurcation_horizon",
  laws: { entropy: 0.34, gravity: 0.62, coherence: 0.84 },
  metrics: {
    fulfillment: 78,
    riskEntropy: 0.34,
    divergence: 12,
    temporalCoherence: 94,
  },
  epochs: [
    {
      id: "CROSSROADS",
      yearOffset: 0,
      yearLabel: "DAY 01",
      stageLabel: "THE CROSSROADS // DAY 01",
      eraTitle: "STILLPOINT BEFORE THE LEAP",
      whoYouBecome: "Observer at the Bifurcation Axis",
      whereYouLive: "Familiar Sanctuary",
      whatYouBuild: "Quiet Foundations & Hidden Ambition",
      whatYouSacrificed: "Nothing yet—except the lives waiting outside comfort",
      narrative:
        "You stand in the quiet hour before commitment hardens into history. Every credential, late-night prototype, and unspoken restlessness coils like potential energy waiting for a single asymmetric decision.",
      densityMultiplier: 0.82,
      speedMultiplier: 0.72,
      geometryFactor: 0.32,
    },
    {
      id: "EMERGENCE",
      yearOffset: 1,
      yearLabel: "+1 YEAR",
      stageLabel: "EMERGENCE // +1 YEAR",
      eraTitle: "FIRST TRAJECTORY CRYSTALLIZATION",
      whoYouBecome: "Focused Practitioner Building Leverage",
      whereYouLive: "Your Anchor City",
      whatYouBuild: "A Compounding Portfolio of Craft",
      whatYouSacrificed: "Wilder detours exchanged for steadier momentum",
      narrative:
        "You wake up to routines sharpened by consistency rather than upheaval. Friends still recognize you easily, yet subtle forks keep tugging whenever midnight finds you staring past the ordinary script.",
      densityMultiplier: 1.0,
      speedMultiplier: 1.0,
      geometryFactor: 0.68,
    },
    {
      id: "CONVERGENCE",
      yearOffset: 5,
      yearLabel: "+5 YEARS",
      stageLabel: "CONVERGENCE // +5 YEARS",
      eraTitle: "COMPOUNDING ARCHITECT",
      whoYouBecome: "Trusted Builder With Deep Roots",
      whereYouLive: "Established Hub of Craft",
      whatYouBuild: "Systems People Rely Upon Daily",
      whatYouSacrificed: "The electric unpredictability of an unscripted foreign leap",
      narrative:
        "Five years down the central branch, respect surrounds your name and competence feels effortless. Still, whenever you open VENJIX at dusk, three faint crossroads pulse just beside what is.",
      densityMultiplier: 1.28,
      speedMultiplier: 1.18,
      geometryFactor: 0.96,
    },
    {
      id: "DESTINY",
      yearOffset: 10,
      yearLabel: "+10 YEARS",
      stageLabel: "DESTINY // +10 YEARS",
      eraTitle: "THE SOVEREIGN BASELINE",
      whoYouBecome: "Seasoned Mentor & Pattern-Breaker",
      whereYouLive: "A Home Shaped Entirely by Deliberate Choices",
      whatYouBuild: "Enduring Institutions & Quiet Autonomy",
      whatYouSacrificed: "Every unlived life left strictly as theoretical geometry",
      narrative:
        "A decade inward, stability and self-knowledge anchor every room you enter. Yet the nexus invites you anytime: pull one of the three decision threads and watch a wholly unfamiliar self crystallize.",
      densityMultiplier: 1.38,
      speedMultiplier: 1.34,
      geometryFactor: 1.24,
    },
  ],
  decisionNodes: [
    {
      id: "nexus-dec-1",
      code: "DECISION-01",
      label: "BURN THE SAFETY BOATS",
      coordLabel: "DAY 01 // AXIS-X",
      xPct: 30,
      yPct: 36,
      dilemma:
        "An unexpected window opens tonight: liquidate predictability and relocate or launch an obsessive flagship leap with zero fallback.",
      choices: [
        {
          id: "nx-1a",
          label: "Take the asymmetric frontier leap immediately",
          consequencePreview:
            "Explosive skill acceleration and surreal highs paired with volatile runway.",
          impactMetrics: {
            fulfillmentDelta: 12,
            riskEntropyDelta: 0.32,
            divergenceDelta: 48,
            coherenceDelta: -14,
          },
        },
        {
          id: "nx-1b",
          label: "Build an underground stealth engine for 6 months first",
          consequencePreview:
            "Dual-life exhaustion by night, arriving on day one with undeniable leverage.",
          impactMetrics: {
            fulfillmentDelta: 8,
            riskEntropyDelta: 0.12,
            divergenceDelta: 26,
            coherenceDelta: 4,
          },
        },
      ],
    },
    {
      id: "nexus-dec-2",
      code: "DECISION-02",
      label: "CHOOSE CRAFT OVER CROWD",
      coordLabel: "YR +01.8 // AXIS-Y",
      xPct: 62,
      yPct: 31,
      dilemma:
        "Consensus peers sprint toward lucrative prestigious conformity while a strange weird obsessional project whispers only to you.",
      choices: [
        {
          id: "nx-2a",
          label: "Commit deeply to the weird uncopied vision",
          consequencePreview:
            "Years of misunderstood solitude ending in an unmistakable category of one.",
          impactMetrics: {
            fulfillmentDelta: 16,
            riskEntropyDelta: 0.24,
            divergenceDelta: 52,
            coherenceDelta: -8,
          },
        },
        {
          id: "nx-2b",
          label: "Ride the consensus wave cleanly to buy future freedom",
          consequencePreview:
            "Early capital and network gravity, trusting discipline not to numb your edge.",
          impactMetrics: {
            fulfillmentDelta: 4,
            riskEntropyDelta: -0.08,
            divergenceDelta: 18,
            coherenceDelta: 9,
          },
        },
      ],
    },
    {
      id: "nexus-dec-3",
      code: "DECISION-03",
      label: "CROSS AN OCEAN ALONE",
      coordLabel: "YR +04.5 // AXIS-Z",
      xPct: 48,
      yPct: 57,
      dilemma:
        "Staying preserves cherished bonds and effortless fluency; crossing into an unfamiliar culture strips your armor down to pure instinct.",
      choices: [
        {
          id: "nx-3a",
          label: "Board the one-way departure to reinvent from zero",
          consequencePreview:
            "Bittersweet homesickness transformed into razor-sharp self-authorship.",
          impactMetrics: {
            fulfillmentDelta: 11,
            riskEntropyDelta: 0.28,
            divergenceDelta: 56,
            coherenceDelta: -11,
          },
        },
        {
          id: "nx-3b",
          label: "Anchor homeward and magnetize the world toward your doorstep",
          consequencePreview:
            "Deeper lifelong alliances forged alongside a quieter local renaissance.",
          impactMetrics: {
            fulfillmentDelta: 9,
            riskEntropyDelta: -0.05,
            divergenceDelta: 22,
            coherenceDelta: 7,
          },
        },
      ],
    },
  ],
  parallelPersona: {
    openingFromFutureSelf:
      "I am speaking from five years inside your steady baseline. Everything you built held intact—your craft commands quiet respect here, and nothing broke. Yet I still trace the alternate branches every night, wondering which edge would have sharpened faster had you jumped.",
    enigmaTradeoffAnalysis:
      "Inside OMEGA-01, temporal coherence remains exceptionally high (94%) precisely because entropy has been rationed. The hidden cost of a clean baseline is rarely failure—it is quiet optimization inside walls slightly smaller than your ceiling.",
    parallelProbes: [
      {
        id: "np-1",
        label: "What ambition quietly faded along this safe baseline?",
        oracleAnswer:
          "Not your competence—only your tolerance for looking foolish at square zero. Prestige compounds smoothly on familiar tracks, subtle enough that you barely notice when bold weirdness turns polite.",
        futureSelfAnswer:
          "The wild midnight experiments got sanded into clean roadmaps. I have zero regrets about the craft we mastered, though I sometimes miss the raw terror of attempting something utterly unfamiliar.",
      },
      {
        id: "np-2",
        label: "Which threshold in the next 12 months carries highest leverage?",
        oracleAnswer:
          "Geography and peer cohort amplify variance faster than raw hours. Stepping into a room where you feel five years behind wakes dormant reserves immediately.",
        futureSelfAnswer:
          "Pick the path that makes your chest tighten just before commitment. Every real inflection point I wish I'd hit harder felt slightly premature the week it arrived.",
      },
      {
        id: "np-3",
        label: "Are the people beside me now still anchored at +5 years?",
        oracleAnswer:
          "Continuity is OMEGA-01's deepest gift: shared meals, inside jokes, and unhurried presence survive intact here—assets high-entropy timelines routinely spend as fuel.",
        futureSelfAnswer:
          "Yes—and you don't realize how sacred Sunday evenings with people who knew you before ambition took over truly are until you visit branches where you traded them for velocity.",
      },
    ],
  },
  generatorSource: "fallback",
};

/* ============================================================================
 * Deterministic Hyper-Contextual Life Branch Synthesizer (Resilient Fallback)
 * ========================================================================== */

export function synthesizeDeterministicLifeBranch(
  req: BranchRequestPayload
): PersonalTimelineBranch {
  const cleanBaseline = req.currentSelfContext.trim() || "Ambitious creator seeking uncharted growth";
  const cleanChoice = req.pivotalChoice.trim() || "Step boldly onto an uncharted timeline";
  const chosenOpt = req.chosenOption?.trim();
  const seed = hashText(
    `${cleanBaseline}|${cleanChoice}|${chosenOpt ?? ""}|${req.currentEpoch ?? ""}`
  );

  const info = extractPlaceAndFocus(
    `${cleanChoice} ${chosenOpt ?? ""}`,
    cleanBaseline
  );
  const preset = SPECTRUM_PRESETS[info.themeKey];
  const snippet = sanitizeChoiceSnippet(cleanChoice);
  const branchNum = (seed % 89) + 10;

  const isChosenMutation = Boolean(chosenOpt);
  const decisionTag = chosenOpt ? deriveShortTitle(chosenOpt) : "";
  const title = chosenOpt
    ? `${deriveShortTitle(cleanChoice)} // ${decisionTag}`
    : deriveShortTitle(cleanChoice);

  const code = `LIFE-${branchNum} // ${
    isChosenMutation ? "FORKED BRANCH" : "THE UNCHOSEN PATH"
  }`;

  const highRiskShift = chosenOpt
    ? /\b(all-in|quit|burn|leap|monk|solo|board|commit|reject|unorthodox|disrupt|risk)\b/i.test(
        chosenOpt
      )
    : false;

  const baseFulfillment = clamp(74 + (seed % 21) + (highRiskShift ? 5 : 2), 45, 98);
  const baseEntropy = Number(
    clamp(0.32 + ((seed >>> 4) % 45) / 100 + (highRiskShift ? 0.14 : -0.05), 0.14, 0.92).toFixed(2)
  );
  const baseDivergence = clamp(
    54 + ((seed >>> 8) % 38) + (isChosenMutation ? 11 : 0),
    24,
    99
  );
  const baseCoherence = clamp(
    91 - Math.round(baseEntropy * 36) + (seed % 7),
    38,
    96
  );

  const choiceContextSentence = chosenOpt
    ? `When ${req.currentEpoch ?? "the turning point"} demanded a verdict, choosing "${chosenOpt}" severed every half-measure.`
    : `Choosing to ${snippet.charAt(0).toLowerCase() + snippet.slice(1)} fractured your timeline away from the familiar script.`;

  const epochs: LifeEpoch[] = [
    {
      id: "CROSSROADS",
      yearOffset: 0,
      yearLabel: "DAY 01",
      stageLabel: "THE CROSSROADS // DAY 01",
      eraTitle: "RUPTURE & DEPARTURE",
      whoYouBecome: `The Beginner Leaving "${cleanBaseline.slice(0, 42)}${cleanBaseline.length > 42 ? "..." : ""}" Behind`,
      whereYouLive: `En route toward ${info.city}`,
      whatYouBuild: `Raw Commitment to ${info.craft}`,
      whatYouSacrificed: "Every safe explanation you used to give strangers about where you're headed",
      narrative: `You wake up with a half-packed bag and a pulse louder than your doubts. ${choiceContextSentence} Everything known recedes behind boarding glass as ${info.city} waits—not with red carpets, only an unwritten slate.`,
      densityMultiplier: 0.85,
      speedMultiplier: 0.78,
      geometryFactor: 0.34,
    },
    {
      id: "EMERGENCE",
      yearOffset: 1,
      yearLabel: "+1 YEAR",
      stageLabel: "EMERGENCE // +1 YEAR",
      eraTitle: "FRICTION & FIRST SIGNAL",
      whoYouBecome: "Relentless Apprentice Tempered by Scarcity",
      whereYouLive: `${info.city} (${info.localeDetail})`,
      whatYouBuild: `Early Prototypes via ${info.domainVerb}`,
      whatYouSacrificed: info.sacrificeCore,
      narrative: `One year in, your mornings smell like espresso and rain over ${info.city}. You wake up in a sparse room surrounded by scars of failed iterations, yet three strangers from opposite continents finally lean in—sensing the unmistakable pulse of ${info.craft}.`,
      densityMultiplier: 1.05,
      speedMultiplier: 1.04,
      geometryFactor: 0.72,
    },
    {
      id: "CONVERGENCE",
      yearOffset: 5,
      yearLabel: "+5 YEARS",
      stageLabel: "CONVERGENCE // +5 YEARS",
      eraTitle: "THE UNMISTAKABLE SIGNATURE",
      whoYouBecome: `Recognized Architect inside ${info.city}`,
      whereYouLive: `A sunlit corner loft overlooking ${info.city}`,
      whatYouBuild: `Signature Work in ${info.craft}`,
      whatYouSacrificed:
        "Two missed family milestones and years when rest felt indistinguishable from guilt",
      narrative: `Five years down this timeline, you wake up at dawn with calm certainty replacing desperation. Your early gamble has hardened into an original voice people travel to witness—${chosenOpt ? `directly shaped by how "${chosenOpt}" forced real invention` : `forged through ${info.domainVerb}`}.`,
      densityMultiplier: 1.32,
      speedMultiplier: 1.22,
      geometryFactor: 1.04,
    },
    {
      id: "DESTINY",
      yearOffset: 10,
      yearLabel: "+10 YEARS",
      stageLabel: "DESTINY // +10 YEARS",
      eraTitle: "REWRITTEN ORIGIN GRAVITY",
      whoYouBecome: "Living Proof of the Unchosen Leap",
      whereYouLive: `Between ${info.city} & quiet sanctuaries you designed`,
      whatYouBuild: `An Independent Ecosystem Rooted in ${info.craft}`,
      whatYouSacrificed:
        "The person you would have been if fear had dressed up as realism ten years ago",
      narrative: `A decade after stepping off the ledge, you walk the quiet horizon of ${info.city} knowing you never merely observed your potential from shore. Even what broke along the way now sparkles inside the architecture of a life undeniably yours.`,
      densityMultiplier: 1.44,
      speedMultiplier: 1.4,
      geometryFactor: 1.32,
    },
  ];

  const decisionNodes: DecisionCrossroad[] = [
    {
      id: `${branchNum}-dec-1`,
      code: "DECISION-01",
      label: "THE PATRONAGE OR SOVEREIGNTY FORK",
      coordLabel: "YR +01.2 // FORK-A",
      xPct: 30,
      yPct: 37,
      dilemma: `Inside ${info.city}, an influential gatekeeper offers funding and prestige on condition you dilute the weirdest half of ${info.craft}.`,
      choices: [
        {
          id: "c1-a",
          label: "Reject compromise and extend lean independent survival",
          consequencePreview:
            "Brutal 14-month stretch of scarcity followed by fierce total ownership.",
          impactMetrics: {
            fulfillmentDelta: 11,
            riskEntropyDelta: 0.22,
            divergenceDelta: 14,
            coherenceDelta: -9,
          },
        },
        {
          id: "c1-b",
          label: "Accept strategic alliance while hiding an underground side-project",
          consequencePreview:
            "Immediate scale and network access at the price of dual political pressure.",
          impactMetrics: {
            fulfillmentDelta: 4,
            riskEntropyDelta: 0.06,
            divergenceDelta: 7,
            coherenceDelta: 5,
          },
        },
      ],
    },
    {
      id: `${branchNum}-dec-2`,
      code: "DECISION-02",
      label: "BURNOUT OR BREAKTHROUGH HOUR",
      coordLabel: "YR +03.1 // FORK-B",
      xPct: 62,
      yPct: 31,
      dilemma: `Year three exhaustion hits hard; hometown friends are flourishing on safe paths while your flagship breakthrough refuses to stabilize cleanly.`,
      choices: [
        {
          id: "c2-a",
          label: "Shed perfectionism and ship the raw unfinished truth publicly",
          consequencePreview:
            "Humbling initial criticism sparking an electric cult resonance overnight.",
          impactMetrics: {
            fulfillmentDelta: 15,
            riskEntropyDelta: 0.16,
            divergenceDelta: 18,
            coherenceDelta: 4,
          },
        },
        {
          id: "c2-b",
          label: "Step away for a silent 90-day sabbatical to rebuild instinct",
          consequencePreview:
            "Calm perspective restores endurance and unexpectedly deepens craft coherence.",
          impactMetrics: {
            fulfillmentDelta: 9,
            riskEntropyDelta: -0.14,
            divergenceDelta: 8,
            coherenceDelta: 14,
          },
        },
        {
          id: "c2-c",
          label: "Bring on an unorthodox wild-card co-architect",
          consequencePreview:
            "Shared creative lightning paired with volatile partnership friction.",
          impactMetrics: {
            fulfillmentDelta: 10,
            riskEntropyDelta: 0.19,
            divergenceDelta: 15,
            coherenceDelta: -6,
          },
        },
      ],
    },
    {
      id: `${branchNum}-dec-3`,
      code: "DECISION-03",
      label: "ROOTS VS INFINITE HORIZON",
      coordLabel: "YR +06.4 // FORK-C",
      xPct: 47,
      yPct: 58,
      dilemma: `Having finally conquered your initial mountain in ${info.city}, gravity asks whether you deepen love and roots here—or leap again into an even stranger frontier.`,
      choices: [
        {
          id: "c3-a",
          label: "Anchor deep in love, mentorship, and enduring legacy here",
          consequencePreview:
            "Rich inner peace transforms restless ambition into generational craft.",
          impactMetrics: {
            fulfillmentDelta: 14,
            riskEntropyDelta: -0.18,
            divergenceDelta: 6,
            coherenceDelta: 16,
          },
        },
        {
          id: "c3-b",
          label: "Sell the pinnacle creation and vanish into your next frontier craft",
          consequencePreview:
            "Permanent nomad freedom fueled by audacity that never decays into routine.",
          impactMetrics: {
            fulfillmentDelta: 8,
            riskEntropyDelta: 0.25,
            divergenceDelta: 22,
            coherenceDelta: -12,
          },
        },
      ],
    },
  ];

  const probes: ParallelProbe[] = [
    {
      id: `p-${branchNum}-1`,
      label: "What hurt most during Year One along this path?",
      oracleAnswer: `In this continuum, solitude amplifies right around month seven. Without traditional milestones framing your days in ${info.city}, only self-authored conviction sustains velocity when nobody claps yet.`,
      futureSelfAnswer: `Honest answer from Year Five? Watchful nights in ${info.city} checking messages from home over a different timezone, wondering if I threw away an easier joy. Stick out month nine—everything cracked open right after.`,
    },
    {
      id: `p-${branchNum}-2`,
      label: "Was the sacrifice worth what we actually built here?",
      oracleAnswer: `Quantitatively, fulfillment outperforms baseline by +${baseFulfillment - 74} points while demanding ${(baseEntropy * 100).toFixed(0)}% higher volatility tolerance—you traded easy predictability for vivid authorship.`,
      futureSelfAnswer: `A hundred times yes—though not for the applause I imagined back when I started. What actually healed us was becoming someone who doesn't flinch when the map runs out.`,
    },
    {
      id: `p-${branchNum}-3`,
      label: "What would you tell present-day me tonight before choosing?",
      oracleAnswer: `Divergence readiness reads ${baseDivergence}%. If you execute even a reversible 90-day experiment toward "${snippet}", causal inertia bends immediately toward this horizon.`,
      futureSelfAnswer: `Stop asking for a 10-year guarantee before taking Day One steps. Move before you feel ready—we learn how to steer mid-flight once the ground disappears.`,
    },
  ];

  const physicsModes: PhysicsMode[] = [
    "bifurcation_horizon",
    "astral_astrolabe",
    "inverted_entropy",
    "dyson_harmonic",
    "obsidian_glass_sea",
  ];
  const resolvedMode: PhysicsMode = chosenOpt
    ? physicsModes[(seed >>> 3) % physicsModes.length]
    : preset.physicsMode;

  return {
    id: `life-${branchNum}-${seed.toString(36)}`,
    code,
    title,
    subtitle: `${info.city} // ${snippet}`,
    parentTimelineTitle: req.parentTimelineTitle,
    currentSelfContext: cleanBaseline,
    pivotalChoice: cleanChoice,
    chosenOption: chosenOpt,
    spectralTint: preset.spectralTint,
    coreColor: preset.coreColor,
    secondaryColor: preset.secondaryColor,
    physicsMode: resolvedMode,
    epochs,
    decisionNodes,
    metrics: {
      fulfillment: baseFulfillment,
      riskEntropy: baseEntropy,
      divergence: baseDivergence,
      temporalCoherence: baseCoherence,
    },
    laws: {
      entropy: baseEntropy,
      gravity: Number(clamp(0.45 + (baseCoherence / 100) * 0.42, 0.25, 0.92).toFixed(2)),
      coherence: Number(clamp(baseCoherence / 100, 0.28, 0.96).toFixed(2)),
    },
    parallelPersona: {
      openingFromFutureSelf: `Look closely—I'm speaking to you from five years inside "${title}" in ${info.city}. Wait until you smell the evening air outside our studio here. Yes, we gave up ${info.sacrificeCore}, and yes, Year One bruised us hard. Ask me anything about how this life feels from the inside.`,
      enigmaTradeoffAnalysis: `Causal scan complete for "${title}". By committing to ${snippet}, emotional fulfillment climbs toward ${baseFulfillment}%, powered by ${info.domainVerb}. The concealed ledger carries ${Math.round(baseEntropy * 100)}% risk entropy: isolating timezone/career detachment alongside pressure to sustain an uncopied trajectory.`,
      parallelProbes: probes,
    },
    generatorSource: "fallback",
  };
}

/* ============================================================================
 * Strict Normalizer for Upstream LLM JSON Responses
 * ========================================================================== */

const VALID_PHYSICS_MODES: PhysicsMode[] = [
  "bifurcation_horizon",
  "astral_astrolabe",
  "inverted_entropy",
  "dyson_harmonic",
  "obsidian_glass_sea",
  "procedural_hybrid",
];

const EPOCH_ORDER: LifeEpochKey[] = [
  "CROSSROADS",
  "EMERGENCE",
  "CONVERGENCE",
  "DESTINY",
];

export function normalizeBranchResponse(
  raw: unknown,
  req: BranchRequestPayload,
  source: GeneratorSource
): PersonalTimelineBranch {
  const fallback = synthesizeDeterministicLifeBranch(req);
  if (!raw || typeof raw !== "object") {
    return { ...fallback, generatorSource: source };
  }

  const obj = raw as Record<string, unknown>;
  const asStr = (val: unknown, fb: string): string =>
    typeof val === "string" && val.trim().length > 0 ? val.trim() : fb;
  const asNum = (val: unknown, fb: number, min: number, max: number): number => {
    const n = typeof val === "number" ? val : Number(val);
    return Number.isFinite(n) ? clamp(n, min, max) : fb;
  };

  let spectralTint: [number, number, number] = fallback.spectralTint;
  if (Array.isArray(obj.spectralTint) && obj.spectralTint.length === 3) {
    const nums = obj.spectralTint.map((v) =>
      asNum(v, 0.5, 0.04, 1.0)
    ) as [number, number, number];
    spectralTint = [
      Number(nums[0].toFixed(2)),
      Number(nums[1].toFixed(2)),
      Number(nums[2].toFixed(2)),
    ];
  }

  const coreColor =
    typeof obj.coreColor === "string" && /^#[0-9a-fA-F]{6}$/.test(obj.coreColor)
      ? obj.coreColor
      : rgbTupleToHex(spectralTint);

  const physicsMode: PhysicsMode =
    typeof obj.physicsMode === "string" &&
    VALID_PHYSICS_MODES.includes(obj.physicsMode as PhysicsMode)
      ? (obj.physicsMode as PhysicsMode)
      : fallback.physicsMode;

  const rawMetrics = (obj.metrics && typeof obj.metrics === "object"
    ? obj.metrics
    : {}) as Record<string, unknown>;
  const metrics: MultiverseMetrics = {
    fulfillment: Math.round(
      asNum(rawMetrics.fulfillment, fallback.metrics.fulfillment, 10, 100)
    ),
    riskEntropy: Number(
      asNum(rawMetrics.riskEntropy, fallback.metrics.riskEntropy, 0.05, 0.98).toFixed(2)
    ),
    divergence: Math.round(
      asNum(rawMetrics.divergence, fallback.metrics.divergence, 5, 100)
    ),
    temporalCoherence: Math.round(
      asNum(rawMetrics.temporalCoherence, fallback.metrics.temporalCoherence, 15, 99)
    ),
  };

  const rawEpochs = Array.isArray(obj.epochs) ? obj.epochs : [];
  const epochs: LifeEpoch[] = EPOCH_ORDER.map((key, idx) => {
    const fbEpoch = fallback.epochs[idx];
    const candidate =
      rawEpochs[idx] && typeof rawEpochs[idx] === "object"
        ? (rawEpochs[idx] as Record<string, unknown>)
        : {};
    return {
      ...fbEpoch,
      id: key,
      eraTitle: asStr(candidate.eraTitle, fbEpoch.eraTitle),
      whoYouBecome: asStr(candidate.whoYouBecome, fbEpoch.whoYouBecome),
      whereYouLive: asStr(candidate.whereYouLive, fbEpoch.whereYouLive),
      whatYouBuild: asStr(candidate.whatYouBuild, fbEpoch.whatYouBuild),
      whatYouSacrificed: asStr(
        candidate.whatYouSacrificed,
        fbEpoch.whatYouSacrificed
      ),
      narrative: asStr(candidate.narrative, fbEpoch.narrative),
    };
  });

  const rawDecisions = Array.isArray(obj.decisionNodes)
    ? obj.decisionNodes
    : [];
  const decisionNodes: DecisionCrossroad[] = fallback.decisionNodes.map(
    (fbNode, idx) => {
      const candidate =
        rawDecisions[idx] && typeof rawDecisions[idx] === "object"
          ? (rawDecisions[idx] as Record<string, unknown>)
          : {};
      const rawChoices = Array.isArray(candidate.choices)
        ? candidate.choices
        : [];
      const parsedChoices = rawChoices
        .slice(0, 3)
        .map((c, cIdx) => {
          if (!c || typeof c !== "object") return null;
          const co = c as Record<string, unknown>;
          const fbChoice = fbNode.choices[cIdx % fbNode.choices.length];
          const rawImp =
            co.impactMetrics && typeof co.impactMetrics === "object"
              ? (co.impactMetrics as Record<string, unknown>)
              : {};
          return {
            id: asStr(co.id, `${fbNode.id}-c-${cIdx + 1}`),
            label: asStr(co.label, fbChoice.label),
            consequencePreview: asStr(
              co.consequencePreview,
              fbChoice.consequencePreview
            ),
            impactMetrics: {
              fulfillmentDelta: Math.round(
                asNum(
                  rawImp.fulfillmentDelta,
                  fbChoice.impactMetrics.fulfillmentDelta,
                  -30,
                  35
                )
              ),
              riskEntropyDelta: Number(
                asNum(
                  rawImp.riskEntropyDelta,
                  fbChoice.impactMetrics.riskEntropyDelta,
                  -0.4,
                  0.45
                ).toFixed(2)
              ),
              divergenceDelta: Math.round(
                asNum(
                  rawImp.divergenceDelta,
                  fbChoice.impactMetrics.divergenceDelta,
                  -10,
                  55
                )
              ),
              coherenceDelta: Math.round(
                asNum(
                  rawImp.coherenceDelta,
                  fbChoice.impactMetrics.coherenceDelta,
                  -30,
                  30
                )
              ),
            },
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);

      return {
        ...fbNode,
        label: asStr(candidate.label, fbNode.label),
        dilemma: asStr(candidate.dilemma, fbNode.dilemma),
        choices:
          parsedChoices.length >= 2 ? parsedChoices : fbNode.choices,
      };
    }
  );

  const rawPersona = (
    obj.parallelPersona && typeof obj.parallelPersona === "object"
      ? obj.parallelPersona
      : {}
  ) as Record<string, unknown>;

  const rawProbes = Array.isArray(rawPersona.parallelProbes)
    ? rawPersona.parallelProbes
    : [];
  const parallelProbes: ParallelProbe[] =
    fallback.parallelPersona.parallelProbes.map((fbProbe, idx) => {
      const candidate =
        rawProbes[idx] && typeof rawProbes[idx] === "object"
          ? (rawProbes[idx] as Record<string, unknown>)
          : {};
      return {
        id: fbProbe.id,
        label: asStr(candidate.label, fbProbe.label),
        oracleAnswer: asStr(candidate.oracleAnswer, fbProbe.oracleAnswer),
        futureSelfAnswer: asStr(
          candidate.futureSelfAnswer,
          fbProbe.futureSelfAnswer
        ),
      };
    });

  return {
    id: asStr(obj.id, fallback.id),
    code: asStr(obj.code, fallback.code),
    title: asStr(obj.title, fallback.title),
    subtitle: asStr(obj.subtitle, fallback.subtitle),
    parentTimelineTitle: req.parentTimelineTitle,
    currentSelfContext: fallback.currentSelfContext,
    pivotalChoice: fallback.pivotalChoice,
    chosenOption: req.chosenOption,
    spectralTint: hexToRgbTuple(coreColor),
    coreColor,
    secondaryColor: asStr(obj.secondaryColor, fallback.secondaryColor),
    physicsMode,
    epochs,
    decisionNodes,
    metrics,
    laws: {
      entropy: metrics.riskEntropy,
      gravity: fallback.laws.gravity,
      coherence: Number(clamp(metrics.temporalCoherence / 100, 0.25, 0.98).toFixed(2)),
    },
    parallelPersona: {
      openingFromFutureSelf: asStr(
        rawPersona.openingFromFutureSelf,
        fallback.parallelPersona.openingFromFutureSelf
      ),
      enigmaTradeoffAnalysis: asStr(
        rawPersona.enigmaTradeoffAnalysis,
        fallback.parallelPersona.enigmaTradeoffAnalysis
      ),
      parallelProbes,
    },
    generatorSource: source,
  };
}

/* ============================================================================
 * Deterministic Oracle / Future-Self Communion Synthesizer
 * ========================================================================== */

export function synthesizeDeterministicCommune(
  req: BranchRequestPayload
): CommuneResponsePayload {
  const question = (req.question ?? req.pivotalChoice).trim();
  const qLower = question.toLowerCase();
  const title = req.timelineSnapshot?.title ?? req.parentTimelineTitle ?? "THIS TIMELINE";
  const subtitle = req.timelineSnapshot?.subtitle ?? req.pivotalChoice;
  const isFutureSelf = req.personaMode === "parallel_self";
  const seed = hashText(`${question}|${title}|${req.personaMode ?? "oracle"}`);

  let transmission = "";
  if (isFutureSelf) {
    if (/(regret|miss|worth|sacrifice|family|friend|lonely)/.test(qLower)) {
      transmission = `I won't sugarcoat it from five years ahead inside "${title}": yes, certain Sundays felt brutally distant when everyone else celebrated familiar milestones. You lose effortless closeness when you sprint toward "${subtitle}". Yet waking up knowing we actually bled for the thing we believed in heals almost every bruise that loneliness left.`;
    } else if (/(money|fail|scared|risk|afford|safe|security)/.test(qLower)) {
      transmission = `Between you and me, months four through eleven tested every financial nerve we had. Nobody rescued us externally; what saved us was turning raw hunger into undeniable shipped work before runway ended. Your fear right now means you understand the stakes—not that you aren't built for "${title}".`;
    } else {
      transmission = `Standing five years inside "${title}" right now, hearing you ask "${question}" feels uncanny—because I asked almost that exact sentence the night everything shifted. The version of us here didn't wait to feel fearless; we simply started living out "${subtitle}" in stubborn daily increments until the world rearranged around it.`;
    }
  } else {
    if (/(tradeoff|cost|sacrifice|hidden|blind|regret)/.test(qLower)) {
      transmission = `Oracle ledger for "${title}": every bright outcome extracts an exact structural shadow. By forcing emergence along "${subtitle}", you gain steep velocity and uncopied identity—at the subtle toll of relational drift, irregular rest cycles, and zero pre-written benchmarks to measure worth against.`;
    } else if (/(reverse|change|return|later|both)/.test(qLower)) {
      transmission = `Asymmetry dictates that no decision returns you to the identical shoreline—yet partial bridges remain. Testing the core assumption of "${question}" through a bounded 60-day prototype lets you sample "${title}"'s true friction before burning every anchor behind you.`;
    } else {
      transmission = `Probability resonance on "${question}" converges cleanly inside "${title}". The determining variable is rarely external luck; it is whether you can endure the awkward first six months of looking inexperienced at "${subtitle}" before compounding quietly flips the board in your favor.`;
    }
  }

  const coh = clamp(82 + (seed % 16), 68, 98);
  const ent = clamp(0.14 + ((seed >>> 4) % 35) / 100, 0.1, 0.65);
  const div = clamp(64 + ((seed >>> 8) % 33), 40, 99);

  return {
    transmission,
    telemetry: {
      temporalCoherence: `${coh}.${seed % 9}%`,
      entropyDelta: `+${ent.toFixed(3)} ΔS`,
      divergenceProbability: `${div}.${(seed >>> 3) % 9}%`,
    },
    generatorSource: "fallback",
  };
}

export function synthesizeEnigmaConverseFallback(
  req: EnigmaConverseRequest
): EnigmaConverseResponse {
  const cleanQuery = req.query.trim();
  const qLower = cleanQuery.toLowerCase();
  const title = req.realityTitle.trim() || "This Reality Horizon";
  const seed = hashText(
    `${req.realityId}|${req.mode}|${cleanQuery}|${req.history?.length ?? 0}`
  );
  const priorTurns = req.history?.length ?? 0;

  let transmission = "";
  if (req.mode === "parallel_self") {
    const choicePhrase = req.pivotalChoice?.trim() || req.realitySynopsis.trim();
    const epochHint = req.currentEpochSummary?.trim() || title;

    if (req.isPersonalTimeline) {
      if (/(day|daily|morning|routine|feel|life like|live)/.test(qLower)) {
        transmission = `Five years inside "${title}" (${epochHint}), my mornings start slower than yours—more self-directed, less scripted by anyone else's calendar. I'm deep into work born straight out of "${choicePhrase}". I still miss the easy predictability and casual closeness with folks back in our original track, yet every honest scar here feels unmistakably mine.`;
      } else if (/(worth|regret|miss|sacrifice|lose|lost|cost)/.test(qLower)) {
        transmission = `If you want zero sugarcoating from Year +5 inside "${title}": yes, it cost us comfortable approval and a few relationships that only made sense on the old road. Certain quiet evenings still sting. Even so, watching what grew once we actually committed to "${choicePhrase}" makes it worth the bruises ten times over.`;
      } else {
        transmission = `Hearing "${cleanQuery}" from across the boundary hits weirdly close${
          priorTurns > 0 ? " after what we've already talked through" : ""
        }. Five years into living "${choicePhrase}", I stopped waiting for permission before building. You wouldn't recognize our calendar anymore, yet the core instinct is identical—just freed from second-guessing.`;
      }
    } else {
      transmission = `Five subjective years inside ${title}, my sensory instincts have rewritten themselves around ${req.realitySynopsis.slice(0, 120).replace(/\.$/, "")}. Answering "${cleanQuery}": daily work here bends toward what you'd call impossible physics back on origin Earth—and though I quietly miss unhurried twilight coffee and simple gravity, stepping into this horizon was worth every disorienting week.`;
    }
  } else {
    const synopsisCore = req.realitySynopsis.trim();
    const choiceAnchor = req.pivotalChoice?.trim() || synopsisCore;

    if (/(tradeoff|cost|sacrifice|risk|blind|danger|fail)/.test(qLower)) {
      transmission = `Oracle ledger for "${title}": committing to "${choiceAnchor}" trades ambient comfort for sharp directional singularity. The concealed liability is compounding isolation and early volatility—yet avoiding the risk altogether carries its own quiet entropy: decades spent optimizing someone else's blueprint.`;
    } else if (/(time|future|year|reverse|when|epoch|destiny)/.test(qLower)) {
      transmission = `Across ${title}, causal momentum locks in rapidly past Month 18 (${
        req.currentEpochSummary ?? "Emergence horizon"
      }). Addressing "${cleanQuery}": trajectories rarely reverse cleanly once identity crystallizes around new proof, yet running a concrete 45-day asymmetric probe now reveals 80% of the friction without irreversible commitment.`;
    } else {
      transmission = `Enigma synthesis aligned on ${title}: your question ("${cleanQuery}") probes the structural hinge between intention and consequence${
        priorTurns > 0 ? ` across ${priorTurns + 1} resonant exchanges` : ""
      }. Follow where energy rises alongside honest fear—noise fades quickly inside ${title}, leaving only deliberate craft.`;
    }
  }

  const coh = clamp(81 + (seed % 17), 65, 98);
  const entPrefix = req.realityId === "null-09" ? "-" : "+";
  const ent = clamp(0.11 + ((seed >>> 4) % 42) / 100, 0.08, 0.72);
  const div = clamp(
    (req.isPersonalTimeline ? 68 : 82) + ((seed >>> 8) % 28),
    42,
    99
  );

  return {
    transmission,
    telemetry: {
      temporalCoherence: `${coh}.${seed % 9}%`,
      entropyDelta: `${entPrefix}${ent.toFixed(3)} ΔS`,
      divergenceProbability: `${div}.${(seed >>> 3) % 9}%`,
    },
    mode: req.mode,
    generatorSource: "fallback",
  };
}

