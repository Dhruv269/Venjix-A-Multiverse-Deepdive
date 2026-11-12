import type { User } from "@supabase/supabase-js";
import type { EnigmaEcho } from "@/components/observatory/enigmaEngine";
import {
  CUSTOM_REALITIES_STORAGE_KEY,
  MAX_CUSTOM_REALITIES,
  REALITY_NODES,
  RealityNode,
  SynapticLink,
  USER_BASELINE_STORAGE_KEY,
} from "@/components/observatory/realityData";
import type { ObserverProfile } from "@/lib/multiverse/types";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabaseClient";

export { isSupabaseConfigured };

export const MULTIVERSE_STORE_KEY = "venjix_multiverse_store_v1";

export const DEFAULT_OBSERVER_PROFILE: ObserverProfile = {
  observerHandle: "GUEST-01",
  baselineContext:
    "18-year-old CS engineering student building software & AI products",
  authMode: "local",
  syncedAt: "",
};

export interface MultiversePersistedState {
  version: 1;
  customRealities: RealityNode[];
  customLinks: SynapticLink[];
  echoHistoryByReality: Record<string, EnigmaEcho[]>;
  observerProfile: ObserverProfile;
}

export interface MultiverseArtifactPayload {
  format: "VENJIX-MULTIVERSE-ARTIFACT-V1";
  exportedAt: string;
  observerProfile: ObserverProfile;
  customRealities: RealityNode[];
  customLinks: SynapticLink[];
  echoHistoryByReality: Record<string, EnigmaEcho[]>;
}

function createEmptyState(): MultiversePersistedState {
  return {
    version: 1,
    customRealities: [],
    customLinks: [],
    echoHistoryByReality: {},
    observerProfile: { ...DEFAULT_OBSERVER_PROFILE },
  };
}

function sanitizeCustomNodes(raw: unknown): RealityNode[] {
  if (!Array.isArray(raw)) return [];
  const seenIds = new Set<string>();
  const valid: RealityNode[] = [];

  for (const item of raw) {
    if (
      item &&
      typeof item === "object" &&
      typeof (item as RealityNode).id === "string" &&
      typeof (item as RealityNode).code === "string" &&
      typeof (item as RealityNode).x === "number" &&
      typeof (item as RealityNode).y === "number" &&
      Array.isArray((item as RealityNode).spectrum) &&
      (item as RealityNode).spectrum.length === 3
    ) {
      const node = item as RealityNode;
      if (!seenIds.has(node.id)) {
        seenIds.add(node.id);
        valid.push(node);
      }
    }
  }

  return valid.slice(-MAX_CUSTOM_REALITIES);
}

function sanitizeLinks(raw: unknown, validIds: Set<string>): SynapticLink[] {
  if (!Array.isArray(raw)) return [];
  const seenIds = new Set<string>();
  const clean: SynapticLink[] = [];

  for (const item of raw) {
    if (
      item &&
      typeof item === "object" &&
      typeof (item as SynapticLink).id === "string" &&
      validIds.has((item as SynapticLink).sourceId) &&
      validIds.has((item as SynapticLink).targetId)
    ) {
      const link = item as SynapticLink;
      if (!seenIds.has(link.id)) {
        seenIds.add(link.id);
        clean.push(link);
      }
    }
  }

  return clean;
}

function ensureCustomLinksForNodes(
  customRealities: RealityNode[],
  existingLinks: SynapticLink[]
): SynapticLink[] {
  const validIds = new Set([
    ...REALITY_NODES.map((n) => n.id),
    ...customRealities.map((n) => n.id),
  ]);
  const clean = sanitizeLinks(existingLinks, validIds);
  const linkedTargets = new Set(clean.map((l) => l.targetId));

  customRealities.forEach((node, idx) => {
    if (linkedTargets.has(node.id)) return;
    const parentId =
      node.parentNodeId && validIds.has(node.parentNodeId)
        ? node.parentNodeId
        : "omega-01";
    clean.push({
      id: `link-${parentId}-${node.id}`,
      sourceId: parentId,
      targetId: node.id,
      curveOffset: idx % 2 === 0 ? -36 : 36,
      pulseDurationSec: 4.2,
      pulseDelaySec: 0.25,
    });
  });

  return clean;
}

