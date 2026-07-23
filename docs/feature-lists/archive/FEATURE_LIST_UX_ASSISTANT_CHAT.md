# Assistant Bubble and Chat — UX Audit

_Status: Shipped — 2026-07-23 (full assistant bubble/chat UX scope completed)_

## Scope, user, and occasion

This audit treats the assistant as one connected journey: entering from the bottom tab or contextual bubble, understanding screen context, using quick actions, composing text or photos, waiting for a streamed answer, approving or undoing changes, recovering from errors, and returning later.

The primary user is a member of this single household using the PWA on a phone, often while planning, shopping, or cooking. The experience should therefore minimize recall, mis-taps, dead ends, and ambiguous state. Tests covered first-use and returning history at 375, 768, and 1280 px, with a 1536 px visual check. No paid model was called; deterministic intercepted streams and an isolated audit database exercised success, failure, cap, confirmation, undo, attachment, and long-history states.

## Headline gap

The assistant’s normal conversation path is intuitive, but route changes and availability changes are not yet durable. A user can ask the app to open a screen and still see only chat, remain locked out after the cap is no longer active, lose Retry after navigation, or remove context without a way to restore it. These seams matter more than adding new assistant features.

## Top three improvements

1. Make every transition finish visibly: navigation chips must reveal their destination and failures must remain recoverable after navigation.
2. Treat cap availability as live state: disable every AI entry point and allow the assistant to recover when the configured cap or date changes.
3. Make context and assistant entry roles explicit and reversible.

## Findings

