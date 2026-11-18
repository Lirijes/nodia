# CI, PR-flöde och auto-merge – nodia (frontend)

Allt utvecklingsarbete sker på feature-brancher. `main` ändras bara via PR:er
som har passerat alla obligatoriska kontroller. Samma upplägg finns i backendrepot
`NodiaApi`, vars `CI.md` även beskriver GitHub-appen och inställningarna i detalj.

## Flödet

1. Pusha en branch som heter `feature/<något>`.
2. **Auto PR** skapar en **draft-PR** mot `main` (om ingen öppen PR finns).
3. **Frontend CI** och **Sensitive change gate** körs på PR:en vid varje push.
4. Markera PR:en **Ready for review** → **Auto-merge** slås på (squash).
5. GitHub mergar automatiskt när alla obligatoriska kontroller är gröna.

Direkt push, force push och radering av `main` blockeras av rulesetet
`main-protection`. Inga undantag finns – inte för admin och inte för appen.

## Workflows

| Fil                  | Händelse                                                                         | Gör                                                       |
| -------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `ci.yml`             | PR mot `main`, push till `main`                                                  | `npm ci`, typecheck, lint, test (Vitest), build           |
| `auto-pr.yml`        | push till `feature/**`                                                           | skapar draft-PR om ingen finns och branchen har ändringar |
| `auto-merge.yml`     | `pull_request_target`: opened, reopened, ready_for_review, converted_to_draft    | slår på/av auto-merge (squash); aldrig för forkar         |
| `sensitive-gate.yml` | `pull_request_target`: opened, reopened, synchronize, edited, labeled, unlabeled | spärr för känsliga ändringar                              |

## Obligatoriska kontroller

| Check                           | Workflow             |
| ------------------------------- | -------------------- |
| `Typecheck, lint, test & build` | `ci.yml`             |
| `Sensitive change gate`         | `sensitive-gate.yml` |

## Känsliga ändringar

`Sensitive change gate` blir röd tills en människa med rollen admin/maintain sätter
etiketten `approved-sensitive`. Godkännandet blir ogiltigt vid varje ny push. Reglerna
är desamma som i `NodiaApi/CI.md`. Sökvägar i detta repo:

- autentisering, sessioner och route-skydd: `src/lib/auth.tsx`, `supabase.ts`, `api.ts`,
  `workspace-context.tsx`, `workspaces.ts`, `src/router.tsx`, `src/routes/login.tsx`,
  `signup.tsx`, `src/components/workspace/auth-layout.tsx`
- databas: `supabase/**`, `drizzle/**`
- beroenden: `package.json`, `package-lock.json`, `.npmrc`
- bygg- och kvalitetskonfiguration: `vite.config.ts`, `vitest.config.ts`,
  `eslint.config.js`, `tsconfig*.json`, `index.html`
- miljövariabler: `.env*`
- CI: `.github/**`

**Så godkänner du:** granska ändringarna, öppna PR:en och välj `approved-sensitive`
under **Labels** i högerspalten. Etiketten skapas en gång under _Issues → Labels_.

## Inställningar i GitHub (nodia)

GitHub-appen, variabeln `PR_BOT_CLIENT_ID` och secreten `PR_BOT_PRIVATE_KEY` beskrivs
i `NodiaApi/CI.md` (appen är gemensam och installerad på båda repona).

1. **Settings → General → Pull Requests**
   - ☐ Allow merge commits · ☑ Allow squash merging · ☐ Allow rebase merging
   - ☑ Always suggest updating pull request branches
   - ☑ **Allow auto-merge**
   - ☑ Automatically delete head branches
2. **Settings → Actions → General**
   - Workflow permissions: _Read repository contents and packages permissions_
   - ☐ Allow GitHub Actions to create and approve pull requests
   - Fork-PR:er: _Require approval for all external contributors_
3. **Settings → Rules → Rulesets:** `main-protection` importerat från
   `.github/rulesets/main-protection.json`, _Bypass list_ tom, _Enforcement_ _Active_.
4. **Issues → Labels:** etiketten `approved-sensitive`.

## Verifiera

Som i `NodiaApi/CI.md`: en ofarlig ändring på en feature-branch ska ge en draft-PR och
auto-mergas efter _Ready for review_. En ändring i t.ex. `src/lib/auth.tsx` ska stoppas
av `Sensitive change gate` tills `approved-sensitive` sätts.