function sanitizeEchoMap(raw: unknown): Record<string, EnigmaEcho[]> {
  if (!raw || typeof raw !== "object") return {};
  const record = raw as Record<string, unknown>;
  const clean: Record<string, EnigmaEcho[]> = {};
  for (const [key, list] of Object.entries(record)) {
    if (!Array.isArray(list)) continue;
    const valid = list
      .filter(
        (entry): entry is EnigmaEcho =>
          Boolean(entry) &&
          typeof entry === "object" &&
          typeof (entry as EnigmaEcho).id === "string" &&
          typeof (entry as EnigmaEcho).query === "string" &&
          typeof (entry as EnigmaEcho).response === "string" &&
          typeof (entry as EnigmaEcho).indexLabel === "string"
      )
      .slice(-24);
    if (valid.length > 0) {
      clean[key] = valid;
    }
  }
  return clean;
}

function sanitizeObserverProfile(raw: unknown): ObserverProfile {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_OBSERVER_PROFILE };
  }
  const obj = raw as Record<string, unknown>;
  const handle =
    typeof obj.observerHandle === "string" && obj.observerHandle.trim()
      ? obj.observerHandle.trim().toUpperCase().slice(0, 24)
      : DEFAULT_OBSERVER_PROFILE.observerHandle;
  const baselineContext =
    typeof obj.baselineContext === "string" && obj.baselineContext.trim()
      ? obj.baselineContext.trim().slice(0, 320)
      : DEFAULT_OBSERVER_PROFILE.baselineContext;

  return {
    observerHandle: handle,
    email:
      typeof obj.email === "string" && obj.email.trim()
        ? obj.email.trim()
        : undefined,
    baselineContext,
    authMode: obj.authMode === "supabase" ? "supabase" : "local",
    syncedAt: typeof obj.syncedAt === "string" ? obj.syncedAt : "",
    cloudUserId: typeof obj.cloudUserId === "string" ? obj.cloudUserId : undefined,
    passportSignature:
      typeof obj.passportSignature === "string" ? obj.passportSignature : undefined,
  };
}

/**
 * Loads persisted Multiverse state from localStorage, migrating prior
 * sessionStorage entries once when localStorage is empty.
 */
export function loadMultiverseState(): MultiversePersistedState {
  if (typeof window === "undefined") {
    return createEmptyState();
  }

  try {
    const raw = window.localStorage.getItem(MULTIVERSE_STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const customRealities = sanitizeCustomNodes(parsed.customRealities);
      const customLinks = ensureCustomLinksForNodes(
        customRealities,
        Array.isArray(parsed.customLinks)
          ? (parsed.customLinks as SynapticLink[])
          : []
      );
      const echoHistoryByReality = sanitizeEchoMap(parsed.echoHistoryByReality);
      const observerProfile = sanitizeObserverProfile(parsed.observerProfile);

      return {
        version: 1,
        customRealities,
        customLinks,
        echoHistoryByReality,
        observerProfile,
      };
    }

    const nextState = createEmptyState();
    const legacyBaseline = window.sessionStorage.getItem(
      USER_BASELINE_STORAGE_KEY
    );
    if (legacyBaseline && legacyBaseline.trim()) {
      nextState.observerProfile.baselineContext = legacyBaseline
        .trim()
        .slice(0, 320);
    }
    const legacyNodesRaw = window.sessionStorage.getItem(
      CUSTOM_REALITIES_STORAGE_KEY
    );
    if (legacyNodesRaw) {
      const parsedLegacy = JSON.parse(legacyNodesRaw) as {
        nodes?: unknown;
        links?: unknown;
      };
      nextState.customRealities = sanitizeCustomNodes(parsedLegacy.nodes);
      nextState.customLinks = ensureCustomLinksForNodes(
        nextState.customRealities,
        Array.isArray(parsedLegacy.links)
          ? (parsedLegacy.links as SynapticLink[])
          : []
      );
    }

    if (nextState.customRealities.length > 0 || legacyBaseline) {
      saveMultiverseState(nextState);
    }
    return nextState;
  } catch {
    return createEmptyState();
  }
}

