import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/workspace/layout";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "Design system — Atelier" },
      { name: "description", content: "Tokens and components used across the workspace." },
      { property: "og:title", content: "Design system — Atelier" },
      { property: "og:description", content: "Tokens and components used across the workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <Page>
      <PageHeader eyebrow="Atelier" title="Design system" description="Tokens and components used across the workspace." />
    </Page>
  ),
});
