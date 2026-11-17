import { Link, Navigate, Outlet, type RouteObject, useLocation, useRoutes } from "react-router-dom";
import { useEffect } from "react";

import { AppShell } from "@/components/workspace/app-shell";
import { FullPageError, FullPageLoader } from "@/components/workspace/full-page-states";
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
import LoginPage from "@/routes/login";
import SignupPage from "@/routes/signup";
import OnboardingPage from "@/routes/onboarding";
import { useAuth } from "@/lib/auth";
import { WorkspaceProvider, useWorkspace } from "@/lib/workspace-context";

const pageMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Overview — Nodia",
    description: "Recent activity, executions, models and knowledge in your workspace.",
  },
  "/playground": {
    title: "Playground — Nodia",
    description: "Test models with prompts, parameters and token cost.",
  },
  "/knowledge": {
    title: "Knowledge — Nodia",
    description: "Manage knowledge bases and documents used for retrieval.",
  },
  "/tools": {
    title: "Tools & Integrations — Nodia",
    description: "Connect integrations, tools and MCP servers.",
  },
  "/workflows": {
    title: "Workflows — Nodia",
    description: "Automated AI workflows, triggers and runs.",
  },
  "/logs": {
    title: "Execution logs — Nodia",
    description: "Every AI execution with steps, tokens and cost.",
  },
  "/settings": {
    title: "Settings — Nodia",
    description: "Workspace, API configuration and preferences.",
  },
  "/login": {
    title: "Sign in — Nodia",
    description: "Sign in to your workspace.",
  },
  "/signup": {
    title: "Create account — Nodia",
    description: "Create an account for your workspace.",
  },
  "/design-system": {
    title: "Design system — Nodia",
    description: "Tokens and components used across the workspace.",
  },
  "/onboarding": {
    title: "Create your workspace — Nodia",
    description: "Create your first workspace to get started.",
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

/**
 * Släpper bara igenom inloggade användare; andra skickas till /login.
 * WorkspaceProvider får key={user.id}: byts användaren byggs all workspace-state om
 * från grunden, så inget från en tidigare användare kan visas.
 */
function RequireAuth() {
  const { session, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullPageLoader />;
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return (
    <WorkspaceProvider key={session.user.id} userId={session.user.id}>
      <PageMetadata />
      <Outlet />
    </WorkspaceProvider>
  );
}

/** Appen kräver minst en workspace – annars obligatorisk onboarding. */
function RequireWorkspace() {
  const { status, workspaces, error, reload } = useWorkspace();
  if (status === "loading") return <FullPageLoader />;
  if (status === "error") {
    return <FullPageError message={error ?? "Unknown error."} onRetry={reload} />;
  }
  if (workspaces.length === 0) return <Navigate to="/onboarding" replace />;
  return <RootLayout />;
}

/** /login och /signup: redan inloggade skickas till startsidan. */
function PublicOnly() {
  const { session, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (session) return <Navigate to="/" replace />;
  return (
    <>
      <PageMetadata />
      <Outlet />
    </>
  );
}

function RootLayout() {
  return (
    <TooltipProvider delayDuration={200}>
      <AppShell>
        <Outlet />
      </AppShell>
      <Toaster />
    </TooltipProvider>
  );
}

export const appRoutes: RouteObject[] = [
  {
    element: <PublicOnly />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      { path: "/onboarding", element: <OnboardingPage /> },
      {
        element: <RequireWorkspace />,
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
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];

export function AppRoutes() {
  return useRoutes(appRoutes);
}
