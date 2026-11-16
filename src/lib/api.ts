import { supabase } from "@/lib/supabase";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Anropar Nodia API via Vite-proxyn (/api/...) och skickar med
 * användarens access token som Bearer-token.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  // getSession() förnyar token automatiskt om den har gått ut.
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(path, { ...init, headers });

  if (response.status === 401) {
    // Token godtogs inte av backend -> logga ut lokalt så att användaren loggar in igen.
    await supabase.auth.signOut({ scope: "local" });
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }
  if (!response.ok) {
    throw new ApiError(response.status, (await response.text()) || response.statusText);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
