import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/workspace/layout";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Playground — Atelier" },
      { name: "description", content: "Test models with prompts, parameters and token cost." },
      { property: "og:title", content: "Playground — Atelier" },
      { property: "og:description", content: "Test models with prompts, parameters and token cost." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <Page>
      <PageHeader eyebrow="Atelier" title="Playground" description="Test models with prompts, parameters and token cost." />
    </Page>
  ),
});
