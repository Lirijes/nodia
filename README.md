# Model Workshop Playground

# Project: AI Workspace – Product UI & Design System

Design and build a polished, distinctive SaaS application for experimenting with, building and understanding AI-powered workflows.

This is not a generic chatbot application. Think of it as a personal AI engineering workspace where users can explore and manage LLMs, knowledge bases, tools, integrations, workflows and AI agents.

The application is initially a learning and experimentation environment, but its design should feel like a credible, production-ready SaaS product.

## 1. Design direction

I want a distinctive visual identity that does NOT look like a typical AI-generated SaaS dashboard.

Avoid:
- Purple and blue gradient backgrounds.
- Glassmorphism.
- Excessive rounded cards.
- Floating glowing AI orbs.
- Generic chatbot layouts.
- Oversized headings and excessive whitespace.
- Decorative illustrations that add no functional value.
- The typical AI landing page aesthetic.

Instead, aim for a combination of:

- Editorial design.
- Modern developer tooling.
- Refined European SaaS aesthetics.
- Functional information architecture.
- Subtle industrial and technical influences.

The result should feel carefully art-directed, calm, intelligent and professional.

It should have personality without sacrificing usability.

## 2. Visual identity

Use a restrained, cohesive palette.

Suggested direction:
- Background: warm off-white (#F7F6F2).
- Main surfaces: white (#FFFFFF).
- Primary text: deep charcoal (#242521).
- Secondary text: muted grey (#777873).
- Borders: subtle warm grey (#E7E5DF).
- Primary accent: muted cobalt blue (#4967A8).
- Secondary accent: restrained muted green for successful states.
- Warning and error colors should be understated but clear.

Use color purposefully. Most of the interface should remain neutral.

Typography:
- Use a refined sans-serif font for the interface.
- Consider a subtle editorial serif for selected page headings or marketing-style moments.
- Use a monospace font for technical information, IDs, code, tokens and execution logs.
- Establish a clear and consistent type scale.

Layout:
- Use a persistent left sidebar.
- A compact top bar for breadcrumbs, workspace context and user settings.
- Main content should have clear hierarchy and consistent alignment.
- Prefer structured tables, lists, tabs and split panels over endless cards.
- Use subtle borders and restrained shadows.
- Use consistent spacing throughout.

## 3. Application structure

Create the following main navigation:

**Overview**
A workspace overview showing:
- Recent activity.
- Recent AI executions.
- Configured models.
- Knowledge bases.
- Connected tools.
- Quick access to create a new experiment.

**Playground**
An interactive environment for testing LLMs.

Include:
- Model selector.
- System prompt editor.
- User input area.
- Temperature and token settings.
- Response panel.
- Token usage and estimated cost.
- Conversation history.

The layout should feel more like a developer workbench than ChatGPT.

**Knowledge**
Manage knowledge bases used for RAG.

Include:
- Knowledge base list.
- Document upload area.
- Document status.
- Processing status.
- Chunk count.
- Embedding information.
- Search and filtering.

**Tools & Integrations**
A place to manage tools that AI models can use.

Include:
- Connected integrations.
- Available tools.
- Tool descriptions.
- Connection status.
- API configuration placeholders.
- MCP server configuration area.

**Workflows**
A visual overview of AI workflows.

Include:
- Workflow list.
- Workflow status.
- Trigger type.
- Last execution.
- Create workflow action.

Do not overcomplicate the workflow builder at this stage.

**Execution Logs**
A technical view of AI activity.

Include:
- Execution history.
- Model used.
- Duration.
- Token usage.
- Estimated cost.
- Execution status.
- Expandable details showing tool calls and execution steps.

**Settings**
Workspace settings, API configuration and preferences.

## 4. Core UI components

Build a consistent component system for:
- Buttons and button variants.
- Inputs and textareas.
- Select menus.
- Tabs.
- Tables.
- Status indicators.
- Badges.
- Dialogs.
- Dropdown menus.
- Tooltips.
- Toast notifications.
- Empty states.
- Loading states.
- Error states.
- Code blocks.
- Technical metadata panels.

Use consistent border radii, spacing, typography and interaction patterns.

Avoid creating a different visual style for every page.

## 5. Design system documentation

This is particularly important.

Create a reusable and clearly documented design system that can be followed by another AI coding assistant (Claude Code) when implementing future functionality.

Document:
- Color tokens.
- Typography scale.
- Spacing scale.
- Border radius values.
- Shadows.
- Layout rules.
- Component variants.
- Button styles.
- Form styles.
- Table styles.
- Navigation patterns.
- Responsive behavior.
- Interaction states.

Centralize design tokens using CSS variables.

Use reusable components rather than page-specific styling.

Create a DESIGN_SYSTEM.md file that explains the visual rules and component conventions.

The design system should be easy to extend without introducing inconsistent styles.

## 6. Technical implementation

Use:
- React.
- TypeScript.
- Tailwind CSS.
- shadcn/ui where appropriate.
- Lucide icons.

Keep the code modular and maintainable.

Create reusable layouts and components.

Use realistic mock data to demonstrate the interface.

Do not build a backend or implement real AI integrations yet.

Do not introduce unnecessary dependencies.

## 7. Responsive design

The application is primarily a desktop workspace.

Optimize the desktop experience first, but ensure that:
- Navigation adapts to smaller screens.
- Tables remain usable.
- Panels stack sensibly.
- Forms remain accessible.
- No horizontal overflow occurs unnecessarily.

## 8. Overall quality expectations

The most important thing is that this should look like a real product designed by an experienced product designer.

Prioritize:
1. Strong visual identity.
2. Excellent information hierarchy.
3. Consistency across all pages.
4. High usability.
5. Reusable design system.
6. Maintainable component architecture.

Do not simply generate a collection of generic dashboard cards.

Think carefully about the relationship between navigation, content density, typography, spacing and interaction.

Build a coherent application where every page feels like part of the same product.

Start by establishing the design system and application shell, then implement the main pages using that system.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/caa0abc0-80c9-4268-a7c8-677bdb548201).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

## Frontend architecture

The frontend is a client-rendered React 19, TypeScript and Vite application.
React Router route definitions live in `src/router.tsx`; page components live in
`src/routes/`, and `src/main.tsx` mounts the app from `index.html`. Vite serves
the SPA entry for local navigation. Production hosting should be configured to
serve `index.html` for application routes such as `/workflows`.

Tailwind CSS 4 is loaded through the Vite plugin and `src/styles.css`. Existing
workspace components, shadcn/ui components, design tokens and visual guidance
in this document remain the source of truth for UI changes.

Useful commands:

```sh
npm run typecheck
npm run lint
npm test
npm run build
```
