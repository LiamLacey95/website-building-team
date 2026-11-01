# Deployment notes: <project name>

Lives at `projects/<slug>/api/deploy.md`. Owner: Backend. Feeds: **Gate 4**. Last verified deploy: <YYYY-MM-DD, commit SHA>.

## Overview

| | |
|---|---|
| Host | <e.g. Cloudflare Pages, project `<name>`> |
| Production URL | <https://...> |
| Preview URLs | <per-branch pattern> |
| Repo / branch that deploys | `master` → production; other branches → preview |
| Build command | `<pnpm build>` |
| Output dir | `<projects/<slug>/web/dist>` |
| Node version | <24.x>, pinned via `<.nvmrc / engines>` |

## Accounts (owned by the client unless noted)

| Service | Purpose | Account owner | Plan | Who has access |
|---|---|---|---|---|
| | | | | |

## Environment variables

Set in the host dashboard for Production and Preview separately. Names and descriptions live in `.env.example`; values never go in the repo.

| Name | Used by | Prod | Preview | Notes |
|---|---|---|---|---|
| | | set / unset | set / unset | |

## DNS and domain

- Registrar: <...>. Renewal date: <...>. Auto-renew: <on/off>.
- Records: <apex/www → host>, email records (SPF, DKIM, DMARC for Resend/sending domain).
- HTTPS: <automatic via host>. HSTS: <yes/no>.

## First-time setup (from zero)

1. <create host project, connect repo>
2. <set env vars>
3. <verify sending domain in email provider>
4. <create Turnstile widget, add hostnames>
5. <add custom domain, wait for certificate>
6. <run smoke test below>

## Routine deploy

Merging to `master` triggers a production build. Content edits in the CMS trigger a rebuild via webhook `<name>`.

## Smoke test after each deploy

- [ ] Home and key pages return 200; 404 page works
- [ ] Contact form: valid submission arrives by email; invalid shows field errors; rate limit returns 429
- [ ] `sitemap.xml` and `robots.txt` correct for production (no `noindex`)
- [ ] Redirects resolve
- [ ] No secrets or source maps exposed

## Rollback

<e.g. host dashboard → Deployments → promote previous build; or `git revert` + push>. Expected time: <minutes>.

## Monitoring and maintenance

- Uptime / errors: <...>
- Backups: <CMS dataset export schedule / DB PITR>
- Dependency updates: <cadence, who>
- Costs to watch: <credit usage, email quota, seats>

## Handover checklist for the client

- [ ] Client owns domain, host, CMS, email and payment accounts
- [ ] Team members removed or downgraded after handover
- [ ] Editing guide delivered
