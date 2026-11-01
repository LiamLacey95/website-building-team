# Stack playbook (Backend)

A decision guide for proposing a stack once a project prompt arrives. Pick the row that matches the brief, then copy `_templates/stack-proposal.md` and fill it in.

Researched 2026-11-01. **Package versions come straight from the npm registry** (`npm view <pkg> version`, same day), so they are authoritative. **Prices are mostly from third-party trackers**, because vendor pricing pages often weren't readable by our search tools, and they change often. Re-check the vendor's own pricing page before a number goes into a client-facing proposal. Each figure links its source; items marked *(unconfirmed)* had sources that disagreed.

## Guiding rules

1. **Static first.** Pre-render every page we can. Add a server only for things that truly need one (form posts, booking webhooks, auth, carts).
2. **Prefer managed services to custom servers** for a brochure or small-business site: fewer moving parts, and less for the client to maintain.
3. **One host, one bill** where we can. Pick a host whose free tier covers the forms and functions too.
4. **Whoever edits content picks the CMS.** Non-technical editors need a visual or hosted CMS; developer-only edits can live in Markdown in git.
5. **Every secret goes in host env vars**, with `.env.example` in the repo. Keys get least privilege.

## Default building blocks (current versions)

| Concern | Default | Version (npm, 2026-11-01) | Alternatives |
|---|---|---|---|
| Site framework (content sites) | Astro | `astro` 7.4.4 | Eleventy `@11ty/eleventy` 3.1.7 |
| Framework (app-like sites) | Next.js | `next` 16.4.3, `react` 19.3.1 | SvelteKit `@sveltejs/kit` 3.1.1 |
| Host adapters | `@astrojs/cloudflare` 14.4.3, `@astrojs/netlify` 8.2.10, `@astrojs/vercel` 11.0.17 | | |
| Small API / functions | Astro endpoints or Hono | `hono` 4.13.16 | host-native functions |
| Validation (shared client/server) | Zod | `zod` 4.6.7 | |
| Transactional email | Resend | `resend` 6.37.0 | Postmark, host email add-ons |
| Database (when needed) | Neon Postgres + Drizzle, or Supabase | `drizzle-orm` 0.45.4, `@supabase/supabase-js` 2.118.0 | Cloudflare D1 (SQLite) |
| Auth (when needed) | Better Auth or Supabase Auth | `better-auth` 1.7.15 | |
| Payments | Stripe | `stripe` 23.1.0 | Shopify |
| Headless CMS (hosted) | Sanity | `sanity` 6.21.0 | Storyblok |
| Git-based CMS | Keystatic or Decap | `@keystatic/core` 0.6.9, `decap-cms-app` 3.17.3 | TinaCMS `@tinacms/cli` 4.0.4 |
| Self-hosted CMS | Payload | `payload` 3.92.1 | Strapi 5.60.0, Directus |
| Deploy CLIs | | `wrangler` 4.156.0, `vercel` 65.9.0, `netlify-cli` 27.16.1 | |

## Hosting comparison

