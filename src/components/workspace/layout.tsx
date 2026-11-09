import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Page heading block. Serif title, one-line description, actions on the right. */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow mb-1.5">{eyebrow}</div>}
        <h1 className="display text-3xl text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Standard page container. All pages use this so gutters stay identical. */
export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1320px] px-4 py-6 md:px-8 md:py-8", className)}>
      {children}
    </div>
  );
}

/** Bordered white surface with optional header row. The only "card" in the system. */
export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
  flush,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Remove body padding (tables, lists). */
  flush?: boolean;
}) {
  return (
    <section
      className={cn("min-w-0 rounded-lg border border-border bg-surface shadow-xs", className)}
    >
      {(title || actions) && (
        <header className="flex min-h-11 items-center justify-between gap-3 border-b border-border px-4 py-2">
          <div className="min-w-0">
            {title && <h2 className="truncate text-sm font-semibold text-foreground">{title}</h2>}
            {description && <p className="truncate text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
        </header>
      )}
      <div className={cn(!flush && "p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

/** Horizontal strip of key metrics, divided by hairlines. Replaces "stat cards". */
export function StatStrip({
  items,
}: {
  items: { label: string; value: ReactNode; hint?: ReactNode }[];
}) {
  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-surface shadow-xs md:grid-cols-4">
      {items.map((it, i) => (
        <div
          key={it.label}
          className={cn(
            "px-4 py-3",
            i > 0 && "border-l border-border",
            i === 2 && "max-md:border-l-0 max-md:border-t",
            i === 3 && "max-md:border-t",
          )}
        >
          <dt className="eyebrow">{it.label}</dt>
          <dd className="num mt-1 text-2xl font-medium tracking-tight text-foreground">
            {it.value}
          </dd>
          {it.hint && <dd className="mt-0.5 text-xs text-muted-foreground">{it.hint}</dd>}
        </div>
      ))}
    </dl>
  );
}

/** Filter/search row placed above a table. */
export function Toolbar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-b border-border px-3 py-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Form row: label + help on the left, control on the right (stacks on mobile). */
export function FieldRow({
  label,
  help,
  htmlFor,
  children,
}: {
  label: string;
  help?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2 border-b border-border py-4 last:border-b-0 md:grid-cols-[240px_1fr] md:gap-8">
      <div>
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {help && <p className="mt-0.5 text-xs text-muted-foreground">{help}</p>}
      </div>
      <div className="min-w-0 max-w-xl">{children}</div>
    </div>
  );
}

/** Stacked label for compact forms (dialogs, side panels). */
export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-xs font-medium text-foreground">
          {label}
        </label>
        {hint && <span className="font-mono text-2xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
