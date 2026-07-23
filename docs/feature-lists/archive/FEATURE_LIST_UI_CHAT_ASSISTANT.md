# Assistant Bubble and Chat — UI Re-audit

_Status: Shipped — 2026-07-23 (full assistant bubble/chat UI scope completed)_

## Scope and evidence

This pass covers the assistant launcher bubble, full-page chat, contextual dialog, quick actions, composer, messages, tool cards, attachment previews, loading/error/cap states, responsive behavior, keyboard focus, dark mode, and motion. Cooking timers are out of scope; their remaining device gate stays in `FEATURE_LIST_UX_CHAT_ASSISTANT_AND_TIMER.md`.

Browser evidence was captured at 375 × 812, 768 × 1024, 1280 × 900, and 1536 × 960. The pass also covered a long conversation, multiline composer, attachment pair, streamed reply, stop, retry, confirmation, cancel, undo, history failure/recovery, dark mode, drag persistence, Escape focus restoration, and reduced-motion source behavior. Screenshots are under `output/playwright/20260723-ui-assistant-*` and `output/playwright/20260723-ux-assistant-*`.

## Headline UI gap

The visual language is coherent and the main chat states are readable, but four state seams still look or behave broken: the launcher visibly relocates after load, attachment controls collide, cap-blocked actions still look active, and the phone dialog appears/disappears without the motion treatment used elsewhere. The result is close to a unified feel, but not yet visually trustworthy under edge conditions.

## Findings

| # | Priority | Category | Finding | Evidence | File(s) | Effort | Cite |
|---|---|---|---|---|---|---|---|
| UI-01 | P1 | Layout / motion | The launcher first paints at the CSS bottom-right fallback and then snaps to its saved/default position. After a left-edge drag and reload it was still at `(315,696)` after 300 ms, then moved to `(12,520)` later. This is a visible layout jump on every cold mount. | Both: `20260723-ui-assistant-bubble-fresh-0ms-375.png` → `…fresh-100ms-375.png`; `…drag-persisted-375.png` → `…drag-persisted-1375ms-375.png` | `src/lib/components/chat/ChatAgent.svelte:24-30`, `:48-61`, `:222-229` | S | [Motion] [H1] [RUI] |
| UI-02 | P1 | Layout / sizing | Two attachment remove controls overlap the neighboring thumbnail. Browser boxes were only 36 × 44 px and the first control covered 8 px of the second image, creating a real mis-tap risk. | Both: `20260723-ui-assistant-attachments-375.png`; boxes `(56–92)` and second image `(84–148)` | `src/lib/components/ChatView.svelte:462-475`; `src/app.css:180-183` | S | [WCAG 2.5.8] [Fitts] [Gestalt] |
| UI-03 | P1 | Interactive correctness | In the cap-exceeded state the composer and attach control look disabled, but the two “Ask” quick actions remain fully active. The screen presents two contradictory interaction states; activating one creates a doomed turn. | Both: `20260723-ui-assistant-cap-exceeded-375.png` → `20260723-ux-assistant-cap-quick-action-375.png` | `src/lib/components/ChatView.svelte:415-450`, `:493-499`, `:509-540` | XS | [Norman] [H1] [H5] |
| UI-04 | P1 | Motion | The phone dialog has no entrance animation and every viewport has an instant exit. Only the desktop `[open]` state receives `agent-dialog-enter`; `dialog.close()` removes the surface before any exit state can render. | Source review plus `20260723-ui-assistant-bubble-inventory-375.png` / `20260723-ui-assistant-dialog-open-375.png` | `src/lib/components/chat/ChatAgent.svelte:173-200`, `:348-375` | M | [Motion] [Material] [WCAG 2.3.3] |
| UI-05 | P2 | Responsive interaction | A phone “Open a screen” chip changes the route behind the full-screen assistant but leaves that assistant open. The URL and context change to Shopping while the destination stays completely obscured, so the visual outcome disagrees with the label. | Both: `20260723-ux-assistant-open-screen-obscured-375.png` | `src/lib/components/ChatView.svelte:421-435`; `src/lib/components/chat/ChatAgent.svelte:192-200` | S | [Norman] [H1] [Jakob] |
| UI-06 | P2 | Touch sizing | Inline chat actions such as Retry, Approve, Cancel, and Undo use 36 px minimum heights. They pass WCAG’s 24 px floor but miss the app’s own 44 px phone target and are the controls most likely to be used while cooking. | Both: browser boxes for Retry/Approve/Cancel/Undo; `20260723-ui-assistant-confirm-375.png`, `…write-undo-375.png` | `src/lib/components/ChatView.svelte:314-355`, `:372-381` | XS | [WCAG 2.5.8] [Fitts] |
| UI-07 | P2 | Hierarchy / affordance | The bottom “Assistant” tab and floating pot launcher appear together but lead to different surfaces: one navigates to full history and loses screen context; the other opens contextual chat. Nothing visible explains the difference, so two equal entry points compete. | Both: `20260723-ui-assistant-bubble-inventory-375.png`; source behavior | `src/lib/components/NavBar.svelte:18-29`; `src/lib/components/chat/ChatAgent.svelte:155-163`, `:241-258` | M | [VH] [H4] [Norman] |
| UI-08 | P3 | Typography | Conversation text sits at the 14 px minimum, tool summaries at 12 px, and composer/day labels at 11 px. The hierarchy works, but the primary reading surface is denser than the 16–18 px body target and becomes tiring in long replies. | Both: `20260723-ui-assistant-success-375.png`, `…scroll-latest-375.png`, dark-mode pass | `src/lib/components/ChatView.svelte:232-243`, `:267-304`, `:505-512` | S | [Type] [VH] |
| UI-09 | P3 | Motion consistency | Desktop entry uses the shared content duration, but close is instant. The asymmetric transition is noticeable on a large elevated surface even though the rest of the motion system is consistent. | Source review; desktop open/close interaction | `src/lib/components/chat/ChatAgent.svelte:173-200`, `:348-361`; `src/app.css:60-64` | S | [Motion] [H4] |

