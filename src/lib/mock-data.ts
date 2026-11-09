import type { Status } from "@/components/workspace/feedback";

export type Model = {
  id: string;
  name: string;
  provider: string;
  context: string;
  inputPrice: number; // USD / 1M tokens
  outputPrice: number;
  status: Status;
  default?: boolean;
};

export const models: Model[] = [
  {
    id: "gpt-5",
    name: "GPT-5",
    provider: "OpenAI",
    context: "400k",
    inputPrice: 1.25,
    outputPrice: 10,
    status: "connected",
    default: true,
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 mini",
    provider: "OpenAI",
    context: "400k",
    inputPrice: 0.25,
    outputPrice: 2,
    status: "connected",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    context: "1M",
    inputPrice: 1.25,
    outputPrice: 10,
    status: "connected",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    context: "1M",
    inputPrice: 0.3,
    outputPrice: 2.5,
    status: "connected",
  },
  {
    id: "claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    context: "200k",
    inputPrice: 3,
    outputPrice: 15,
    status: "disconnected",
  },
];

export type KnowledgeBase = {
  id: string;
  name: string;
  description: string;
  docs: number;
  chunks: number;
  embedding: string;
  dims: number;
  updated: string;
  status: Status;
};

export const knowledgeBases: KnowledgeBase[] = [
  {
    id: "kb_01HX7Q",
    name: "Product documentation",
    description: "Public docs, changelogs and API reference",
    docs: 142,
    chunks: 8412,
    embedding: "text-embedding-3-large",
    dims: 3072,
    updated: "12 min ago",
    status: "ready",
  },
  {
    id: "kb_01HX9A",
    name: "Support tickets 2026",
    description: "Resolved Zendesk tickets, anonymised",
    docs: 1208,
    chunks: 22950,
    embedding: "text-embedding-3-small",
    dims: 1536,
    updated: "1 h ago",
    status: "processing",
  },
  {
    id: "kb_01HY2C",
    name: "Research papers",
    description: "Retrieval, agents and evaluation papers",
    docs: 37,
    chunks: 4103,
    embedding: "gemini-embedding-001",
    dims: 768,
    updated: "Yesterday",
    status: "ready",
  },
  {
    id: "kb_01HZ4M",
    name: "Internal handbook",
    description: "Policies, onboarding, engineering RFCs",
    docs: 64,
    chunks: 0,
    embedding: "text-embedding-3-small",
    dims: 1536,
    updated: "3 days ago",
    status: "failed",
  },
];

export type Doc = {
  id: string;
  name: string;
  type: "pdf" | "md" | "html" | "txt" | "docx";
  size: string;
  chunks: number;
  status: Status;
  stage: string;
  added: string;
};

export const documents: Doc[] = [
  {
    id: "doc_8f21",
    name: "api-reference-v3.md",
    type: "md",
    size: "184 KB",
    chunks: 312,
    status: "ready",
    stage: "Indexed",
    added: "2026-11-08 14:02",
  },
  {
    id: "doc_8f22",
    name: "getting-started.md",
    type: "md",
    size: "22 KB",
    chunks: 41,
    status: "ready",
    stage: "Indexed",
    added: "2026-11-08 14:02",
  },
  {
    id: "doc_8f30",
    name: "Security whitepaper.pdf",
    type: "pdf",
    size: "2.4 MB",
    chunks: 0,
    status: "processing",
    stage: "Embedding · 64%",
    added: "2026-11-09 07:41",
  },
  {
    id: "doc_8f31",
    name: "pricing-faq.html",
    type: "html",
    size: "48 KB",
    chunks: 0,
    status: "queued",
    stage: "Waiting",
    added: "2026-11-09 07:42",
  },
  {
    id: "doc_8f19",
    name: "Changelog 2025.docx",
    type: "docx",
    size: "310 KB",
    chunks: 0,
    status: "failed",
    stage: "Parse error",
    added: "2026-11-07 09:15",
  },
  {
    id: "doc_8f11",
    name: "rate-limits.md",
    type: "md",
    size: "9 KB",
    chunks: 14,
    status: "ready",
    stage: "Indexed",
    added: "2026-11-02 16:30",
  },
  {
    id: "doc_8f10",
    name: "webhooks.md",
    type: "md",
    size: "31 KB",
    chunks: 52,
    status: "ready",
    stage: "Indexed",
    added: "2026-11-02 16:30",
  },
];