| # | Priority | Dimension | Finding | User impact | Evidence | File / screenshot | Effort | Cite |
|---|---|---|---|---|---|---|---|---|
| UX-01 | P1 | Feedback / dead ends | On phone, “Shopping list” changes the route behind the full-screen agent but does not close it. The context label changes to Shopping while the requested screen remains completely hidden. | The user taps an “Open” action and appears to go nowhere; finding the result requires guessing that Close reveals it. | Browser, 375 px | `output/playwright/20260723-ux-assistant-open-screen-obscured-375.png`; `src/lib/components/ChatView.svelte:421-435` | S | section 5 `cta-outcome` [H1] [Norman] |
| UX-02 | P1 | Feedback / reversibility | `capExceeded` is effectively latched. Once the controller is hydrated or receives `cap_exceeded`, later page data cannot set it back to false because `hydrateOnce` exits early. | After midnight or a Settings cap increase, chat can remain disabled until a full browser reload even though the server says it is available. | Browser + source | `output/playwright/20260723-ux-assistant-cap-stale-after-navigation-375.png`; `src/lib/stores/chat-agent.svelte.ts:78-94`, `:450` | M | section 5 `stale-warning` [H1] [H3] |
| UX-03 | P2 | Error recovery | A failed assistant reply and its Retry button are client-only. The server persists the user message but not the error; navigation or reload leaves an unanswered user bubble with no recovery action. | The user must remember and retype the request, and the transcript looks as if the assistant silently ignored it. | Browser + source | `output/playwright/20260723-ui-assistant-error-375.png` → `20260723-ui-assistant-dialog-open-375.png`; `src/routes/api/chat/+server.ts:464-477` | M | section 5 `stale-error` [H3] [H9] |
| UX-04 | P2 | Error prevention / consistency | The cap banner disables the composer and photo control but leaves “What’s in the freezer?” and “Add to freezer” enabled. `send()` itself does not guard `capExceeded`. | The screen says AI is paused, then accepts a request that can only fail and adds a doomed turn to history. | Browser + source | `output/playwright/20260723-ui-assistant-cap-exceeded-375.png` → `20260723-ux-assistant-cap-quick-action-375.png`; `src/lib/components/ChatView.svelte:415-450`; `src/lib/stores/chat-agent.svelte.ts:317-328` | XS | section 5 `cta-state` [H1] [H5] |
| UX-05 | P2 | Reversibility / copy | “Remove” disables the current screen context, but no control restores it on the same screen. Closing and reopening the agent keeps context absent. | An accidental tap removes useful context and forces a route change or reload to recover; “Remove” also does not name what is being removed. | Browser + source | `output/playwright/20260723-ux-assistant-context-removed-375.png`, `…context-still-removed-375.png`; `src/lib/stores/chat-agent.svelte.ts:155-156`; `messages/en.json:769`, `messages/nl.json:769` | S | section 5 `terminal-edit` [H3] [H6] |
| UX-06 | P2 | Discoverability / convention | The bottom Assistant tab and floating launcher coexist but have different outcomes. The tab navigates to full history and drops current screen context; the bubble opens contextual chat. | The user must learn which “Assistant” to choose and may lose context by selecting the visually familiar bottom tab. | Browser + source | `output/playwright/20260723-ui-assistant-bubble-inventory-375.png`; `src/lib/components/NavBar.svelte`; `src/lib/components/chat/ChatAgent.svelte:155-163` | M | [H4] [H6] [Krug] |
| UX-07 | P2 | Microcopy / semantic accuracy | Cap feedback hardcodes €0.50 in English and Dutch even though the household can configure any chat cap up to €20. | The app can report the wrong reason and amount precisely when the user is trying to understand why chat stopped. | Source review | `messages/en.json:738-739`, `messages/nl.json:738-739`; `src/lib/server/ai/config.ts:92-118`; `src/lib/server/ai/client.ts:23-36` | S | section 5 `copy-state` [H1] [H2] |
| UX-08 | P2 | Microcopy / language | Several server-owned chat strings bypass localization: the mid-stream failure is hardcoded English, tool-start summaries are English, and a captionless photo is persisted as “Here’s a photo.” | A Dutch household can receive mixed-language status, error, and history text inside an otherwise Dutch assistant. | Source review | `src/routes/api/chat/+server.ts:175-178`, `:464-466`; `src/lib/tool_display.ts:31-91`; `src/lib/stores/chat-agent.svelte.ts:448-453` | M | section 5 `technical-copy` [H2] [H4] |
| UX-09 | P2 | Touch | Retry, Approve, Cancel, and Undo are 36 px high, while paired attachment remove controls are 36 px wide and overlap. | These high-consequence controls are more error-prone for a phone used one-handed or while cooking. | Browser + source | `output/playwright/20260723-ui-assistant-confirm-375.png`, `…attachments-375.png`; `src/lib/components/ChatView.svelte:314-381`, `:462-475` | S | [WCAG 2.5.8] [Fitts] |
| UX-10 | P3 | Feedback / trust | Photos are deliberately transient and disappear from history after reload, but the composer never explains that privacy/storage rule. | A user may expect the photo to remain with the message or, conversely, worry that it is stored permanently. | Source review + attachment state | `src/lib/stores/chat-agent.svelte.ts:343-368`; `src/routes/api/chat/+server.ts:118-124`, `:175-178`; `output/playwright/20260723-ui-assistant-attachments-375.png` | XS | [H1] [H2] |
| UX-11 | P3 | Keyboard efficiency | After clicking Send and receiving a reply, browser focus was not on the composer despite the component’s attempted early refocus. Enter-to-send from the textarea works, but pointer send interrupts rapid follow-up typing. | Returning keyboard users need an extra click or Tab before the next question. | Browser + source | deterministic success pass (`inputFocused: false`); `src/lib/components/ChatView.svelte:179-188`, `:537-547` | XS | section 5 `focus-after-async` [KNav] [H7] |
| UX-12 | P3 | Orientation | Only the most recent 20 messages are loaded, with no “recent history” label, load-older control, or explanation. | Older turns silently disappear, so users cannot tell whether history is truncated or lost. | Browser + source | long-history pass; `src/lib/server/ai/recent_chat.ts:7-20`; `output/playwright/20260723-ui-assistant-scroll-up-375.png` | M | [H1] [H6] |

### Totals

- P1: 2
- P2: 7
- P3: 3
- No P4 findings

## What already works

- First-use copy names the three useful domains: meals, freezer, and shopping.
- “Open” and “Ask” quick actions are grouped and visually distinct.
- Sending, streaming, Stop, Retry, confirmation, Cancel, Undo, and jump-to-latest all provide immediate feedback.
- Errors, cap state, and history failure use status/alert semantics without stealing focus.
- Escape closes the assistant and returns focus to the launcher.
- The launcher has a keyboard alternative to drag.
- The composer has a persistent label, supports Shift+Enter/multiline text, and does not overflow at phone width.
- Long replies, dark mode, and desktop/tablet widths remain readable.
- Hydrated confirmation requests correctly expire instead of allowing a stale destructive action.