export function saveMultiverseState(state: MultiversePersistedState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MULTIVERSE_STORE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota or private browsing restrictions
  }
}

export function saveCustomRealities(
  customRealities: RealityNode[],
  customLinks: SynapticLink[]
): MultiversePersistedState {
  const current = loadMultiverseState();
  const capped = customRealities.slice(-MAX_CUSTOM_REALITIES);
  const next: MultiversePersistedState = {
    ...current,
    customRealities: capped,
    customLinks: ensureCustomLinksForNodes(capped, customLinks),
  };
  saveMultiverseState(next);
  return next;
}

export function saveEchoHistoryForReality(
  realityId: string,
  echoes: EnigmaEcho[]
): MultiversePersistedState {
  const current = loadMultiverseState();
  const cleanKey = realityId.trim() || "global";
  const nextMap = { ...current.echoHistoryByReality };
  if (echoes.length > 0) {
    nextMap[cleanKey] = echoes.slice(-24);
  } else {
    delete nextMap[cleanKey];
  }
  const next: MultiversePersistedState = {
    ...current,
    echoHistoryByReality: nextMap,
  };
  saveMultiverseState(next);
  return next;
}

export function saveObserverProfile(
  profile: ObserverProfile
): MultiversePersistedState {
  const current = loadMultiverseState();
  const next: MultiversePersistedState = {
    ...current,
    observerProfile: sanitizeObserverProfile(profile),
  };
  saveMultiverseState(next);
  return next;
}

export function purgeCustomMultiverse(): MultiversePersistedState {
  const current = loadMultiverseState();
  const next: MultiversePersistedState = {
    version: 1,
    customRealities: [],
    customLinks: [],
    echoHistoryByReality: {},
    observerProfile: current.observerProfile,
  };
  saveMultiverseState(next);
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(CUSTOM_REALITIES_STORAGE_KEY);
    } catch {
      // Ignore restricted sessionStorage
    }
  }
  return next;
}

function computeLocalPassportSignature(seedInput: string): string {
  let h1 = 2166136261 >>> 0;
  let h2 = 3735928559 >>> 0;
  for (let i = 0; i < seedInput.length; i += 1) {
    const c = seedInput.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 16777619) >>> 0;
    h2 ^= c + i;
    h2 = Math.imul(h2, 2246822519) >>> 0;
  }
  return `VX-${h1.toString(16).toUpperCase().padStart(8, "0")}-${h2
    .toString(16)
    .toUpperCase()
    .padStart(8, "0")}`;
}

export function saveLocalObserverPassport(params: {
  handle: string;
  baselineContext: string;
  email?: string;
}): ObserverProfile {
  const current = loadMultiverseState().observerProfile;
  const cleanHandle =
    params.handle.trim().toUpperCase().slice(0, 24) || "GUEST-01";
  const cleanBaseline =
    params.baselineContext.trim().slice(0, 320) ||
    DEFAULT_OBSERVER_PROFILE.baselineContext;
  const cleanEmail = params.email?.trim() || current.email;
  const nowIso = new Date().toISOString();

  const updated: ObserverProfile = {
    ...current,
    observerHandle: cleanHandle,
    baselineContext: cleanBaseline,
    email: cleanEmail,
    syncedAt: nowIso,
    passportSignature:
      current.passportSignature ||
      computeLocalPassportSignature(`${cleanHandle}|${cleanEmail ?? "local"}|${nowIso}`),
  };

  saveObserverProfile(updated);
  return updated;
}

