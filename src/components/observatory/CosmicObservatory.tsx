"use client";

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import ObservatoryNavbar from "./ObservatoryNavbar";
import RealityConstellation from "./RealityConstellation";
import RealityInspector from "./RealityInspector";
import RealityBreachView from "./RealityBreachView";
import ForgeTimelineModal from "./ForgeTimelineModal";
import ObserverIdentityModal from "./ObserverIdentityModal";
import TimelineComparisonModal from "./TimelineComparisonModal";
import EnigmaCommunion, {
  CrystallizeDivergencePayload,
} from "./EnigmaCommunion";
import { cosmicAudio } from "@/lib/cosmicAudio";
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { EnigmaEcho } from "./enigmaEngine";
import {
  DEFAULT_OBSERVATORY_SPECTRUM,
  MAX_CUSTOM_REALITIES,
  REALITY_NODES,
  SYNAPTIC_LINKS,
  RealityNode,
  SynapticLink,
  createPersonalTimelineNode,
  synthesizeCustomRealityNode,
} from "./realityData";
import {
  DEFAULT_OBSERVER_PROFILE,
  MultiversePersistedState,
  loadMultiverseState,
  purgeCustomMultiverse,
  saveCustomRealities,
  saveEchoHistoryForReality,
  saveMultiverseState,
  saveObserverProfile,
  syncSessionWithCloud,
  upsertCloudMultiverseState,
} from "@/lib/multiverseStore";
import type { ObserverProfile, PersonalTimelineBranch } from "@/lib/multiverse/types";
import type { EnigmaActivityState } from "../gateway/AtmosphericCanvas";

/**
 * ============================================================================
 * COMPONENT: CosmicObservatory
 * ============================================================================
 * MILESTONE 2 + MILESTONE 3 + MILESTONE 4:
 * Living Reality Orbs, Synaptic Threads, Enigma Communion & Custom Divergence Spawning
 *
 * Coordinates the interactive Multiverse Network suspended in deep space:
 * - Floating translucent navigation bar with quick reality switching & Enigma entry.
 * - Full-viewport organic SVG constellation connecting 5 foundational + up to 3
 *   user-crystallized Reality Orbs via luminous Cubic Bezier synaptic threads.
 * - Right-sanctuary border-minimal Reality Deep-Dive inspection overlay.
 * - Full-screen Harmonic Singularity Communion interface ("The Enigma").
 * - Live spectral RGB & harmonic activity telemetry streamed upstream into WebGL2.
 */

interface CosmicObservatoryProps {
  /** Controls visibility & zoom entrance state */
  isActive: boolean;
  /** Returns visitor smoothly back to the Gateway */
  onExitGateway: () => void;
  /** Broadcasts smoothly hovered/selected reality RGB spectrum toward WebGL2 */
  onSpectrumChange?: (spectrum: [number, number, number]) => void;
  /** Broadcasts Enigma consciousness state ("idle" | "synthesizing" | "transmitting") */
  onEnigmaStateChange?: (state: EnigmaActivityState) => void;
}