## Recommended order

### Phase 1 — restore trustworthy transitions

1. **CHAT-UX-4 (S):** close the contextual agent when an “Open” chip navigates; focus the destination heading.
2. **CHAT-UX-5 (M):** separate controller hydration from live availability refresh so cap state can move both true → false and false → true after navigation, midnight, or Settings changes.
3. **CHAT-UX-6 (XS):** disable AI quick actions and guard `send()` whenever `capExceeded` is true.
4. **CHAT-UX-7 (M):** make failed turns durable or derive an orphaned-turn recovery card after hydration, preserving Retry without duplicating the user row.

### Phase 2 — clarify context, language, and cost

5. **CHAT-UX-8 (S):** replace one-way “Remove” with a reversible “Use this screen” toggle or Remove/Restore pair.
6. **CHAT-UX-9 (M):** distinguish the full-history destination from the contextual launcher. Recommended default: keep “Assistant” for history and label the launcher “Ask about this screen.”
7. **CHAT-UX-10 (S):** return the effective cap value with page/history/SSE state and interpolate it in both locales.
8. **CHAT-UX-11 (M):** route server-owned errors, photo fallback text, and tool display summaries through the request locale.
9. **CHAT-UX-12 (S):** make inline actions and photo removal meet the 44 px household target without overlap.

### Phase 3 — trust and efficiency polish

10. **CHAT-UX-13 (XS):** add concise photo copy such as “Photos are used for this reply and aren’t saved.”
11. **CHAT-UX-14 (XS):** restore composer focus after pointer-send completion without forcing the mobile keyboard open when the user intentionally dismissed it.
12. **CHAT-UX-15 (M):** label the transcript as recent and either load older turns or state the retention window.

## Adopted patterns

- One visible outcome per CTA: “Open” reveals a screen; “Ask” creates a turn.
- Availability gates every route into the same capability, not only the text field.
- Reversible context control over one-way removal.
- Runtime values in runtime copy; no hardcoded configurable amount.
- Locale enters the server display seam so persisted and streamed UI text stays consistent.
- One-shot photo privacy is stated before send.

## Terminology changes

- `Remove` → `Don’t use this screen` plus `Use this screen`, or a labelled toggle.
- Contextual launcher accessible/visible label → `Ask about this screen`.
- Full transcript destination remains `Assistant`.
- Cap copy interpolates the effective configured amount.
- History boundary copy → `Recent conversation` if older turns remain intentionally hidden.

## Decisions

The recommended defaults were selected and shipped:

1. **Assistant entry model:** the bottom Assistant destination remains the conversation home; the contextual launcher is visibly labelled “Ask about this screen.”
2. **Photo history policy:** photos remain one-shot and the composer discloses that they are not saved.
3. **Motion:** the dialog uses short productive entrance/exit motion and honors reduced-motion preferences.

## Acceptance checks

- A phone navigation chip reveals its destination without a second close action.
- When the server cap is false, the current session can send without a reload; when true, no AI trigger remains enabled.
- A failed final turn still offers Retry after route navigation and reload.
- Context can be removed and restored on the same screen.
- The displayed cap amount always matches Settings/env/default resolution.
- English and Dutch turns contain no server-generated text from the other locale.
- Every high-consequence chat action has a non-overlapping 44 × 44 phone target.
- Users know before sending whether an attached photo will be stored.
- Older-history behavior is visible rather than silent.

## Implementation outcome

All 12 UX findings, including the P3 trust and efficiency polish, shipped on 2026-07-23. The implementation adds live cap recovery with the configured amount, durable interrupted-turn retry, visible recent-history boundaries, reversible context, destination-revealing navigation, localized server-owned chat copy, explicit launcher roles, one-shot photo disclosure, safe focus recovery, and 44 × 44 touch targets.

Verification passed with `npm run check`, 413 unit tests, `npm run build`, and responsive browser stories at 375, 768, 1280, and 1536 px in English and Dutch. The browser pass covered navigation, cap transitions in both directions, interrupted history, attachments, focus, dialog motion, and reduced motion using an isolated database and deterministic streams without provider spend.