### Totals

- P1: 4
- P2: 3
- P3: 2
- Categories: layout/motion 4, interactive/responsive correctness 3, sizing 1, typography 1

## What already works

- No horizontal overflow or clipping appeared at 375, 768, 1280, or 1536 px.
- Light and dark themes preserve readable contrast and clear user/assistant separation.
- The composer expands to seven lines without covering navigation or losing the send control.
- Streaming, Stop, Retry, confirmation, Cancel, Undo, long-history scrolling, and jump-to-latest all have distinct visual feedback.
- Escape closes the dialog and restores focus to the launcher.
- The launcher supports drag plus Arrow Up/Arrow Down alternatives.
- Global reduced-motion handling neutralizes animations and smooth scrolling.
- Quick navigation and AI actions are already grouped as “Open” and “Ask.”

## Top three improvements

1. **Make visible state truthful:** close the phone dialog when a navigation chip opens a screen, and disable every AI quick action whenever the cap blocks chat.
2. **Remove visual breakage:** establish launcher position before revealing it and redesign attachment removal so targets do not overlap.
3. **Finish the phone interaction layer:** add symmetric dialog motion and raise inline actions to the 44 px household touch target.

## Recommended sequence

### Phase 1 — P1 correctness

1. **CHAT-UI-5 (S):** render the launcher hidden/non-interactive until saved position and collision settling finish; reveal it with the micro-duration opacity token.
2. **CHAT-UI-6 (S):** keep remove controls inside each thumbnail’s bounds or increase attachment spacing; enforce a true 44 × 44 box.
3. **CHAT-UI-7 (XS):** gate AI quick chips with `capExceeded`, including disabled styling and semantics.
4. **CHAT-UI-8 (S):** have navigation chips close the agent before navigation; on phone, move focus to the destination heading after navigation.
5. **CHAT-UI-9 (M):** add phone entrance and all-viewport exit states using the existing content/micro motion tokens, with the current global reduced-motion fallback.

### Phase 2 — P2 consistency

6. **CHAT-UI-10 (XS):** introduce a shared inline chat-action class with a 44 px phone minimum for Retry, Approve, Cancel, and Undo.
7. **CHAT-UI-11 (M):** distinguish the launcher’s contextual role from the full-history tab. Recommended default: keep both, label the launcher “Ask about this screen,” and keep “Assistant” as the conversation home.

### Phase 3 — P3 polish

8. **CHAT-UI-12 (S):** move primary bubble text to 15–16 px while retaining compact 12–13 px metadata/tool summaries.
9. **CHAT-UI-13 (S):** tune entry/exit easing after the state fixes, not before them.

## Shared patterns to seed or reuse

- Reuse `--motion-micro`, `--motion-content`, `--ease-standard`, and `--ease-emphasized`; do not add a motion library.
- Add one shared `ui-chat-action` utility or component for 44 px inline actions.
- Add a launcher-ready state rather than hardcoding a second position.
- Keep the existing `Icon.svelte` registry, daisyUI theme tokens, and global reduced-motion guard.

## Terminology

- **Assistant**: the full conversation/history destination.
- **Ask about this screen**: the contextual launcher and its accessible name.
- **Open**: navigation that must reveal the destination immediately.
- **Ask**: an AI request that must be disabled whenever chat is unavailable.

## Acceptance checks

- On a cold 375 px load, the launcher never appears at a fallback position before settling.
- Two photo previews have independent 44 × 44 remove controls with no overlap.
- A cap-blocked state contains no enabled AI trigger.
- Tapping “Shopping list” or “Meal plan” from the phone agent reveals that screen in the same interaction.
- Phone open and all-viewport close transitions are visible but absent under reduced motion.
- Retry, Approve, Cancel, Undo, attach, send, stop, close, and context controls all meet the 44 px household target.
- The Assistant tab and contextual launcher communicate different roles before activation.

## Implementation outcome

All nine UI findings, including the P3 typography and motion polish, shipped on 2026-07-23. The launcher stays hidden until its saved position is settled, attachments have independent non-overlapping 44 × 44 controls, blocked actions look and behave disabled, the dialog animates symmetrically, navigation reveals its destination, primary chat text is 16 px, and the contextual launcher is visibly distinct from the Assistant history destination.

Verification passed with `npm run check`, 413 unit tests, `npm run build`, and responsive browser stories at 375, 768, 1280, and 1536 px in English and Dutch. The pass found no horizontal overflow or console errors and verified reduced-motion behavior without provider spend.