/* ============================================================================
 * Real Supabase Cloud Postgres Sync (`public.observer_multiverses`)
 * ========================================================================== */

const OBSERVER_MULTIVERSES_TABLE = "observer_multiverses";
let cachedTableColumns: string[] | null = null;

export function deriveObserverHandleFromUser(
  user: User,
  preferredHandle?: string
): string {
  const cleanPreferred = preferredHandle?.trim().toUpperCase();
  if (cleanPreferred && cleanPreferred !== "GUEST-01") {
    return cleanPreferred.slice(0, 24);
  }

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const rawCandidate =
    (typeof meta.observer_handle === "string" && meta.observer_handle) ||
    (typeof meta.user_name === "string" && meta.user_name) ||
    (typeof meta.preferred_username === "string" && meta.preferred_username) ||
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof user.email === "string" && user.email.split("@")[0]) ||
    "OBSERVER-01";

  const sanitized = rawCandidate
    .toUpperCase()
    .replace(/[^A-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);

  return sanitized || "OBSERVER-01";
}

function isUnknownColumnError(err: { code?: string; message?: string } | null): boolean {
  if (!err) return false;
  if (err.code === "PGRST204" || err.code === "42703") return true;
  const msg = err.message ?? "";
  return (
    /column .* does not exist/i.test(msg) ||
    /could not find the .* column/i.test(msg)
  );
}

function isMissingConflictConstraintError(
  err: { code?: string; message?: string } | null
): boolean {
  if (!err) return false;
  if (err.code === "42P10") return true;
  return /no unique or exclusion constraint matching the ON CONFLICT/i.test(
    err.message ?? ""
  );
}

function buildFullColumnMap(
  user: User,
  state: MultiversePersistedState,
  nowIso: string
): Record<string, unknown> {
  const promotedProfile: ObserverProfile = {
    observerHandle: deriveObserverHandleFromUser(
      user,
      state.observerProfile.observerHandle
    ),
    email: user.email ?? state.observerProfile.email,
    baselineContext:
      state.observerProfile.baselineContext.trim() ||
      DEFAULT_OBSERVER_PROFILE.baselineContext,
    authMode: "supabase",
    syncedAt: nowIso,
    cloudUserId: user.id,
    passportSignature:
      state.observerProfile.passportSignature ??
      computeLocalPassportSignature(`${user.id}|${user.email ?? ""}`),
  };

  const fullEnvelope: MultiversePersistedState = {
    version: 1,
    customRealities: state.customRealities.slice(-MAX_CUSTOM_REALITIES),
    customLinks: ensureCustomLinksForNodes(
      state.customRealities,
      state.customLinks
    ),
    echoHistoryByReality: sanitizeEchoMap(state.echoHistoryByReality),
    observerProfile: promotedProfile,
  };

  return {
    user_id: user.id,
    email: user.email ?? null,
    observer_handle: promotedProfile.observerHandle,
    baseline_context: promotedProfile.baselineContext,
    custom_realities: fullEnvelope.customRealities,
    custom_links: fullEnvelope.customLinks,
    echo_history: fullEnvelope.echoHistoryByReality,
    echo_history_by_reality: fullEnvelope.echoHistoryByReality,
    observer_profile: promotedProfile,
    state_json: fullEnvelope,
    data: fullEnvelope,
    updated_at: nowIso,
  };
}

function pickColumns(
  source: Record<string, unknown>,
  keys: string[]
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in source) {
      out[key] = source[key];
    }
  }
  return out;
}

