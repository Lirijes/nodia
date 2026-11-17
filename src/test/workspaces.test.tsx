import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Context } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError, apiFetch } from "@/lib/api";
import * as authModule from "@/lib/auth";
import { activeWorkspaceStorageKey, type Workspace } from "@/lib/workspaces";
import { AppRoutes } from "@/router";

// --- Mockar -----------------------------------------------------------------

type FakeUser = { id: string; email: string };

const auth = vi.hoisted(() => ({
  current: null as null | {
    session: { user: FakeUser };
    user: FakeUser;
    loading: boolean;
    signIn: () => Promise<void>;
    signUp: () => Promise<{ needsConfirmation: boolean }>;
    signOut: () => Promise<void>;
  },
}));

// Som den riktiga useAuth läses värdet från en React-context, så att ett byte av
// användare får komponenterna att rendera om – precis som med AuthProvider.
vi.mock("@/lib/auth", async () => {
  const React = await import("react");
  const TestAuthContext = React.createContext<typeof auth.current>(null);
  return {
    TestAuthContext,
    useAuth: () => React.useContext(TestAuthContext),
  };
});

vi.mock("@/lib/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/api")>()),
  apiFetch: vi.fn(),
}));

const apiFetchMock = vi.mocked(apiFetch);

// --- Hjälpare ---------------------------------------------------------------

function signInAs(id: string) {
  const user = { id, email: `${id}@example.test` };
  auth.current = {
    session: { user },
    user,
    loading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  };
}

