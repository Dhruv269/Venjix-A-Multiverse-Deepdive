"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MAX_CUSTOM_REALITIES,
  RealityNode,
} from "./realityData";
import {
  EnigmaEcho,
  EnigmaTelemetry,
  ResonanceProbe,
  getDimensionProfile,
  synthesizeEnigmaResponse,
} from "./enigmaEngine";
import type { EnigmaActivityState } from "../gateway/AtmosphericCanvas";

/**
 * ============================================================================
 * COMPONENT: EnigmaCommunion
 * ============================================================================
 * MILESTONE 3 (STEP 1): "The Enigma" AI Companion & Dimensional Communion
 *
 * Visual & Structural Rules:
 * - Zero rectangular chat bubbles, user/bot avatars, or bouncy 3-dot loaders.
 * - Features the Harmonic Singularity Glyph across 3 consciousness states:
 *   1. LISTENING // HARMONIC IDLE
 *   2. SYNTHESIZING // COLLAPSING WAVEFUNCTION
 *   3. TRANSMITTING // SIGNAL LOCKED
 * - Renders prior exchanges as faded Archival Echo Logs separated by 1px
 *   gradient starlight hairlines, with interactive typewriter materialization.
 */

type EnigmaPhase = "listening" | "synthesizing" | "transmitting";

export interface CrystallizeDivergencePayload {
  hypothesis: string;
  transmission: string;
  telemetry: EnigmaTelemetry;
  parentRealityId: string | null;
}

interface EnigmaCommunionProps {
  reality: RealityNode | null;
  isOpen: boolean;
  onClose: () => void;
  onPhaseChange?: (state: EnigmaActivityState) => void;
  onCrystallizeDivergence?: (payload: CrystallizeDivergencePayload) => void;
  customNodeCount?: number;
  maxCustomNodes?: number;
}