async function performResilientUpsert(
  userId: string,
  payload: Record<string, unknown>
): Promise<{ error: { code?: string; message?: string } | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { error: { message: "Supabase client unavailable." } };
  }

  const upsertRes = await supabase
    .from(OBSERVER_MULTIVERSES_TABLE)
    .upsert(payload, { onConflict: "user_id" });

  if (!upsertRes.error) {
    return { error: null };
  }

  // Fallback if `user_id` lacks a formal unique index for ON CONFLICT
  if (isMissingConflictConstraintError(upsertRes.error)) {
    const existingRes = await supabase
      .from(OBSERVER_MULTIVERSES_TABLE)
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingRes.data) {
      const updatePayload = { ...payload };
      delete updatePayload.user_id;
      const updateRes = await supabase
        .from(OBSERVER_MULTIVERSES_TABLE)
        .update(updatePayload)
        .eq("user_id", userId);
      return { error: updateRes.error };
    }

    const insertRes = await supabase
      .from(OBSERVER_MULTIVERSES_TABLE)
      .insert(payload);
    return { error: insertRes.error };
  }

  return { error: upsertRes.error };
}

export async function upsertCloudMultiverseState(
  user: User,
  state: MultiversePersistedState
): Promise<{ ok: boolean; syncedAt: string; errorMessage?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      syncedAt: state.observerProfile.syncedAt,
      errorMessage: "Supabase not configured.",
    };
  }

  const nowIso = new Date().toISOString();
  const fullMap = buildFullColumnMap(user, state, nowIso);
  const candidateSchemas: string[][] = cachedTableColumns
    ? [cachedTableColumns]
    : [
        [
          "user_id",
          "observer_handle",
          "baseline_context",
          "custom_realities",
          "custom_links",
          "echo_history",
          "updated_at",
        ],
        [
          "user_id",
          "observer_handle",
          "baseline_context",
          "custom_realities",
          "echo_history",
          "updated_at",
        ],
        [
          "user_id",
          "observer_handle",
          "custom_realities",
          "echo_history",
          "updated_at",
        ],
        ["user_id", "observer_handle", "state_json", "updated_at"],
        ["user_id", "state_json", "updated_at"],
        ["user_id", "data", "updated_at"],
        ["user_id", "custom_realities", "echo_history"],
      ];

  let lastError: string | undefined;

  for (const cols of candidateSchemas) {
    const payload = pickColumns(fullMap, cols);
    const { error } = await performResilientUpsert(user.id, payload);
    if (!error) {
      cachedTableColumns = cols;
      const persisted = loadMultiverseState();
      if (persisted.observerProfile.authMode === "supabase") {
        saveObserverProfile({
          ...persisted.observerProfile,
          syncedAt: nowIso,
          cloudUserId: user.id,
          email: user.email ?? persisted.observerProfile.email,
        });
      }
      return { ok: true, syncedAt: nowIso };
    }

    lastError = error.message;
    if (!isUnknownColumnError(error)) {
      return {
        ok: false,
        syncedAt: state.observerProfile.syncedAt,
        errorMessage: error.message,
      };
    }
    // Cached columns became stale; reset so fallback schemas execute
    cachedTableColumns = null;
  }

  return {
    ok: false,
    syncedAt: state.observerProfile.syncedAt,
    errorMessage:
      lastError || "Unable to match public.observer_multiverses column schema.",
  };
}

