import { Button } from "@/components/ui/button";

export function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <span className="font-mono text-2xs text-muted-foreground">Loading…</span>
    </div>
  );
}

/** Helsidesfel med möjlighet att försöka igen, t.ex. när API:t inte svarar. */
export function FullPageError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div role="alert" className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Could not load your workspaces
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <Button className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </div>
  );
}
