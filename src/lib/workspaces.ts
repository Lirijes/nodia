import { apiFetch } from "@/lib/api";

/**
 * En workspace i UI:t = ett "company" i backend/databasen.
 * Den här filen är det enda stället där de två begreppen möts.
 */
export type WorkspaceRole = "owner" | "member";

export type Workspace = {
  id: string;
  name: string;
  /** Endast för visning. Behörighet avgörs alltid av backend. */
  role: WorkspaceRole;
  createdAt: string;
};

export const WORKSPACE_NAME_MAX_LENGTH = 100;

/**
 * localStorage-nyckel för vald workspace, per användare.
 * Värdet är bara en UI-preferens – det ger aldrig behörighet (backend kontrollerar medlemskap).
 */
export function activeWorkspaceStorageKey(userId: string) {
  return `nodia.activeWorkspace.${userId}`;
}

/** Workspaces där den inloggade användaren (enligt access token) är medlem. */
export function fetchWorkspaces(): Promise<Workspace[]> {
  return apiFetch<Workspace[]>("/api/companies");
}

/**
 * Skapar en workspace; backend gör den inloggade användaren till Owner.
 * Skickar medvetet BARA namnet – användar-id och roll bestäms av servern.
 */
export function createWorkspace(name: string): Promise<Workspace> {
  return apiFetch<Workspace>("/api/companies", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}
