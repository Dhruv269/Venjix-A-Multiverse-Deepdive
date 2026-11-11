"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { EnigmaEcho } from "./enigmaEngine";
import type { RealityNode } from "./realityData";
import type { ObserverProfile } from "@/lib/multiverse/types";
import {
  MultiversePersistedState,
  authenticateAndSyncObserver,
  exportMultiverseArtifactJson,
  isSupabaseConfigured,
  loadMultiverseState,
  parseImportedMultiverseArtifact,
} from "@/lib/multiverseStore";

interface ObserverIdentityModalProps {
  isOpen: boolean;
  observerProfile: ObserverProfile;
  customNodes: RealityNode[];
  allNodes: RealityNode[];
  echoHistoryByReality: Record<string, EnigmaEcho[]>;
  onClose: () => void;
  onProfileSynchronized: (nextProfile: ObserverProfile) => void;
  onImportArtifact: (imported: MultiversePersistedState) => void;
  onPurgeMultiverse: () => void;
}

export default function ObserverIdentityModal({
  isOpen,
  observerProfile,
  customNodes,
  allNodes,
  echoHistoryByReality,
  onClose,
  onProfileSynchronized,
  onImportArtifact,
  onPurgeMultiverse,
}: ObserverIdentityModalProps) {
  const [handleInput, setHandleInput] = useState<string>(
    observerProfile.observerHandle
  );
  const [baselineInput, setBaselineInput] = useState<string>(
    observerProfile.baselineContext
  );
  const [emailInput, setEmailInput] = useState<string>(
    observerProfile.email ?? ""
  );
  const [passkeyInput, setPasskeyInput] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"info" | "warn">("info");
  const [confirmPurge, setConfirmPurge] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isSyncingRef = useRef<boolean>(false);

  useEffect(() => {
    isSyncingRef.current = isSyncing;
  }, [isSyncing]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSyncingRef.current) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const supabaseEnabled = isSupabaseConfigured();

  // Telemetry summary computed cleanly from live Observatory state
  const telemetrySummary = useMemo(() => {
    let bestFulfillmentNode: RealityNode | null = null;
    let bestFulfillmentScore = -1;

    let highestDivNode: RealityNode | null = null;
    let highestDivScore = -1;

    for (const node of allNodes) {
      const fScore =
        node.personalTimeline?.metrics.fulfillment ??
        (parseFloat(node.telemetry.resonanceStability) || 0);
      if (fScore > bestFulfillmentScore) {
        bestFulfillmentScore = fScore;
        bestFulfillmentNode = node;
      }

      const dScore =
        node.personalTimeline?.metrics.divergence ??
        (parseFloat(node.divergence) || 0);
      if (dScore > highestDivScore) {
        highestDivScore = dScore;
        highestDivNode = node;
      }
    }

    const totalEchoes = Object.values(echoHistoryByReality).reduce(
      (sum, arr) => sum + arr.length,
      0
    );

    return {
      totalForged: customNodes.length,
      bestFulfillmentLabel: bestFulfillmentNode
        ? `${bestFulfillmentNode.code} (${Math.round(bestFulfillmentScore)}%)`
        : "N/A",
      highestDivLabel: highestDivNode
        ? `${highestDivNode.code} (${Math.round(highestDivScore)}%)`
        : "N/A",
      totalEchoes,
    };
  }, [allNodes, customNodes.length, echoHistoryByReality]);

  const handleSynchronize = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSyncing) return;

    setIsSyncing(true);
    setStatusFeedback(null);

    try {
      const snapshot = loadMultiverseState();
      const result = await authenticateAndSyncObserver({
        handle: handleInput,
        baselineContext: baselineInput,
        email: emailInput,
        passkey: passkeyInput,
        stateSnapshot: snapshot,
      });

      if (!isMountedRef.current) return;
      onProfileSynchronized(result.profile);
      setHandleInput(result.profile.observerHandle);
      setBaselineInput(result.profile.baselineContext);
      setStatusTone("info");
      setStatusFeedback(result.statusMessage);
      setPasskeyInput("");
    } catch {
      if (!isMountedRef.current) return;
      setStatusTone("warn");
      setStatusFeedback("OBSERVER SYNCHRONIZATION INTERRUPTED // RETRYING LOCAL VAULT");
    } finally {
      if (isMountedRef.current) {
        setIsSyncing(false);
      }
    }
  };

  const handleExportArtifact = () => {
    const state = loadMultiverseState();
    const jsonString = exportMultiverseArtifactJson(state);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const slug = observerProfile.observerHandle
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-");
    link.href = url;
    link.download = `venjix-multiverse-${slug || "observer"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setStatusTone("info");
    setStatusFeedback("CONSTELLATION ARTIFACT EXPORTED TO LOCAL DISK (.JSON)");
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseImportedMultiverseArtifact(text);
      if (!parsed) {
        setStatusTone("warn");
        setStatusFeedback("INVALID ARTIFACT SIGNATURE // UNABLE TO PARSE .JSON");
        return;
      }
      onImportArtifact(parsed);
      setHandleInput(parsed.observerProfile.observerHandle);
      setBaselineInput(parsed.observerProfile.baselineContext);
      setEmailInput(parsed.observerProfile.email ?? "");
      setStatusTone("info");
      setStatusFeedback(
        `RESTORED ${parsed.customRealities.length} TIMELINES FROM ARTIFACT`
      );
    } catch {
      setStatusTone("warn");
      setStatusFeedback("FAILED TO READ SELECTED ARTIFACT FILE");
    }
  };

  const handleExecutePurge = () => {
    onPurgeMultiverse();
    setConfirmPurge(false);
    setStatusTone("info");
    setStatusFeedback("CUSTOM NODES & ECHO LOGS PURGED // CANVAS RESET");
  };

  const tabIndex = isOpen ? 0 : -1;

  return (
    <section
      aria-label="Observer Identity Synchronization Console"
      aria-hidden={!isOpen}
      inert={!isOpen || undefined}
      className={`fixed inset-0 z-40 flex items-center justify-center px-4 py-6 bg-[radial-gradient(ellipse_at_center,rgba(14,8,34,0.9)_0%,rgba(3,2,6,0.94)_74%,rgba(3,2,6,0.98)_100%)] backdrop-blur-xl transition-all duration-500 overflow-y-auto ${
        isOpen
          ? "opacity-100 pointer-events-auto scale-100"
          : "opacity-0 pointer-events-none scale-98"
      }`}
    >
      <div className="relative w-full max-w-3xl my-auto rounded-3xl bg-[#080414]/88 border border-[#C2B0FF]/25 px-5 sm:px-8 py-6 sm:py-7 shadow-[0_0_72px_rgba(113,54,217,0.34)]">
        {/* Specular Top Starlight Rim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-[#F6F3FE]/65 to-transparent"
        />

        {/* Console Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.26em] text-[#C2B0FF] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse shadow-[0_0_8px_#38BDF8]" />
              <span>
                OBSERVER IDENTITY SYNCHRONIZATION {"//"} {observerProfile.observerHandle}
              </span>
              <span className="px-2 py-0.5 rounded-full border border-[#C2B0FF]/30 bg-[#0D0720]/70 text-[8px] text-[#38BDF8]">
                {observerProfile.authMode === "supabase"
                  ? "CLOUD LOCKED"
                  : supabaseEnabled
                    ? "CLOUD READY"
                    : "VOID VAULT"}
              </span>
            </div>
            <h2 className="mt-1.5 font-[family-name:var(--font-orbitron)] text-lg sm:text-2xl font-bold tracking-[0.12em] text-[#F6F3FE] uppercase">
              OBSERVER CONDUIT & TELEMETRY
            </h2>
          </div>

          <button
            type="button"
            tabIndex={tabIndex}
            disabled={isSyncing}
            onClick={onClose}
            className="shrink-0 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.2em] text-[#9F95B3] hover:text-[#F6F3FE] uppercase cursor-pointer disabled:opacity-40"
          >
            [ ESC ]
          </button>
        </div>

        {/* Multiverse Telemetry Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          <div className="px-3.5 py-2.5 rounded-2xl bg-[#0D0720]/65 border border-[#C2B0FF]/18">
            <div className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.2em] text-[#9F95B3]/75 uppercase">
              TIMELINES FORGED
            </div>
            <div className="mt-1 font-[family-name:var(--font-orbitron)] text-base sm:text-lg font-bold text-[#F6F3FE] tabular-nums">
              {telemetrySummary.totalForged}
            </div>
          </div>

          <div className="px-3.5 py-2.5 rounded-2xl bg-[#0D0720]/65 border border-[#C2B0FF]/18">
            <div className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.2em] text-[#9F95B3]/75 uppercase">
              PEAK FULFILLMENT
            </div>
            <div className="mt-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] sm:text-xs font-medium text-[#38BDF8] truncate">
              {telemetrySummary.bestFulfillmentLabel}
            </div>
          </div>

          <div className="px-3.5 py-2.5 rounded-2xl bg-[#0D0720]/65 border border-[#C2B0FF]/18">
            <div className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.2em] text-[#9F95B3]/75 uppercase">
              HIGHEST DIVERGENCE
            </div>
            <div className="mt-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] sm:text-xs font-medium text-[#E879F9] truncate">
              {telemetrySummary.highestDivLabel}
            </div>
          </div>

          <div className="px-3.5 py-2.5 rounded-2xl bg-[#0D0720]/65 border border-[#C2B0FF]/18">
            <div className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.2em] text-[#9F95B3]/75 uppercase">
              ENIGMA ECHOES
            </div>
            <div className="mt-1 font-[family-name:var(--font-orbitron)] text-base sm:text-lg font-bold text-[#C2B0FF] tabular-nums">
              {telemetrySummary.totalEchoes}
            </div>
          </div>
        </div>

        {/* Hairline Divider */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-[#C2B0FF]/35 to-transparent mb-5"
        />

        {/* Identity & Authentication Form */}
        <form onSubmit={handleSynchronize} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="venjix-observer-handle"
                className="block font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.22em] text-[#C2B0FF]/90 uppercase mb-1.5"
              >
                01 {"//"} OBSERVER DESIGNATION / HANDLE
              </label>
              <input
                id="venjix-observer-handle"
                type="text"
                tabIndex={tabIndex}
                disabled={isSyncing}
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder="GUEST-01"
                maxLength={24}
                className="w-full rounded-xl bg-[#0D0720]/75 border border-[#C2B0FF]/25 focus:border-[#F6F3FE]/70 px-3.5 py-2 font-[family-name:var(--font-jetbrains-mono)] text-xs tracking-[0.14em] text-[#F6F3FE] uppercase placeholder:text-[#9F95B3]/40 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="venjix-observer-email"
                className="block font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.22em] text-[#9F95B3]/90 uppercase mb-1.5"
              >
                02 {"//"} NEURAL MAIL (OPTIONAL CLOUD SYNC)
              </label>
              <input
                id="venjix-observer-email"
                type="email"
                tabIndex={tabIndex}
                disabled={isSyncing}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={
                  supabaseEnabled
                    ? "observer@domain.com"
                    : "optional (local passport active)"
                }
                className="w-full rounded-xl bg-[#0D0720]/75 border border-[#C2B0FF]/20 focus:border-[#38BDF8]/70 px-3.5 py-2 font-[family-name:var(--font-inter)] text-xs text-[#F6F3FE] placeholder:text-[#9F95B3]/40 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="venjix-observer-baseline"
              className="block font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.22em] text-[#38BDF8]/90 uppercase mb-1.5"
            >
              03 {"//"} DEFAULT REALITY BASELINE CONTEXT (AUTO-FILLS TIMELINE FORGE)
            </label>
            <textarea
              id="venjix-observer-baseline"
              rows={2}
              tabIndex={tabIndex}
              disabled={isSyncing}
              value={baselineInput}
              onChange={(e) => setBaselineInput(e.target.value)}
              placeholder="e.g., 18-year-old CS engineering student building software & AI products"
              className="w-full rounded-xl bg-[#0D0720]/75 border border-[#38BDF8]/25 focus:border-[#38BDF8]/75 px-3.5 py-2 font-[family-name:var(--font-inter)] text-xs sm:text-sm text-[#F6F3FE] placeholder:text-[#9F95B3]/40 focus:outline-none resize-none disabled:opacity-50"
            />
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex-1 min-w-[200px]">
              <label
                htmlFor="venjix-observer-passkey"
                className="block font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.22em] text-[#9F95B3]/85 uppercase mb-1.5"
              >
                04 {"//"} PASSKEY TOKEN{" "}
                {observerProfile.passportSignature
                  ? `(${observerProfile.passportSignature})`
                  : ""}
              </label>
              <input
                id="venjix-observer-passkey"
                type="password"
                tabIndex={tabIndex}
                disabled={isSyncing}
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Min 6 chars for Supabase cloud or local signature..."
                className="w-full rounded-xl bg-[#0D0720]/75 border border-[#C2B0FF]/20 focus:border-[#F6F3FE]/65 px-3.5 py-2 font-[family-name:var(--font-jetbrains-mono)] text-xs text-[#F6F3FE] placeholder:text-[#9F95B3]/40 focus:outline-none disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              tabIndex={tabIndex}
              disabled={isSyncing}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7136D9]/35 hover:bg-[#7136D9]/55 border border-[#C2B0FF]/55 hover:border-[#F6F3FE]/85 font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.2em] text-[#F6F3FE] uppercase shadow-[0_0_24px_rgba(113,54,217,0.34)] transition-all cursor-pointer disabled:opacity-50"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
              <span>
                {isSyncing
                  ? "SYNCHRONIZING..."
                  : "[ SYNCHRONIZE IDENTITY -> ]"}
              </span>
            </button>
          </div>
        </form>

        {statusFeedback && (
          <p
            role="status"
            className={`mt-3 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.18em] uppercase ${
              statusTone === "warn" ? "text-[#FB7185]" : "text-[#38BDF8]"
            }`}
          >
            {statusFeedback}
          </p>
        )}

        {/* Artifact Export / Import & Multiverse Reset Footer */}
        <div className="mt-6 pt-4 border-t border-[#C2B0FF]/15 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              tabIndex={tabIndex}
              onClick={handleExportArtifact}
              className="px-3.5 py-2 rounded-full bg-transparent hover:bg-white/5 border border-[#C2B0FF]/30 hover:border-[#C2B0FF]/70 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.18em] text-[#D7CEEF] hover:text-[#FFFFFF] uppercase transition-all cursor-pointer"
            >
              [ EXPORT .JSON ARTIFACT ]
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="hidden"
              tabIndex={-1}
            />
            <button
              type="button"
              tabIndex={tabIndex}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-full bg-transparent hover:bg-white/5 border border-[#38BDF8]/35 hover:border-[#38BDF8]/80 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.18em] text-[#38BDF8] hover:text-[#FFFFFF] uppercase transition-all cursor-pointer"
            >
              [ IMPORT .JSON ]
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!confirmPurge ? (
              <button
                type="button"
                tabIndex={tabIndex}
                disabled={customNodes.length === 0 && telemetrySummary.totalEchoes === 0}
                onClick={() => setConfirmPurge(true)}
                className="px-3.5 py-2 rounded-full bg-[#FB7185]/10 hover:bg-[#FB7185]/22 border border-[#FB7185]/35 hover:border-[#FB7185]/70 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.18em] text-[#FB7185] uppercase transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
              >
                [ RESET MULTIVERSE {"//"} PURGE CUSTOM NODES ]
              </button>
            ) : (
              <>
                <button
                  type="button"
                  tabIndex={tabIndex}
                  onClick={handleExecutePurge}
                  className="px-3.5 py-2 rounded-full bg-[#FB7185]/30 hover:bg-[#FB7185]/45 border border-[#FB7185]/80 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.18em] text-[#FFFFFF] uppercase transition-all cursor-pointer"
                >
                  [ CONFIRM PURGE ]
                </button>
                <button
                  type="button"
                  tabIndex={tabIndex}
                  onClick={() => setConfirmPurge(false)}
                  className="px-3 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.16em] text-[#9F95B3] hover:text-[#F6F3FE] uppercase cursor-pointer"
                >
                  CANCEL
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

