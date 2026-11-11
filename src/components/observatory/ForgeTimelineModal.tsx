"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { synthesizeDeterministicLifeBranch } from "@/lib/multiverse/branchEngine";
import type { PersonalTimelineBranch } from "@/lib/multiverse/types";
import type { RealityNode } from "./realityData";

interface ForgeTimelineModalProps {
  isOpen: boolean;
  initialBaseline: string;
  parentReality: RealityNode | null;
  customCount: number;
  maxCustomCount: number;
  onClose: () => void;
  onBaselineChange: (baseline: string) => void;
  onTimelineForged: (
    branch: PersonalTimelineBranch,
    enterBreachImmediately: boolean
  ) => void;
}

const CHOICE_PRESETS: Array<{ label: string; value: string }> = [
  {
    label: "Tokyo Indie Sci-Fi Games",
    value: "What if I moved to Tokyo to direct indie sci-fi games?",
  },
  {
    label: "Pro Cricket Full-Time",
    value: "What if I pursued pro cricket full-time?",
  },
  {
    label: "AI Startup Out of High School",
    value: "What if I launched a frontier AI startup right out of high school?",
  },
  {
    label: "Berlin Sound & Philosophy",
    value:
      "What if I dropped the conventional track to study music and systems philosophy in Berlin?",
  },
];