function extractCloudStateFromRow(
  row: Record<string, unknown>,
  user: User,
  localFallbackProfile: ObserverProfile
): MultiversePersistedState {
  cachedTableColumns = Object.keys(row).filter(
    (k) => k !== "id" && k !== "created_at"
  );

  const envelopeRaw =
    (row.state_json as Record<string, unknown> | undefined) ??
    (row.state as Record<string, unknown> | undefined) ??
    (row.data as Record<string, unknown> | undefined) ??
    (row.multiverse_state as Record<string, unknown> | undefined) ??
    null;

  const customRealities = sanitizeCustomNodes(
    row.custom_realities ??
      row.customRealities ??
      envelopeRaw?.customRealities
  );

  const rawLinks =
    row.custom_links ?? row.customLinks ?? envelopeRaw?.customLinks;

  const customLinks = ensureCustomLinksForNodes(
    customRealities,
    Array.isArray(rawLinks) ? (rawLinks as SynapticLink[]) : []
  );

  const echoHistoryByReality = sanitizeEchoMap(
    row.echo_history ??
      row.echo_history_by_reality ??
      row.echoHistoryByReality ??
      envelopeRaw?.echoHistoryByReality
  );

  const envelopeProfile =
    (envelopeRaw?.observerProfile as Record<string, unknown> | undefined) ??
    (row.observer_profile as Record<string, unknown> | undefined) ??
    {};

  const rowHandle =
    (typeof row.observer_handle === "string" && row.observer_handle) ||
    (typeof row.observerHandle === "string" && row.observerHandle) ||
    (typeof envelopeProfile.observerHandle === "string" &&
      envelopeProfile.observerHandle) ||
    localFallbackProfile.observerHandle;

  const rowBaseline =
    (typeof row.baseline_context === "string" && row.baseline_context) ||
    (typeof row.baselineContext === "string" && row.baselineContext) ||
    (typeof envelopeProfile.baselineContext === "string" &&
      envelopeProfile.baselineContext) ||
    localFallbackProfile.baselineContext;

  const updatedAt =
    (typeof row.updated_at === "string" && row.updated_at) ||
    (typeof envelopeProfile.syncedAt === "string" && envelopeProfile.syncedAt) ||
    new Date().toISOString();

  const observerProfile: ObserverProfile = {
    observerHandle: deriveObserverHandleFromUser(user, rowHandle),
    email: user.email ?? localFallbackProfile.email,
    baselineContext:
      rowBaseline.trim().slice(0, 320) ||
      DEFAULT_OBSERVER_PROFILE.baselineContext,
    authMode: "supabase",
    syncedAt: updatedAt,
    cloudUserId: user.id,
    passportSignature:
      localFallbackProfile.passportSignature ??
      computeLocalPassportSignature(`${user.id}|${user.email ?? ""}`),
  };

  return {
    version: 1,
    customRealities,
    customLinks,
    echoHistoryByReality,
    observerProfile,
  };
}

function mergeEchoMaps(
  cloudMap: Record<string, EnigmaEcho[]>,
  localMap: Record<string, EnigmaEcho[]>
): { merged: Record<string, EnigmaEcho[]>; hadLocalAdditions: boolean } {
  const merged: Record<string, EnigmaEcho[]> = { ...cloudMap };
  let hadLocalAdditions = false;

  for (const [key, localList] of Object.entries(localMap)) {
    const cloudList = merged[key] ?? [];
    const seen = new Set(cloudList.map((e) => `${e.query}::${e.response}`));
    const combined = [...cloudList];

    for (const item of localList) {
      const sig = `${item.query}::${item.response}`;
      if (!seen.has(sig)) {
        seen.add(sig);
        combined.push(item);
        hadLocalAdditions = true;
      }
    }

    if (combined.length > 0) {
      merged[key] = combined.slice(-24);
    }
  }

  return { merged, hadLocalAdditions };
}

export interface CloudSyncResult {
  state: MultiversePersistedState;
  statusMessage: string;
  source: "cloud-hydrated" | "guest-migrated" | "cloud-merged" | "cloud-error";
}

/**
 * Synchronizes an authenticated Supabase user session against `public.observer_multiverses`:
 * - Hydrates saved cloud realities, echo logs, and observer profile.
 * - Seamlessly migrates/merges any forged Guest realities when signing up or logging in
 *   so local exploration prior to login is never lost.
 */