export type Integration = {
  id: string;
  name: string;
  category: string;
  description: string;
  status: Status;
  tools: number;
  auth: string;
  lastUsed: string;
};

export const integrations: Integration[] = [
  {
    id: "github",
    name: "GitHub",
    category: "Developer",
    description: "Read repositories, issues and pull requests.",
    status: "connected",
    tools: 8,
    auth: "OAuth",
    lastUsed: "4 min ago",
  },
  {
    id: "linear",
    name: "Linear",
    category: "Project management",
    description: "Create and query issues, cycles and projects.",
    status: "connected",
    tools: 5,
    auth: "API key",
    lastUsed: "2 h ago",
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description: "Post messages and read channel history.",
    status: "connected",
    tools: 4,
    auth: "OAuth",
    lastUsed: "Yesterday",
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    category: "Data",
    description: "Run read-only SQL against a configured database.",
    status: "warning",
    tools: 2,
    auth: "Connection string",
    lastUsed: "3 days ago",
  },
  {
    id: "notion",
    name: "Notion",
    category: "Knowledge",
    description: "Search and read pages and databases.",
    status: "disconnected",
    tools: 3,
    auth: "OAuth",
    lastUsed: "—",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    description: "Look up customers, invoices and subscriptions.",
    status: "disconnected",
    tools: 6,
    auth: "API key",
    lastUsed: "—",
  },
];

export type Tool = {
  name: string;
  source: string;
  description: string;
  params: string;
  enabled: boolean;
};

export const tools: Tool[] = [
  {
    name: "search_knowledge",
    source: "built-in",
    description: "Semantic search across selected knowledge bases.",
    params: "query: string, k?: number",
    enabled: true,
  },
  {
    name: "web_fetch",
    source: "built-in",
    description: "Fetch and extract readable content from a URL.",
    params: "url: string",
    enabled: true,
  },
  {
    name: "run_python",
    source: "built-in",
    description: "Execute Python in an isolated sandbox.",
    params: "code: string",
    enabled: false,
  },
  {
    name: "github.search_issues",
    source: "GitHub",
    description: "Search issues across connected repositories.",
    params: "q: string, repo?: string",
    enabled: true,
  },
  {
    name: "linear.create_issue",
    source: "Linear",
    description: "Create a new issue in a team.",
    params: "team: string, title: string, body?: string",
    enabled: true,
  },
  {
    name: "slack.post_message",
    source: "Slack",
    description: "Post a message to a channel.",
    params: "channel: string, text: string",
    enabled: false,
  },
  {
    name: "fs.read_file",
    source: "mcp:filesystem",
    description: "Read a file from the mounted workspace directory.",
    params: "path: string",
    enabled: true,
  },
];

export type McpServer = {
  name: string;
  transport: "stdio" | "http" | "sse";
  endpoint: string;
  tools: number;
  status: Status;
};

export const mcpServers: McpServer[] = [
  {
    name: "filesystem",
    transport: "stdio",
    endpoint: "npx @modelcontextprotocol/server-filesystem ./workspace",
    tools: 4,
    status: "connected",
  },
  {
    name: "browser",
    transport: "http",
    endpoint: "http://localhost:3333/mcp",
    tools: 7,
    status: "connected",
  },
  {
    name: "analytics-internal",
    transport: "sse",
    endpoint: "https://mcp.internal.acme.dev/sse",
    tools: 0,
    status: "disconnected",
  },
];

export type Workflow = {
  id: string;
  name: string;
  description: string;
  trigger: "Manual" | "Schedule" | "Webhook" | "Event";
  triggerDetail: string;
  steps: string[];
  status: Status;
  lastRun: string;
  lastResult: Status;
  runs: number;
};

