# VENJIX // Product Requirements Document (PRD)

**Product:** VENJIX — The Multiverse Observatory  
**Document Version:** 1.0  
**Status:** Production Baseline  
**Primary Stack:** Next.js 16 (App Router), React 19, TypeScript 5, WebGL2 (GLSL ES 3.00), HTML5 Canvas 2D, Web Audio API, Supabase (`@supabase/supabase-js`)

---

## 1. Executive Summary & Vision

**VENJIX** is an interactive personal multiverse observatory and life-choice simulation platform. While conventional journaling or AI chat tools treat alternate scenarios as disposable text threads, VENJIX anchors hypothetical choices in an atmospheric cosmic geometry: users define their real-world baseline, forge counterfactual *"what if?"* decisions into luminous orbital Reality Nodes, enter interactive physics simulations across four temporal epochs, interrogate their own alternate selves inside a live communion terminal, and benchmark divergent trajectories side by side.

VENJIX is designed around three non-negotiable engineering principles:
1. **Sensory Cohesion:** Every UI transition couples visuals, shader telemetry, and procedural audio so the observatory feels like a singular instrument rather than stitched widgets.
2. **Offline-First & Zero-Friction Resilience:** All core AI simulations, WebGL shaders, audio synthesis, and persistence work instantaneously in the browser even when no LLM API keys or database credentials are configured.
3. **Graceful Cloud Upgrade:** When LLM keys (`GEMINI_API_KEY`, `MISTRAL_API_KEY`, `OPENAI_API_KEY`) and Supabase credentials are supplied, routes seamlessly escalate from deterministic local engines to live AI inference and authenticated Postgres synchronization.

---

## 2. Target Audience & Personas

### Persona 1: The Crossroads Explorer
- **Profile:** Students, builders, founders, and professionals standing near irreversible life forks (switching majors, relocating, leaving a stable role to ship an independent product, turning down an offer).
- **Goal:** Externalize intuition and anxiety around unchosen paths into tangible timelines they can inspect across `DAY 01`, `+1 YR`, `+5 YRS`, and `+10 YRS`.
- **Primary Workflow in VENJIX:** Sets a real-world baseline → clicks `+ FORGE CHOICE` to crystallize an alternate choice → enters `RealityBreachView` to inspect epoch outcomes and branch further via Decision Crossroads → runs **Timeline Comparison Matrix** against `OMEGA-01` (`Your Personal Nexus`) to evaluate trade-offs across `Fulfillment`, `Wealth`, `Mastery`, and `Freedom`.

### Persona 2: The Speculative Worldbuilder
- **Profile:** Writers, game designers, systems thinkers, and interactive-fiction creators fascinated by alternate physics, divergent histories, and surreal sci-fi interfaces.
- **Goal:** Explore rich atmospheric archetypes (`CHRONO-04`, `NULL-09`, `AETHER-12`, `MYTHOS-07`), mutate physical constants (`entropyRate`, `gravityPolarity`, `coherenceFactor`, `temporalDrift`), and converse with speculative personas or an oracle inside a reactive visual shell.
- **Primary Workflow in VENJIX:** Navigates the synaptic constellation → enters Dimensional Breach spaces and adjusts live Law Mutators → switches `EnigmaCommunion` between `enigma_oracle` and `parallel_self` modes → exports curated `.json` multiverse archives via `ObserverIdentityModal` or syncs to Supabase Postgres.

---

## 3. End-to-End User Journey & Core Flows

### Flow A: Gateway Awakening (`page.tsx` → `CosmicObservatory`)
1. On initial visit, the user enters a void canvas illuminated by [`AtmosphericCanvas.tsx`](../src/components/gateway/AtmosphericCanvas.tsx) ramping `u_reveal` (`0.05 → 1.0` over `2.2s`).
2. [`page.tsx`](../src/app/page.tsx) steps through a choreographed 4-stage reveal (`0.0s` environment opening, `2.2s` wordmark emergence, `4.2s` threshold readiness, `5.8s`–`7.8s` telemetry HUD visibility).
3. Clicking `INITIATE DISCOVERY` in [`InitiateContactButton.tsx`](../src/components/gateway/InitiateContactButton.tsx) unlocks Web Audio (`cosmicAudio.unlockFromGesture()`), triggers the 3-phase sequence (`signal_detected` → `dimensional_resonance` → `origin_synchronized`), ramps shader uniforms (`u_warp`, `u_observatory`), persists `venjix_gateway_revealed` in `sessionStorage`, and reveals `CosmicObservatory`. *(Returning sessions or OAuth callback redirects bypass the intro sequence cleanly.)*