export async function syncSessionWithCloud(
  user: User,
  localSnapshot: MultiversePersistedState,
  options?: { forceCloudPush?: boolean }
): Promise<CloudSyncResult> {
  const supabase = getSupabaseClient();
  const nowIso = new Date().toISOString();

  const promotedProfile: ObserverProfile = {
    observerHandle: deriveObserverHandleFromUser(
      user,
      localSnapshot.observerProfile.observerHandle
    ),
    email: user.email ?? localSnapshot.observerProfile.email,
    baselineContext:
      localSnapshot.observerProfile.baselineContext.trim() ||
      DEFAULT_OBSERVER_PROFILE.baselineContext,
    authMode: "supabase",
    syncedAt: nowIso,
    cloudUserId: user.id,
    passportSignature:
      localSnapshot.observerProfile.passportSignature ??
      computeLocalPassportSignature(`${user.id}|${user.email ?? ""}`),
  };

  if (!supabase) {
    const fallbackState: MultiversePersistedState = {
      ...localSnapshot,
      observerProfile: promotedProfile,
    };
    saveMultiverseState(fallbackState);
    return {
      state: fallbackState,
      statusMessage: "SUPABASE CLIENT UNAVAILABLE // LOCAL VAULT PRESERVED",
      source: "cloud-error",
    };
  }

  try {
    const { data: row, error } = await supabase
      .from(OBSERVER_MULTIVERSES_TABLE)
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      const preserved: MultiversePersistedState = {
        ...localSnapshot,
        observerProfile: { ...promotedProfile, syncedAt: "" },
      };
      saveMultiverseState(preserved);
      return {
        state: preserved,
        statusMessage: `CLOUD SYNC PAUSED (${error.message}) // LOCAL VAULT INTACT`,
        source: "cloud-error",
      };
    }

    const rowObj =
      row && typeof row === "object"
        ? (row as Record<string, unknown>)
        : null;

    const cloudParsed = rowObj
      ? extractCloudStateFromRow(rowObj, user, promotedProfile)
      : null;

    const hasCloudContent = Boolean(
      cloudParsed &&
        (cloudParsed.customRealities.length > 0 ||
          Object.keys(cloudParsed.echoHistoryByReality).length > 0)
    );
    const hasGuestContent =
      localSnapshot.customRealities.length > 0 ||
      Object.keys(localSnapshot.echoHistoryByReality).length > 0;

    // Case 1: Empty cloud row & user has Guest timelines (or completely brand new account)
    if (!cloudParsed || (!hasCloudContent && hasGuestContent)) {
      const migratedState: MultiversePersistedState = {
        version: 1,
        customRealities: localSnapshot.customRealities.slice(-MAX_CUSTOM_REALITIES),
        customLinks: ensureCustomLinksForNodes(
          localSnapshot.customRealities,
          localSnapshot.customLinks
        ),
        echoHistoryByReality: sanitizeEchoMap(localSnapshot.echoHistoryByReality),
        observerProfile: cloudParsed
          ? {
              ...cloudParsed.observerProfile,
              baselineContext:
                localSnapshot.observerProfile.baselineContext !==
                DEFAULT_OBSERVER_PROFILE.baselineContext
                  ? localSnapshot.observerProfile.baselineContext
                  : cloudParsed.observerProfile.baselineContext,
              syncedAt: nowIso,
            }
          : promotedProfile,
      };
      saveMultiverseState(migratedState);

      const upsertRes = await upsertCloudMultiverseState(user, migratedState);
      if (upsertRes.ok) {
        migratedState.observerProfile.syncedAt = upsertRes.syncedAt;
        saveMultiverseState(migratedState);
      }

      return {
        state: migratedState,
        statusMessage: hasGuestContent
          ? upsertRes.ok
            ? "GUEST TIMELINES MIGRATED TO CLOUD // SUPABASE POSTGRES ACTIVE"
            : `LOCAL TIMELINES KEPT (${upsertRes.errorMessage ?? "SYNC PENDING"})`
          : upsertRes.ok
            ? "CLOUD SYNC ACTIVE // SUPABASE POSTGRES INITIALIZED"
            : `AUTHENTICATED (${upsertRes.errorMessage ?? "SYNC PENDING"})`,
        source: "guest-migrated",
      };
    }

    // Case 2: Cloud data exists — merge any unsynced local Guest nodes if present
    const cloudIds = new Set(cloudParsed.customRealities.map((n) => n.id));
    const localOnlyNodes = localSnapshot.customRealities.filter(
      (n) => !cloudIds.has(n.id)
    );
    const mergedNodes = [
      ...cloudParsed.customRealities,
      ...localOnlyNodes,
    ].slice(-MAX_CUSTOM_REALITIES);
    const mergedLinks = ensureCustomLinksForNodes(mergedNodes, [
      ...cloudParsed.customLinks,
      ...localSnapshot.customLinks,
    ]);
    const { merged: mergedEchoes, hadLocalAdditions } = mergeEchoMaps(
      cloudParsed.echoHistoryByReality,
      localSnapshot.echoHistoryByReality
    );

    const mergedState: MultiversePersistedState = {
      version: 1,
      customRealities: mergedNodes,
      customLinks: mergedLinks,
      echoHistoryByReality: mergedEchoes,
      observerProfile: cloudParsed.observerProfile,
    };

    saveMultiverseState(mergedState);

    if (
      localOnlyNodes.length > 0 ||
      hadLocalAdditions ||
      options?.forceCloudPush
    ) {
      const upsertRes = await upsertCloudMultiverseState(user, mergedState);
      if (upsertRes.ok) {
        mergedState.observerProfile.syncedAt = upsertRes.syncedAt;
        saveMultiverseState(mergedState);
      }
      return {
        state: mergedState,
        statusMessage:
          localOnlyNodes.length > 0 || hadLocalAdditions
            ? "MERGED GUEST EXPLORATION WITH SUPABASE POSTGRES"
            : "CLOUD SYNC VERIFIED // SUPABASE POSTGRES UP TO DATE",
        source: "cloud-merged",
      };
    }

    return {
      state: mergedState,
      statusMessage: `CLOUD MULTIVERSE HYDRATED (${mergedState.customRealities.length} TIMELINES)`,
      source: "cloud-hydrated",
    };
  } catch (err) {
    const preserved: MultiversePersistedState = {
      ...localSnapshot,
      observerProfile: { ...promotedProfile, syncedAt: "" },
    };
    saveMultiverseState(preserved);
    return {
      state: preserved,
      statusMessage: `CLOUD SYNC ERROR (${err instanceof Error ? err.message : "UNKNOWN"})`,
      source: "cloud-error",
    };
  }
}

