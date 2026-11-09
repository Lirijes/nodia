import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/workspace/layout";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Atelier" },
      { name: "description", content: "Workspace, API configuration and preferences." },
      { property: "og:title", content: "Settings — Atelier" },
      { property: "og:description", content: "Workspace, API configuration and preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <Page>
      <PageHeader eyebrow="Atelier" title="Settings" description="Workspace, API configuration and preferences." />
    </Page>
  ),
});
