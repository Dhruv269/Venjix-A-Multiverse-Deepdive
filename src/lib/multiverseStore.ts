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
  return raw
    .filter(
      (n): n is RealityNode =>
        Boolean(n) &&
        typeof n === "object" &&
        typeof (n as RealityNode).id === "string" &&
        typeof (n as RealityNode).code === "string" &&
        typeof (n as RealityNode).x === "number" &&
        typeof (n as RealityNode).y === "number" &&
        Array.isArray((n as RealityNode).spectrum) &&
        (n as RealityNode).spectrum.length === 3
    )
    .slice(-MAX_CUSTOM_REALITIES);
}

function sanitizeLinks(raw: unknown, validIds: Set<string>): SynapticLink[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (l): l is SynapticLink =>
      Boolean(l) &&
      typeof l === "object" &&
      typeof (l as SynapticLink).id === "string" &&
      validIds.has((l as SynapticLink).sourceId) &&
      validIds.has((l as SynapticLink).targetId)
  );
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
    email: typeof obj.email === "string" && obj.email.trim() ? obj.email.trim() : undefined,
    baselineContext,
    authMode: obj.authMode === "supabase" ? "supabase" : "local",
    syncedAt: typeof obj.syncedAt === "string" ? obj.syncedAt : "",
    cloudUserId: typeof obj.cloudUserId === "string" ? obj.cloudUserId : undefined,
    passportSignature:
      typeof obj.passportSignature === "string" ? obj.passportSignature : undefined,
  };
}

/**
 * Loads the persisted Multiverse state cleanly on the client, migrating any
 * prior sessionStorage nodes/baseline once when localStorage is empty.
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
      const validIds = new Set([
        ...REALITY_NODES.map((n) => n.id),
        ...customRealities.map((n) => n.id),
      ]);
      const customLinks = sanitizeLinks(parsed.customLinks, validIds);
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

    // One-time graceful migration from legacy sessionStorage keys if present
    const nextState = createEmptyState();
    const legacyBaseline = window.sessionStorage.getItem(USER_BASELINE_STORAGE_KEY);
    if (legacyBaseline && legacyBaseline.trim()) {
      nextState.observerProfile.baselineContext = legacyBaseline.trim().slice(0, 320);
    }
    const legacyNodesRaw = window.sessionStorage.getItem(CUSTOM_REALITIES_STORAGE_KEY);
    if (legacyNodesRaw) {
      const parsedLegacy = JSON.parse(legacyNodesRaw) as {
        nodes?: unknown;
        links?: unknown;
      };
      nextState.customRealities = sanitizeCustomNodes(parsedLegacy.nodes);
      const validIds = new Set([
        ...REALITY_NODES.map((n) => n.id),
        ...nextState.customRealities.map((n) => n.id),
      ]);
      nextState.customLinks = sanitizeLinks(parsedLegacy.links, validIds);
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
  const next: MultiversePersistedState = {
    ...current,
    customRealities: customRealities.slice(-MAX_CUSTOM_REALITIES),
    customLinks,
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

/* ============================================================================
 * Observer Passport / Optional Supabase Cloud Synchronization
 * ========================================================================== */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
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

export interface ObserverSyncResult {
  profile: ObserverProfile;
  statusMessage: string;
}

export async function authenticateAndSyncObserver(params: {
  handle: string;
  baselineContext: string;
  email?: string;
  passkey?: string;
  stateSnapshot: MultiversePersistedState;
}): Promise<ObserverSyncResult> {
  const cleanHandle =
    params.handle.trim().toUpperCase().slice(0, 24) || "GUEST-01";
  const cleanBaseline =
    params.baselineContext.trim().slice(0, 320) ||
    DEFAULT_OBSERVER_PROFILE.baselineContext;
  const cleanEmail = params.email?.trim() || undefined;
  const cleanPasskey = params.passkey?.trim() || "";
  const nowIso = new Date().toISOString();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()?.replace(
    /\/$/,
    ""
  );
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (supabaseUrl && supabaseKey && cleanEmail && cleanPasskey.length >= 6) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      // Attempt sign-in with Supabase REST Auth first
      let authRes = await fetch(
        `${supabaseUrl}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
          },
          body: JSON.stringify({ email: cleanEmail, password: cleanPasskey }),
        }
      );

      // If account doesn't exist yet, attempt REST sign-up transparently
      if (!authRes.ok) {
        authRes = await fetch(`${supabaseUrl}/auth/v1/signup`, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
          },
          body: JSON.stringify({
            email: cleanEmail,
            password: cleanPasskey,
            data: { observer_handle: cleanHandle },
          }),
        });
      }

      if (authRes.ok) {
        const authData = (await authRes.json()) as {
          access_token?: string;
          user?: { id?: string };
        };
        const userId = authData.user?.id;
        const accessToken = authData.access_token;

        // Best-effort cloud state upsert into `venjix_multiverse_states` table if created
        if (userId && accessToken) {
          await fetch(`${supabaseUrl}/rest/v1/venjix_multiverse_states`, {
            method: "POST",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
              apikey: supabaseKey,
              Authorization: `Bearer ${accessToken}`,
              Prefer: "resolution=merge-duplicates",
            },
            body: JSON.stringify({
              user_id: userId,
              observer_handle: cleanHandle,
              state_json: {
                ...params.stateSnapshot,
                observerProfile: {
                  observerHandle: cleanHandle,
                  email: cleanEmail,
                  baselineContext: cleanBaseline,
                  authMode: "supabase",
                  syncedAt: nowIso,
                  cloudUserId: userId,
                },
              },
              updated_at: nowIso,
            }),
          }).catch(() => undefined);
        }

        const cloudProfile: ObserverProfile = {
          observerHandle: cleanHandle,
          email: cleanEmail,
          baselineContext: cleanBaseline,
          authMode: "supabase",
          syncedAt: nowIso,
          cloudUserId: userId,
          passportSignature: computeLocalPassportSignature(
            `${cleanHandle}|${cleanEmail}|${userId ?? nowIso}`
          ),
        };
        saveObserverProfile(cloudProfile);
        return {
          profile: cloudProfile,
          statusMessage:
            "SUPABASE OBSERVER SYNCHRONIZED // CLOUD LINK ESTABLISHED",
        };
      }
    } catch {
      // Gracefully fall back to persistent local Observer Passport below
    } finally {
      clearTimeout(timeout);
    }
  }

  const localProfile: ObserverProfile = {
    observerHandle: cleanHandle,
    email: cleanEmail,
    baselineContext: cleanBaseline,
    authMode: "local",
    syncedAt: nowIso,
    passportSignature: computeLocalPassportSignature(
      `${cleanHandle}|${cleanEmail ?? "local"}|${cleanPasskey || "void"}`
    ),
  };
  saveObserverProfile(localProfile);

  return {
    profile: localProfile,
    statusMessage: supabaseUrl
      ? "LOCAL OBSERVER PASSPORT SEALED (ENTER VALID EMAIL + 6-CHAR PASSKEY FOR CLOUD SYNC)"
      : "LOCAL OBSERVER PASSPORT SEALED // STORED IN PERSISTENT VOID VAULT",
  };
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
    const validIds = new Set([
      ...REALITY_NODES.map((n) => n.id),
      ...customRealities.map((n) => n.id),
    ]);
    const customLinks = sanitizeLinks(parsed.customLinks, validIds);
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

