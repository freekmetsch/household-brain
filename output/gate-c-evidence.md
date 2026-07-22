# Gate D and Release D evidence pack

_Release C verified and Gate D passed, 2026-07-22._

## Scope

Release C at `c0cf8f0` was live on Railway before the Gate D review. Freek then authorized completion of the full feature list, including SRD-17, after the live legacy rows had a reviewed outcome.

## Automated proof

- 54 unit-test files and 362 tests pass after deleting the spent compatibility test file and adding source-view regressions.
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

## Live legacy review

Before any review write, the live database was copied to `/data/snapshots/gate-d-pre-resolve-20260722T173707Z.db`. The snapshot contained the same 106 shopping entries and 14 unresolved legacy rows as the source database.

All 14 rows were dismissed with an audit record. No row was attached or converted because the live data did not support either choice without guessing:

- The 12 rows from the old 2026-07-13 and 2026-07-15 planning weeks had no live source candidate: `snoeptomaatjes`, `milde olijfolie`, `r pandan rijst (gekookt en afgekoeld)`, `zonnebloemolie`, `peper en zout`, `r fijngesneden prei`, `scheut ketjap`, `r champignons`, `theelepel sambal`, `Snuf komijn`, `Snuf djahe (gember)`, and `Snuf kurkuma`.
- The two rows in the completed current delivery cycle were ambiguous aggregates. `bloem` matched two contributions from one recipe with different amounts; `suiker` matched three. The old rows had no amount that could identify one contribution.

Twelve rows were reviewed through the deployed shopping screen. The old Monday-keyed 2026-07-13 week normalizes to the household's Wednesday week boundary, so its two rows could not render in the screen. A guarded maintenance write resolved only their exact IDs after checking every source field and revision. It changed only the same resolution, audit, retirement, and revision fields as the service dismissal.

Post-state: 14 dismissed audit rows, zero unresolved active legacy rows, and no approved exception list needed. AH eligibility continues to exclude legacy rows.

## SRD-17 cleanup proof

- The shopping API accepts only source-owned mutations. The retired name-keyed writers and the always-blocked serve-fresh writer route are gone.
- The chat shopping tool now reads the same source-owned weekly view as the shopping screen. A regression test proves a saved source choice wins over a stale historical override row.
- Inventory coverage uses exact normalized Dutch names, so `rijstazijn` no longer hides `rijst` in either the screen or chat output.
- Historical `shopping_list_overrides` data, import/export support, the no-guess upgrade importer, append-only migrations, and legacy review remain intact for self-hosted upgrades.
- The cleanup removes more code than it adds and leaves no second writable compatibility path.
