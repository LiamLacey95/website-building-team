# Report: how-it-works 04-define-alignment (Backend)

Date: 2026-11-01. State: DONE. File changed: `projects/how-it-works/api/stack-proposal.md` (§2 and §3, Accounts, Risks).

## 1. MINOR 1: the required reviewer needs a public repo

**What I checked.** GitHub's "Deployments and environments" reference, under "Required reviewers", says: *"If you are on a GitHub Free, GitHub Pro, or GitHub Team plan, required reviewers are only available for public repositories."* The page Review cited for this resolves, but the sentence itself is on this reference page, so the proposal now links there.

**What the proposal now says:**
- **§3, "Gate 4 enforced, on a public repo only":** the caveat with the quote.
- **The order under Q2 A:**
  1. Do what Q10 requires.
  2. Make the repo public.
  3. Create the `github-pages` environment, with the human as required reviewer and deployments restricted to `master`.
  4. Only then merge the deploy workflow.

  Until step 4, CI is build-and-check only, with no deploy job, and the workflow's step list says so.
- **Q2 table:**
  - **A:** "Gate 4 approval: enforced by GitHub".
  - **B:** the approval gate is lost on a private repo on Pro or Team. The fallback is procedural: the deploy job runs only from a `workflow_dispatch` the human triggers.
  - **C:** approval through the host's own control, such as a release branch or a manual production promote.
- **Accounts table:** the reviewer row notes "public repo only on Free, Pro and Team".
- **Risks:** a new row covers the deploy workflow landing before the reviewer exists.

## 2. MINOR 6: wider redaction and a licence guard that walks the whole chain

**Redaction.** §2 now has a pattern table. One list (`server/content/redact.ts`) drives both the redaction step and the post-build scan of `dist/`. It covers:

| What | Example |
|---|---|
| Drive paths, either slash | `[A-Za-z]:[\\/]` |
| Git Bash / MSYS paths | `/[a-z]/(Users\|home\|…)/` |
| POSIX home paths | `/home/…`, `/Users/…` |
| UNC paths | `\\server\share\…` |
| T3 thread ids and `t3-thread://` links | `thread:mcp:…` |
| UUIDs | environment and thread ids |
| Email addresses | |

The repo root is replaced first, in every spelling. The patterns stop at whitespace and this repo's folder name has a space, so this first pass is what handles paths inside the repo.

**Checked now** with a throwaway script, not committed: 12 real strings from this repo were all caught, and 5 that must survive were all kept (commit hashes, URLs, repo-relative paths, ratios, commands).

**Licence guard.** It now walks the whole sidecar, as `docs/review/tools/licences.mjs` does:
- nested `source_provenance`, including provenance stored as a JSON string;
- every `workflow` id, model key and licence string.

It fails on:
- no sidecar, or invalid JSON;
- a workflow outside the allow-list (WEB1 to WEB5, WEB6b);
- a non-commercial model or licence anywhere in the chain.

The error names the node's path in the chain.

**Gate 1 Q11 (FLUX Klein).** The answer is recorded in `server/content/licence-policy.json`:
- **A:** Klein passes, with the credits disclosure.
- **B:** Klein anywhere in the chain fails.
- **Unanswered:** Klein passes in development and fails the strict release build.

Review's `licences.mjs` stays the independent check, with the same rules in separate code.

## 3. Q10 D: a git-log snapshot plan

§2 has a new "Git log: live or snapshot (Q10)" section:
- **Source by Q10 answer:** A, B and C use the live log (under C the hashes are read at build, so they match). D uses the snapshot.
- **Snapshot file:** `projects/how-it-works/server/content/git-log.snapshot.json`, committed. Its fields:
  - `exportedAt`, `sourceHead`, `count`;
  - for each commit: sha, short sha, ISO date, the role parsed from the subject's prefix, subject, files changed, and coarse areas.

  There are no author names, emails or file paths, and subjects are redacted. Commits are oldest first.
- **Exporter:** `export-git-log.mjs`, Node built-ins only, written in Phase 5 with tests. It refuses to run on a shallow clone and prints the count and date range.
- **Sequence under D:**
  1. Export.
  2. Commit the snapshot.
  3. Review checks it (redaction scan, and the count against `git rev-list --count`).
  4. The PM squashes, so the snapshot ends up inside the public repo's single commit.
- **Loader:** shows the snapshot plus any live commits after the squash, with a plain caption. Snapshot hashes are shown as text, not links, because those commits don't exist in the public repo.

## Not changed

Everything else in the proposal: the framework, Front-end's sign-off, the interactivity budget, analytics and costs.

## Needs

Nothing.
