# Orqam (أرقام)

> Course DLBCSPJWD01 (IU) | Author: Mahmoud Taleb | Repository: https://github.com/MahmoudTaleb55/Orqam

**A full-stack, multi-tenant ERP prototype for accounting and business operations, built for Arabic-speaking and MULTI-region businesses — with first-class global support.**

Orqam ("numbers" in Arabic) is a double-entry accounting and business-operations platform: IFRS-aligned books, sales & purchases, inventory, banking, HR & payroll, fixed assets, reporting, an AI assistant, and document/receipt processing — all under strict per-company (workspace) isolation.

> Academic / portfolio note: this is a working prototype engineered to production patterns. Where a control is aspirational rather than implemented, this document says so explicitly. Nothing here is claimed that the codebase does not do.

---

## Table of contents

- [Highlights](#highlights)
- [Technology stack](#technology-stack)
- [Architecture](#architecture)
- [Workspace isolation (defense in depth)](#workspace-isolation-defense-in-depth)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Where your data lives](#where-your-data-lives)
- [Adding a country localization pack](#adding-a-country-localization-pack)
- [Scripts](#scripts)
- [Testing](#testing)
- [Security posture](#security-posture)
- [Project layout](#project-layout)
- [Screenshots](#screenshots)
- [Status & roadmap](#status--roadmap)
- [License](#license)

---

## Highlights

- **Double-entry accounting** — chart of accounts, journal entries, IFRS-oriented statements. Postings are balanced and committed atomically (the bank-transaction → journal-entry write is a single database transaction).
- **Business operations** — Sales (customers, invoices, receipts, AR aging), Purchases (vendors, bills, AP payments, AP aging), Inventory (items, categories, locations, valuation; items and categories can be deleted, and items already in use are protected from deletion), Banking, HR & Payroll (attendance, leave, payroll runs), Fixed Assets (depreciation, impairment, revaluation, disposal).
- **Multi-tenant by design** — every workspace's data is isolated at the database layer (PostgreSQL row-level security) in addition to route-level authorization and composite foreign keys.
- **Localization** — the entire in-app UI is fully translated across **English, Arabic, German, and French**, with direction following the locale (RTL for Arabic, LTR otherwise). English is the default; any locale is user-selectable and switches every label, dialog, table, and message. Per-country business packs (tax rate, weekend days, leave, social-insurance, end-of-service) for MENA (SA, AE, EG, KW, QA, JO) **and** global markets (INTL, US, GB, DE, FR, IN), 12 packs in total (code GB is the United Kingdom).
- **AI assistant** — natural-language accounting actions, receipt/invoice vision extraction, and document generation (server-side only; API keys never reach the browser).
- **Private object storage** — documents and avatars live in a private S3 bucket (server-side encryption, no public access); protected downloads are proxied through the authenticated backend.

## Technology stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Radix UI (shadcn-style), Wouter, TanStack React Query, React Hook Form, Zod, Recharts.
**Backend:** Node.js, Express 5 (ESM), TypeScript, Passport (local email/password + Google/Microsoft OIDC), `express-session` with PostgreSQL-backed session store.
**Data:** PostgreSQL via Drizzle ORM; migrations via Drizzle Kit and a checked-in SQL migration runner. Shared schema (`shared/schema.ts`) and API contracts (`shared/routes.ts`).
**AI:** OpenAI SDK (server-side); `OPENAI_BASE_URL` and the `AI_*` model variables let a deployment target any OpenAI-compatible endpoint/model without code changes.
**Object storage:** AWS S3 (or any S3-compatible service) via the AWS SDK v3.
**Testing:** Vitest (unit + DB/S3 integration), Playwright (end-to-end).

## Architecture

```
Browser (React SPA)
   │  REST /api/*  (TanStack Query; workspace id sent as X-Company-Id)
   ▼
Express 5
   │  session + passport → global /api gate (auth + role) → withCompanyScope
   ▼
Business modules (accounting, sales, purchases, inventory, banking, HR, assets)
   │  Drizzle ORM, request-scoped DB client pinned to the active workspace
   ▼
PostgreSQL  — row-level security keyed on the active company
   │
   └── OpenAI  (server-side AI calls)
```

Every authenticated `/api/*` request runs inside `withCompanyScope(companyId, …)`, which pins a database client whose `app.current_company_id` setting the RLS policies consult — so a query that omits a `WHERE company_id = …` filter returns zero rows for the wrong tenant rather than leaking data.

## Workspace isolation (defense in depth)

Three independent layers, so a mistake in any one does not cause a cross-tenant leak:

1. **Route authorization** — `requireAuth` + membership resolution reject unauthenticated or wrong-workspace requests; client-supplied company ids are verified against the caller's memberships, never trusted blindly.
2. **Composite foreign keys** — cross-table references are keyed on `(id, company_id)`, so the database physically refuses to link rows across workspaces.
3. **Row-level security** — every workspace-scoped table enables and *forces* RLS with a `workspace_isolation` policy; the connecting role is a non-superuser so the policy always applies. Policies are re-asserted on every boot from a single source of truth, with a periodic production drift sweep.

Full design rationale: [`docs/design/workspace-isolation-defense-in-depth.md`](docs/design/workspace-isolation-defense-in-depth.md). Runtime proof: `server/__tests__/cross-workspace-isolation.test.ts`.

## Getting started

**Prerequisites:** Node.js 20+, a PostgreSQL database (local, or hosted such as Supabase or Neon). The `DATABASE_URL` user must be able to `CREATE ROLE` / `GRANT` (migration 0008 creates the `app_api` role automatically; a local superuser or the Supabase `postgres` user works). For a hosted provider that offers connection pooling, use the **session-mode** pooler (or a direct connection) — not a transaction-mode pooler — because the per-request workspace scoping relies on session-level settings persisting on one connection. Choose a database region close to your users; a distant region adds latency to every request. **Object storage (AWS S3 or any S3-compatible service) is optional** — without it, uploaded documents/avatars fall back to local disk (suitable for development; for production or multi-instance deployments, configure your own private S3 bucket). OpenAI and OAuth credentials are also optional — those features simply stay dormant when unconfigured.

Local Postgres quick start (Docker):

```bash
docker run --name orqam-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=orqam -p 5432:5432 -d postgres:16
# then in .env: DATABASE_URL=postgresql://postgres:postgres@localhost:5432/orqam
```

```bash
# 1. Clone and install dependencies
git clone https://github.com/MahmoudTaleb55/Orqam.git
cd Orqam
npm install

# 2. Configure environment
cp .env.example .env              # macOS/Linux
# Copy-Item .env.example .env   # Windows PowerShell
#    Then edit .env — at minimum set DATABASE_URL and SESSION_SECRET (see below).

# 3. Create the database schema
npm run db:push

# 4. Run in development
npm run dev            # serves API + client on http://localhost:5000
```

On boot the server applies all SQL migrations and installs the RLS policies.

**First use:** open http://localhost:5000, choose **Sign up**, create an account, then create a workspace (company). The IFRS chart of accounts is seeded when the first workspace is created. There are no demo credentials.

> For local development, S3 should be off: leave `OBJECT_STORAGE_PROVIDER` and `AWS_S3_BUCKET` empty in `.env` (the shipped `.env.example` does) and uploads are stored on local disk under `uploads/`.

## Environment variables

**Required** (the app will not run securely without these):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string. For hosted Postgres over the internet, enable TLS (e.g. `?sslmode=require`). With a connection pooler (Supabase, PgBouncer), use the **session-mode** endpoint (commonly port `5432`), not transaction mode (`6543`) — workspace scoping sets a session variable that must survive across the queries in a request. URL-encode any special characters in the password. |
| `SESSION_SECRET` | Random secret that signs session cookies. **Generate one**, do not reuse the placeholder: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. In production the server refuses to boot if this is missing or shorter than 32 characters. |

**Optional** (each enables a feature; absent = feature disabled, app still works):

| Variable | Enables |
|---|---|
| `OPENAI_API_KEY`, `OPENAI_BASE_URL` | AI assistant, receipt/document extraction. Server-side only. |
| `AI_CHAT_MODEL` | Chat model (default `gpt-4o`). |
| `AI_VISION_MODEL` | Receipt/document vision extraction model (default `gpt-4o`). |
| `AI_IMAGE_MODEL` | Image generation model (default `gpt-image-1`). |
| `AI_TRANSCRIBE_MODEL` | Audio transcription model (default `gpt-4o-mini-transcribe`). |
| `AI_TTS_MODEL` | Text-to-speech model (default `gpt-4o-mini-tts`). |
| `DB_POOL_MAX`, `DB_SESSION_POOL_MAX` | Sizes of the request-scoped and session-store connection pools (defaults 8 and 4). Their sum must stay below your database/pooler connection limit. |
| `DB_ACQUIRE_TIMEOUT_MS` | Milliseconds to wait for a pooled connection (default 10000). |
| `RESEND_API_KEY`, `EMAIL_FROM` | Outbound email (password reset, invitations). Without `RESEND_API_KEY` no emails are sent; invitations can still be shared via copy-link in Settings > Members. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | "Continue with Google" SSO. Buttons appear only when configured. |
| `MICROSOFT_CLIENT_ID` / `MICROSOFT_CLIENT_SECRET` | "Continue with Microsoft" SSO. |
| `OBJECT_STORAGE_PROVIDER=s3`, `AWS_REGION`, `AWS_S3_BUCKET` | S3 document/avatar storage. Without it, files fall back to local disk (development only). For local dev, clear `OBJECT_STORAGE_PROVIDER` and `AWS_S3_BUCKET`. |
| `AWS_S3_ENDPOINT` | Custom endpoint for S3-compatible services (e.g. MinIO). Leave blank for Amazon S3. |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` | Static AWS credentials. Prefer an IAM role or the standard AWS credential chain. |
| `APP_URL` / `PUBLIC_APP_URL` | Public base URL used to build links in outbound emails (reset/invite). |

Credentials live only in `.env` (git-ignored). In production, prefer an AWS IAM role or the standard AWS credential chain over static access keys, and inject secrets via the deployment platform rather than a committed file. **Never** place secrets in `VITE_`-prefixed variables — those are exposed to the browser.

## Where your data lives

All business data (users, companies, invoices, journal entries, …) is stored in **the PostgreSQL database you point `DATABASE_URL` at** — never in the code or the repository. Uploaded files go to your configured object storage (or local disk in development). Consequences:

- Each operator runs against **their own** database, so cloning this repo gives you the application, not anyone else's data. Set your own `DATABASE_URL` and you start with an empty, private system.
- Data persists across `npm run dev` restarts because databases are durable — restarting the server does not reset rows. To start fresh, point at a new/empty database (or drop and re-run `npm run db:push`).
- Never share your `DATABASE_URL`: it contains the credentials to your database.

## Adding a country localization pack

Per-country rules (currency, VAT/GST rate, weekend days, annual leave, probation, social-insurance rates, end-of-service formula) live in a single file: **`shared/localization.ts`**. To add a country, append one entry to `LOCALIZATION_PACKS`:

```ts
BH: {
  code: "BH", nameAr: "البحرين", nameEn: "Bahrain",
  defaultCurrencyCode: "BHD", defaultCurrencySymbol: "د.ب",
  defaultVatRate: 0.10, zakatApplicable: true,
  weekendDays: [5, 6], annualLeaveDays: 30, probationDays: 90,
  socialInsurance: { label: "GOSI", employeeRate: 0.07, employerRate: 0.12 },
  endOfServiceFormula: "gulf",
},
```

No schema change or migration is needed — the settings UI reads the pack list from the API, and payroll/leave logic consume it via `getPack()`. Shipped packs today: INTL, SA, AE, EG, KW, QA, JO (MENA) and US, GB, DE, FR, IN (global).

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server (API + Vite client) on port 5000. |
| `npm run build` | Production build (Vite client + esbuild server bundle). |
| `npm start` | Run the production build. |
| `npm run check` | TypeScript type-check (`tsc`). |
| `npm test` | Run the Vitest suite (unit + DB/S3 integration). |
| `npm run test:watch` | Vitest in watch mode. |
| `npm run test:e2e` | Playwright end-to-end suite. |
| `npm run db:push` | Apply the Drizzle schema to the database. |

## Testing

> **Warning:** the DB-backed Vitest suites and the Playwright suite write real rows to the database in `DATABASE_URL`. Run them only against a throwaway database, never your real data.

- **Unit & integration (Vitest):** pure-logic tests plus database- and S3-backed integration tests that run against real services. The DB/S3 tests skip cleanly when `DATABASE_URL` / S3 are not configured, so the suite stays green in any environment. They run serially (`fileParallelism: false`) because they share one database and rely on connection-scoped settings.
- **End-to-end (Playwright):** run `npx playwright install` once; the suite starts the dev server itself (set `PLAYWRIGHT_NO_WEBSERVER` to reuse a server you already started). `npx playwright test --list` currently lists 371 tests in 92 spec files, covering auth, role-based access, workspace isolation, reporting, and UI behavior across locales.

`node ./node_modules/vitest/vitest.mjs list` currently lists 264 tests in 33 files.

Notable integration tests: bank-transaction journal atomicity, cross-workspace isolation (RLS proof), session revocation, and S3 document/avatar round-trips under a least-privilege IAM user.

## Security posture

Implemented and verifiable today:

- PostgreSQL row-level security for per-workspace data isolation (re-asserted on every boot; production drift monitoring).
- Session cookies: `httpOnly`, `sameSite=lax`, `secure` in production; secret validated at boot; sessions invalidated on password reset / change / "sign out other sessions".
- Rate limiting on sign-in, sign-up, password-reset, and invitation endpoints.
- Upload validation by file **content** (magic bytes), not the client-declared type; 2 MB avatar cap.
- Private S3 bucket with server-side encryption and Block Public Access; downloads proxied through the authenticated backend.
- OAuth: provider email must be verified; an OAuth login cannot silently take over a pre-existing password account; outbound email links are built from a trusted base URL (not the request `Host` header).
- Server-side-only handling of all API keys and credentials.

Honest limitations (not yet implemented): no CSRF token layer or Content-Security-Policy yet; no two-factor authentication; no managed encryption-at-rest beyond S3 defaults; no third-party security certification.

## Project layout

```
client/            React SPA (pages, components, contexts, i18n)
server/            Express app
  routes.ts          main API routes
  storage.ts         data-access layer (IStorage)
  db.ts              Drizzle + request-scoped workspace client
  auth/              local auth, membership middleware, email
  ai/                OAuth (OIDC), object storage (S3), chat/image, audio, batch
  services/          document & avatar storage, extraction, PDF
shared/            schema.ts, routes.ts, localization packs (contracts shared by client + server)
migrations/        checked-in SQL migrations (applied in order on boot)
tests/e2e/         Playwright specs
docs/design/       architecture decision records
script/            build script (npm run build)
scripts/           pre-commit and migration check scripts
docs/              design documents
uploads/           runtime local-disk uploads (created when S3 is off)
```

## Status & roadmap

**Done:** multi-tenant with RLS; full four-language localization (English/Arabic/German/French) across the entire in-app UI; S3 document/avatar storage; OAuth (Google/Microsoft); accounting-integrity guards (atomic postings, over-application and disposed-asset guards, journal/subledger reversal integrity); automated security scanning with the high-severity findings and a batch of medium/low findings remediated; connection-pool model tuned to stay resilient on a hosted/connection-limited Postgres; vendor + route code-splitting for load performance.

**Roadmap:** CSRF/CSP hardening; two-factor authentication; remaining low-severity security findings; localization of the public marketing pages (the in-app product is fully localized); real bank-feed integration via an Open Banking aggregator (today's banking module is manual entry); expanded automated test coverage.

---

## Screenshots

No screenshots are committed yet. Screens worth capturing:

- Dashboard (English)
- Invoice creation / sales view
- Arabic RTL view
- AI assistant

## License

MIT. See [LICENSE](LICENSE).

---

*Orqam is a software tool for managing finances; it is not a substitute for professional tax, legal, or accounting advice.*
