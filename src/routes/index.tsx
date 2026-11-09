import { Page, PageHeader } from "@/components/workspace/layout";

export default function HomePage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Atelier"
        title="Overview"
        description="Recent activity, executions, models and knowledge in your workspace."
      />
    </Page>
  );
}
