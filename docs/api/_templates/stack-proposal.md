# Stack proposal: <project name>

Owner: Backend (with Front-end). Phase: Define. Feeds: **Gate 1**.
Date: <YYYY-MM-DD>. Brief: `projects/<slug>/briefs/<id>.md`. Lives at `projects/<slug>/api/stack-proposal.md`. Site type (see `docs/api/stack-playbook.md`): <1 Brochure | 2 Small business | 3 Content | 4 E-commerce lite | 5 Web app>.

## Requirements that drive the stack

| Requirement (from brief or research) | Implication |
|---|---|
| <e.g. owner edits opening hours weekly> | <needs a non-technical CMS> |
| <e.g. contact form, ~50 leads/month> | <one server endpoint + email> |

## Options

### Option A: <name> (recommended)

- Framework / rendering: <e.g. Astro 7, static + 1 endpoint>
- Hosting: <e.g. Cloudflare Pages>
- CMS / content: <e.g. Sanity Free>
- Forms / email / spam: <e.g. Worker endpoint, Zod, Turnstile, Resend>
- Integrations: <booking, payments, analytics>
- Pros: <...>
- Cons / risks: <...>

### Option B: <name>

<same fields>

### Option C: <name> (optional)

<same fields>

## Comparison

| | A | B | C |
|---|---|---|---|
| Monthly running cost (launch) | | | |
| Monthly cost at 10x traffic | | | |
| One-off setup effort | | | |
| Editing experience for client | | | |
| Performance budget fit (LCP, JS KB) | | | |
| Lock-in / portability | | | |
| What the client maintains | | | |

## Cost breakdown (recommended option)

| Item | Plan | $/month | Source (vendor page, checked <date>) |
|---|---|---|---|
| Hosting | | | |
| CMS | | | |
| Email | | | |
| Domain | | /year | |
| **Total** | | | |

## Accounts and secrets needed

Accounts are registered in the **client's** name where possible. Secrets go into host env vars only; names are listed in `.env.example`.

| Account | Owner | Env var(s) | Least-privilege scope |
|---|---|---|---|
| | | | |

## What the client maintains after launch

- <domain renewal, CMS content, account billing, ...>

## Recommendation

<2 to 4 sentences: which option, why, and the main risk.>

## Open questions for the PM / human

1. <...>
