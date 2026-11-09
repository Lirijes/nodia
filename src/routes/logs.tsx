import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/workspace/layout";

export const Route = createFileRoute("/logs")({
  head: () => ({
    meta: [
      { title: "Execution logs — Atelier" },
      { name: "description", content: "Every AI execution with steps, tokens and cost." },
      { property: "og:title", content: "Execution logs — Atelier" },
      { property: "og:description", content: "Every AI execution with steps, tokens and cost." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <Page>
      <PageHeader eyebrow="Atelier" title="Execution logs" description="Every AI execution with steps, tokens and cost." />
    </Page>
  ),
});
