# Security

This is a solo-maintained, self-hosted household app — there's no security team and no SLA, but I do want to know about real problems.

## Reporting a vulnerability

Please don't open a public issue for anything that could be exploited before it's fixed. Use this repo's private vulnerability reporting instead (Security tab → **Report a vulnerability**). If that option isn't available, open a regular issue asking for a private channel and I'll follow up.

I'll aim to acknowledge a report within a few days. Fixing it depends on severity and my available time — this is not a funded project.

## What's in scope

- Anything that lets one household's data reach another self-hosted instance it shouldn't.
- Auth bypass, session handling bugs, or a way to act as another user in the same household.
- A way to make the app leak the Albert Heijn token, the OpenRouter key, or other `.env` secrets.

## What's explicitly out of scope

- Albert Heijn's own API or account security — this project only consumes it. Report AH-side issues to Albert Heijn.
- The fact that the AH integration is unofficial and reverse-engineered. That's documented, not a vulnerability.
- Issues that only apply if you've deployed the app with secrets committed to a public repo or an exposed `.env` file — that's a deployment mistake, not a code vulnerability, though I'm happy to make the docs clearer if a mistake like that is easy to make.