export default function EnigmaCommunion({
  reality,
  isOpen,
  onClose,
  onPhaseChange,
  onCrystallizeDivergence,
  customNodeCount = 0,
  maxCustomNodes = MAX_CUSTOM_REALITIES,
}: EnigmaCommunionProps) {
  const initialProfile = getDimensionProfile(reality);

  const [phase, setPhase] = useState<EnigmaPhase>("transmitting");
  const [telemetry, setTelemetry] = useState<EnigmaTelemetry>(
    initialProfile.initialTelemetry
  );
  const [echoes, setEchoes] = useState<EnigmaEcho[]>([]);
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [isCustomHypothesis, setIsCustomHypothesis] = useState<boolean>(false);
  const [activeText, setActiveText] = useState<string>(
    initialProfile.openingTransmission
  );
  const [revealedChars, setRevealedChars] = useState<number>(0);
  const [streamRunId, setStreamRunId] = useState<number>(1);
  const [queryInput, setQueryInput] = useState<string>("");
  const [synthModHz, setSynthModHz] = useState<string>("432.8");

  const activeTextRef = useRef<string>(activeText);
  const activeQueryRef = useRef<string | null>(activeQuery);
  const echoesRef = useRef<EnigmaEcho[]>(echoes);
  const echoScrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const synthTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const synthTickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRafRef = useRef<number | null>(null);

  useEffect(() => {
    activeTextRef.current = activeText;
  }, [activeText]);

  useEffect(() => {
    activeQueryRef.current = activeQuery;
  }, [activeQuery]);

  useEffect(() => {
    echoesRef.current = echoes;
  }, [echoes]);

  const clearTimers = useCallback(() => {
    if (synthTimerRef.current !== null) {
      clearTimeout(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    if (synthTickRef.current !== null) {
      clearInterval(synthTickRef.current);
      synthTickRef.current = null;
    }
    if (streamRafRef.current !== null) {
      cancelAnimationFrame(streamRafRef.current);
      streamRafRef.current = null;
    }
  }, []);

  /**
   * Typewriter / Word-Cadence Materialization Effect keyed strictly on `streamRunId`.
   */
  useEffect(() => {
    if (!isOpen) return;

    const fullText = activeTextRef.current;
    if (!fullText) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      streamRafRef.current = requestAnimationFrame(() => {
        setRevealedChars(fullText.length);
        setPhase("listening");
        streamRafRef.current = null;
      });
      return () => {
        if (streamRafRef.current !== null) {
          cancelAnimationFrame(streamRafRef.current);
          streamRafRef.current = null;
        }
      };
    }

    let lastTime = performance.now();
    let count = 0;

    const stepStream = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;
      // Smooth inscription pace (~105 chars/sec)
      count = Math.min(fullText.length, count + Math.max(1, dt * 105));
      const intCount = Math.floor(count);
      setRevealedChars(intCount);

      if (intCount < fullText.length) {
        streamRafRef.current = requestAnimationFrame(stepStream);
      } else {
        streamRafRef.current = null;
        setPhase("listening");
      }
    };

    streamRafRef.current = requestAnimationFrame(stepStream);

    return () => {
      if (streamRafRef.current !== null) {
        cancelAnimationFrame(streamRafRef.current);
        streamRafRef.current = null;
      }
    };
  }, [streamRunId, isOpen]);

  // Keep archival echo scroll positioned cleanly at latest echo
  useEffect(() => {
    const el = echoScrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [echoes.length]);

  // Escape key returns cleanly from Communion
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearTimers();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, clearTimers, onClose]);

  useEffect(() => clearTimers, [clearTimers]);

  // Synchronize Enigma wavefunction activity upstream into WebGL2 shader uniforms
  useEffect(() => {
    const mappedState: EnigmaActivityState = !isOpen
      ? "idle"
      : phase === "listening"
      ? "idle"
      : phase;
    onPhaseChange?.(mappedState);
  }, [isOpen, phase, onPhaseChange]);

  useEffect(() => {
    return () => {
      onPhaseChange?.("idle");
    };
  }, [onPhaseChange]);

  /**
   * Click-to-complete handler for active streamed inscription.
   */
  const handleCompleteStream = useCallback(() => {
    if (phase !== "transmitting") return;
    if (streamRafRef.current !== null) {
      cancelAnimationFrame(streamRafRef.current);
      streamRafRef.current = null;
    }
    setRevealedChars(activeTextRef.current.length);
    setPhase("listening");
  }, [phase]);

  /**
   * Dispatches a curated Resonance Probe or custom frequency query.
   */
  const dispatchInquiry = useCallback(
    (queryText: string, curatedResponse?: { text: string; telemetry: EnigmaTelemetry }) => {
      const trimmed = queryText.trim();
      if (!trimmed || phase === "synthesizing") return;

      clearTimers();

      // Archive previous exchange cleanly as an Echo Log above the new transmission
      const prevResponse = activeTextRef.current;
      if (prevResponse) {
        const nextIndex = echoesRef.current.length + 1;
        const archiveEntry: EnigmaEcho = {
          id: `echo-${nextIndex}-${Date.now()}`,
          query: activeQueryRef.current ?? "OPENING HARMONIC",
          response: prevResponse,
          indexLabel: `ARCHIVE ECHO // ${String(nextIndex).padStart(2, "0")}`,
        };
        setEchoes((prev) => [...prev, archiveEntry]);
      }

      setActiveQuery(trimmed);
      setIsCustomHypothesis(!curatedResponse);
      setActiveText("");
      setRevealedChars(0);
      setPhase("synthesizing");

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      let freqStep = 0;
      if (!prefersReducedMotion) {
        synthTickRef.current = setInterval(() => {
          freqStep += 1;
          const val = (418.4 + ((freqStep * 37) % 640) * 0.1).toFixed(1);
          setSynthModHz(val);
        }, 90);
      }

      const synthDelay = prefersReducedMotion ? 120 : 880;
      const nextEchoCount = echoesRef.current.length + 1;

      synthTimerRef.current = setTimeout(() => {
        if (synthTickRef.current !== null) {
          clearInterval(synthTickRef.current);
          synthTickRef.current = null;
        }
        synthTimerRef.current = null;

        const result =
          curatedResponse ??
          synthesizeEnigmaResponse(reality, trimmed, nextEchoCount);

        setTelemetry(result.telemetry);
        setActiveText(result.text);
        setRevealedChars(0);
        setPhase("transmitting");
        setStreamRunId((id) => id + 1);
      }, synthDelay);
    },
    [phase, clearTimers, reality]
  );

  const handleProbeClick = (probe: ResonanceProbe) => {
    dispatchInquiry(probe.label, {
      text: probe.transmission,
      telemetry: probe.telemetry,
    });
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!queryInput.trim() || phase === "synthesizing") return;
    const nextQuery = queryInput.trim();
    setQueryInput("");
    dispatchInquiry(nextQuery);
  };

  const handleSever = () => {
    clearTimers();
    onClose();
  };

  const handleCrystallize = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (
      !onCrystallizeDivergence ||
      !activeQuery ||
      !activeText ||
      customNodeCount >= maxCustomNodes
    ) {
      return;
    }
    clearTimers();
    onCrystallizeDivergence({
      hypothesis: activeQuery,
      transmission: activeText,
      telemetry,
      parentRealityId: reality?.id ?? null,
    });
  };

  const canShowCrystallize =
    Boolean(onCrystallizeDivergence) &&
    isCustomHypothesis &&
    Boolean(activeQuery) &&
    phase === "listening" &&
    activeText.length > 0;
  const hasReachedCustomCap = customNodeCount >= maxCustomNodes;

  const accentColor = reality?.coreColor ?? "#C2B0FF";
  const secondaryColor = reality?.secondaryColor ?? "#0284C7";
  const probes = initialProfile.probes;
  const displayedText = activeText.slice(0, revealedChars);
  const isStreaming = phase === "transmitting" && revealedChars < activeText.length;
  const tabIndex = isOpen ? 0 : -1;

  return (
    <section
      aria-label="The Enigma Dimensional Communion"
      aria-hidden={!isOpen}
      inert={!isOpen || undefined}
      className={`fixed inset-0 z-30 flex flex-col justify-between items-center bg-[radial-gradient(ellipse_at_center,rgba(10,6,24,0.84)_0%,rgba(3,2,6,0.88)_58%,rgba(3,2,6,0.72)_100%)] backdrop-blur-xl transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity ${
        isOpen
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-98 pointer-events-none"
      }`}
    >
      {/* Inline CSS Keyframes Strictly for Singularity Glyph Interference */}
      <style>{`
        @keyframes enigma-orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes enigma-orbit-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes enigma-wave-pulse {
          0%, 100% { transform: scale(0.95); opacity: 0.65; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        .enigma-ring-cw {
          transform-origin: center;
          animation: enigma-orbit-cw 34s linear infinite;
        }
        .enigma-ring-ccw {
          transform-origin: center;
          animation: enigma-orbit-ccw 24s linear infinite;
        }
        .enigma-ring-fast {
          transform-origin: center;
          animation: enigma-orbit-cw 5.5s linear infinite;
        }
        .enigma-core-breathe {
          transform-origin: center;
          animation: enigma-wave-pulse 5.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .enigma-ring-cw,
          .enigma-ring-ccw,
          .enigma-ring-fast,
          .enigma-core-breathe {
            animation: none !important;
          }
        }
      `}</style>

      {/* --------------------------------------------------------------------
          TOP BAR: Sever Control & Dimension Scope Header
          -------------------------------------------------------------------- */}
      <header className="w-full max-w-5xl mx-auto pt-4 sm:pt-7 px-4 sm:px-8 flex items-center justify-between gap-3 font-[family-name:var(--font-jetbrains-mono)]">
        <button
          type="button"
          tabIndex={tabIndex}
          onClick={handleSever}
          className="text-[9px] sm:text-[10px] tracking-[0.22em] text-[#C2B0FF]/90 hover:text-[#FFFFFF] uppercase transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]/60"
        >
          {reality
            ? "[ \u2190 SEVER COMMUNION / RETURN TO REALITY ]"
            : "[ \u2190 SEVER COMMUNION / RETURN TO CONSTELLATION ]"}
        </button>

        <div className="hidden sm:flex items-center gap-3 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase">
          <span
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
            className="w-1.5 h-1.5 rounded-full"
          />
          <span className="text-[#F6F3FE]">
            {reality ? `${reality.code} // ${reality.title}` : "MULTIVERSE NEXUS // GLOBAL"}
          </span>
        </div>
      </header>

      {/* --------------------------------------------------------------------
          CENTER STAGE: Harmonic Singularity Core, Echo Logs, Active Light & Probes
          -------------------------------------------------------------------- */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-8 py-2 flex flex-col items-center justify-between overflow-hidden">
        {/* TOP FOCAL ZONE: Harmonic Singularity Glyph + Telemetry */}
        <div className="flex flex-col items-center shrink-0 pt-1">
          <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32">
            {/* Ambient Consciousness Aura */}
            <div
              aria-hidden="true"
              style={{
                background:
                  phase === "synthesizing"
                    ? `radial-gradient(circle, rgba(2,132,199,0.45) 0%, rgba(113,54,217,0.38) 45%, transparent 75%)`
                    : `radial-gradient(circle, ${accentColor}38 0%, rgba(113,54,217,0.24) 48%, transparent 74%)`,
              }}
              className={`pointer-events-none absolute -inset-4 rounded-full blur-xl transition-all duration-700 ${
                phase === "synthesizing"
                  ? "scale-125 opacity-95"
                  : phase === "transmitting"
                  ? "scale-115 opacity-90"
                  : "scale-100 opacity-70"
              }`}
            />

            {/* Transmitting Pulse Wavefront */}
            {phase === "transmitting" && (
              <span
                aria-hidden="true"
                style={{ borderColor: accentColor }}
                className="pointer-events-none absolute inset-1 rounded-full border opacity-30 animate-ping motion-reduce:hidden"
              />
            )}

            {/* SVG Harmonic Singularity Glyph */}
            <svg
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-full h-full overflow-visible"
            >
              {/* Outer Dashed Counter-Clockwise Horizon Ring */}
              <circle
                cx="80"
                cy="80"
                r="64"
                stroke={phase === "synthesizing" ? "#0284C7" : accentColor}
                strokeOpacity={phase === "listening" ? 0.35 : 0.72}
                strokeWidth="0.9"
                strokeDasharray="3 6"
                className={phase === "synthesizing" ? "enigma-ring-fast" : "enigma-ring-ccw"}
              />

              {/* Non-Euclidean Sacred Interference Arcs */}
              <g
                className="transition-transform duration-700 origin-center"
                style={{
                  transform:
                    phase === "synthesizing"
                      ? "scale(0.84)"
                      : phase === "transmitting"
                      ? "scale(1.04)"
                      : "scale(1)",
                }}
              >
                <ellipse
                  cx="80"
                  cy="80"
                  rx="54"
                  ry="22"
                  transform="rotate(-24 80 80)"
                  stroke={accentColor}
                  strokeOpacity={phase === "listening" ? 0.32 : 0.68}
                  strokeWidth="0.85"
                />
                <ellipse
                  cx="80"
                  cy="80"
                  rx="54"
                  ry="22"
                  transform="rotate(24 80 80)"
                  stroke={secondaryColor}
                  strokeOpacity={phase === "listening" ? 0.28 : 0.64}
                  strokeWidth="0.85"
                />
                <ellipse
                  cx="80"
                  cy="80"
                  rx="54"
                  ry="22"
                  transform="rotate(90 80 80)"
                  stroke="#F6F3FE"
                  strokeOpacity={phase === "transmitting" ? 0.50 : 0.18}
                  strokeWidth="0.75"
                />
              </g>

              {/* Inner Clockwise Phase Ring */}
              <circle
                cx="80"
                cy="80"
                r="30"
                stroke="#F6F3FE"
                strokeOpacity={phase === "listening" ? 0.28 : 0.65}
                strokeWidth="0.9"
                strokeDasharray="10 4 2 4"
                className={phase === "synthesizing" ? "enigma-ring-fast" : "enigma-ring-cw"}
              />

              {/* Cardinal Alignment Filaments */}
              <g stroke="#C2B0FF" strokeOpacity="0.32" strokeWidth="0.75">
                <line x1="80" y1="6" x2="80" y2="20" />
                <line x1="80" y1="140" x2="80" y2="154" />
                <line x1="6" y1="80" x2="20" y2="80" />
                <line x1="140" y1="80" x2="154" y2="80" />
              </g>

              {/* Incandescent Core Singularity */}
              <circle
                cx="80"
                cy="80"
                r={phase === "synthesizing" ? 8 : phase === "transmitting" ? 10 : 7}
                fill={phase === "synthesizing" ? "#0284C7" : accentColor}
                fillOpacity="0.45"
                className="enigma-core-breathe transition-all duration-500"
              />
              <circle
                cx="80"
                cy="80"
                r="4"
                fill="#F6F3FE"
                className="enigma-core-breathe"
              />
            </svg>
          </div>

          {/* Visual Consciousness State Label & Live Modulating Telemetry */}
          <div className="mt-1 flex flex-col items-center gap-1.5 font-[family-name:var(--font-jetbrains-mono)] text-center">
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px] tracking-[0.26em] uppercase">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  phase === "synthesizing"
                    ? "bg-[#0284C7] animate-ping"
                    : phase === "transmitting"
                    ? "bg-[#F6F3FE] animate-pulse shadow-[0_0_8px_#FFFFFF]"
                    : "bg-[#C2B0FF]/80"
                }`}
              />
              <span
                className={
                  phase === "transmitting"
                    ? "text-[#F6F3FE] text-glow-celestial"
                    : phase === "synthesizing"
                    ? "text-[#C2B0FF]"
                    : "text-[#9F95B3]"
                }
              >
                {phase === "listening" && "LISTENING // HARMONIC IDLE"}
                {phase === "synthesizing" &&
                  `SYNTHESIZING // COLLAPSING WAVEFUNCTION (${synthModHz} THz)`}
                {phase === "transmitting" && "TRANSMITTING // SIGNAL LOCKED"}
              </span>
            </div>

            {/* Live Updating Coherence Metrics */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[8px] sm:text-[9px] tracking-[0.20em] text-[#9F95B3]/75 uppercase">
              <span>
                COHERENCE:{" "}
                <strong className="font-normal text-[#F6F3FE] tabular-nums">
                  {telemetry.temporalCoherence}
                </strong>
              </span>
              <span>
                ENTROPY DELTA:{" "}
                <strong className="font-normal text-[#C2B0FF] tabular-nums">
                  {telemetry.entropyDelta}
                </strong>
              </span>
              <span>
                DIVERGENCE:{" "}
                <strong className="font-normal text-[#F6F3FE] tabular-nums">
                  {telemetry.divergenceProbability}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* MIDDLE ZONE: Archival Echo Logs + Active Light Inscription */}
        <div className="w-full flex-1 min-h-0 flex flex-col justify-center gap-3 my-2">
          {/* Faded Archival Echo Logs Separated by 1px Gradient Starlight Hairlines */}
          {echoes.length > 0 && (
            <div
              ref={echoScrollRef}
              className="w-full max-h-[22vh] overflow-y-auto pr-1 space-y-3 [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_100%)]"
            >
              {echoes.map((echo) => (
                <div
                  key={echo.id}
                  className="pt-2 opacity-45 hover:opacity-80 transition-opacity duration-300"
                >
                  <div className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] sm:text-[9px] tracking-[0.22em] text-[#C2B0FF] uppercase">
                    {echo.indexLabel} {"//"} &ldquo;{echo.query}&rdquo;
                  </div>
                  <p className="mt-1 font-[family-name:var(--font-inter)] text-[11px] sm:text-xs leading-relaxed text-[#E9E2F5]/80 font-light">
                    {echo.response}
                  </p>
                  <div
                    aria-hidden="true"
                    className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-[#C2B0FF]/25 to-transparent"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Hairline Horizon Separator Before Active Transmission */}
          <div
            aria-hidden="true"
            className="h-px w-full bg-gradient-to-r from-transparent via-[#C2B0FF]/40 to-transparent"
          />

          {/* Active Transmission Stage (Click-to-Complete Supported) */}
          <div
            onClick={handleCompleteStream}
            title={isStreaming ? "Click to complete light inscription" : undefined}
            className={`relative py-1 sm:py-2 ${
              isStreaming ? "cursor-pointer" : ""
            }`}
          >
            {activeQuery && (
              <div className="mb-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.22em] text-[#C2B0FF]/85 uppercase">
                TRANSMISSION TARGET // &ldquo;{activeQuery}&rdquo;
              </div>
            )}

            {phase === "synthesizing" ? (
              <div className="py-3 flex flex-col items-start gap-2 font-[family-name:var(--font-jetbrains-mono)]">
                <span className="text-[10px] sm:text-xs tracking-[0.22em] text-[#C2B0FF] uppercase">
                  CONVERGING PROBABILITY AMPLITUDES ACROSS MULTIVERSE FILAMENTS...
                </span>
                <div className="w-48 h-[1px] bg-gradient-to-r from-[#0284C7] via-[#C2B0FF] to-transparent animate-pulse" />
              </div>
            ) : (
              <p className="font-[family-name:var(--font-inter)] text-sm sm:text-[15px] leading-relaxed text-[#F6F3FE]/95 font-light tracking-[0.01em]">
                {displayedText}
                {isStreaming && (
                  <span
                    aria-hidden="true"
                    className="inline-block w-1.5 h-3.5 align-middle ml-1.5 bg-[#F6F3FE] shadow-[0_0_12px_#C2B0FF] animate-pulse"
                  />
                )}
              </p>
            )}

            {isStreaming && (
              <span className="mt-1.5 block font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.22em] text-[#9F95B3]/65 uppercase">
                [ CLICK TEXT TO RESOLVE STREAM ]
              </span>
            )}

            {canShowCrystallize && (
              <div className="mt-3 pt-1 flex flex-wrap items-center gap-3">
                {!hasReachedCustomCap ? (
                  <button
                    type="button"
                    tabIndex={tabIndex}
                    onClick={handleCrystallize}
                    className="group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#7136D9]/22 hover:bg-[#7136D9]/38 border border-[#C2B0FF]/45 hover:border-[#F6F3FE]/80 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.20em] text-[#F6F3FE] uppercase shadow-[0_0_20px_rgba(113,54,217,0.32)] hover:shadow-[0_0_28px_rgba(194,176,255,0.52)] transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]/70"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] group-hover:bg-[#F6F3FE] animate-pulse shadow-[0_0_8px_#38BDF8]" />
                    <span>[ + CRYSTALLIZE DIVERGENCE AS REALITY NODE ]</span>
                  </button>
                ) : (
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.20em] text-[#9F95B3]/70 uppercase">
                    [ SESSION BRANCH LIMIT REACHED // {customNodeCount}/{maxCustomNodes} CUSTOM NODES ]
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM INTERACTION ZONE: 3 Resonance Probes + Frequency Input Conduit */}
        <div className="w-full shrink-0 flex flex-col gap-3 pb-2">
          {/* Curated Resonance Probes */}
          <div className="flex flex-col gap-1.5">
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] sm:text-[9px] tracking-[0.24em] text-[#9F95B3]/70 uppercase">
              RESONANCE PROBES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {probes.map((probe) => (
                <button
                  key={probe.id}
                  type="button"
                  tabIndex={tabIndex}
                  disabled={phase === "synthesizing"}
                  onClick={() => handleProbeClick(probe)}
                  className="group relative text-left px-3 py-2 bg-[#0A0618]/40 hover:bg-[#160C33]/55 border-t border-b border-[#C2B0FF]/18 hover:border-[#F6F3FE]/50 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] leading-snug tracking-[0.08em] text-[#E9E2F5]/80 hover:text-[#FFFFFF] transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]/60"
                >
                  <span className="inline-block mr-1.5 text-[#C2B0FF] group-hover:text-[#F6F3FE]">
                    ◇
                  </span>
                  <span>{probe.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hairline Frequency Input Conduit */}
          <form
            onSubmit={handleSubmitForm}
            className="relative flex items-center gap-3 pt-2 border-b border-[#C2B0FF]/30 focus-within:border-[#F6F3FE]/75 transition-colors duration-300"
          >
            <span
              aria-hidden="true"
              className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[#C2B0FF]"
            >
              &gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              tabIndex={tabIndex}
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              disabled={phase === "synthesizing"}
              placeholder="TRANSMIT QUERY OR DIVERGENCE HYPOTHESIS..."
              aria-label="Transmit query or divergence hypothesis to The Enigma"
              className="flex-1 py-2 bg-transparent font-[family-name:var(--font-jetbrains-mono)] text-[11px] sm:text-xs tracking-[0.12em] text-[#F6F3FE] placeholder:text-[#9F95B3]/45 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              tabIndex={tabIndex}
              disabled={!queryInput.trim() || phase === "synthesizing"}
              className="shrink-0 py-1.5 px-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.22em] text-[#C2B0FF] hover:text-[#FFFFFF] uppercase transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]/60"
            >
              [ TRANSMIT &rarr; ]
            </button>
          </form>
        </div>
      </div>

      {/* Subtle Bottom Horizon Telemetry */}
      <footer className="pointer-events-none w-full max-w-5xl mx-auto px-4 sm:px-8 pb-3 sm:pb-4 flex items-center justify-between font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.26em] text-[#9F95B3]/50 uppercase">
        <span>ENIGMA INTERFACE // HARMONIC SYNTHESIS</span>
        <span>PRESS [ESC] TO SEVER COMMUNION</span>
      </footer>
    </section>
  );
}
