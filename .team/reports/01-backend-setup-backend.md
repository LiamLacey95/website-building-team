# Report: 01-backend-setup (Backend)

Date: 2026-11-01. State: DONE.

## Deliverables

| # | Deliverable | Path |
|---|---|---|
| 1 | Stack decision guide covering 5 site types (brochure, small business + booking, content-heavy, e-commerce lite, web app): stack, hosting, CMS, forms, monthly costs, client maintenance, sources cited | `F:\ArtGen\Website Test\docs\api\stack-playbook.md` |
| 2 | Templates | `F:\ArtGen\Website Test\docs\api\_templates\stack-proposal.md`, `contract.md`, `CHANGELOG.md`, `deploy.md` |
| 3 | Toolchain check | below, and repeated in the playbook |

`server/` was not scaffolded, as the brief asked.

## Key defaults

- Content sites: Astro 7.4.4 static on Cloudflare Pages (free, commercial use allowed) or Netlify (Forms are unlimited and free on credit plans since 2026-04-14).
- Forms: one server endpoint (Zod 4 validation, Cloudflare Turnstile, per-IP rate limit, Resend email with 3k free a month), or Netlify Forms with no code.
- CMS: Sanity Free (20 seats, 10k docs) for structured content; Keystatic or Decap when git-based editing is enough; Storyblok for visual page building.
- Apps: Next.js 16.4 or SvelteKit 3, Neon or Supabase, Drizzle, Better Auth.
- Avoid Vercel Hobby for client work: it's non-commercial only, and Pro costs $20 a seat.

## Research caveats

- Package versions are authoritative: they came from `npm view` on 2026-11-01.
- Most prices came from third-party trackers, because vendor pricing pages weren't readable through search. Sources disagreed on a few figures (the Neon Launch minimum, the Cloudflare free request cap, the Storyblok Starter price), and the playbook marks those *(unconfirmed)*. We re-check vendor pages before quoting any number to a client.

## Toolchain

| Tool | Version | Status |
|---|---|---|
| Node | 24.11.1 | OK |
| npm / npx | 11.6.2 | OK |
| pnpm | 11.9.0 | OK |
| Bun | 1.4.3 | OK |
| Python | 3.14.2 (`py`/`python3`), 3.11.15 (`python`) | OK. Two interpreters, so call them explicitly |
| git | 2.51.2 | OK |
| gh | 2.86.0 | OK |
| sqlite3 | 3.50.6 | OK |
| Docker | 29.2.0 CLI | **Gap:** the daemon isn't running (Docker Desktop is stopped). It's only needed for a self-hosted CMS (Payload or Strapi) or local Postgres |
| psql | missing | Gap: only needed for Postgres projects |
| wrangler / vercel / netlify-cli | not global | We install them per project as devDependencies once the host is chosen (latest: 4.156.0 / 65.9.0 / 27.16.1) |
| Stripe CLI, Supabase CLI | missing | We install them only if a project needs local webhooks or local Supabase |

Nothing large was installed.

## Needs

Nothing for now. Once a project starts, I'll need the hosting, email and CMS accounts in the client's name (I'll raise a QUESTION when that comes up).