export const workflows: Workflow[] = [
  {
    id: "wf_support_triage",
    name: "Support ticket triage",
    description: "Classify incoming tickets, retrieve docs, draft a reply.",
    trigger: "Webhook",
    triggerDetail: "POST /hooks/zendesk",
    steps: ["Webhook", "Classify", "Retrieve", "Draft reply", "Slack"],
    status: "active",
    lastRun: "6 min ago",
    lastResult: "success",
    runs: 1284,
  },
  {
    id: "wf_weekly_digest",
    name: "Weekly engineering digest",
    description: "Summarise merged PRs and closed issues.",
    trigger: "Schedule",
    triggerDetail: "0 8 * * MON",
    steps: ["Cron", "GitHub", "Summarise", "Slack"],
    status: "active",
    lastRun: "6 days ago",
    lastResult: "success",
    runs: 42,
  },
  {
    id: "wf_doc_qa",
    name: "Docs Q&A evaluation",
    description: "Run golden-set questions against the docs KB.",
    trigger: "Manual",
    triggerDetail: "Run on demand",
    steps: ["Dataset", "Retrieve", "Answer", "Grade"],
    status: "draft",
    lastRun: "2 days ago",
    lastResult: "warning",
    runs: 9,
  },
  {
    id: "wf_lead_enrich",
    name: "Lead enrichment",
    description: "Enrich new signups with company data.",
    trigger: "Event",
    triggerDetail: "user.created",
    steps: ["Event", "Web fetch", "Extract", "Postgres"],
    status: "paused",
    lastRun: "3 weeks ago",
    lastResult: "failed",
    runs: 311,
  },
];

export type ExecStep = {
  kind: "llm" | "tool" | "retrieval" | "system";
  name: string;
  duration: number; // ms
  detail: string;
  status: Status;
};

export type Execution = {
  id: string;
  source: string;
  model: string;
  started: string;
  duration: number; // ms
  tokensIn: number;
  tokensOut: number;
  cost: number;
  status: Status;
  steps: ExecStep[];
};

