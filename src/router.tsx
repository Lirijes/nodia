import { Link, Outlet, type RouteObject, useLocation, useRoutes } from "react-router-dom";
import { useEffect } from "react";

import { AppShell } from "@/components/workspace/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/routes/index";
import PlaygroundPage from "@/routes/playground";
import KnowledgePage from "@/routes/knowledge";
import ToolsPage from "@/routes/tools";
import WorkflowsPage from "@/routes/workflows";
import LogsPage from "@/routes/logs";
import SettingsPage from "@/routes/settings";
import DesignSystemPage from "@/routes/design-system";

const pageMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Overview — Atelier",
    description: "Recent activity, executions, models and knowledge in your workspace.",
  },
  "/playground": {
    title: "Playground — Atelier",
    description: "Test models with prompts, parameters and token cost.",
  },
  "/knowledge": {
    title: "Knowledge — Atelier",
    description: "Manage knowledge bases and documents used for retrieval.",
  },
  "/tools": {
    title: "Tools & Integrations — Atelier",
    description: "Connect integrations, tools and MCP servers.",
  },
  "/workflows": {
    title: "Workflows — Atelier",
    description: "Automated AI workflows, triggers and runs.",
  },
  "/logs": {
    title: "Execution logs — Atelier",
    description: "Every AI execution with steps, tokens and cost.",
  },
  "/settings": {
    title: "Settings — Atelier",
    description: "Workspace, API configuration and preferences.",
  },
  "/design-system": {
    title: "Design system — Atelier",
    description: "Tokens and components used across the workspace.",
  },
};

function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const metadata = pageMetadata[pathname];
    if (!metadata) return;
    document.title = metadata.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", metadata.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", metadata.description);
    document.querySelector('meta[property="og:type"]')?.setAttribute("content", "website");
    document.querySelector('meta[name="twitter:card"]')?.setAttribute("content", "summary");
  }, [pathname]);
  return null;
}

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function RootLayout() {
  return (
    <TooltipProvider delayDuration={200}>
      <PageMetadata />
      <AppShell>
        <Outlet />
      </AppShell>
      <Toaster />
    </TooltipProvider>
  );
}

export const appRoutes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/playground", element: <PlaygroundPage /> },
      { path: "/knowledge", element: <KnowledgePage /> },
      { path: "/tools", element: <ToolsPage /> },
      { path: "/workflows", element: <WorkflowsPage /> },
      { path: "/logs", element: <LogsPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/design-system", element: <DesignSystemPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];

export function AppRoutes() {
  return useRoutes(appRoutes);
}
