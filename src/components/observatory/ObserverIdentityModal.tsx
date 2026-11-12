"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { EnigmaEcho } from "./enigmaEngine";
import type { RealityNode } from "./realityData";
import type { ObserverProfile } from "@/lib/multiverse/types";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  MultiversePersistedState,
  exportMultiverseArtifactJson,
  loadMultiverseState,
  parseImportedMultiverseArtifact,
  saveLocalObserverPassport,
} from "@/lib/multiverseStore";

type AuthMethodTab = "password" | "magic_link";
type PasswordSubMode = "sign_in" | "sign_up";

interface ObserverIdentityModalProps {
  isOpen: boolean;
  observerProfile: ObserverProfile;
  cloudUser: User | null;
  isCloudSyncing: boolean;
  cloudSyncStatus: string | null;
  customNodes: RealityNode[];
  allNodes: RealityNode[];
  echoHistoryByReality: Record<string, EnigmaEcho[]>;
  onClose: () => void;
  onProfileSynchronized: (nextProfile: ObserverProfile) => void;
  onForceCloudSync: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onImportArtifact: (imported: MultiversePersistedState) => void;
  onPurgeMultiverse: () => void;
}

function formatSyncTimestamp(iso: string | undefined): string {
  if (!iso) return "PENDING";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function ObserverIdentityModal({
  isOpen,
  observerProfile,
  cloudUser,
  isCloudSyncing,
  cloudSyncStatus,
  customNodes,
  allNodes,
  echoHistoryByReality,
  onClose,
  onProfileSynchronized,
  onForceCloudSync,
  onSignOut,
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
    cloudUser?.email ?? observerProfile.email ?? ""
  );
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authTab, setAuthTab] = useState<AuthMethodTab>("password");
  const [passwordMode, setPasswordMode] = useState<PasswordSubMode>("sign_in");
  const [oauthLoading, setOauthLoading] = useState<"github" | "google" | null>(
    null
  );
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"info" | "warn">("info");
  const [confirmPurge, setConfirmPurge] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isBusyRef = useRef<boolean>(false);

  const effectiveBusy = isBusy || isCloudSyncing || oauthLoading !== null;

  useEffect(() => {
    isBusyRef.current = effectiveBusy;
  }, [effectiveBusy]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isBusyRef.current) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const supabaseEnabled = isSupabaseConfigured();
  const isAuthenticated = Boolean(cloudUser);

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

  const commitDraftIdentityBeforeAuth = () => {
    const saved = saveLocalObserverPassport({
      handle: handleInput,
      baselineContext: baselineInput,
      email: emailInput.trim() || undefined,
    });
    onProfileSynchronized(saved);
    return saved;
  };

  const handleSaveProfileOnly = async () => {
    if (effectiveBusy) return;
    setIsBusy(true);
    setStatusFeedback(null);

    try {
      const updated = commitDraftIdentityBeforeAuth();
      if (isAuthenticated) {
        await onForceCloudSync();
      }
      if (!isMountedRef.current) return;
      setHandleInput(updated.observerHandle);
      setBaselineInput(updated.baselineContext);
      setStatusTone("info");
      setStatusFeedback(
        isAuthenticated
          ? "OBSERVER HANDLE & BASELINE PUSHED TO SUPABASE POSTGRES"
          : "LOCAL OBSERVER PASSPORT UPDATED IN PERSISTENT VAULT"
      );
    } finally {
      if (isMountedRef.current) {
        setIsBusy(false);
      }
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (effectiveBusy) return;

    const cleanEmail = emailInput.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setStatusTone("warn");
      setStatusFeedback("ENTER A VALID OBSERVER EMAIL ADDRESS");
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setStatusTone("warn");
      setStatusFeedback(
        "SUPABASE CLIENT UNAVAILABLE // CHECK .ENV.LOCAL KEYS"
      );
      return;
    }

    const draftProfile = commitDraftIdentityBeforeAuth();
    setIsBusy(true);
    setStatusFeedback(null);

    try {
      if (authTab === "magic_link") {
        const { error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              observer_handle: draftProfile.observerHandle,
            },
          },
        });

        if (!isMountedRef.current) return;
        if (error) {
          setStatusTone("warn");
          setStatusFeedback(`MAGIC LINK FAILED // ${error.message.toUpperCase()}`);
          return;
        }

        setStatusTone("info");
        setStatusFeedback(
          `MAGIC LINK DISPATCHED TO ${cleanEmail.toUpperCase()} // CHECK INBOX TO ENTER`
        );
        return;
      }

      if (passwordInput.length < 6) {
        setStatusTone("warn");
        setStatusFeedback("PASSWORD MUST BE AT LEAST 6 CHARACTERS");
        return;
      }

      if (passwordMode === "sign_in") {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: passwordInput,
        });

        if (!isMountedRef.current) return;
        if (error) {
          setStatusTone("warn");
          setStatusFeedback(`AUTH REJECTED // ${error.message.toUpperCase()}`);
          return;
        }

        setPasswordInput("");
        setStatusTone("info");
        setStatusFeedback(
          "CREDENTIALS VERIFIED // HYDRATING CLOUD MULTIVERSE..."
        );
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: passwordInput,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              observer_handle: draftProfile.observerHandle,
            },
          },
        });

        if (!isMountedRef.current) return;
        if (error) {
          setStatusTone("warn");
          setStatusFeedback(`ACCOUNT CREATION FAILED // ${error.message.toUpperCase()}`);
          return;
        }

        setPasswordInput("");
        if (data.session) {
          setStatusTone("info");
          setStatusFeedback(
            "OBSERVER ACCOUNT CREATED // MIGRATING TIMELINES TO POSTGRES..."
          );
        } else {
          setStatusTone("info");
          setStatusFeedback(
            `ACCOUNT CREATED // VERIFY CONFIRMATION LINK SENT TO ${cleanEmail.toUpperCase()}`
          );
        }
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setStatusTone("warn");
      setStatusFeedback(
        `SUPABASE AUTH ERROR // ${
          err instanceof Error ? err.message.toUpperCase() : "UNKNOWN ERROR"
        }`
      );
    } finally {
      if (isMountedRef.current) {
        setIsBusy(false);
      }
    }
  };

  const handleOAuthLogin = async (provider: "github" | "google") => {
    if (effectiveBusy) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setStatusTone("warn");
      setStatusFeedback(
        "SUPABASE CLIENT UNAVAILABLE // CHECK .ENV.LOCAL KEYS"
      );
      return;
    }

    commitDraftIdentityBeforeAuth();
    setOauthLoading(provider);
    setStatusFeedback(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error && isMountedRef.current) {
        setOauthLoading(null);
        setStatusTone("warn");
        setStatusFeedback(
          `${provider.toUpperCase()} OAUTH ERROR // ${error.message.toUpperCase()}`
        );
      }
    } catch (err) {
      if (isMountedRef.current) {
        setOauthLoading(null);
        setStatusTone("warn");
        setStatusFeedback(
          `${provider.toUpperCase()} OAUTH FAILED // ${
            err instanceof Error ? err.message.toUpperCase() : "NETWORK ERROR"
          }`
        );
      }
    }
  };

  const handleForceSync = async () => {
    if (effectiveBusy || !isAuthenticated) return;
    setIsBusy(true);
    setStatusFeedback(null);
    try {
      commitDraftIdentityBeforeAuth();
      await onForceCloudSync();
      if (!isMountedRef.current) return;
      setStatusTone("info");
      setStatusFeedback(
        "SUPABASE POSTGRES RESYNC COMPLETE // ALL TIMELINES PRESERVED"
      );
    } finally {
      if (isMountedRef.current) {
        setIsBusy(false);
      }
    }
  };

  const handleSignOutClick = async () => {
    if (effectiveBusy || !isAuthenticated) return;
    setIsBusy(true);
    setStatusFeedback(null);
    try {
      await onSignOut();
      if (!isMountedRef.current) return;
      setHandleInput("GUEST-01");
      setPasswordInput("");
      setStatusTone("info");
      setStatusFeedback("CLOUD IDENTITY SEVERED // RETURNED TO LOCAL VOID VAULT");
    } finally {
      if (isMountedRef.current) {
        setIsBusy(false);
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
    setStatusFeedback(
      isAuthenticated
        ? "CUSTOM NODES & ECHO LOGS PURGED LOCALLY & IN CLOUD"
        : "CUSTOM NODES & ECHO LOGS PURGED // CANVAS RESET"
    );
  };

  const tabIndex = isOpen ? 0 : -1;
  const activeFeedback = statusFeedback || cloudSyncStatus;

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
      <div className="relative w-full max-w-3xl my-auto rounded-3xl bg-[#080414]/90 border border-[#C2B0FF]/25 px-5 sm:px-8 py-6 sm:py-7 shadow-[0_0_72px_rgba(113,54,217,0.34)]">
        {/* Specular Top Starlight Rim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-[#F6F3FE]/65 to-transparent"
        />

        {/* Console Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.24em] text-[#C2B0FF] uppercase">
              <span
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  isAuthenticated
                    ? "bg-[#34D399] shadow-[0_0_10px_#34D399]"
                    : "bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]"
                }`}
              />
              <span>
                OBSERVER IDENTITY {"//"} {observerProfile.observerHandle}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full border text-[8px] ${
                  isAuthenticated
                    ? "border-[#34D399]/45 bg-[#052E24]/60 text-[#34D399]"
                    : supabaseEnabled
                      ? "border-[#38BDF8]/35 bg-[#0D0720]/70 text-[#38BDF8]"
                      : "border-[#C2B0FF]/30 bg-[#0D0720]/70 text-[#C2B0FF]"
                }`}
              >
                {isAuthenticated
                  ? "CLOUD SYNC // ACTIVE"
                  : supabaseEnabled
                    ? "SUPABASE READY"
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
            disabled={effectiveBusy}
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

        {/* Shared Editable Observer Handle & Life Baseline */}
        <div className="space-y-3.5 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
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
                disabled={effectiveBusy}
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder="GUEST-01"
                maxLength={24}
                className="w-full rounded-xl bg-[#0D0720]/75 border border-[#C2B0FF]/25 focus:border-[#F6F3FE]/70 px-3.5 py-2 font-[family-name:var(--font-jetbrains-mono)] text-xs tracking-[0.14em] text-[#F6F3FE] uppercase placeholder:text-[#9F95B3]/40 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                tabIndex={tabIndex}
                disabled={effectiveBusy}
                onClick={handleSaveProfileOnly}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#120A2A]/80 hover:bg-[#1E1245] border border-[#C2B0FF]/30 hover:border-[#F6F3FE]/70 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.18em] text-[#E9E2F5] uppercase transition-all cursor-pointer disabled:opacity-45"
              >
                {isAuthenticated
                  ? "[ UPDATE HANDLE & BASELINE ]"
                  : "[ SAVE LOCAL HANDLE & BASELINE ]"}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="venjix-observer-baseline"
              className="block font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.22em] text-[#38BDF8]/90 uppercase mb-1.5"
            >
              02 {"//"} DEFAULT REALITY BASELINE CONTEXT (AUTO-FILLS TIMELINE FORGE)
            </label>
            <textarea
              id="venjix-observer-baseline"
              rows={2}
              tabIndex={tabIndex}
              disabled={effectiveBusy}
              value={baselineInput}
              onChange={(e) => setBaselineInput(e.target.value)}
              placeholder="e.g., 18-year-old CS engineering student building software & AI products"
              className="w-full rounded-xl bg-[#0D0720]/75 border border-[#38BDF8]/25 focus:border-[#38BDF8]/75 px-3.5 py-2 font-[family-name:var(--font-inter)] text-xs sm:text-sm text-[#F6F3FE] placeholder:text-[#9F95B3]/40 focus:outline-none resize-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* ------------------------------------------------------------------
            AUTHENTICATED CLOUD VAULT VIEW vs. MULTI-PROVIDER AUTH PORTAL
            ------------------------------------------------------------------ */}
        {isAuthenticated && cloudUser ? (
          <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(8,29,29,0.55)_0%,rgba(12,7,28,0.88)_100%)] border border-[#34D399]/35 p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.22em] text-[#34D399] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse shadow-[0_0_10px_#34D399]" />
                <span>CLOUD SYNC {"//"} ACTIVE — SUPABASE POSTGRES</span>
              </div>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.16em] text-[#9F95B3]">
                SYNCED: {formatSyncTimestamp(observerProfile.syncedAt)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-[#04030A]/75 border border-[#C2B0FF]/16 px-3.5 py-2.5">
                <div className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.20em] text-[#9F95B3]/80 uppercase">
                  AUTHENTICATED OBSERVER EMAIL
                </div>
                <div className="mt-1 font-[family-name:var(--font-inter)] text-xs sm:text-sm text-[#F6F3FE] truncate">
                  {cloudUser.email || observerProfile.email || "OAuth Verified Identity"}
                </div>
              </div>

              <div className="rounded-xl bg-[#04030A]/75 border border-[#C2B0FF]/16 px-3.5 py-2.5">
                <div className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.20em] text-[#9F95B3]/80 uppercase">
                  SUPABASE OBSERVER UID
                </div>
                <div className="mt-1 font-[family-name:var(--font-jetbrains-mono)] text-[10px] sm:text-[11px] text-[#7DD3FC] truncate">
                  UID: {cloudUser.id}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
              <button
                type="button"
                tabIndex={tabIndex}
                disabled={effectiveBusy}
                onClick={handleForceSync}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0284C7]/25 hover:bg-[#0284C7]/45 border border-[#38BDF8]/55 hover:border-[#F6F3FE]/85 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.18em] text-[#F6F3FE] uppercase shadow-[0_0_20px_rgba(56,189,248,0.22)] transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                <span>
                  {effectiveBusy ? "SYNCING POSTGRES..." : "[ FORCE CLOUD SYNC NOW ]"}
                </span>
              </button>

              <button
                type="button"
                tabIndex={tabIndex}
                disabled={effectiveBusy}
                onClick={handleSignOutClick}
                className="px-4 py-2 rounded-full bg-[#FB7185]/12 hover:bg-[#FB7185]/25 border border-[#FB7185]/40 hover:border-[#FB7185]/80 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.18em] text-[#FB7185] hover:text-[#FFFFFF] uppercase transition-all cursor-pointer disabled:opacity-50"
              >
                [ SIGN OUT {"//"} SEVER IDENTITY ]
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#0B061B]/75 border border-[#C2B0FF]/20 p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.22em] text-[#C2B0FF] uppercase">
                03 {"//"} SUPABASE CLOUD AUTHENTICATION PORTAL
              </span>

              {/* Mode Switcher: Email+Password vs Magic Link */}
              <div className="inline-flex rounded-full bg-[#05030C] border border-[#C2B0FF]/20 p-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[8px] sm:text-[9px] tracking-[0.16em] uppercase">
                <button
                  type="button"
                  tabIndex={tabIndex}
                  onClick={() => {
                    setAuthTab("password");
                    setStatusFeedback(null);
                  }}
                  className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                    authTab === "password"
                      ? "bg-[#7136D9]/45 text-[#FFFFFF]"
                      : "text-[#9F95B3] hover:text-[#F6F3FE]"
                  }`}
                >
                  EMAIL + PASSWORD
                </button>
                <button
                  type="button"
                  tabIndex={tabIndex}
                  onClick={() => {
                    setAuthTab("magic_link");
                    setStatusFeedback(null);
                  }}
                  className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                    authTab === "magic_link"
                      ? "bg-[#0284C7]/45 text-[#FFFFFF]"
                      : "text-[#9F95B3] hover:text-[#F6F3FE]"
                  }`}
                >
                  MAGIC LINK
                </button>
              </div>
            </div>

            {/* 1-Click OAuth Providers: GitHub & Google */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                tabIndex={tabIndex}
                disabled={effectiveBusy || !supabaseEnabled}
                onClick={() => handleOAuthLogin("github")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#05030C]/90 hover:bg-[#140B2E] border border-[#C2B0FF]/30 hover:border-[#F6F3FE]/75 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.18em] text-[#F6F3FE] uppercase transition-all cursor-pointer disabled:opacity-45"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2B0FF]" />
                <span>
                  {oauthLoading === "github"
                    ? "REDIRECTING GITHUB..."
                    : "[ CONTINUE WITH GITHUB ]"}
                </span>
              </button>

              <button
                type="button"
                tabIndex={tabIndex}
                disabled={effectiveBusy || !supabaseEnabled}
                onClick={() => handleOAuthLogin("google")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#05030C]/90 hover:bg-[#0B1C33] border border-[#38BDF8]/35 hover:border-[#38BDF8]/80 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.18em] text-[#E9E2F5] hover:text-[#FFFFFF] uppercase transition-all cursor-pointer disabled:opacity-45"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                <span>
                  {oauthLoading === "google"
                    ? "REDIRECTING GOOGLE..."
                    : "[ CONTINUE WITH GOOGLE ]"}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-[8px] font-[family-name:var(--font-jetbrains-mono)] tracking-[0.26em] text-[#9F95B3]/60 uppercase">
              <span className="flex-1 h-px bg-[#C2B0FF]/15" />
              <span>OR NEURAL MAIL CREDENTIALS</span>
              <span className="flex-1 h-px bg-[#C2B0FF]/15" />
            </div>

            {/* Email + Password OR Magic Link Form */}
            <form onSubmit={handleEmailAuthSubmit} className="space-y-3">
              {authTab === "password" && (
                <div className="flex items-center justify-between gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.18em] uppercase">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      tabIndex={tabIndex}
                      onClick={() => setPasswordMode("sign_in")}
                      className={`pb-0.5 border-b transition-colors cursor-pointer ${
                        passwordMode === "sign_in"
                          ? "border-[#C2B0FF] text-[#F6F3FE]"
                          : "border-transparent text-[#9F95B3]/70 hover:text-[#E9E2F5]"
                      }`}
                    >
                      SIGN IN
                    </button>
                    <span className="text-[#9F95B3]/40">/</span>
                    <button
                      type="button"
                      tabIndex={tabIndex}
                      onClick={() => setPasswordMode("sign_up")}
                      className={`pb-0.5 border-b transition-colors cursor-pointer ${
                        passwordMode === "sign_up"
                          ? "border-[#38BDF8] text-[#38BDF8]"
                          : "border-transparent text-[#9F95B3]/70 hover:text-[#E9E2F5]"
                      }`}
                    >
                      CREATE OBSERVER ACCOUNT
                    </button>
                  </div>
                </div>
              )}

              <div
                className={`grid grid-cols-1 ${
                  authTab === "password" ? "sm:grid-cols-2" : ""
                } gap-3`}
              >
                <input
                  id="venjix-observer-email"
                  aria-label="Observer Email"
                  type="email"
                  tabIndex={tabIndex}
                  disabled={effectiveBusy}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="observer@domain.com"
                  className="w-full rounded-xl bg-[#05030C]/90 border border-[#C2B0FF]/25 focus:border-[#38BDF8]/75 px-3.5 py-2.5 font-[family-name:var(--font-inter)] text-xs sm:text-sm text-[#F6F3FE] placeholder:text-[#9F95B3]/40 focus:outline-none disabled:opacity-50"
                />

                {authTab === "password" && (
                  <input
                    id="venjix-observer-passkey"
                    aria-label="Observer Password"
                    type="password"
                    tabIndex={tabIndex}
                    disabled={effectiveBusy}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Password (min 6 characters)..."
                    className="w-full rounded-xl bg-[#05030C]/90 border border-[#C2B0FF]/25 focus:border-[#F6F3FE]/70 px-3.5 py-2.5 font-[family-name:var(--font-jetbrains-mono)] text-xs text-[#F6F3FE] placeholder:text-[#9F95B3]/40 focus:outline-none disabled:opacity-50"
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-[8px] tracking-[0.16em] text-[#9F95B3]/75 uppercase">
                  GUEST TIMELINES MERGE AUTOMATICALLY UPON SIGN-IN
                </span>

                <button
                  type="submit"
                  tabIndex={tabIndex}
                  disabled={effectiveBusy || !supabaseEnabled}
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7136D9]/40 hover:bg-[#7136D9]/60 border border-[#C2B0FF]/55 hover:border-[#F6F3FE]/85 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.18em] text-[#F6F3FE] uppercase shadow-[0_0_24px_rgba(113,54,217,0.34)] transition-all cursor-pointer disabled:opacity-45"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                  <span>
                    {effectiveBusy
                      ? "CONNECTING..."
                      : authTab === "magic_link"
                        ? "[ SEND MAGIC LINK -> ]"
                        : passwordMode === "sign_in"
                          ? "[ SIGN IN // CLOUD SYNC -> ]"
                          : "[ CREATE OBSERVER ACCOUNT -> ]"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}

        {activeFeedback && (
          <p
            role="status"
            className={`mt-3 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.16em] uppercase ${
              statusTone === "warn" ? "text-[#FB7185]" : "text-[#38BDF8]"
            }`}
          >
            {activeFeedback}
          </p>
        )}

        {/* Artifact Export / Import & Multiverse Reset Footer */}
        <div className="mt-5 pt-4 border-t border-[#C2B0FF]/15 flex flex-wrap items-center justify-between gap-2.5">
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
                disabled={
                  customNodes.length === 0 && telemetrySummary.totalEchoes === 0
                }
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
