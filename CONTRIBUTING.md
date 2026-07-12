# Contributing

This is a side project I maintain around actually using it, not a company with a support queue. That shapes what "contributing" looks like here.

## Before you write code

For anything beyond a small, obvious fix, open an issue first and describe what you want to change and why. That saves you from building something that doesn't fit the project's direction — this app is deliberately scoped to a single household with no signup flow, no multi-tenancy, and no plans to add either.

## Making a change

1. `npm install`, then `npm run dev` (see [README](README.md) for the full setup).
2. Run `npm run check` (svelte-check) and `npm run test:unit` (vitest) before opening a PR. Both are free — no network calls, no API cost.
3. Keep the two architecture invariants intact, described in [CLAUDE.md](CLAUDE.md):
   - Albert Heijn matching always sources from the Dutch recipe fields, never the English display translation.
   - The LLM provider stays swappable behind `src/lib/server/ai/client.ts` — don't reach for an SDK anywhere else.

## Albert Heijn changes

Anything touching `src/lib/server/ai/executors.ts`'s AH write paths deserves extra care: it's an unofficial, reverse-engineered integration, and a bad change there can push a broken basket to someone's real AH account. Describe what you tested manually in the PR.

## Response time

I review PRs when I have time, which some weeks is not much. If your PR sits for a while, a friendly bump is fine.
