import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import * as api from "@/lib/workspaces";
import { activeWorkspaceStorageKey, type Workspace } from "@/lib/workspaces";

type WorkspaceStatus = "loading" | "ready" | "error";

type WorkspaceContextValue = {
  status: WorkspaceStatus;
  workspaces: Workspace[];
  /** Vald workspace. null bara när listan är tom (eller inte laddad). */
  activeWorkspace: Workspace | null;
  error: string | null;
  /** Byter aktiv workspace. Id som inte finns i serverns lista ignoreras. */
  selectWorkspace: (id: string) => void;
  /** Skapar en workspace och gör den aktiv. */
  createWorkspace: (name: string) => Promise<Workspace>;
  reload: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function readStoredId(userId: string): string | null {
  try {
    return localStorage.getItem(activeWorkspaceStorageKey(userId));
  } catch {
    return null; // t.ex. blockerad lagring i privat läge
  }
}

function storeId(userId: string, id: string) {
  try {
    localStorage.setItem(activeWorkspaceStorageKey(userId), id);
  } catch {
    // Preferensen sparas inte – appen fungerar ändå.
  }
}

function byName(a: Workspace, b: Workspace) {
  return a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
}

/**
 * Workspace-state för EN användare.
 *
 * Monteras med key={userId} (se router.tsx): byts användaren byggs providern om från
 * grunden, så ingen state från en tidigare användare kan finnas kvar. Svar på anrop
 * som startades före ett byte/unmount ignoreras (ignore-flagga och aliveRef).
 */
export function WorkspaceProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [status, setStatus] = useState<WorkspaceStatus>("loading");
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(() => readStoredId(userId));
  const [reloadCount, setReloadCount] = useState(0);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    setStatus("loading");
    setError(null);

    api.fetchWorkspaces().then(
      (list) => {
        if (ignore) return;
        setWorkspaces([...list].sort(byName));
        setStatus("ready");
      },
      (err: unknown) => {
        if (ignore) return;
        setError(err instanceof Error ? err.message : "Could not load workspaces.");
        setStatus("error");
      },
    );

    return () => {
      ignore = true;
    };
  }, [userId, reloadCount]);

  // Sparat id används bara om det finns i listan från servern; annars den första.
  const activeWorkspace = workspaces.find((w) => w.id === activeId) ?? workspaces[0] ?? null;

  const selectWorkspace = useCallback(
    (id: string) => {
      if (!workspaces.some((w) => w.id === id)) return;
      setActiveId(id);
      storeId(userId, id);
    },
    [workspaces, userId],
  );

  const createWorkspace = useCallback(
    async (name: string) => {
      const created = await api.createWorkspace(name);
      // Providern kan ha avmonterats (utloggning/byte av användare) medan anropet pågick.
      if (aliveRef.current) {
        setWorkspaces((prev) => [...prev.filter((w) => w.id !== created.id), created].sort(byName));
        setActiveId(created.id);
        storeId(userId, created.id);
      }
      return created;
    },
    [userId],
  );

  const reload = useCallback(() => setReloadCount((n) => n + 1), []);

  const value: WorkspaceContextValue = {
    status,
    workspaces,
    activeWorkspace,
    error,
    selectWorkspace,
    createWorkspace,
    reload,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return ctx;
}