export default function CosmicObservatory({
  isActive,
  onExitGateway,
  onSpectrumChange,
  onEnigmaStateChange,
}: CosmicObservatoryProps) {
  const [customNodes, setCustomNodes] = useState<RealityNode[]>([]);
  const [customLinks, setCustomLinks] = useState<SynapticLink[]>([]);
  const [echoHistoryByReality, setEchoHistoryByReality] = useState<
    Record<string, EnigmaEcho[]>
  >({});
  const [observerProfile, setObserverProfile] = useState<ObserverProfile>(
    () => ({ ...DEFAULT_OBSERVER_PROFILE })
  );
  const [selectedRealityId, setSelectedRealityId] = useState<string | null>(
    null
  );
  const [hoveredRealityId, setHoveredRealityId] = useState<string | null>(null);
  const [isEnigmaOpen, setIsEnigmaOpen] = useState<boolean>(false);
  const [enigmaSession, setEnigmaSession] = useState<number>(0);
  const [isBreachOpen, setIsBreachOpen] = useState<boolean>(false);
  const [isForgeOpen, setIsForgeOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isObserverOpen, setIsObserverOpen] = useState<boolean>(false);
  const [forgeSession, setForgeSession] = useState<number>(0);
  const [compareSession, setCompareSession] = useState<number>(0);
  const [observerSession, setObserverSession] = useState<number>(0);
  const [breachSession, setBreachSession] = useState<number>(0);
  const [newlyBornId, setNewlyBornId] = useState<string | null>(null);
  const [cloudUser, setCloudUser] = useState<User | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<string | null>(null);

  const bornTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cloudUserRef = useRef<User | null>(null);
  const syncedCloudUserIdRef = useRef<string | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const applyPersistedState = useCallback((state: MultiversePersistedState) => {
    setObserverProfile(state.observerProfile);
    setCustomNodes(state.customRealities);
    setCustomLinks(state.customLinks);
    setEchoHistoryByReality(state.echoHistoryByReality);
  }, []);

  const pushSnapshotToCloud = useCallback(
    async (snapshot: MultiversePersistedState) => {
      const activeUser = cloudUserRef.current;
      if (!activeUser) return;
      const result = await upsertCloudMultiverseState(activeUser, snapshot);
      if (!isMountedRef.current) return;
      if (result.ok) {
        setObserverProfile((prev) => ({
          ...prev,
          authMode: "supabase",
          cloudUserId: activeUser.id,
          email: activeUser.email ?? prev.email,
          syncedAt: result.syncedAt,
        }));
        setCloudSyncStatus(
          "CLOUD SYNC // ACTIVE — AUTO-SAVED TO SUPABASE POSTGRES"
        );
      } else if (result.errorMessage) {
        setCloudSyncStatus(
          `CLOUD AUTO-SYNC WARNING: ${result.errorMessage.toUpperCase()}`
        );
      }
    },
    []
  );

  // Hydrate persistent Multiverse Store locally and bind real-time Supabase auth listener
  useEffect(() => {
    isMountedRef.current = true;
    const persisted = loadMultiverseState();
    const rafId = requestAnimationFrame(() => {
      applyPersistedState(persisted);
    });

    const supabase = getSupabaseClient();
    if (!supabase) {
      return () => {
        isMountedRef.current = false;
        cancelAnimationFrame(rafId);
      };
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const nextUser = session?.user ?? null;

        if (nextUser) {
          cloudUserRef.current = nextUser;
          setCloudUser(nextUser);

          const shouldHydrateCloud =
            event === "SIGNED_IN" ||
            event === "INITIAL_SESSION" ||
            syncedCloudUserIdRef.current !== nextUser.id;

          if (shouldHydrateCloud && syncedCloudUserIdRef.current !== nextUser.id) {
            syncedCloudUserIdRef.current = nextUser.id;
            setIsCloudSyncing(true);

            void syncSessionWithCloud(nextUser, loadMultiverseState())
              .then((res) => {
                if (!isMountedRef.current) return;
                applyPersistedState(res.state);
                setCloudSyncStatus(res.statusMessage);
                setObserverSession((s) => s + 1);
                setEnigmaSession((s) => s + 1);
              })
              .finally(() => {
                if (isMountedRef.current) {
                  setIsCloudSyncing(false);
                }
              });
          }
          return;
        }

        cloudUserRef.current = null;
        setCloudUser(null);

        if (event === "SIGNED_OUT" || syncedCloudUserIdRef.current !== null) {
          syncedCloudUserIdRef.current = null;
          const current = loadMultiverseState();
          if (current.observerProfile.authMode === "supabase") {
            const revertedProfile: ObserverProfile = {
              ...current.observerProfile,
              authMode: "local",
              cloudUserId: undefined,
              syncedAt: "",
            };
            const updatedState: MultiversePersistedState = {
              ...current,
              observerProfile: revertedProfile,
            };
            saveMultiverseState(updatedState);
            setObserverProfile(revertedProfile);
          }
          setCloudSyncStatus(
            "OBSERVER SESSION SEVERED // LOCAL VOID VAULT ACTIVE"
          );
        }
      }
    );

    return () => {
      isMountedRef.current = false;
      cancelAnimationFrame(rafId);
      authListener.subscription.unsubscribe();
    };
  }, [applyPersistedState]);

  useEffect(() => {
    return () => {
      if (bornTimerRef.current !== null) {
        clearTimeout(bornTimerRef.current);
      }
    };
  }, []);

  const allNodes = useMemo(
    () => [...REALITY_NODES, ...customNodes],
    [customNodes]
  );

  const allLinks = useMemo(
    () => [...SYNAPTIC_LINKS, ...customLinks],
    [customLinks]
  );

  const selectedReality =
    allNodes.find((node) => node.id === selectedRealityId) ?? null;

  const hoveredReality =
    allNodes.find((node) => node.id === hoveredRealityId) ?? null;

  // Hovering an orb previews its spectral hue smoothly; otherwise hold selected reality or default violet
  const targetSpectrum =
    (hoveredReality ?? selectedReality)?.spectrum ??
    DEFAULT_OBSERVATORY_SPECTRUM;

  useEffect(() => {
    if (!isActive) return;
    onSpectrumChange?.(targetSpectrum);
    cosmicAudio.updateDroneSpectrum(targetSpectrum);
  }, [isActive, targetSpectrum, onSpectrumChange]);

  const handleToggleSelectReality = useCallback((realityId: string | null) => {
    setSelectedRealityId((prev) =>
      realityId !== null && prev === realityId ? null : realityId
    );
  }, []);

  const handleDirectSelectReality = useCallback((realityId: string) => {
    setSelectedRealityId(realityId);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedRealityId(null);
  }, []);

  const handleOpenEnigma = useCallback(() => {
    setEnigmaSession((s) => s + 1);
    setIsObserverOpen(false);
    setIsForgeOpen(false);
    setIsCompareOpen(false);
    setIsEnigmaOpen(true);
  }, []);

  const handleToggleEnigma = useCallback(() => {
    setIsEnigmaOpen((prev) => {
      if (!prev) {
        setEnigmaSession((s) => s + 1);
        setIsObserverOpen(false);
        setIsForgeOpen(false);
        setIsCompareOpen(false);
      }
      return !prev;
    });
  }, []);

  const handleCloseEnigma = useCallback(() => {
    setIsEnigmaOpen(false);
  }, []);

  const handleOpenBreach = useCallback(() => {
    if (!selectedRealityId) return;
    setHoveredRealityId(null);
    setIsObserverOpen(false);
    setIsCompareOpen(false);
    cosmicAudio.playBreachTransition();
    setBreachSession((session) => session + 1);
    setIsBreachOpen(true);
  }, [selectedRealityId]);

  const handleCloseBreach = useCallback(() => {
    setIsBreachOpen(false);
  }, []);

  const persistCustomRealities = useCallback(
    (nodesToSave: RealityNode[], linksToSave: SynapticLink[]) => {
      const saved = saveCustomRealities(nodesToSave, linksToSave);
      void pushSnapshotToCloud(saved);
    },
    [pushSnapshotToCloud]
  );

  const scheduleNewlyBornHighlight = useCallback((nodeId: string) => {
    setNewlyBornId(nodeId);
    if (bornTimerRef.current !== null) {
      clearTimeout(bornTimerRef.current);
    }
    bornTimerRef.current = setTimeout(() => {
      setNewlyBornId((curr) => (curr === nodeId ? null : curr));
      bornTimerRef.current = null;
    }, 4500);
  }, []);

  const handleOpenForge = useCallback(() => {
    setHoveredRealityId(null);
    setIsEnigmaOpen(false);
    setIsBreachOpen(false);
    setIsObserverOpen(false);
    setIsCompareOpen(false);
    setForgeSession((s) => s + 1);
    setIsForgeOpen(true);
  }, []);

  const handleCloseForge = useCallback(() => {
    setIsForgeOpen(false);
  }, []);

  const handleOpenCompare = useCallback(() => {
    setHoveredRealityId(null);
    setIsEnigmaOpen(false);
    setIsBreachOpen(false);
    setIsForgeOpen(false);
    setIsObserverOpen(false);
    cosmicAudio.playOrbHover();
    setCompareSession((s) => s + 1);
    setIsCompareOpen(true);
  }, []);

  const handleCloseCompare = useCallback(() => {
    setIsCompareOpen(false);
  }, []);

  const handleEnterBreachFromCompare = useCallback((realityId: string) => {
    setIsCompareOpen(false);
    setHoveredRealityId(null);
    setSelectedRealityId(realityId);
    cosmicAudio.playBreachTransition();
    setBreachSession((session) => session + 1);
    setIsBreachOpen(true);
  }, []);

  const handleOpenObserver = useCallback(() => {
    setHoveredRealityId(null);
    setIsEnigmaOpen(false);
    setIsBreachOpen(false);
    setIsForgeOpen(false);
    setIsCompareOpen(false);
    setObserverSession((s) => s + 1);
    setIsObserverOpen(true);
  }, []);

  const handleCloseObserver = useCallback(() => {
    setIsObserverOpen(false);
  }, []);

  const handleProfileSynchronized = useCallback(
    (nextProfile: ObserverProfile) => {
      setObserverProfile(nextProfile);
      const saved = saveObserverProfile(nextProfile);
      void pushSnapshotToCloud(saved);
    },
    [pushSnapshotToCloud]
  );

  const handleForceCloudSync = useCallback(async () => {
    const activeUser = cloudUserRef.current;
    if (!activeUser) return;
    setIsCloudSyncing(true);
    try {
      const res = await syncSessionWithCloud(
        activeUser,
        loadMultiverseState(),
        { forceCloudPush: true }
      );
      if (!isMountedRef.current) return;
      applyPersistedState(res.state);
      setCloudSyncStatus(res.statusMessage);
    } finally {
      if (isMountedRef.current) {
        setIsCloudSyncing(false);
      }
    }
  }, [applyPersistedState]);

  const handleSignOut = useCallback(async () => {
    const supabase = getSupabaseClient();
    syncedCloudUserIdRef.current = null;
    cloudUserRef.current = null;
    if (supabase) {
      await supabase.auth.signOut().catch(() => undefined);
    }
    if (!isMountedRef.current) return;
    setCloudUser(null);
    const current = loadMultiverseState();
    const localProfile: ObserverProfile = {
      ...current.observerProfile,
      observerHandle: "GUEST-01",
      authMode: "local",
      cloudUserId: undefined,
      syncedAt: "",
    };
    const nextState: MultiversePersistedState = {
      ...current,
      observerProfile: localProfile,
    };
    saveMultiverseState(nextState);
    setObserverProfile(localProfile);
    setCloudSyncStatus("SIGNED OUT // LOCAL VOID VAULT ACTIVE");
  }, []);

  const handleEchoesChange = useCallback(
    (realityKey: string, nextEchoes: EnigmaEcho[]) => {
      setEchoHistoryByReality((prev) => ({
        ...prev,
        [realityKey]: nextEchoes,
      }));
      const saved = saveEchoHistoryForReality(realityKey, nextEchoes);
      void pushSnapshotToCloud(saved);
    },
    [pushSnapshotToCloud]
  );

  const handleImportArtifact = useCallback(
    (imported: MultiversePersistedState) => {
      applyPersistedState(imported);
      setSelectedRealityId(imported.customRealities[0]?.id ?? "omega-01");
      setEnigmaSession((s) => s + 1);
      void pushSnapshotToCloud(imported);
    },
    [applyPersistedState, pushSnapshotToCloud]
  );

  const handlePurgeMultiverse = useCallback(() => {
    const cleanState = purgeCustomMultiverse();
    applyPersistedState(cleanState);
    setSelectedRealityId((curr) =>
      REALITY_NODES.some((n) => n.id === curr) ? curr : null
    );
    setHoveredRealityId(null);
    setNewlyBornId(null);
    setEnigmaSession((s) => s + 1);
    void pushSnapshotToCloud(cleanState);
  }, [applyPersistedState, pushSnapshotToCloud]);

  const handleBaselineChange = useCallback(
    (nextBaseline: string) => {
      const current = loadMultiverseState();
      const updatedProfile: ObserverProfile = {
        ...current.observerProfile,
        baselineContext: nextBaseline,
      };
      setObserverProfile(updatedProfile);
      const saved = saveObserverProfile(updatedProfile);
      void pushSnapshotToCloud(saved);
    },
    [pushSnapshotToCloud]
  );

  const appendOrRotateCustomNode = useCallback(
    (node: RealityNode, link: SynapticLink) => {
      let baseNodes = customNodes;
      let baseLinks = customLinks;
      let nextNode = node;
      let nextLink = link;

      if (baseNodes.length >= MAX_CUSTOM_REALITIES) {
        const evictedId = baseNodes[0].id;
        baseNodes = baseNodes.slice(1);
        baseLinks = baseLinks.filter(
          (l) => l.sourceId !== evictedId && l.targetId !== evictedId
        );
        if (nextLink.sourceId === evictedId) {
          nextNode = { ...nextNode, parentNodeId: "omega-01" };
          nextLink = {
            ...nextLink,
            id: `link-omega-01-${nextNode.id}`,
            sourceId: "omega-01",
          };
        }
      }

      const nextCustomNodes = [...baseNodes, nextNode];
      const nextCustomLinks = [...baseLinks, nextLink];
      setCustomNodes(nextCustomNodes);
      setCustomLinks(nextCustomLinks);
      persistCustomRealities(nextCustomNodes, nextCustomLinks);
      return nextNode;
    },
    [customNodes, customLinks, persistCustomRealities]
  );

  const handleTimelineForged = useCallback(
    (branch: PersonalTimelineBranch, enterBreachImmediately: boolean) => {
      const parentReality =
        allNodes.find((n) => n.id === selectedRealityId) ??
        allNodes.find((n) => n.id === "omega-01") ??
        null;

      const { node, link } = createPersonalTimelineNode(
        branch,
        parentReality,
        allNodes,
        customNodes.length + 1
      );

      const savedNode = appendOrRotateCustomNode(node, link);

      setIsForgeOpen(false);
      setIsEnigmaOpen(false);
      setHoveredRealityId(null);
      setSelectedRealityId(savedNode.id);
      scheduleNewlyBornHighlight(savedNode.id);
      cosmicAudio.playBreachTransition();

      if (enterBreachImmediately) {
        setBreachSession((session) => session + 1);
        setIsBreachOpen(true);
      }
    },
    [
      allNodes,
      customNodes.length,
      selectedRealityId,
      appendOrRotateCustomNode,
      scheduleNewlyBornHighlight,
    ]
  );

  const handleBreachDecision = useCallback(
    (mutatedBranch: PersonalTimelineBranch) => {
      const parentReality =
        allNodes.find((n) => n.id === selectedRealityId) ?? null;

      const { node, link } = createPersonalTimelineNode(
        mutatedBranch,
        parentReality,
        allNodes,
        customNodes.length + 1
      );

      const savedNode = appendOrRotateCustomNode(node, link);
      setSelectedRealityId(savedNode.id);
      scheduleNewlyBornHighlight(savedNode.id);
      cosmicAudio.playBreachTransition();
    },
    [
      allNodes,
      customNodes.length,
      selectedRealityId,
      appendOrRotateCustomNode,
      scheduleNewlyBornHighlight,
    ]
  );

  const handleCrystallizeDivergence = useCallback(
    (payload: CrystallizeDivergencePayload) => {
      const parentReality =
        allNodes.find((n) => n.id === payload.parentRealityId) ?? null;

      const { node, link } = synthesizeCustomRealityNode({
        hypothesis: payload.hypothesis,
        transmission: payload.transmission,
        telemetry: payload.telemetry,
        parentReality,
        existingNodes: allNodes,
        customIndex: Math.min(MAX_CUSTOM_REALITIES, customNodes.length + 1),
      });

      const savedNode = appendOrRotateCustomNode(node, link);

      setIsEnigmaOpen(false);
      setIsBreachOpen(false);
      setHoveredRealityId(null);
      setSelectedRealityId(savedNode.id);
      scheduleNewlyBornHighlight(savedNode.id);
    },
    [
      allNodes,
      customNodes.length,
      appendOrRotateCustomNode,
      scheduleNewlyBornHighlight,
    ]
  );

  const handleExit = useCallback(() => {
    setIsEnigmaOpen(false);
    setIsBreachOpen(false);
    setIsForgeOpen(false);
    setIsCompareOpen(false);
    setIsObserverOpen(false);
    setSelectedRealityId(null);
    setHoveredRealityId(null);
    setNewlyBornId(null);
    onSpectrumChange?.(DEFAULT_OBSERVATORY_SPECTRUM);
    onEnigmaStateChange?.("idle");
    onExitGateway();
  }, [onExitGateway, onSpectrumChange, onEnigmaStateChange]);

  const isObservatoryLayerInteractive =
    isActive &&
    !isEnigmaOpen &&
    !isBreachOpen &&
    !isForgeOpen &&
    !isCompareOpen &&
    !isObserverOpen;

  return (
    <section
      aria-label="Cosmic Observatory"
      aria-hidden={!isActive}
      inert={!isActive || undefined}
      className={`fixed inset-0 z-20 flex flex-col justify-between items-center transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity motion-reduce:transform-none ${
        isActive
          ? "opacity-100 scale-100 delay-150 pointer-events-auto"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* Floating Translucent Navigation Capsule */}
      <div
        inert={isBreachOpen || isForgeOpen || isCompareOpen || isObserverOpen || undefined}
        className={`w-full transition-opacity duration-500 ${
          isBreachOpen || isForgeOpen || isCompareOpen || isObserverOpen
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
      >
        <ObservatoryNavbar
          nodes={allNodes}
          selectedRealityId={selectedRealityId}
          onSelectReality={handleToggleSelectReality}
          onHoverReality={setHoveredRealityId}
          onOpenEnigma={handleToggleEnigma}
          onOpenForge={handleOpenForge}
          onOpenCompare={handleOpenCompare}
          onOpenObserver={handleOpenObserver}
          observerHandle={observerProfile.observerHandle}
          isEnigmaOpen={isEnigmaOpen}
          isCompareOpen={isCompareOpen}
          isObserverOpen={isObserverOpen}
          onExitGateway={handleExit}
          isInteractive={isObservatoryLayerInteractive}
        />
      </div>

      {/* Interactive Multiverse Network Stage */}
      <div
        className={`relative flex-1 w-full flex flex-col items-center justify-center px-4 sm:px-8 overflow-visible transition-opacity duration-700 ${
          isBreachOpen
            ? "opacity-0 pointer-events-none"
            : isEnigmaOpen || isForgeOpen || isCompareOpen || isObserverOpen
              ? "opacity-15 pointer-events-none"
              : "opacity-100"
        }`}
      >
        <RealityConstellation
          nodes={allNodes}
          links={allLinks}
          selectedId={selectedRealityId}
          hoveredId={hoveredRealityId}
          newlyBornId={newlyBornId}
          onSelect={(id) => handleToggleSelectReality(id)}
          onHover={setHoveredRealityId}
          isInteractive={isObservatoryLayerInteractive}
        />

        {/* Quiet Guidance Prompt + Personal Life-Choice Multiverse Portal */}
        <div
          className={`mt-1 sm:mt-2 flex flex-col items-center gap-2.5 transition-opacity duration-500 ${
            selectedReality ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <p className="pointer-events-none font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] tracking-[0.26em] text-[#9F95B3]/75 uppercase text-center">
            SELECT A REALITY ORB TO INSPECT ITS TIMELINE — OR FORGE A PERSONAL LIFE DIVERGENCE
          </p>
          <button
            type="button"
            tabIndex={isObservatoryLayerInteractive && !selectedReality ? 0 : -1}
            onClick={handleOpenForge}
            className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#0C071E]/85 hover:bg-[#190F3C]/95 border border-[#38BDF8]/50 hover:border-[#F6F3FE]/85 font-[family-name:var(--font-jetbrains-mono)] text-[10px] sm:text-[11px] tracking-[0.22em] text-[#F6F3FE] uppercase shadow-[0_0_26px_rgba(56,189,248,0.28)] hover:shadow-[0_0_36px_rgba(194,176,255,0.45)] transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#38BDF8]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] group-hover:bg-[#F6F3FE] animate-pulse shadow-[0_0_10px_#38BDF8]" />
            <span>[ + SIMULATE LIFE CHOICE {"//"} FORGE TIMELINE ]</span>
          </button>
        </div>
      </div>

      {/* Ethereal Right-Sanctuary Reality Deep-Dive Overlay */}
      <RealityInspector
        reality={selectedReality}
        allNodes={allNodes}
        allLinks={allLinks}
        onClose={handleClearSelection}
        onSelectReality={handleDirectSelectReality}
        onCommune={handleOpenEnigma}
        onEnterBreach={handleOpenBreach}
        onForgeBranchFromHere={handleOpenForge}
        isObservatoryActive={isObservatoryLayerInteractive}
      />

      {/* Subtle Bottom Cosmic Telemetry Horizon */}
      <footer
        className={`pointer-events-none w-full flex items-center justify-between px-4 sm:px-8 pb-4 sm:pb-5 font-[family-name:var(--font-jetbrains-mono)] text-[8px] sm:text-[9px] tracking-[0.26em] text-[#9F95B3]/55 uppercase transition-opacity duration-500 ${
          isEnigmaOpen || isBreachOpen || isForgeOpen || isCompareOpen || isObserverOpen
            ? "opacity-0"
            : "opacity-100"
        }`}
      >
        <span>SYNAPTIC MATRIX {"//"} {allNodes.length} REALITIES ONLINE</span>
        <span className="hidden sm:inline">COSMIC OBSERVATORY {"//"} NEXUS</span>
        <span>
          {selectedReality
            ? `FOCUS // ${selectedReality.code}`
            : `OBSERVER // ${observerProfile.observerHandle}`}
        </span>
      </footer>

      {/* Interactive Dimensional Breach Simulation Viewport */}
      {selectedReality && (
        <RealityBreachView
          key={`breach-${breachSession}`}
          reality={selectedReality}
          isOpen={isActive && isBreachOpen}
          isEnigmaOpen={isEnigmaOpen}
          onExitBreach={handleCloseBreach}
          onSummonEnigma={handleToggleEnigma}
          onSpectrumChange={onSpectrumChange}
          onBranchDecision={handleBreachDecision}
        />
      )}

      {/* Personal Life-Choice Multiverse Divergence Forger */}
      <ForgeTimelineModal
        key={`forge-${forgeSession}`}
        isOpen={isActive && isForgeOpen}
        initialBaseline={observerProfile.baselineContext}
        parentReality={selectedReality}
        customCount={customNodes.length}
        maxCustomCount={MAX_CUSTOM_REALITIES}
        onClose={handleCloseForge}
        onBaselineChange={handleBaselineChange}
        onTimelineForged={handleTimelineForged}
      />

      {/* Quantum Superposition Parallel Life Comparison Matrix */}
      <TimelineComparisonModal
        key={`compare-${compareSession}`}
        isOpen={isActive && isCompareOpen}
        nodes={allNodes}
        selectedRealityId={selectedRealityId}
        onClose={handleCloseCompare}
        onEnterBreachForReality={handleEnterBreachFromCompare}
      />

      {/* Observer Identity Synchronization & Vault Console */}
      <ObserverIdentityModal
        key={`observer-${observerSession}`}
        isOpen={isActive && isObserverOpen}
        observerProfile={observerProfile}
        cloudUser={cloudUser}
        isCloudSyncing={isCloudSyncing}
        cloudSyncStatus={cloudSyncStatus}
        customNodes={customNodes}
        allNodes={allNodes}
        echoHistoryByReality={echoHistoryByReality}
        onClose={handleCloseObserver}
        onProfileSynchronized={handleProfileSynchronized}
        onForceCloudSync={handleForceCloudSync}
        onSignOut={handleSignOut}
        onImportArtifact={handleImportArtifact}
        onPurgeMultiverse={handlePurgeMultiverse}
      />

      {/* Dimensional Communion Interface ("The Enigma") */}
      <EnigmaCommunion
        key={`enigma-${selectedReality?.id ?? "global"}-${enigmaSession}`}
        reality={selectedReality}
        isOpen={isActive && isEnigmaOpen}
        onClose={handleCloseEnigma}
        onPhaseChange={onEnigmaStateChange}
        onCrystallizeDivergence={handleCrystallizeDivergence}
        initialEchoes={
          echoHistoryByReality[selectedReality?.id ?? "global"] ?? []
        }
        onEchoesChange={handleEchoesChange}
        customNodeCount={customNodes.length}
        maxCustomNodes={MAX_CUSTOM_REALITIES}
      />
    </section>
  );
}
