import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/workspace/layout";

export const Route = createFileRoute("/workflows")({
  head: () => ({
    meta: [
      { title: "Workflows — Atelier" },
      { name: "description", content: "Automated AI workflows, triggers and runs." },
      { property: "og:title", content: "Workflows — Atelier" },
      { property: "og:description", content: "Automated AI workflows, triggers and runs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <Page>
      <PageHeader eyebrow="Atelier" title="Workflows" description="Automated AI workflows, triggers and runs." />
    </Page>
  ),
});
