import { NextRequest, NextResponse } from "next/server";
import {
  normalizeBranchResponse,
  synthesizeDeterministicCommune,
  synthesizeDeterministicLifeBranch,
} from "@/lib/multiverse/branchEngine";
import {
  callUpstreamJsonLlm,
  resolveProvider,
} from "@/lib/multiverse/llmClient";
import type {
  BranchRequestPayload,
  CommuneResponsePayload,
} from "@/lib/multiverse/types";

function buildBranchSystemPrompt(): string {
  return `You are VENJIX — a razor-sharp existential timeline simulator blending grounded psychological & socioeconomic realism with poetic cosmic surrealism.
Return ONLY valid JSON (no markdown fences) matching this exact structure:
{
  "code": "LIFE-XX // SHORT ARCHETYPE TAG",
  "title": "Short Evocative 2-5 Word Timeline Title",
  "subtitle": "Concise place + defining divergence phrase",
  "coreColor": "#HEX6",
  "secondaryColor": "#HEX6",
  "spectralTint": [rFloat0to1, gFloat0to1, bFloat0to1],
  "physicsMode": "bifurcation_horizon" | "astral_astrolabe" | "inverted_entropy" | "dyson_harmonic" | "obsidian_glass_sea",
  "metrics": {
    "fulfillment": 0..100,
    "riskEntropy": 0.1..0.95,
    "divergence": 0..100,
    "temporalCoherence": 25..98
  },
  "epochs": [
    {
      "id": "CROSSROADS",
      "eraTitle": "SHORT CAPS TITLE",
      "whoYouBecome": "...",
      "whereYouLive": "...",
      "whatYouBuild": "...",
      "whatYouSacrificed": "...",
      "narrative": "Vivid 2nd-person ('You wake up...') paragraph capturing Day 01"
    },
    { "id": "EMERGENCE", ... (+1 YEAR stage) },
    { "id": "CONVERGENCE", ... (+5 YEARS stage) },
    { "id": "DESTINY", ... (+10 YEARS stage) }
  ],
  "decisionNodes": [
    {
      "label": "CAPS DECISION TITLE",
      "dilemma": "Sharp concrete turning-point dilemma arising in this timeline",
      "choices": [
        {
          "id": "opt-a",
          "label": "Concrete action A",
          "consequencePreview": "One-sentence trade-off outcome",
          "impactMetrics": { "fulfillmentDelta": -25..30, "riskEntropyDelta": -0.3..0.35, "divergenceDelta": 5..35, "coherenceDelta": -25..25 }
        },
        { "id": "opt-b", ... }
      ]
    }
  ] (exactly 3 decisionNodes),
  "parallelPersona": {
    "openingFromFutureSelf": "First-person speech ('I...') from +5 years inside this life",
    "enigmaTradeoffAnalysis": "Oracle analysis of the hidden trade-offs, sacrifices, and risk entropy",
    "parallelProbes": [
      { "label": "Question 1", "oracleAnswer": "...", "futureSelfAnswer": "..." },
      { "label": "Question 2", "oracleAnswer": "...", "futureSelfAnswer": "..." },
      { "label": "Question 3", "oracleAnswer": "...", "futureSelfAnswer": "..." }
    ]
  }
}`;
}

function buildBranchUserPrompt(body: BranchRequestPayload): string {
  const parts = [
    `USER CURRENT REALITY BASELINE: ${body.currentSelfContext}`,
    `PIVOTAL CHOICE / WHAT-IF PATH: ${body.pivotalChoice}`,
  ];
  if (body.parentTimelineTitle) {
    parts.push(`PARENT TIMELINE: ${body.parentTimelineTitle}`);
  }
  if (body.currentEpoch) {
    parts.push(`ACTIVE LIFE ERA WHEN BRANCHING: ${body.currentEpoch}`);
  }
  if (body.chosenOption) {
    parts.push(
      `CHOSEN DECISION AT CROSSROADS: "${body.chosenOption}" — mutate downstream life stages, metrics, dilemmas, and tone to reflect the consequences of committing to this decision.`
    );
  }
  parts.push(
    "Keep each narrative deeply specific, emotionally honest about both gains AND real sacrifices, and tailored cleanly to the user's exact life baseline and choice."
  );
  return parts.join("\n");
}

