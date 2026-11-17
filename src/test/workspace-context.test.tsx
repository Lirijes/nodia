import { act, render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { apiFetch } from "@/lib/api";
import { WorkspaceProvider, useWorkspace } from "@/lib/workspace-context";
import type { Workspace } from "@/lib/workspaces";

vi.mock("@/lib/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/api")>()),
  apiFetch: vi.fn(),
}));

const apiFetchMock = vi.mocked(apiFetch);

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

function Probe() {
  const { status, workspaces } = useWorkspace();
  return <div data-testid="state">{`${status}:${workspaces.map((w) => w.name).join(",")}`}</div>;
}

const ws = (id: string, name: string): Workspace => ({
  id,
  name,
  role: "owner",
  createdAt: "2026-11-17T08:00:00Z",
});

beforeEach(() => {
  localStorage.clear();
  apiFetchMock.mockReset();
});

// Router-nivån monterar providern med key={userId}. Det här testet kontrollerar det
// andra skyddslagret: även UTAN key får ett sent svar aldrig skriva över ny state.
it("ignores a response for a previous userId even without remounting", async () => {
  const forA = deferred<Workspace[]>();
  const forB = deferred<Workspace[]>();
  apiFetchMock
    .mockImplementationOnce((() => forA.promise) as typeof apiFetch)
    .mockImplementationOnce((() => forB.promise) as typeof apiFetch);

  const { rerender } = render(
    <WorkspaceProvider userId="user-a">
      <Probe />
    </WorkspaceProvider>,
  );
  rerender(
    <WorkspaceProvider userId="user-b">
      <Probe />
    </WorkspaceProvider>,
  );

  await act(async () => forB.resolve([ws("b1", "Bob Corp")]));
  await act(async () => forA.resolve([ws("a1", "Alice Corp")])); // sent svar för user-a

  expect(screen.getByTestId("state")).toHaveTextContent("ready:Bob Corp");
});
