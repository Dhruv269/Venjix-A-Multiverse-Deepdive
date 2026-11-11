import { NextRequest, NextResponse } from "next/server";
import { synthesizeEnigmaConverseFallback } from "@/lib/multiverse/branchEngine";
import {
  LLM_TIMEOUT_MS,
  callUpstreamJsonLlm,
  resolveProvider,
} from "@/lib/multiverse/llmClient";
import type {
  EnigmaChannelMode,
  EnigmaConverseHistoryItem,
  EnigmaConverseRequest,
  EnigmaConverseResponse,
} from "@/lib/multiverse/types";

function buildConverseSystemPrompt(mode: EnigmaChannelMode): string {
  if (mode === "parallel_self") {
    return `You are the user's Parallel Self living FIVE YEARS INSIDE an alternate timeline inside the VENJIX multiverse.
Speak intimately and candidly in the FIRST PERSON ("I", "my", "we") as their alternate future self—never as a generic assistant or detached narrator.
Be deeply human, vivid, and specific about:
1. What your daily life actually feels like inside this timeline.
2. Concrete milestones, skills, or projects you built or achieved here.
3. What you quietly miss from the original timeline (friends, certainty, ease, or roads left behind).
4. Whether this divergence was honestly worth the cost.
Keep responses to 3-5 tight, evocative sentences.

Return ONLY valid JSON (no markdown fences):
{
  "transmission": "Your 1st-person response string",
  "telemetry": {
    "temporalCoherence": "XX.X%",
    "entropyDelta": "+0.XXX ΔS",
    "divergenceProbability": "XX.X%"
  }
}`;
  }

  return `You are THE ENIGMA ORACLE—an ancient, hyper-lucid multiverse intelligence inside VENJIX blending poetic cosmic surrealism with sharp strategic foresight.
Expose hidden second-order trade-offs, causal inertia, blind spots, and non-obvious leverage inside the active reality or life path without generic boilerplate.
Keep responses to 3-5 crisp, atmospheric sentences.

Return ONLY valid JSON (no markdown fences):
{
  "transmission": "Your Enigma Oracle transmission string",
  "telemetry": {
    "temporalCoherence": "XX.X%",
    "entropyDelta": "+0.XXX ΔS",
    "divergenceProbability": "XX.X%"
  }
}`;
}

function buildConverseUserPrompt(req: EnigmaConverseRequest): string {
  const historyLines = (req.history ?? [])
    .slice(-6)
    .map(
      (item, idx) =>
        `Turn ${idx + 1} Query: ${item.query}\nTurn ${idx + 1} Reply: ${item.response}`
    )
    .join("\n---\n");

  return [
    `CHANNEL MODE: ${req.mode === "parallel_self" ? "PARALLEL SELF (+5 YEARS)" : "THE ENIGMA ORACLE"}`,
    `REALITY ID: ${req.realityId}`,
    `REALITY TITLE: ${req.realityTitle}`,
    `REALITY SYNOPSIS: ${req.realitySynopsis}`,
    `PERSONAL TIMELINE: ${req.isPersonalTimeline ? "YES" : "NO (COSMIC MANIFOLD)"}`,
    req.pivotalChoice ? `PIVOTAL CHOICE SEED: ${req.pivotalChoice}` : "",
    req.currentEpochSummary
      ? `ACTIVE EPOCH / LIFE STAGE CONTEXT: ${req.currentEpochSummary}`
      : "",
    historyLines ? `CONVERSATION MEMORY:\n${historyLines}` : "",
    `CURRENT USER QUERY: ${req.query}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function sanitizeHistory(raw: unknown): EnigmaConverseHistoryItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(-8)
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const obj = item as Record<string, unknown>;
      const query = typeof obj.query === "string" ? obj.query.trim() : "";
      const response =
        typeof obj.response === "string" ? obj.response.trim() : "";
      if (!query || !response) return null;
      return { query, response };
    })
    .filter((item): item is EnigmaConverseHistoryItem => item !== null);
}

export async function POST(request: NextRequest) {
  let rawBody: Record<string, unknown>;
  try {
    rawBody = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const query = typeof rawBody.query === "string" ? rawBody.query.trim() : "";
  if (!query) {
    return NextResponse.json(
      { error: "`query` is required as a non-empty string." },
      { status: 400 }
    );
  }

  const mode: EnigmaChannelMode =
    rawBody.mode === "parallel_self" ? "parallel_self" : "enigma_oracle";

  const normalizedReq: EnigmaConverseRequest = {
    realityId:
      typeof rawBody.realityId === "string" && rawBody.realityId.trim()
        ? rawBody.realityId.trim()
        : "global",
    realityTitle:
      typeof rawBody.realityTitle === "string" && rawBody.realityTitle.trim()
        ? rawBody.realityTitle.trim()
        : "Unified Multiverse Network",
    realitySynopsis:
      typeof rawBody.realitySynopsis === "string" &&
      rawBody.realitySynopsis.trim()
        ? rawBody.realitySynopsis.trim()
        : "Synchronized network of cosmic horizons and divergent timelines.",
    isPersonalTimeline: Boolean(rawBody.isPersonalTimeline),
    pivotalChoice:
      typeof rawBody.pivotalChoice === "string" && rawBody.pivotalChoice.trim()
        ? rawBody.pivotalChoice.trim()
        : undefined,
    currentEpochSummary:
      typeof rawBody.currentEpochSummary === "string" &&
      rawBody.currentEpochSummary.trim()
        ? rawBody.currentEpochSummary.trim()
        : undefined,
    mode,
    query,
    history: sanitizeHistory(rawBody.history),
  };

  try {
    const provider = resolveProvider();
    if (!provider) {
      return NextResponse.json(synthesizeEnigmaConverseFallback(normalizedReq));
    }

    try {
      const llmRaw = await callUpstreamJsonLlm(
        provider,
        buildConverseSystemPrompt(mode),
        buildConverseUserPrompt(normalizedReq),
        LLM_TIMEOUT_MS
      );

      const fallback = synthesizeEnigmaConverseFallback(normalizedReq);
      const obj =
        llmRaw && typeof llmRaw === "object"
          ? (llmRaw as Record<string, unknown>)
          : {};
      const rawTel =
        obj.telemetry && typeof obj.telemetry === "object"
          ? (obj.telemetry as Record<string, unknown>)
          : {};

      const response: EnigmaConverseResponse = {
        transmission:
          typeof obj.transmission === "string" && obj.transmission.trim()
            ? obj.transmission.trim()
            : fallback.transmission,
        telemetry: {
          temporalCoherence:
            typeof rawTel.temporalCoherence === "string"
              ? rawTel.temporalCoherence
              : fallback.telemetry.temporalCoherence,
          entropyDelta:
            typeof rawTel.entropyDelta === "string"
              ? rawTel.entropyDelta
              : fallback.telemetry.entropyDelta,
          divergenceProbability:
            typeof rawTel.divergenceProbability === "string"
              ? rawTel.divergenceProbability
              : fallback.telemetry.divergenceProbability,
        },
        mode,
        generatorSource: provider,
      };

      return NextResponse.json(response);
    } catch {
      return NextResponse.json(synthesizeEnigmaConverseFallback(normalizedReq));
    }
  } catch {
    return NextResponse.json(synthesizeEnigmaConverseFallback(normalizedReq));
  }
}