function ws(id: string, name: string, role: Workspace["role"] = "owner"): Workspace {
  return { id, name, role, createdAt: "2026-11-17T08:00:00Z" };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

type Call = { path: string; init: RequestInit | undefined };

/** Kö av svar: varje anrop till apiFetch tar nästa svar i tur och ordning. */
function mockApiResponses(...responses: Array<() => Promise<unknown>>) {
  const calls: Call[] = [];
  apiFetchMock.mockImplementation(((path: string, init?: RequestInit) => {
    calls.push({ path, init });
    const next = responses.shift();
    if (!next) throw new Error(`Unexpected apiFetch call: ${init?.method ?? "GET"} ${path}`);
    return next();
  }) as typeof apiFetch);
  return calls;
}

const ok =
  <T,>(value: T) =>
  () =>
    Promise.resolve(value);

const { TestAuthContext } = authModule as unknown as {
  TestAuthContext: Context<typeof auth.current>;
};

function renderApp(path: string) {
  const ui = () => (
    <TestAuthContext.Provider value={auth.current}>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </TestAuthContext.Provider>
  );
  const result = render(ui());
  return { ...result, rerenderApp: () => result.rerender(ui()) };
}

const onboardingHeading = () => screen.findByRole("heading", { name: "Create your workspace" });
const switcher = (name: string) => screen.findByRole("button", { name: `Workspace: ${name}` });

async function submitCreateForm(name: string) {
  fireEvent.change(await screen.findByLabelText("Workspace name"), { target: { value: name } });
  fireEvent.click(screen.getByRole("button", { name: "Create workspace" }));
}

beforeEach(() => {
  localStorage.clear();
  apiFetchMock.mockReset();
  signInAs("user-a");
});

// --- Tester -----------------------------------------------------------------

describe("Workspace gate", () => {
  it("sends a signed-in user without workspaces to mandatory onboarding", async () => {
    mockApiResponses(ok([]));

    renderApp("/settings");

    expect(await onboardingHeading()).toBeInTheDocument();
  });

  it("shows the app with the first workspace (by name) active", async () => {
    mockApiResponses(ok([ws("b", "Beta"), ws("a", "Alpha")]));

    renderApp("/settings");

    expect(await switcher("Alpha")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
  });

  it("redirects /onboarding to the app when the user already has a workspace", async () => {
    mockApiResponses(ok([ws("a", "Alpha")]));

    renderApp("/onboarding");

    expect(await switcher("Alpha")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Create your workspace" })).toBeNull();
  });

  it("shows an error with retry when the workspaces cannot be loaded", async () => {
    const calls = mockApiResponses(
      () => Promise.reject(new Error("Network down")),
      ok([ws("a", "Alpha")]),
    );

    renderApp("/settings");

    expect(await screen.findByText("Network down")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await switcher("Alpha")).toBeInTheDocument();
    expect(calls).toHaveLength(2);
  });
});

describe("Active workspace (localStorage)", () => {
  it("uses the stored workspace when it is in the server's list", async () => {
    localStorage.setItem(activeWorkspaceStorageKey("user-a"), "b");
    mockApiResponses(ok([ws("a", "Alpha"), ws("b", "Beta")]));

    renderApp("/settings");

    expect(await switcher("Beta")).toBeInTheDocument();
  });

  it("ignores a stored id that is not in the server's list (tampered or stale)", async () => {
    localStorage.setItem(activeWorkspaceStorageKey("user-a"), "someone-elses-company");
    const calls = mockApiResponses(ok([ws("a", "Alpha")]));

    renderApp("/settings");

    expect(await switcher("Alpha")).toBeInTheDocument();
    expect(calls.map((c) => c.path)).toEqual(["/api/companies"]);
  });

  it("stores the preference per user", async () => {
    localStorage.setItem(activeWorkspaceStorageKey("user-a"), "b");
    signInAs("user-b");
    mockApiResponses(ok([ws("a", "Alpha"), ws("b", "Beta")]));

    renderApp("/settings");

    expect(await switcher("Alpha")).toBeInTheDocument(); // user-a:s val påverkar inte user-b
  });

  it("switches workspace from the switcher and remembers the choice", async () => {
    mockApiResponses(ok([ws("a", "Alpha"), ws("b", "Beta", "member")]));
    renderApp("/settings");

    fireEvent.keyDown(await switcher("Alpha"), { key: "Enter" });
    fireEvent.click(await screen.findByRole("menuitem", { name: "Beta" }));

    expect(await switcher("Beta")).toBeInTheDocument();
    expect(screen.getByText("Member")).toBeInTheDocument();
    expect(localStorage.getItem(activeWorkspaceStorageKey("user-a"))).toBe("b");
  });
});

describe("Create workspace", () => {
  it("posts only the trimmed name, activates the new workspace and opens the app", async () => {
    const calls = mockApiResponses(ok([]), ok(ws("new-id", "Acme")));
    renderApp("/");
    await onboardingHeading();

    await submitCreateForm("  Acme  ");

    expect(await switcher("Acme")).toBeInTheDocument();
    const post = calls.find((c) => c.init?.method === "POST");
    expect(post?.path).toBe("/api/companies");
    // Bara namnet skickas – aldrig userId eller role.
    expect(JSON.parse(post?.init?.body as string)).toEqual({ name: "Acme" });
    expect(localStorage.getItem(activeWorkspaceStorageKey("user-a"))).toBe("new-id");
  });

  it("sends only one POST when the user submits repeatedly", async () => {
    const pending = deferred<Workspace>();
    const calls = mockApiResponses(ok([]), () => pending.promise);
    renderApp("/");
    await onboardingHeading();

    fireEvent.change(screen.getByLabelText("Workspace name"), { target: { value: "Acme" } });
    const form = screen.getByRole("button", { name: "Create workspace" }).closest("form")!;
    fireEvent.submit(form);
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(calls.filter((c) => c.init?.method === "POST")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Creating…" })).toBeDisabled();

    await act(async () => pending.resolve(ws("new-id", "Acme")));
    expect(await switcher("Acme")).toBeInTheDocument();
  });

  it("does not call the API for a blank name", async () => {
    const calls = mockApiResponses(ok([]));
    renderApp("/");
    await onboardingHeading();

    await submitCreateForm("   ");

    expect(await screen.findByRole("alert")).toHaveTextContent("between 1 and 100 characters");
    expect(calls.filter((c) => c.init?.method === "POST")).toHaveLength(0);
  });

  it("shows a validation message when the API rejects the name", async () => {
    mockApiResponses(ok([]), () => Promise.reject(new ApiError(400, "{}")));
    renderApp("/");
    await onboardingHeading();

    await submitCreateForm("Acme");

    expect(await screen.findByRole("alert")).toHaveTextContent("between 1 and 100 characters");
    expect(screen.getByRole("button", { name: "Create workspace" })).toBeEnabled();
  });

  it("creates another workspace from the switcher dialog", async () => {
    const calls = mockApiResponses(ok([ws("a", "Alpha")]), ok(ws("z", "Zeta")));
    renderApp("/settings");

    fireEvent.keyDown(await switcher("Alpha"), { key: "Enter" });
    fireEvent.click(await screen.findByRole("menuitem", { name: /New workspace/ }));
    await submitCreateForm("Zeta");

    expect(await switcher("Zeta")).toBeInTheDocument();
    expect(JSON.parse(calls[1]?.init?.body as string)).toEqual({ name: "Zeta" });
  });
});

describe("Switching user", () => {
  it("clears the previous user's workspaces immediately", async () => {
    const userB = deferred<Workspace[]>();
    mockApiResponses(ok([ws("a1", "Alice Corp")]), () => userB.promise);
    const { rerenderApp } = renderApp("/settings");
    expect(await switcher("Alice Corp")).toBeInTheDocument();

    signInAs("user-b");
    rerenderApp();

    // Medan user-b:s lista laddas får inget från user-a synas.
    expect(screen.queryByText("Alice Corp")).toBeNull();
    await act(async () => userB.resolve([ws("b1", "Bob Corp")]));
    expect(await switcher("Bob Corp")).toBeInTheDocument();
    expect(screen.queryByText("Alice Corp")).toBeNull();
  });

  it("does not carry the previous user's in-memory selection over to the next user", async () => {
    // Båda användarna är medlemmar i samma två företag.
    const shared = [ws("a", "Alpha"), ws("b", "Beta")];
    mockApiResponses(ok(shared), ok(shared));
    const { rerenderApp } = renderApp("/settings");
    fireEvent.keyDown(await switcher("Alpha"), { key: "Enter" });
    fireEvent.click(await screen.findByRole("menuitem", { name: "Beta" }));
    expect(await switcher("Beta")).toBeInTheDocument();

    signInAs("user-b");
    rerenderApp();

    // user-b har inget eget val -> första workspacen, inte user-a:s "Beta".
    expect(await switcher("Alpha")).toBeInTheDocument();
  });

  it("ignores a late response that belongs to the previous user", async () => {
    const userA = deferred<Workspace[]>();
    mockApiResponses(() => userA.promise, ok([ws("b1", "Bob Corp")]));
    const { rerenderApp } = renderApp("/settings");

    signInAs("user-b");
    rerenderApp();
    expect(await switcher("Bob Corp")).toBeInTheDocument();

    // user-a:s anrop blir klart först nu – efter bytet.
    await act(async () => userA.resolve([ws("a1", "Alice Corp")]));

    await waitFor(() => expect(screen.queryByText("Alice Corp")).toBeNull());
    expect(await switcher("Bob Corp")).toBeInTheDocument();
  });
});