/* ============================================================================
 * .JSON Constellation Artifact Export / Import
 * ========================================================================== */

export function exportMultiverseArtifactJson(
  state: MultiversePersistedState
): string {
  const payload: MultiverseArtifactPayload = {
    format: "VENJIX-MULTIVERSE-ARTIFACT-V1",
    exportedAt: new Date().toISOString(),
    observerProfile: state.observerProfile,
    customRealities: state.customRealities,
    customLinks: state.customLinks,
    echoHistoryByReality: state.echoHistoryByReality,
  };
  return JSON.stringify(payload, null, 2);
}

export function parseImportedMultiverseArtifact(
  rawJson: string
): MultiversePersistedState | null {
  try {
    const parsed = JSON.parse(rawJson) as Record<string, unknown>;
    if (
      parsed.format !== "VENJIX-MULTIVERSE-ARTIFACT-V1" &&
      !Array.isArray(parsed.customRealities)
    ) {
      return null;
    }

    const customRealities = sanitizeCustomNodes(parsed.customRealities);
    const customLinks = ensureCustomLinksForNodes(
      customRealities,
      Array.isArray(parsed.customLinks)
        ? (parsed.customLinks as SynapticLink[])
        : []
    );
    const echoHistoryByReality = sanitizeEchoMap(parsed.echoHistoryByReality);
    const observerProfile = sanitizeObserverProfile(parsed.observerProfile);

    const next: MultiversePersistedState = {
      version: 1,
      customRealities,
      customLinks,
      echoHistoryByReality,
      observerProfile,
    };
    saveMultiverseState(next);
    return next;
  } catch {
    return null;
  }
}