export default function ForgeTimelineModal({
  isOpen,
  initialBaseline,
  parentReality,
  customCount,
  maxCustomCount,
  onClose,
  onBaselineChange,
  onTimelineForged,
}: ForgeTimelineModalProps) {
  const [baseline, setBaseline] = useState<string>(initialBaseline);
  const [pivotalChoice, setPivotalChoice] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const choiceInputRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isGeneratingRef = useRef<boolean>(false);
  const isOpenRef = useRef<boolean>(isOpen);
  const isMountedRef = useRef<boolean>(true);
  const abortedByCloseRef = useRef<boolean>(false);

  useEffect(() => {
    isGeneratingRef.current = isGenerating;
  }, [isGenerating]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortedByCloseRef.current = true;
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      abortedByCloseRef.current = true;
      abortRef.current?.abort();
      return;
    }

    const t = setTimeout(() => {
      choiceInputRef.current?.focus();
    }, 180);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isGeneratingRef.current) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const isAtCapacity = customCount >= maxCustomCount;

  const submitBranch = useCallback(
    async (enterBreach: boolean) => {
      if (isGeneratingRef.current) return;

      const cleanBaseline = baseline.trim();
      const cleanChoice = pivotalChoice.trim();

      if (!cleanBaseline || !cleanChoice) {
        setErrorMsg(
          "Enter both your current reality baseline and a pivotal life choice to diverge."
        );
        return;
      }

      setErrorMsg(null);
      setIsGenerating(true);
      onBaselineChange(cleanBaseline);

      abortedByCloseRef.current = true;
      abortRef.current?.abort();

      abortedByCloseRef.current = false;
      const controller = new AbortController();
      abortRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const res = await fetch("/api/multiverse/branch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            currentSelfContext: cleanBaseline,
            pivotalChoice: cleanChoice,
            parentTimelineTitle: parentReality?.title ?? "Your Personal Nexus",
          }),
        });

        const data = (await res.json()) as
          | PersonalTimelineBranch
          | { error?: string };

        if (!res.ok || !("epochs" in data)) {
          throw new Error(
            ("error" in data && data.error) ||
              "Failed to crystallize divergent timeline."
          );
        }

        if (!isMountedRef.current || !isOpenRef.current) return;
        onTimelineForged(data, enterBreach);
      } catch {
        // Only bail silently if the modal closed or unmounted; otherwise weave via client-side synthesizer
        if (abortedByCloseRef.current || !isMountedRef.current || !isOpenRef.current) {
          return;
        }
        const fallbackBranch = synthesizeDeterministicLifeBranch({
          currentSelfContext: cleanBaseline,
          pivotalChoice: cleanChoice,
          parentTimelineTitle: parentReality?.title ?? "Your Personal Nexus",
        });
        onTimelineForged(fallbackBranch, enterBreach);
      } finally {
        clearTimeout(timeoutId);
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
        if (isMountedRef.current) {
          setIsGenerating(false);
        }
      }
    },
    [
      baseline,
      pivotalChoice,
      onBaselineChange,
      parentReality,
      onTimelineForged,
    ]
  );

  const tabIndex = isOpen ? 0 : -1;

  return (
    <section
      aria-label="Forge Personal Life Divergence"
      aria-hidden={!isOpen}
      inert={!isOpen || undefined}
      className={`fixed inset-0 z-40 flex items-center justify-center px-4 py-6 bg-[radial-gradient(ellipse_at_center,rgba(14,8,34,0.88)_0%,rgba(3,2,6,0.92)_72%,rgba(3,2,6,0.96)_100%)] backdrop-blur-xl transition-all duration-500 ${
        isOpen
          ? "opacity-100 pointer-events-auto scale-100"
          : "opacity-0 pointer-events-none scale-98"
      }`}
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#080414]/82 border border-[#C2B0FF]/25 px-5 sm:px-8 py-6 sm:py-8 shadow-[0_0_64px_rgba(110,50,227,0.32)]">
        {/* Specular Top Starlight Rim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-[#F6F3FE]/65 to-transparent"
        />

        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.26em] text-[#C2B0FF] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse shadow-[0_0_8px_#38BDF8]" />
              <span>
                PERSONAL MULTIVERSE ENGINE {"//"}{" "}
                {parentReality
                  ? `BRANCHING FROM ${parentReality.code}`
                  : "ROOT NEXUS"}
              </span>
            </div>
            <h2 className="mt-1.5 font-[family-name:var(--font-orbitron)] text-lg sm:text-2xl font-bold tracking-[0.12em] text-[#F6F3FE] uppercase">
              FORGE PERSONAL DIVERGENCE
            </h2>
            <p className="mt-1 font-[family-name:var(--font-inter)] text-xs text-[#B7ADD0]/85 leading-relaxed">
              Anchor where your life stands right now, then fracture history
              around the choice you never made to step inside who you become.
            </p>
          </div>

          <button
            type="button"
            tabIndex={tabIndex}
            disabled={isGenerating}
            onClick={onClose}
            className="shrink-0 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.2em] text-[#9F95B3] hover:text-[#F6F3FE] uppercase cursor-pointer disabled:opacity-40"
          >
            [ ESC ]
          </button>
        </div>

        {/* Hairline Divider */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-[#C2B0FF]/35 to-transparent mb-5"
        />

        {/* Form Inputs */}
        <div className="space-y-4">
          {/* 1. Current Reality Baseline */}
          <div>
            <label
              htmlFor="venjix-baseline-input"
              className="block font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.24em] text-[#C2B0FF]/90 uppercase mb-1.5"
            >
              01 {"//"} YOUR CURRENT REALITY BASELINE
            </label>
            <textarea
              id="venjix-baseline-input"
              rows={2}
              tabIndex={tabIndex}
              disabled={isGenerating}
              value={baseline}
              onChange={(e) => setBaseline(e.target.value)}
              placeholder="e.g., 18-year-old CS engineering student building software & AI products"
              className="w-full rounded-xl bg-[#0D0720]/70 border border-[#C2B0FF]/20 focus:border-[#F6F3FE]/65 px-3.5 py-2.5 font-[family-name:var(--font-inter)] text-xs sm:text-sm text-[#F6F3FE] placeholder:text-[#9F95B3]/45 focus:outline-none transition-colors resize-none disabled:opacity-50"
            />
          </div>

          {/* 2. Pivotal Choice / Alternate Path */}
          <div>
            <label
              htmlFor="venjix-choice-input"
              className="block font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.24em] text-[#38BDF8]/90 uppercase mb-1.5"
            >
              02 {"//"} THE PIVOTAL CHOICE / ALTERNATE PATH
            </label>
            <textarea
              ref={choiceInputRef}
              id="venjix-choice-input"
              rows={2}
              tabIndex={tabIndex}
              disabled={isGenerating}
              value={pivotalChoice}
              onChange={(e) => setPivotalChoice(e.target.value)}
              placeholder='e.g., "What if I moved to Japan to direct indie sci-fi games?"'
              className="w-full rounded-xl bg-[#0D0720]/70 border border-[#38BDF8]/30 focus:border-[#38BDF8]/80 px-3.5 py-2.5 font-[family-name:var(--font-inter)] text-xs sm:text-sm text-[#F6F3FE] placeholder:text-[#9F95B3]/45 focus:outline-none transition-colors resize-none disabled:opacity-50"
            />

            {/* Quick-Tap Alternate Life Inspirations */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.2em] text-[#9F95B3]/70 uppercase mr-1">
                SPARKS:
              </span>
              {CHOICE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  tabIndex={tabIndex}
                  disabled={isGenerating}
                  onClick={() => setPivotalChoice(preset.value)}
                  className="px-2.5 py-1 rounded-full bg-[#130A2B]/65 hover:bg-[#1E1044]/85 border border-[#C2B0FF]/20 hover:border-[#38BDF8]/60 font-[family-name:var(--font-jetbrains-mono)] text-[8px] sm:text-[9px] tracking-[0.12em] text-[#D7CEEF] hover:text-[#FFFFFF] uppercase transition-all cursor-pointer disabled:opacity-40"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <p
              role="alert"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.14em] text-[#FB7185] uppercase"
            >
              {errorMsg}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#C2B0FF]/15 flex flex-wrap items-center justify-between gap-3">
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.2em] text-[#9F95B3]/75 uppercase">
            CUSTOM SLOTS: {customCount} / {maxCustomCount}
            {isAtCapacity ? " (REPLACES OLDEST)" : ""}
          </span>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              tabIndex={tabIndex}
              disabled={isGenerating}
              onClick={() => submitBranch(false)}
              className="px-4 py-2.5 rounded-full bg-transparent hover:bg-white/5 border border-[#C2B0FF]/30 hover:border-[#C2B0FF]/65 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.18em] text-[#D7CEEF] hover:text-[#FFFFFF] uppercase transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              [ ADD TO MAP ONLY ]
            </button>

            <button
              type="button"
              tabIndex={tabIndex}
              disabled={isGenerating}
              onClick={() => submitBranch(true)}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#7136D9]/35 hover:bg-[#7136D9]/55 border border-[#38BDF8]/65 hover:border-[#F6F3FE]/85 font-[family-name:var(--font-jetbrains-mono)] text-[10px] sm:text-xs tracking-[0.2em] text-[#F6F3FE] uppercase shadow-[0_0_28px_rgba(56,189,248,0.32)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span
                className={`w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_10px_#38BDF8] ${
                  isGenerating ? "animate-ping" : "animate-pulse"
                }`}
              />
              <span>
                {isGenerating
                  ? "WEAVING PARALLEL TIMELINE..."
                  : "[ CRYSTALLIZE & ENTER BREACH -> ]"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

