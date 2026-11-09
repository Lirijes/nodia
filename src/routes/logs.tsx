import { Page, PageHeader } from "@/components/workspace/layout";

export default function LogsPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Atelier"
        title="Execution logs"
        description="Every AI execution with steps, tokens and cost."
      />
    </Page>
  );
}