### Flow B: Constellation Navigation & Reality Inspection
1. Inside [`CosmicObservatory.tsx`](../src/components/observatory/CosmicObservatory.tsx), [`RealityConstellation.tsx`](../src/components/observatory/RealityConstellation.tsx) renders an organic `1000 × 620` orbital field connected by cubic Bezier SVG synaptic threads (`SYNAPTIC_LINKS`).
2. Hovering or clicking any node (`OMEGA-01`, `CHRONO-04`, `NULL-09`, `AETHER-12`, `MYTHOS-07`, or custom forged branches) updates `activeSpectrum` on `AtmosphericCanvas`, smoothly shifting `u_spectralTint`, plays a subtle harmonic hover chime (`playOrbHover`), and opens `RealityInspector` with telemetry (`entropyIndex`, `temporalDrift`, `resonanceStability`) and an `[ ENTER DIMENSIONAL BREACH -> ]` trigger.

### Flow C: Life-Choice Forging & Dimensional Breach Simulation
1. Clicking `+ FORGE CHOICE` opens the forging modal where users edit their persistent `baselineContext` and pose a counterfactual decision prompt.
2. Submitting dispatches `POST /api/multiverse/branch` (`src/app/api/multiverse/branch/route.ts`), which enforces a strict `6000ms` `AbortController` timeout over configured LLM APIs and falls back immediately to `synthesizeDeterministicLifeBranch()` if offline or timed out.
3. The newly forged branch crystallizes onto the constellation (up to `MAX_CUSTOM_REALITIES = 5`, enforcing eviction/cap protections and automatic synaptic linking to its `parentNodeId`).
4. Clicking `[ ENTER DIMENSIONAL BREACH -> ]` launches [`RealityBreachView.tsx`](../src/components/observatory/RealityBreachView.tsx), rendering an interactive physics canvas (`bifurcation_horizon`, `astral_astrolabe`, `inverted_entropy`, `dyson_harmonic`, `obsidian_glass_sea`, or `procedural_hybrid`) paired with:
   - **Epoch Scrubber:** Inspect outcomes and canvas density across `DAY 01`, `+1 YR`, `+5 YRS`, and `+10 YRS`.
   - **Spatial Anomalies:** Clickable canvas/sidebar coordinates revealing epoch-specific turning points.
   - **Decision Crossroads:** In-breach choice buttons that recursively spawn child divergence branches or deepen the simulation.
   - **Live Law Mutators:** Real-time sliders modifying `entropyRate`, `gravityPolarity`, `coherenceFactor`, and `temporalDrift` in the live physics loop.

### Flow D: Dual-Channel Enigma Communion
1. Opening `ENIGMA` in [`ObservatoryNavbar.tsx`](../src/components/observatory/ObservatoryNavbar.tsx) mounts [`EnigmaCommunion.tsx`](../src/components/observatory/EnigmaCommunion.tsx).
2. Users toggle between two channels routed to `POST /api/enigma/converse`:
   - `enigma_oracle`: Speaks as the cosmic observatory intelligence analyzing divergence harmonics.
   - `parallel_self`: Adopts the first-person perspective of the user living inside the selected timeline branch (`branchContext`, `baselineContext`).
3. Transmission states (`idle`, `transmitting`, `synthesizing`) update `u_activity` (`0.0` / `0.42` / `1.0`) in `AtmosphericCanvas`, driving shader turbulence velocity during inference.
4. Any AI insight can be crystallized directly onto the constellation map via `onCrystallizeDivergence`, and transcripts persist as Echo Logs.

