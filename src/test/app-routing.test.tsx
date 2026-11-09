import { matchRoutes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { appRoutes } from "@/router";

describe("App routing", () => {
  it.each([
    "/",
    "/playground",
    "/knowledge",
    "/tools",
    "/workflows",
    "/logs",
    "/settings",
    "/design-system",
  ])("matches %s", (path) => {
    const matches = matchRoutes(appRoutes, path);

    expect(matches?.at(-1)?.route.path).toBe(path);
  });

  it("falls back to not found for unknown paths", () => {
    const matches = matchRoutes(appRoutes, "/missing");

    expect(matches?.at(-1)?.route.path).toBe("*");
  });
});
