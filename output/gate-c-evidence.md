# Gate D evidence pack

_Release C candidate, 2026-07-22. Gate D remains closed._

## Scope

SRD-5 through SRD-16 are complete. SRD-17 compatibility deletion and archival were not started.

## Automated proof

- 55 unit-test files and 361 tests pass.
- Svelte check passes with no errors or warnings.
- The production build passes.
- The migration rehearsal passes on a copy of the current database and a Release A fixture. The fixture import assigns four stable ingredient IDs, preserves every old ingredient field and its order, imports three legacy rows without fan-out or loss, and makes the second import a no-op.
- The AH request fixtures reject invented or cross-item product IDs, missing or duplicate refs, invalid quantities, and client copies of term, amount, unit, source, product name, entry ID, revision, or week. Eligibility tests exclude covered rows and unapproved terms at the shared preview/push boundary. Preview tokens are user-bound, short-lived, latest-review-only, and single-use. State tests prove pending-before-dispatch, one dispatch, definite rejection, timeout or 5xx uncertainty, local finalization failure, bought state, and history rows. Only safe reads retry after an authentication failure.
- Recipe proposals stage without a write, apply only selected reviewed additions, mint `ai_accepted` only at apply time, and reject expired, cross-user, duplicate, stocked, or stale proposals.
- Portion presets use the canonical recipe yield, store an absolute result, reject values above 99, and make no model call.
- Cooking generation ignores presentational time changes, while canonical ingredient or direction changes make the cache stale. Existing v4 output is reused when valid.
- Translation accepts only a complete translated ingredient set with matching numeric and fraction tokens.

## Browser proof

The locally served production build passed against a temporary database copy at 375, 768, and 1280 px in English and Dutch. No checked page had horizontal overflow, browser errors, console errors, or a Vite error screen. The 375 px meal plan changed 4 servings to 8 through the real server action.

- [Recipes, 375 px, English](gate-c-recipes-375-en.png)
- [Meal plan, 375 px, English](gate-c-plan-375-en.png)
- [Shopping, 375 px, English](gate-c-shopping-375-en.png)
- [Cook mode, 375 px, English](gate-c-cook-375-en.png)
- [Cook mode, 768 px, English](gate-c-cook-768-en.png)
- [Shopping, 768 px, Dutch](gate-c-shopping-768-nl.png)
- [Meal plan, 375 px, Dutch](gate-c-plan-375-nl.png)
- [Recipes, 1280 px, Dutch](gate-c-recipes-1280-nl.png)
- [Shopping, 1280 px, English](gate-c-shopping-1280-en.png)

## Database and rollback proof

- [Migration evidence](gate-b-2026-07-22T16-40-02-229Z/gate-b-evidence.json)
- [Rollback evidence](gate-c-rollback-evidence.json)
- Release A at `74b7f13` starts against the migrated fixture, logs in, saves `bolognese`, advances revision 2 to 3, preserves all three ingredient IDs, and preserves the note write.
- The pre-SRD-0 image at `907ba22` returns healthy against the full restored pre-`0020` fixture.
- The rehearsal now records Drizzle journal entries in synthetic fixtures. Historical images therefore test the intended migration state instead of replaying migration `0000` over existing tables.
- A copied early-draft `0020` database exposed missing `amount_override` and `unit_override` columns. Startup repairs only that exact partial shape. Unit tests prove row preservation, idempotence, and no change to fresh or pre-`0020` databases.

## Gate D blocker

Release B reported 14 unresolved active legacy rows in production. They remain blocked from AH. Each row must be attached to one live source, converted to a manual item, dismissed with its audit record, or named in a user-approved exception list before Gate D can open.
