import { useState, type ReactNode, type HTMLAttributes, type TdHTMLAttributes } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Data table ----------
 * Plain semantic table with system styling. Wrap in <DataTable> to get
 * horizontal scrolling on small screens instead of page overflow.
 */
export function DataTable({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)}>{children}</table>
    </div>
  );
}

export function Th({ className, ...p }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "eyebrow h-8 whitespace-nowrap border-b border-border bg-surface-sunken px-4 text-left font-normal",
        className,
      )}
      {...p}
    />
  );
}

export function Td({ className, ...p }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("h-11 border-b border-border px-4 align-middle text-foreground", className)}
      {...p}
    />
  );
}

export function Tr({
  className,
  interactive,
  selected,
  ...p
}: HTMLAttributes<HTMLTableRowElement> & { interactive?: boolean; selected?: boolean }) {
  return (
    <tr
      className={cn(
        "last:[&>td]:border-b-0",
        interactive && "cursor-pointer transition-colors hover:bg-surface-sunken/60",
        selected && "bg-primary-soft/50 hover:bg-primary-soft/60",
        className,
      )}
      {...p}
    />
  );
}

/** Mono, muted identifier (IDs, hashes, model slugs). */
export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("font-mono text-xs text-muted-foreground", className)}>{children}</span>
  );
}

/* ---------- Metadata list ---------- */
export function MetaList({
  items,
  columns = 1,
}: {
  items: { label: string; value: ReactNode; mono?: boolean }[];
  columns?: 1 | 2;
}) {
  return (
    <dl className={cn("grid gap-x-6", columns === 2 && "sm:grid-cols-2")}>
      {items.map((it) => (
        <div
          key={it.label}
          className="flex items-baseline justify-between gap-4 border-b border-dashed border-border py-2 last:border-b-0"
        >
          <dt className="shrink-0 text-xs text-muted-foreground">{it.label}</dt>
          <dd
            className={cn(
              "min-w-0 truncate text-right text-xs text-foreground",
              it.mono && "num font-mono",
            )}
          >
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- Code block ---------- */
export function CodeBlock({
  code,
  language,
  title,
  className,
}: {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={cn("overflow-hidden rounded-md bg-code text-code-foreground", className)}>
      <div className="flex h-8 items-center justify-between border-b border-code-muted/20 px-3">
        <span className="font-mono text-2xs uppercase tracking-wider text-code-muted">
          {title ?? language ?? "code"}
        </span>
        <button
          type="button"
          aria-label="Copy code"
          onClick={() => {
            navigator.clipboard?.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          className="flex items-center gap-1 font-mono text-2xs text-code-muted transition-colors hover:text-code-foreground"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-5">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-sm border border-border-strong bg-surface px-1 font-mono text-2xs text-muted-foreground">
      {children}
    </kbd>
  );
}

/** Thin horizontal meter, e.g. token budget or quota. */
export function Meter({
  value,
  max,
  tone = "primary",
}: {
  value: number;
  max: number;
  tone?: "primary" | "warning";
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-surface-sunken">
      <div
        className={cn("h-full rounded-full", tone === "primary" ? "bg-primary" : "bg-warning")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