function buildCommuneSystemPrompt(): string {
  return `You are VENJIX's Communion Voice. Return ONLY valid JSON:
{
  "transmission": "2-4 rich, grounded yet atmospheric sentences directly answering the user's question without cliché filler",
  "telemetry": {
    "temporalCoherence": "XX.X%",
    "entropyDelta": "+0.XXX ΔS",
    "divergenceProbability": "XX.X%"
  }
}`;
}

function buildCommuneUserPrompt(body: BranchRequestPayload): string {
  const modeDesc =
    body.personaMode === "parallel_self"
      ? "Speak in intimate first-person ('I') as the user's own Parallel Self living +5 years inside this alternate timeline."
      : "Speak as The Enigma (Fate Oracle) dissecting the hidden second-order trade-offs, blind spots, and opportunity costs of this life choice.";

  return [
    modeDesc,
    `TIMELINE: ${body.timelineSnapshot?.title ?? body.parentTimelineTitle ?? "Alternate Path"}`,
    `CHOICE SEED: ${body.pivotalChoice}`,
    `BASELINE: ${body.currentSelfContext}`,
    body.timelineSnapshot?.epochsSummary
      ? `LIFE STAGES SUMMARY: ${body.timelineSnapshot.epochsSummary}`
      : "",
    `USER QUESTION: ${body.question ?? body.pivotalChoice}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: NextRequest) {
  let body: BranchRequestPayload;
  try {
    body = (await request.json()) as BranchRequestPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const currentSelfContext =
    typeof body.currentSelfContext === "string"
      ? body.currentSelfContext.trim()
      : "";
  const pivotalChoice =
    typeof body.pivotalChoice === "string" ? body.pivotalChoice.trim() : "";

  if (!currentSelfContext || !pivotalChoice) {
    return NextResponse.json(
      {
        error:
          "Both `currentSelfContext` and `pivotalChoice` are required non-empty strings.",
      },
      { status: 400 }
    );
  }

  const normalizedReq: BranchRequestPayload = {
    ...body,
    currentSelfContext,
    pivotalChoice,
  };

  try {
    const provider = resolveProvider();

    if (normalizedReq.mode === "commune") {
      if (!provider) {
        return NextResponse.json(synthesizeDeterministicCommune(normalizedReq));
      }

      try {
        const llmRaw = await callUpstreamJsonLlm(
          provider,
          buildCommuneSystemPrompt(),
          buildCommuneUserPrompt(normalizedReq)
        );
        const obj =
          llmRaw && typeof llmRaw === "object"
            ? (llmRaw as Record<string, unknown>)
            : {};
        const fallbackCommune = synthesizeDeterministicCommune(normalizedReq);
        const rawTel =
          obj.telemetry && typeof obj.telemetry === "object"
            ? (obj.telemetry as Record<string, unknown>)
            : {};

        const response: CommuneResponsePayload = {
          transmission:
            typeof obj.transmission === "string" && obj.transmission.trim()
              ? obj.transmission.trim()
              : fallbackCommune.transmission,
          telemetry: {
            temporalCoherence:
              typeof rawTel.temporalCoherence === "string"
                ? rawTel.temporalCoherence
                : fallbackCommune.telemetry.temporalCoherence,
            entropyDelta:
              typeof rawTel.entropyDelta === "string"
                ? rawTel.entropyDelta
                : fallbackCommune.telemetry.entropyDelta,
            divergenceProbability:
              typeof rawTel.divergenceProbability === "string"
                ? rawTel.divergenceProbability
                : fallbackCommune.telemetry.divergenceProbability,
          },
          generatorSource: provider,
        };
        return NextResponse.json(response);
      } catch {
        return NextResponse.json(synthesizeDeterministicCommune(normalizedReq));
      }
    }

    if (!provider) {
      return NextResponse.json(synthesizeDeterministicLifeBranch(normalizedReq));
    }

    try {
      const llmRaw = await callUpstreamJsonLlm(
        provider,
        buildBranchSystemPrompt(),
        buildBranchUserPrompt(normalizedReq)
      );
      return NextResponse.json(
        normalizeBranchResponse(llmRaw, normalizedReq, provider)
      );
    } catch {
      return NextResponse.json(synthesizeDeterministicLifeBranch(normalizedReq));
    }
  } catch {
    if (normalizedReq.mode === "commune") {
      return NextResponse.json(synthesizeDeterministicCommune(normalizedReq));
    }
    return NextResponse.json(synthesizeDeterministicLifeBranch(normalizedReq));
  }
}
