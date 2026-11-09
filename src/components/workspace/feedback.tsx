import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export type Status =
  | "success"
  | "running"
  | "queued"
  | "warning"
  | "failed"
  | "idle"
  | "connected"
  | "disconnected"
  | "processing"
  | "ready"
  | "active"
  | "paused"
  | "draft";

const tone: Record<Status, "success" | "info" | "warning" | "danger" | "neutral"> = {
  success: "success",
  connected: "success",
  ready: "success",
  active: "success",
  running: "info",
  processing: "info",
  queued: "neutral",
  idle: "neutral",
  draft: "neutral",
  paused: "warning",
  warning: "warning",
  failed: "danger",
  disconnected: "danger",
};

const dotVariants = cva("inline-block size-1.5 shrink-0 rounded-full", {
  variants: {
    tone: {
      success: "bg-success",
      info: "bg-primary",
      warning: "bg-warning",
      danger: "bg-destructive",
      neutral: "bg-subtle-foreground",
    },
    pulse: { true: "animate-pulse", false: "" },
  },
});

/** Dot + label. The canonical way to show any state. */
export function StatusBadge({ status, label }: { status: Status; label?: string }) {
  const t = tone[status];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-foreground">
      <span
        className={dotVariants({ tone: t, pulse: status === "running" || status === "processing" })}
      />
      <span className="capitalize">{label ?? status}</span>
    </span>
  );
}

const tagVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-sm border px-1.5 font-mono text-2xs leading-[18px]",
  {
    variants: {
      variant: {
        neutral: "border-border bg-surface-sunken text-muted-foreground",
        primary: "border-primary/20 bg-primary-soft text-primary",
        success: "border-success/20 bg-success-soft text-success",
        warning: "border-warning/25 bg-warning-soft text-warning",
        danger: "border-destructive/20 bg-destructive-soft text-destructive",
        outline: "border-border-strong bg-transparent text-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

/** Small monospace label for metadata (provider, trigger type, version, env). */
export function Tag({
  children,
  variant,
  className,
}: { children: ReactNode; className?: string } & VariantProps<typeof tagVariants>) {
  return <span className={cn(tagVariants({ variant }), className)}>{children}</span>;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-3 flex size-9 items-center justify-center rounded-md border border-dashed border-border-strong text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
  code,
  onRetry,
}: {
  title?: string;
  message: string;
  code?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-destructive/25 bg-destructive-soft px-3.5 py-3">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{message}</p>
        {code && <p className="mt-1.5 font-mono text-2xs text-destructive">{code}</p>}
      </div>
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

/** Skeleton rows matching table density. */
export function LoadingRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <Skeleton className="h-3 w-40 rounded-sm bg-surface-sunken" />
          <Skeleton className="h-3 w-20 rounded-sm bg-surface-sunken" />
          <Skeleton className="ml-auto h-3 w-16 rounded-sm bg-surface-sunken" />
        </div>
      ))}
    </div>
  );
}
