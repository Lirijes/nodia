import { Navigate } from "react-router-dom";

import { AuthLayout } from "@/components/workspace/auth-layout";
import { CreateWorkspaceForm } from "@/components/workspace/create-workspace-form";
import { FullPageError, FullPageLoader } from "@/components/workspace/full-page-states";
import { useAuth } from "@/lib/auth";
import { useWorkspace } from "@/lib/workspace-context";

/**
 * Obligatorisk första workspace. Användare som redan har en workspace skickas vidare.
 * När den första workspacen skapats blir listan icke-tom och vi navigerar till appen.
 */
export default function OnboardingPage() {
  const { user, signOut } = useAuth();
  const { status, workspaces, error, reload } = useWorkspace();

  if (status === "loading") return <FullPageLoader />;
  if (status === "error") {
    return <FullPageError message={error ?? "Unknown error."} onRetry={reload} />;
  }
  if (workspaces.length > 0) return <Navigate to="/" replace />;

  return (
    <AuthLayout
      title="Create your workspace"
      description="Your work is organised in workspaces. Create your first one to get started."
      footer={
        <>
          Signed in as {user?.email}.{" "}
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => void signOut()}
          >
            Sign out
          </button>
        </>
      }
    >
      <CreateWorkspaceForm />
    </AuthLayout>
  );
}
