# Routes

This project uses React Router with a small route table in `src/router.tsx`.
Each page stays in its own file in this directory and is imported by that table.

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `playground.tsx` | `/playground` |
| `knowledge.tsx` | `/knowledge` |
| `tools.tsx` | `/tools` |
| `workflows.tsx` | `/workflows` |
| `logs.tsx` | `/logs` |
| `settings.tsx` | `/settings` |
| `design-system.tsx` | `/design-system` |

The shared navigation and page frame are in `src/components/workspace/app-shell.tsx`.
Add new pages to the route table in `src/router.tsx` and keep their visual
structure in the existing workspace components and design tokens.
