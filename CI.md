# CI, PR-flöde och auto-merge – nodia (frontend)

Allt utvecklingsarbete sker på feature-brancher. `main` ändras bara via PR:er
som har passerat alla obligatoriska kontroller. Samma upplägg finns i backendrepot
`NodiaApi`, vars `CI.md` även beskriver GitHub-appen och inställningarna i detalj.
Den här filen tar upp det som skiljer sig, främst **Lovable**.

## Flödet

1. Pusha en branch som heter `feature/<något>` (eller låt Lovable pusha till `feature/lovable`).
2. **Auto PR** skapar en **draft-PR** mot `main` (om ingen öppen PR finns).
3. **Frontend CI** och **Sensitive change gate** körs på PR:en vid varje push.
4. Markera PR:en **Ready for review** → **Auto-merge** slås på (squash).
5. GitHub mergar automatiskt när alla obligatoriska kontroller är gröna.
6. **Sync Lovable branch** mergar `main` tillbaka in i `feature/lovable`.

Direkt push, force push och radering av `main` blockeras av rulesetet
`main-protection`. Inga undantag finns – inte för admin, Lovable eller appen.

## Workflows

| Fil                       | Händelse                                                                         | Gör                                                                   |
| ------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `ci.yml`                  | PR mot `main`, push till `main`                                                  | `npm ci`, typecheck, lint, test (Vitest), build                       |
| `auto-pr.yml`             | push till `feature/**`                                                           | skapar draft-PR om ingen finns och branchen har ändringar             |
| `auto-merge.yml`          | `pull_request_target`: opened, reopened, ready_for_review, converted_to_draft    | slår på/av auto-merge (squash); aldrig för forkar                     |
| `sensitive-gate.yml`      | `pull_request_target`: opened, reopened, synchronize, edited, labeled, unlabeled | spärr för känsliga ändringar                                          |
| `sync-lovable-branch.yml` | push till `main`, manuellt                                                       | mergar `main` in i `feature/lovable` (merge commit, ingen force push) |

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

Lovable ändrar ofta `package.json`/`package-lock.json`. Sådana Lovable-PR:er kräver
alltså manuellt godkännande, och det är avsiktligt.

## Lovable

Lovable synkar mot **en** branch åt gången. Den branchen ska vara `feature/lovable`,
aldrig `main`.

```
Lovable ⇄ feature/lovable ──(draft-PR, CI, gate, auto-merge)──▶ main
              ▲                                                  │
              └──────────── Sync Lovable branch (merge) ─────────┘
```

- Varje Lovable-push till `feature/lovable` öppnar (eller uppdaterar) en draft-PR.
  Markera den _Ready for review_ när ändringarna ska till `main`.
- Efter squash-mergen mergar `sync-lovable-branch.yml` in `main` i `feature/lovable`
  med en vanlig merge commit. Ingen historik skrivs om, så Lovable påverkas inte, och
  nästa Lovable-PR innehåller bara nya ändringar. Synken sker också när andra
  feature-brancher mergas, så Lovable ser hela kodbasen.
- `feature/lovable` skyddas av rulesetet `lovable-branch-protection` (ingen radering,
  ingen force push).

### Konfigurera Lovable (gör detta innan rulesetet för main aktiveras)

1. Lovable-projektet → **Project settings → Git → GitHub** → öppna **branch picker**.
   Medan `main` är aktiv: skapa branchen `feature/lovable` (den skapas från den aktiva
   branchen). Finns den redan på GitHub: välj den.
2. Byt till `feature/lovable`. Lovable börjar direkt redigera och synka den branchen.
3. Gör en liten ändring i Lovable och kontrollera att commiten hamnar på
   `feature/lovable` (inte `main`) och att en draft-PR skapas.

Du kan inte byta branch medan Lovable redigerar projektet.

### Om något går fel med Lovable

- **Lovable pushar till `lovable-sync`:** GitHub avvisade en push, oftast för att
  branchen hade nya commits som Lovable inte kunde lägga sig ovanpå. Merga
  `lovable-sync` in i `feature/lovable` med en **merge commit** (inte squash eller
  rebase) och radera sedan `lovable-sync`.
- **Synkjobbet misslyckas med konflikt eller "Manuell synk krävs":**
  ```sh
  git fetch origin
  git switch feature/lovable && git pull --ff-only
  git merge origin/main        # lös ev. konflikter
  git push origin feature/lovable
  ```
  Ändrade workflows (`.github/workflows/**`) på `main` kräver alltid detta manuella
  steg, eftersom appen saknar behörigheten _Workflows_.
- **Synkjobbet misslyckas vid push:** Lovable pushade samtidigt. Kör om jobbet
  (_Actions → Sync Lovable branch → Re-run_).
- **Lovable visar `lovable-fallback`:** `feature/lovable` har raderats. Återskapa den
  och välj den i branch picker.
- Skriv aldrig om historiken på `feature/lovable` (ingen force push, rebase eller amend).

## Inställningar att göra i GitHub (nodia)

Gör först steg 1–3 i `NodiaApi/CI.md` (appen skapas en gång och installeras på båda
repona; variabel, secret och etikett läggs in i **detta** repo också). Sedan:

1. **Settings → General → Pull Requests**
   - ☐ Allow merge commits · ☑ Allow squash merging · ☐ Allow rebase merging
   - ☑ Always suggest updating pull request branches
   - ☑ **Allow auto-merge**
   - ☐ **Automatically delete head branches** – lämnas **avstängd** i detta repo så att
     `feature/lovable` aldrig raderas efter en merge. Rulesetet blockerar också radering,
     men GitHubs automatiska radering och rulesets har haft rapporterade avvikelser, så
     båda skydden används. Radera andra feature-brancher med _Delete branch_ på PR:en.
2. **Settings → Actions → General**
   - Workflow permissions: _Read repository contents and packages permissions_
   - ☐ Allow GitHub Actions to create and approve pull requests
   - Fork-PR:er: _Require approval for all external contributors_
3. **Konfigurera Lovable** enligt avsnittet ovan.
4. **Merga workflowen till main:** pusha `ci/pr-automation`, öppna PR manuellt och merga
   när `Typecheck, lint, test & build` är grön.
5. **Importera rulesets:** _Settings → Rules → Rulesets → New ruleset → Import a ruleset_
   - `.github/rulesets/main-protection.json`
   - `.github/rulesets/lovable-branch-protection.json`

   Kontrollera att _Bypass list_ är tom och _Enforcement status_ är _Active_ för båda.

6. **Verifiera** som i `NodiaApi/CI.md` och dessutom:
   - en Lovable-ändring ger en draft-PR från `feature/lovable`
   - efter merge körs _Sync Lovable branch_ och `feature/lovable` finns kvar
   - försök radera `feature/lovable` på GitHub → ska nekas
