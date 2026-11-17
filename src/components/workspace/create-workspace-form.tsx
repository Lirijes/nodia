import { useRef, useState, type FormEvent } from "react";

import { FormError } from "@/components/workspace/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { useWorkspace } from "@/lib/workspace-context";
import { WORKSPACE_NAME_MAX_LENGTH, type Workspace } from "@/lib/workspaces";

/** Formulär för att skapa en workspace – används av onboarding och "New workspace…". */
export function CreateWorkspaceForm({
  onCreated,
  submitLabel = "Create workspace",
}: {
  onCreated?: (workspace: Workspace) => void;
  submitLabel?: string;
}) {
  const { createWorkspace } = useWorkspace();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Ref i stället för bara state: stoppar även ett andra klick/Enter som kommer
  // innan React hunnit rendera om och inaktivera knappen.
  const inFlight = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const trimmed = name.trim();
    if (trimmed.length === 0 || trimmed.length > WORKSPACE_NAME_MAX_LENGTH) {
      setError(`Enter a name between 1 and ${WORKSPACE_NAME_MAX_LENGTH} characters.`);
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setError(null);
    try {
      const workspace = await createWorkspace(trimmed);
      onCreated?.(workspace);
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 400
          ? `Enter a name between 1 and ${WORKSPACE_NAME_MAX_LENGTH} characters.`
          : "Could not create the workspace. Please try again.",
      );
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="workspace-name">Workspace name</Label>
        <Input
          id="workspace-name"
          autoComplete="organization"
          autoFocus
          maxLength={WORKSPACE_NAME_MAX_LENGTH}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
        />
      </div>
      <FormError message={error} />
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Creating…" : submitLabel}
      </Button>
    </form>
  );
}
