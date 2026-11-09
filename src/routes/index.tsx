import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/workspace/layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Atelier" },
      { name: "description", content: "Recent activity, executions, models and knowledge in your workspace." },
      { property: "og:title", content: "Overview — Atelier" },
      { property: "og:description", content: "Recent activity, executions, models and knowledge in your workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <Page>
      <PageHeader eyebrow="Atelier" title="Overview" description="Recent activity, executions, models and knowledge in your workspace." />
    </Page>
  ),
});
