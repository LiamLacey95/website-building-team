# API and content contract: <project name>

Owner: Backend. Consumers: Front-end. Status: <draft | published | frozen>. Version: <0.1.0>.
Machine-readable source of truth: `server/contracts/` (<TypeScript types + Zod schemas | OpenAPI 3.1 YAML>). If this doc and the code disagree, the code wins and this doc is a bug.
Changes: see `docs/api/CHANGELOG.md`. Breaking changes are announced to Front-end directly before merging.

## Conventions

- Base URL: `/api` (same origin). JSON in and out, `Content-Type: application/json; charset=utf-8`.
- Field names: `camelCase`. Dates: ISO 8601 strings in UTC (`2026-11-01T09:30:00Z`). Money: integer minor units plus currency (`{ "amount": 2500, "currency": "USD" }`).
- IDs: opaque strings. Front-end must not parse them.
- Images: `{ src, width, height, alt }`; `alt` is required (empty string only for decorative images).
- Rich text: <Portable Text | Markdown | HTML sanitized on the server>.

### Error shape (all endpoints)

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Human-readable summary safe to show users",
    "fields": { "email": "Enter a valid email address" }
  }
}
```

| HTTP | `code` | When |
|---|---|---|
| 400 | `VALIDATION_FAILED` | body fails schema; `fields` lists problems |
| 403 | `SPAM_SUSPECTED` | Turnstile or honeypot failed |
| 404 | `NOT_FOUND` | |
| 429 | `RATE_LIMITED` | includes `Retry-After` header |
| 500 | `INTERNAL` | generic; details logged on the server only |

## Content model

Content read at build time (static), not over runtime APIs, unless marked **runtime**.

### `<TypeName>`

| Field | Type | Required | Notes / validation |
|---|---|---|---|
| `id` | string | yes | |
| `slug` | string | yes | lowercase, `a-z0-9-` |
| `title` | string | yes | max 80 chars |
| | | | |

Where it comes from: <CMS document type / content collection path>. Fixture: `server/contracts/fixtures/<type>.json`.

## Endpoints

### `POST /api/<name>`

Purpose: <...>. Auth: <none | session>. Rate limit: <e.g. 5/min per IP>. Spam: <Turnstile token in `cf-turnstile-response`, honeypot field `website` must be empty>.

Request:

```json
{ }
```

Response `200`:

```json
{ "ok": true }
```

Errors: `VALIDATION_FAILED`, `SPAM_SUSPECTED`, `RATE_LIMITED`.

## Mocks and fixtures

- Fixtures: `server/contracts/fixtures/*.json`, realistic copy, no lorem ipsum.
- Mock mode: <e.g. `PUBLIC_API_MOCK=1` makes the front end read fixtures; or MSW handlers in `server/contracts/mocks/`>.

## SEO and plumbing owned by Backend

- `sitemap.xml`, `robots.txt`, redirects file, structured data types: <...>.