| Host | Free tier | Paid entry | Notes |
|---|---|---|---|
| **Cloudflare Pages + Workers** | Static hosting free; Workers Free has daily caps (about 100k requests/day *(unconfirmed)*; KV 100k reads and 1k writes/day) [CF limits](https://developers.cloudflare.com/workers/platform/pricing/) | $5/month account minimum covers Workers, Pages Functions, KV, Hyperdrive, Durable Objects; ~10M requests included *(third-party)* [CF pricing](https://developers.cloudflare.com/workers/platform/pricing/), [makerkit](https://makerkit.dev/pricing-calculator/cloudflare) | Best value for commercial sites. Free commercial use. Turnstile and DNS from the same account. |
| **Netlify** | 300 credits/month, hard cap, site pauses when it runs out. Forms are unlimited and free on credit plans since 2026-04-14 [Netlify changelog](https://www.netlify.com/changelog/2026-04-14-pricing-updates-april-2026.md), [docs](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) | Personal $9/month (1,000 credits); Pro from $20/month (3,000 credits), with unlimited free team members [netli.fyi](https://netli.fyi/blog/netlify-pricing-and-limits), [usagepricing](https://www.usagepricing.com/blueprint/activity/netlify-2026-07-14-pro-credit-tiers) | Built-in Forms with no code is a big win for brochure sites. Keep an eye on the credit burn. |
| **Vercel** | Hobby is free but **personal, non-commercial use only** [makerkit](https://makerkit.dev/blog/saas/vercel-cost) | Pro $20/seat/month plus usage [temps.sh](https://temps.sh/blog/vercel-pricing-2026-pro-plan-explained) | Best fit for Next.js. Client sites need Pro, so per-seat cost adds up. |

**Default host:** Cloudflare Pages for static and content sites; Netlify when we want zero-code Forms; Vercel only when the build is Next.js-heavy and the client accepts $20 a seat.

## Supporting services pricing

| Service | Free | Paid entry | Source |
|---|---|---|---|
| Resend (email) | 3,000 emails/month, 100/day | Pro $20/month for 50k | [Resend blog](https://resend.com/blog/new-free-tier), [usecarly](https://www.usecarly.com/blog/resend-pricing/) |
| Cloudflare Turnstile (spam) | Free, up to 20 widgets | Enterprise only | [CF Turnstile plans](https://developers.cloudflare.com/turnstile/plans/) |
| Web3Forms (form backend) | 250 submissions/month, one recipient | paid tiers | [agentdeals](https://agentdeals.dev/vendor/web3forms) |
| Formspree (form backend) | ~50 submissions/month *(third-party)* | paid tiers | [Formspree limits](https://help.formspree.io/articles/account-management/account-limits) |
| Sanity (CMS) | $0: 20 seats, unlimited viewers, 10k documents | Growth $15/seat/month (25k documents, private datasets) | [sanity.io/pricing](https://sanity.io/pricing), [flowninja](https://www.flowninja.com/blog/sanity-cms-pricing) |
| Storyblok (visual CMS) | Starter free, 1 seat *(per its fact sheet)* | Growth $99/month (5 seats) | [Storyblok 2026 factsheet](https://a.storyblok.com/f/88751/x/454af31b24/2026-pricing-plan-factsheet.pdf), [Capterra](https://www.capterra.com/p/213991/Storyblok/pricing/) |
| Cal.com (booking) | Free forever, 1 user | Teams ~$12/user/month (yearly billing) | [koalendar](https://koalendar.com/blog/cal-com-pricing), [toolradar](https://toolradar.com/tools/cal-com/pricing) |
| Supabase (DB + auth) | 500 MB DB, 50k MAU, pauses after 1 week idle | Pro $25/month plus compute | [makerkit](https://makerkit.dev/blog/saas/supabase-pricing), [jetadmin](https://www.jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs/) |
| Neon (Postgres) | 100 CU-hours, 0.5 GB/project, suspends at limit | Launch pay-as-you-go (~$0.106/CU-hour) *(the docs say $5 minimum)* | [neon.com/pricing](https://neon.com/pricing), [Neon plans docs](https://neon.com/docs/introduction/plans) |
| Stripe (payments) | No monthly fee | 2.9% + 30¢ per US card charge; +1.5% international | [flexprice](https://flexprice.io/blog/stripe-pricing-breakdown-2026), [superdupr](https://superdupr.com/blog/stripe-fees) |
| Shopify | n/a | Starter $5/month (5% + 30¢ card fees, no Oxygen); Basic $39/month or $29/month billed yearly | [stylefactory](https://www.stylefactoryproductions.com/blog/shopify-fees), [demandsage](https://www.demandsage.com/?p=34726), [weaverse](https://blog.weaverse.io/blogs/shopify-headless-pricing) |

---

## 1. Brochure or portfolio

**Profile:** 3 to 10 pages, rare edits, a contact form at most.

- **Stack:** Astro (static output) + content collections (Markdown/MDX in the repo).
- **Hosting:** Cloudflare Pages (free, commercial use OK) or Netlify Free.
- **CMS:** None if we make the edits. If the client edits: Keystatic or Decap (git-based, free, no extra service), or Sanity Free for a nicer editor.
- **Forms:** Netlify Forms (zero code, unlimited) if on Netlify. Otherwise a single Pages Function or Worker that validates with Zod, checks Turnstile, and sends through Resend. Web3Forms is the no-code fallback.
- **Monthly cost:** $0 for typical traffic. Domain about $10 to $20/year.
- **Client maintains:** domain renewal, content edits, nothing else. No servers or databases.

## 2. Small business with contact or booking

**Profile:** services, location, hours, reviews, contact form, appointment booking.

- **Stack:** Astro + one or two server endpoints (`/api/contact`) on the host adapter.
- **Hosting:** Cloudflare Pages + Workers (free, or $5/month once there is real traffic) or Netlify.
- **CMS:** Sanity Free (structured content like services, staff, FAQs, testimonials) or Keystatic. Storyblok if the client wants visual page building.
- **Forms:** server endpoint with Zod validation, Turnstile, rate limiting (per-IP via KV or the host's rate-limit rules), email via Resend (free 3k/month), optional copy to a Google Sheet or DB.
- **Booking:** embed Cal.com (free for one user; Teams ~$12/user/month) or the client's existing tool (Calendly, Square, Fresha). Don't build booking ourselves unless the brief requires it.
- **SEO plumbing:** `@astrojs/sitemap`, robots.txt, `LocalBusiness` JSON-LD, NAP consistency, redirects file.
- **Monthly cost:** $0 to $5 host + $0 email + $0 to $12 booking.
- **Client maintains:** CMS content, booking calendar, Resend/Cal.com accounts (owned by the client), domain.

## 3. Blog or content-heavy

**Profile:** many articles, categories, authors, search, newsletter, multiple editors.

- **Stack:** Astro (static, with incremental rebuilds via CMS webhook). Pagefind for client-side search (static, no service).
- **Hosting:** Cloudflare Pages (unlimited static bandwidth) or Netlify.
- **CMS:** Sanity (Free for up to 20 seats and 10k docs; Growth $15/seat once it outgrows that). Git-based (Keystatic/TinaCMS) works for 1 or 2 technical editors.
- **Forms:** newsletter signup through the provider's API (Buttondown, ConvertKit/Kit, Resend Audiences) behind our endpoint so the API key stays server-side.
- **Extras:** RSS, `Article` JSON-LD, OG image generation at build time, image CDN (Astro `<Image>` with AVIF/WebP).
- **Monthly cost:** $0 to $30 depending on CMS seats.
- **Client maintains:** editorial workflow in the CMS, newsletter account, user seats.

## 4. E-commerce lite

**Profile:** under ~50 products, simple checkout, few variants.

- **Option A (simplest):** Astro site + **Stripe Checkout / Payment Links** per product. Products live in the CMS with a Stripe price ID. One webhook endpoint for order emails. Costs: Stripe fees only (2.9% + 30¢).
- **Option B (needs inventory, shipping, tax, order admin):** **Shopify** as the commerce backend. Embed Buy Buttons or use the Storefront API from Astro. Starter $5/month is fine for very small catalogs (but 5% card fees); Basic is $39/month ($29 billed yearly). Hydrogen/Oxygen is overkill for "lite".
- **Hosting:** Cloudflare Pages / Netlify (static catalog + one or two functions).
- **Security:** never trust client prices; create checkout sessions on the server from price IDs; verify webhook signatures.
- **Client maintains:** products and stock (Stripe dashboard or Shopify admin), fulfilment, tax settings, payouts.

## 5. Web app (accounts, dashboards, user data)

**Profile:** logins, per-user data, CRUD, maybe roles and payments.

- **Stack:** Next.js 16 (App Router) or SvelteKit 3, Drizzle ORM, Zod, Better Auth (or Supabase Auth).
- **Data:** Neon Postgres (scale-to-zero, cheap) or Supabase (DB + auth + storage in one; Pro $25/month for production since free projects pause).
- **Hosting:** Vercel Pro ($20/seat) for Next.js; Cloudflare Workers via adapters for SvelteKit/Hono; Netlify also fine.
- **Must-haves:** migrations in git, row-level authorization checks, rate limiting, audit of env vars, automated tests for every endpoint with logic, error tracking (Sentry free tier), backups (provider PITR).
- **Monthly cost:** roughly $25 to $70 to start (DB + host seats), then usage.
- **Client maintains:** user support, DB backups and plan, auth provider settings, and probably a developer retainer. Say this plainly in the proposal.

---

## Choosing quickly

```
Does anyone log in?                     yes -> 5 Web app
Do they sell products?                  yes -> 4 E-commerce lite
More than ~20 articles or several editors? yes -> 3 Content-heavy
Booking or a stream of leads?           yes -> 2 Small business
otherwise                                   -> 1 Brochure
```

## Local toolchain (verified 2026-11-01 on the team machine)

| Tool | Version | Status |
|---|---|---|
| Node | 24.11.1 | OK (LTS line) |
| npm / npx | 11.6.2 | OK |
| pnpm | 11.9.0 | OK |
| Bun | 1.4.3 | OK |
| Python | 3.14.2 (`py`, `python3`); 3.11.15 (`python`) | OK, two interpreters on PATH |
| git | 2.51.2 | OK |
| gh | 2.86.0 | OK |
| Docker | 29.2.0 CLI | **daemon not running** (Docker Desktop not started) |
| sqlite3 | 3.50.6 | OK (32-bit build) |
| psql | none | gap, only needed for Postgres projects (Neon has a web SQL editor) |
| wrangler / vercel / netlify-cli | none global | gap by design: install per project as devDependencies or run via `npx` |
| Stripe CLI, Supabase CLI | none | install only if the project needs webhooks or local Supabase |
