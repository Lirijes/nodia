import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/workspace/layout";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge — Atelier" },
      { name: "description", content: "Manage knowledge bases and documents used for retrieval." },
      { property: "og:title", content: "Knowledge — Atelier" },
      { property: "og:description", content: "Manage knowledge bases and documents used for retrieval." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <Page>
      <PageHeader eyebrow="Atelier" title="Knowledge" description="Manage knowledge bases and documents used for retrieval." />
    </Page>
  ),
});
