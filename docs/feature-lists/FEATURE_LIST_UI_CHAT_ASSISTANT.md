# Chat Assistant Screen — UI Workup

_Status: In flight — selected P2 packages shipped; optional P3 exit motion remains (2026-07-23)_

## Scope

This audit covers the assistant's surrounding screen: launcher, panel, history shell, empty state, quick actions, composer, responsive layout, focus treatment, loading/error presentation, and its coexistence with cooking overlays. It deliberately excludes the content and quality of chat messages.

Evidence came from real-browser passes at 375 × 812, 768 × 1024, 1280 × 900, and 1536 × 960, keyboard operation, English and Dutch copy, empty/history states, cooking timers, and reduced-motion inspection. Screenshots live under `output/playwright/20260723-chat-polish-*` and `output/playwright/20260723-ui-chat-*`.

## Findings

| Priority | Status | Finding and impact | Evidence | Effort | Principles |
|---|---|---|---|---|---|
| P1 | Resolved | The desktop assistant panel covered the cooking timer, leaving only a sliver visible. The timer now moves into a dedicated lane beside the 30 rem panel. | `ChatAgent.svelte`, `Timer.svelte`, `app.css`; `20260723-ui-chat-timer-dialog-clash-1280.png` → `…fixed-1280.png` | S | [H1] [Gestalt] [RUI] |
| P1 | Resolved | At 768 px, a side panel and a usable timer cannot coexist. The assistant now uses its full-screen presentation through 831 px. | `ChatAgent.svelte`; `20260723-ui-chat-timer-agent-fullscreen-768.png` | S | [RUI] [Fitts] |
| P2 | Resolved | A saved launcher position could collide with the timer or bottom navigation. Both overlays now publish/consume layout changes and the launcher relocates to the nearest safe position. | `ChatAgent.svelte`, `TimerStack.svelte`; `20260723-ui-chat-timer-bubble-collision-fixed-375.png` | M | [H5] [Gestalt] [Fitts] |
| P2 | Resolved | Navigation and AI quick actions now use labelled “Open” and “Ask” groups with distinct treatments, making their consequences visible before activation. | `ChatView.svelte`; `20260723-chat-polish-home-final-375.png` | S | [H2] [H4] [Norman] |
| P2 | Resolved | Quick actions and primary composer, panel, attachment, and context controls now provide 44 px kitchen-friendly targets. | browser measurements at 375, 768, 1280, and 1536 px; `ChatView.svelte`, `ChatAgent.svelte` | S | [WCAG 2.5.8] [Fitts] |
| P2 | Resolved | The composer now keeps a compact visible label while the field is empty or populated. | `ChatView.svelte`; English and Dutch phone screenshots | XS | [WCAG 3.3.2] [H6] |
| P3 | Proposed | The panel has a polished entrance but disappears instantly on close, making the state transition feel asymmetric. | `ChatAgent.svelte:319-355` | S | [Motion] [H4] |
| P3 | Resolved | Attachment failures, spend-cap feedback, and history loading/errors now expose status or alert semantics without stealing focus. | invalid-upload and loading browser passes; `ChatView.svelte`, `ChatAgent.svelte` | XS | [WCAG 4.1.3] [H1] |

Principle tokens: Nielsen heuristics (`H1`–`H10`), responsive UI (`RUI`), Fitts' law, Norman's signifiers, Gestalt grouping, WCAG success criteria, and motion continuity (`Motion`).

## What already works

- The empty state has a clear focal point and brings common actions close to the composer.
- History remains readable without horizontal overflow across all audited widths.
- Mobile uses a full-screen native dialog; desktop uses a restrained 30 rem panel.
- Bubble grouping, day dividers, focus rings, and user-controlled autoscroll establish strong visual rhythm.
- Reduced-motion users already receive a global motion reduction.

## Remaining UI option

- Add a short assistant-panel exit transition if the added motion proves worthwhile; preserve the global reduced-motion behavior.

## Recommended sequence

1. **CHAT-UI-1 (S, completed):** split quick actions into clearly labelled navigation and “Ask assistant” treatments.
2. **CHAT-UI-2 (S, completed):** normalize launcher, close, attach, send, stop, chip, and context controls to 44 px on touch layouts.
3. **CHAT-UI-3 (XS, completed):** add a visually quiet persistent composer label and status/alert roles.
4. **CHAT-UI-4 (S, optional P3):** introduce a short exit transition that respects `prefers-reduced-motion`.

## Shipped verification

- No horizontal overflow or timer/panel collision at 375, 768, 1280, or 1536 px.
- Phone quick actions, attach, send, and jump-to-latest controls measured 44 CSS px; panel and context controls use the same minimum target.
- English uses “Assistant” and Dutch uses “Assistent” across navigation, title, launcher, panel, and composer.
- Invalid attachment feedback exposes an atomic alert, and desktop Escape returns focus to the launcher.
- With the assistant open at 1280 px, the timer remained operable with a measured 16 px gap.

## Acceptance checks

- No timer, launcher, assistant panel, or bottom navigation overlaps at 375, 768, 1280, or 1536 px.
- A first-time user can predict which quick actions navigate and which contact the AI.
- Every primary phone control in the assistant chrome is at least 44 × 44 CSS px.
- The composer keeps an understandable visible label while populated.
- Loading and attachment errors announce without stealing focus.