export const executions: Execution[] = [
  {
    id: "exe_9c41f2",
    source: "Support ticket triage",
    model: "gpt-5-mini",
    started: "2026-11-09 08:44:12",
    duration: 4120,
    tokensIn: 3820,
    tokensOut: 412,
    cost: 0.0018,
    status: "success",
    steps: [
      {
        kind: "system",
        name: "trigger.webhook",
        duration: 4,
        detail: "ticket_id=88213 channel=email",
        status: "success",
      },
      {
        kind: "llm",
        name: "classify",
        duration: 812,
        detail: "→ category=billing confidence=0.93",
        status: "success",
      },
      {
        kind: "retrieval",
        name: "search_knowledge",
        duration: 214,
        detail: "kb_01HX7Q k=6 top_score=0.842",
        status: "success",
      },
      {
        kind: "llm",
        name: "draft_reply",
        duration: 2870,
        detail: "412 tokens · finish_reason=stop",
        status: "success",
      },
      {
        kind: "tool",
        name: "slack.post_message",
        duration: 220,
        detail: "channel=#support-drafts ok=true",
        status: "success",
      },
    ],
  },
  {
    id: "exe_9c41e8",
    source: "Playground",
    model: "gemini-2.5-pro",
    started: "2026-11-09 08:31:55",
    duration: 9840,
    tokensIn: 12044,
    tokensOut: 1630,
    cost: 0.0313,
    status: "success",
    steps: [
      {
        kind: "llm",
        name: "chat.completion",
        duration: 9840,
        detail: "1630 tokens · finish_reason=stop",
        status: "success",
      },
    ],
  },
  {
    id: "exe_9c41d0",
    source: "Docs Q&A evaluation",
    model: "gpt-5",
    started: "2026-11-09 08:12:03",
    duration: 15210,
    tokensIn: 22810,
    tokensOut: 2210,
    cost: 0.0506,
    status: "warning",
    steps: [
      {
        kind: "system",
        name: "dataset.load",
        duration: 38,
        detail: "golden_set_v4 rows=24",
        status: "success",
      },
      {
        kind: "retrieval",
        name: "search_knowledge",
        duration: 960,
        detail: "24 queries · avg_score=0.71",
        status: "success",
      },
      { kind: "llm", name: "answer", duration: 11200, detail: "24 completions", status: "success" },
      {
        kind: "llm",
        name: "grade",
        duration: 3012,
        detail: "pass=19 fail=5 · below threshold 0.85",
        status: "warning",
      },
    ],
  },
  {
    id: "exe_9c41b7",
    source: "Lead enrichment",
    model: "gemini-2.5-flash",
    started: "2026-11-09 07:58:40",
    duration: 2310,
    tokensIn: 1405,
    tokensOut: 0,
    cost: 0.0004,
    status: "failed",
    steps: [
      {
        kind: "system",
        name: "trigger.event",
        duration: 2,
        detail: "user.created id=u_44120",
        status: "success",
      },
      {
        kind: "tool",
        name: "web_fetch",
        duration: 2200,
        detail: "GET https://acme-corp.io → 200",
        status: "success",
      },
      {
        kind: "tool",
        name: "postgres.query",
        duration: 108,
        detail: "ECONNREFUSED 10.0.4.12:5432",
        status: "failed",
      },
    ],
  },
  {
    id: "exe_9c41a2",
    source: "Agent · repo assistant",
    model: "gpt-5",
    started: "2026-11-09 07:40:18",
    duration: 0,
    tokensIn: 5120,
    tokensOut: 210,
    cost: 0.0085,
    status: "running",
    steps: [
      {
        kind: "llm",
        name: "plan",
        duration: 1420,
        detail: "3 tool calls planned",
        status: "success",
      },
      {
        kind: "tool",
        name: "github.search_issues",
        duration: 640,
        detail: "q='flaky test' results=12",
        status: "success",
      },
      {
        kind: "tool",
        name: "fs.read_file",
        duration: 0,
        detail: "path=src/ci/retry.ts",
        status: "running",
      },
    ],
  },
  {
    id: "exe_9c4199",
    source: "Weekly engineering digest",
    model: "gpt-5-mini",
    started: "2026-11-03 08:00:01",
    duration: 6880,
    tokensIn: 18230,
    tokensOut: 940,
    cost: 0.0064,
    status: "success",
    steps: [
      {
        kind: "tool",
        name: "github.list_merged_prs",
        duration: 1200,
        detail: "since=7d count=37",
        status: "success",
      },
      { kind: "llm", name: "summarise", duration: 5400, detail: "940 tokens", status: "success" },
      {
        kind: "tool",
        name: "slack.post_message",
        duration: 280,
        detail: "channel=#eng ok=true",
        status: "success",
      },
    ],
  },
];

export const activity = [
  { who: "You", what: "uploaded 2 documents to", target: "Product documentation", when: "08:42" },
  { who: "Workflow", what: "completed run of", target: "Support ticket triage", when: "08:44" },
  { who: "You", what: "connected MCP server", target: "browser", when: "Yesterday" },
  { who: "System", what: "failed to index", target: "Changelog 2025.docx", when: "Nov 7" },
  { who: "You", what: "paused workflow", target: "Lead enrichment", when: "Nov 5" },
];

export const conversation = [
  {
    role: "user" as const,
    content: "Summarise the rate-limit policy for the public API in three bullet points.",
    tokens: 18,
  },
  {
    role: "assistant" as const,
    content:
      "• Requests are limited to 600/min per API key, with a burst allowance of 100.\n• Exceeding the limit returns HTTP 429 with a Retry-After header in seconds.\n• Enterprise workspaces can request higher limits; webhooks are not rate-limited.",
    tokens: 64,
  },
];

export const formatMs = (ms: number) =>
  ms === 0 ? "—" : ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(2)} s`;
export const formatCost = (c: number) => `$${c.toFixed(4)}`;
export const formatNum = (n: number) => n.toLocaleString("en-US");
