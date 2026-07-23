# Chat Assistant and Cooking Timer — UX Workup

_Status: In flight — selected assistant packages shipped; physical timer-device gate remains (2026-07-23)_

## Goal and boundary

The assistant should feel available without competing with cooking. The timer must remain glanceable, dismissible, and capable of reaching an audible alarm while the screen is locked. This workup covers the experience around chat, not the content of assistant replies.

## Journey audit

| Journey | Current result |
|---|---|
| Open/close from any app screen | Works; Escape now closes the desktop non-modal dialog and returns focus to the launcher. |
| Open while a timer is active | Fixed: desktop timer moves beside the panel; tablet uses full-screen chat; launcher avoids the timer stack. |
| Start timer, background the page | Fixed in-browser: the timer tap starts a real media timeline whose alarm is embedded at the deadline, so the alarm does not depend on a throttled JavaScript callback. |
| Cancel/reset timer | Works; the associated media element stops and releases its source. |
| Reload an already-running timer | Remaining platform constraint: playback cannot be restarted automatically after reload because browsers require a user gesture. |
| Force-close the browser/app | Not guaranteed by the web platform; notifications remain a best-effort backup. |

## Findings

| Priority | Status | Finding and impact | Evidence | Effort | Principles |
|---|---|---|---|---|---|
| P1 | Resolved in browser; device check pending | The alarm previously depended on foreground JavaScript/Web Audio. A pre-started media timeline now carries the alarm through normal browser backgrounding; physical locked-screen behavior remains unverified. Foreground Web Audio, vibration, Wake Lock, and notifications remain fallbacks. | `background_audio.ts`, `cook-timer-alarm.m4a`, `BenchSheet.svelte`; background-tab playback verified | M | [H5] [Doherty] [Peak-end] |
| P1 | Resolved | Opening chat could make an active timer unobservable and hard to dismiss. Timer and panel now negotiate separate desktop lanes and a full-screen tablet boundary. | before/after screenshots at 1280 and 768 px | M | [H1] [H3] [RUI] |
| P2 | Resolved | Desktop Escape did not close the non-modal dialog. It now closes and returns focus to the launcher. | keyboard browser pass; `ChatAgent.svelte` | XS | [KNav] [H3] |
| P2 | Resolved | The destination now uses the canonical name “Assistant” in English and “Assistent” in Dutch across navigation, title, launcher, panel, and composer. | English and Dutch phone browser passes; `messages/en.json`, `messages/nl.json` | XS | [H4] [Krug] |
| P2 | Resolved | “Open” navigation and “Ask” AI quick actions are labelled, grouped, and styled separately, so their consequence is apparent before activation. | `ChatView.svelte`; `20260723-chat-polish-home-final-375.png` | S | [H2] [H4] [Norman] |
| P2 | Resolved | Primary phone interactions now meet the 44 px kitchen-use target, reducing slips with wet or occupied hands. | browser measurements at 375 px; wider responsive passes at 768, 1280, and 1536 px | S | [Fitts] [WCAG 2.5.8] |
| P3 | Resolved | Loading, cap, and attachment failure changes now expose status or alert semantics without moving focus. | invalid-upload and loading browser passes; `ChatView.svelte`, `ChatAgent.svelte` | XS | [WCAG 4.1.3] [H1] |

## Background-sound design

Starting a timer is the required user gesture. That gesture starts one ordinary audio element near the end of a long silent lead-in; the alarm tone is encoded into the same file at the target offset. The browser therefore advances media playback rather than waiting for a background `setTimeout` to start sound. One audio element is used per concurrent timer.

Guardrails:

- the cooking view must remain open;
- timers longer than 12 hours fall back to the foreground alarm path;
- reload, media pause, browser force-close, OS process eviction, and device-specific power rules can still interrupt sound;
- notifications are described as backup, not a promise;
- physical iOS and Android locked-screen verification remains an explicit release check.

## Remaining UX gate

- Run and record the physical iPhone and Android locked-screen timer matrix. Normal browser backgrounding is verified; locked-screen behavior is not.

## Recommended sequence

1. **CHAT-UX-1 (XS, completed):** choose one assistant name and update navigation/title/launcher together.
2. **CHAT-UX-2 (S, completed):** separate “Go to…” actions from “Ask…” actions with verbs and grouping.
3. **CHAT-UX-3 (S, completed):** apply 44 px touch targets and semantic live feedback.
4. **TIMER-UX-1 (device gate):** test a 2-minute timer with screen locked on the household's actual iPhone and Android device; record lock, notification, silent-mode, media-volume, and force-close outcomes.

## Acceptance checks

- The timer stays visible and operable before, during, and after opening chat.
- Opening or closing chat never changes the timer deadline or stops its media.
- A backgrounded browser tab reaches the encoded alarm without a JavaScript wake-up.
- Cancel/reset stops media immediately.
- Escape, close button, and launcher all return users to a predictable focus location.
- Every quick action states or visually signals whether it navigates or contacts the AI.
