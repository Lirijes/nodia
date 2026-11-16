import type { ReactNode } from "react";

import { Brand } from "@/components/workspace/app-shell";
import { isSupabaseConfigured } from "@/lib/supabase";

/** Gemensam ram för inloggnings- och registreringssidan. */
export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Brand />
        </div>
        <div className="rounded-md border border-border bg-surface p-6 shadow-xs">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          {!isSupabaseConfigured && (
            <p
              role="alert"
              className="mt-4 rounded-md border border-destructive/40 bg-destructive-soft px-3 py-2 text-xs text-destructive"
            >
              Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to
              .env.local.
            </p>
          )}
          <div className="mt-6">{children}</div>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">{footer}</div>
      </div>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}
