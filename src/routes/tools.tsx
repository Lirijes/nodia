import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/workspace/layout";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Tools & Integrations — Atelier" },
      { name: "description", content: "Connect integrations, tools and MCP servers." },
      { property: "og:title", content: "Tools & Integrations — Atelier" },
      { property: "og:description", content: "Connect integrations, tools and MCP servers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <Page>
      <PageHeader eyebrow="Atelier" title="Tools & Integrations" description="Connect integrations, tools and MCP servers." />
    </Page>
  ),
});