### Flow E: Parallel Life Comparison Matrix & Observer Identity Sync
1. Clicking `[ COMPARE TIMELINES ]` opens [`TimelineComparisonModal.tsx`](../src/components/observatory/TimelineComparisonModal.tsx), powered by [`comparisonEngine.ts`](../src/components/observatory/comparisonEngine.ts). Users pick Timeline A and Timeline B to view synchronized epoch summaries, a 4-axis radar chart (`Fulfillment`, `Wealth`, `Mastery`, `Freedom`), numeric deltas, and a synthesized **Nexus Verdict**.
2. Clicking `[ OBSERVER // {handle} ]` opens [`ObserverIdentityModal.tsx`](../src/components/observatory/ObserverIdentityModal.tsx), enabling:
   - Instant local `.json` archive export/import and state reset.
   - Real `@supabase/supabase-js` authentication (Email/Password Sign In & Sign Up, Magic Link OTP, GitHub & Google OAuth) and cloud Postgres sync via `public.observer_multiverses`.

---

## 4. Functional Requirements (Priority Breakdown)

| ID | Priority | Requirement | Implementation Reference |
| :--- | :--- | :--- | :--- |
| **FR-01** | **P0** | Background WebGL2 canvas must interpolate `u_spectralTint` and `u_activity` smoothly per frame (`~0.03` at 60fps) without abrupt color snapping. | [`AtmosphericCanvas.tsx`](../src/components/gateway/AtmosphericCanvas.tsx) (`L775-L797`) |
| **FR-02** | **P0** | Observatory must support 5 anchor nodes (`REALITY_NODES`) plus up to `MAX_CUSTOM_REALITIES = 5` custom nodes persisted across browser reloads. | [`realityData.ts`](../src/components/observatory/realityData.ts), [`multiverseStore.ts`](../src/lib/multiverseStore.ts) |
| **FR-03** | **P0** | All AI endpoints (`/api/multiverse/branch`, `/api/enigma/converse`) must complete or fall back cleanly within `6000ms` so UI buttons never hang indefinitely. | [`branch/route.ts`](../src/app/api/multiverse/branch/route.ts), [`converse/route.ts`](../src/app/api/enigma/converse/route.ts) |
| **FR-04** | **P0** | `RealityBreachView` must support multi-epoch scrubbing, inspectable anomalies, live physical law mutation sliders, and recursive Decision Crossroads. | [`RealityBreachView.tsx`](../src/components/observatory/RealityBreachView.tsx) |
| **FR-05** | **P0** | Audio synthesis must initialize strictly inside explicit user gesture handlers (`unlockFromGesture`) to comply with browser autoplay policies, with zero external `.mp3`/`.wav` assets. | [`cosmicAudio.ts`](../src/lib/cosmicAudio.ts) |
| **FR-06** | **P1** | Timeline Comparison Matrix must compute normalized 4-axis metrics (`Fulfillment`, `Wealth`, `Mastery`, `Freedom`) cleanly for both custom personal branches and core archetypes. | [`comparisonEngine.ts`](../src/components/observatory/comparisonEngine.ts), [`TimelineComparisonModal.tsx`](../src/components/observatory/TimelineComparisonModal.tsx) |
| **FR-07** | **P1** | Observer Auth Portal must support Email/Password, Magic Link OTP, and GitHub/Google OAuth via Supabase while degrading gracefully to local-only mode if Supabase keys are absent. | [`ObserverIdentityModal.tsx`](../src/components/observatory/ObserverIdentityModal.tsx), [`supabaseClient.ts`](../src/lib/supabaseClient.ts) |
| **FR-08** | **P1** | Cloud sync must resolve local-vs-cloud state cleanly on `onAuthStateChange` and allow manual `FORCE CLOUD SYNC NOW` + `.json` bundle portability. | [`CosmicObservatory.tsx`](../src/components/observatory/CosmicObservatory.tsx), [`multiverseStore.ts`](../src/lib/multiverseStore.ts) |

---

## 5. Technical Constraints & Data Contracts

### 5.1 Core TypeScript Schemas (`src/lib/multiverse/types.ts` & `realityData.ts`)

```ts
export type PhysicsMode =
  | "bifurcation_horizon"
  | "astral_astrolabe"
  | "inverted_entropy"
  | "dyson_harmonic"
  | "obsidian_glass_sea"
  | "procedural_hybrid";

export interface RealityLaws {
  entropyRate: number;      // 0.0 - 2.0
  gravityPolarity: number;  // -1.0 (repulsive) to 1.0 (attractive)
  coherenceFactor: number;  // 0.1 - 2.0
  temporalDrift: number;    // 0.0 - 2.0
}

export interface RealitySimulationConfig {
  nodeId: string;
  physicsMode: PhysicsMode;
  laws: RealityLaws;
  epochs: SimulationEpoch[];
  anomalies: SpatialAnomaly[];
  visualSeed: number;
  narrativeHeader: string;
  crossroads?: DecisionCrossroad[];
  personalTimeline?: PersonalTimelineBranch;
}
```

Each node plotted in the Cosmic Observatory conforms to `RealityNode` (`src/components/observatory/realityData.ts`), pairing orbital coordinates (`x: 0..1000`, `y: 0..620`), palette tokens (`coreColor`, `secondaryColor`, `auraColor`, `spectrum: [number, number, number]`), telemetry strings, optional `isCustom`/`parentNodeId`, and an optional nested `PersonalTimelineBranch` (`baselineContext`, `choicePrompt`, `branchTitle`, `branchSummary`, 4 `LifeEpoch[]` snapshots, and 3 `DecisionCrossroad[]` triggers).

### 5.2 Non-Functional Requirements (NFR Targets)

| Category | Target / Constraint | Enforcement Mechanism |
| :--- | :--- | :--- |
| **Frame Rate & Smoothness** | `60fps` fluid shader & canvas rendering; zero abrupt shader snaps. | Frame-delta clamped (`Math.min(delta, 0.1)`), exponential/power lerp factors (`Math.pow(0.97, delta * 60)` for `u_spectralTint`/`u_activity`; `Math.exp(-delta * 2.4)` for `u_observatory`; `Math.exp(-delta * 5.5)` for `u_warp`), tab-visibility pause (`visibilitychange`), DPR capped at `2.0`. |
| **API Latency Bound** | Strictly `< 6000ms` worst-case AI route latency. | `LLM_TIMEOUT_MS = 6000` `AbortController` in both `/api/multiverse/branch` and `/api/enigma/converse`, caught cleanly and routed to instant deterministic synthesizers. |
| **SSR / Hydration Safety** | Zero React hydration mismatches across initial load. | Deterministic time/IDs seeded client-side after mount; `localStorage` and `AudioContext` accessed strictly inside effects or event handlers (`typeof window !== "undefined"`). |
| **Zero External Media Assets** | `0 KB` external `.mp3`, `.wav`, texture, or shader asset fetches. | 100% procedural WebGL2 GLSL + Canvas 2D geometry + Web Audio API synthesis. |
| **Cloud Security** | Strict per-user tenant isolation in Postgres. | Row Level Security (`auth.uid() = user_id`) enabled on `public.observer_multiverses` for `SELECT`, `INSERT`, and `UPDATE`. |

---

## 6. Future Roadmap

1. **Multi-Depth Branching DAG Explorer:** Upgrade the `1000 × 620` constellation graph to pan/zoom across unlimited nested generations of `DecisionCrossroad` children with automatic force-directed spacing.
2. **Streaming Token & Shader Modulation:** Replace single-shot REST AI responses with Server-Sent Events (SSE) so `u_activity` and Enigma transmission audio ticks synchronize syllable-by-syllable with streaming parallel-self responses.
3. **Shareable Read-Only Breach Snapshots:** Generate signed Supabase public share links allowing observers to send a specific branched life simulation and Comparison Matrix card to friends without exposing private baseline logs.
4. **Interactive Spatial Audio & Mobile Parallax:** Map node cursor/gyroscope proximity to Web Audio stereo `StereoPannerNode` placement and subtle tilt-driven constellation parallax on mobile viewports.

