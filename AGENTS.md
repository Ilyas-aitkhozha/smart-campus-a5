# AGENTS.md — instructions for coding agents

Read this file before you change anything. If your tool does not load it automatically, the human pastes it into the chat.

## Purpose
Smart Campus is a small demo app. A student picks a room that fits a group (capacity and equipment), then checks if a time slot is free.
The app only answers Available or Unavailable and gives a reason. It never creates or saves a booking.
All data is fictional and lives in `src/rooms.js`. The current time is fixed at 2026-10-28 09:00. The app has no backend, login, API or database.

## Architecture (keep these boundaries)
| File | Role | Rule |
|---|---|---|
| `src/rooms.js` | Data: rooms, bookings, equipment, fixed NOW | Data only. The catalog is deep-frozen. |
| `src/availability.js` | Booking rules AC-1..AC-3 | Pure function. No DOM and no imports from the UI. |
| `src/filters.js` | Filter rules (capacity, equipment) | Pure function. Never mutates its input. |
| `src/roomView.js` | Room-list view model (selection, empty state) | Pure function. No DOM. |
| `src/messages.js` | All user-facing text | Every new message goes here. |
| `src/app.js` | DOM rendering and events only | No business rules in this file. |
| `src/main.js` | Entry point | Wiring only. |
| `tests/*.test.js` | Vitest tests (`ui.test.js` uses jsdom) | |

## Setup and safe commands
Node 18+ (verified with Node 22). Run all commands from the repository root.

| Command | Purpose | Expected |
|---|---|---|
| `npm ci` | Install the exact versions from `package-lock.json` | exit 0 |
| `npm test` | Run all tests | 0 failed |
| `npx vitest run --reporter=verbose` | Same tests, one line per test | 0 failed |
| `npm run build` | Production build into `dist/` | exit 0 |
| `npm run dev` | Local dev server | only when a human asks for it |
| `git status`, `git diff` | Review your changes | always before you report |

## Coding conventions
- Plain ES modules and vanilla JavaScript. Do not add a framework or TypeScript unless a human asks for it.
- Rules are pure functions that take their inputs as arguments. Pass time in as `now`; never call `new Date()` for the current time inside a rule.
- Never mutate the catalog, the bookings or any input array. Return new arrays.
- Build DOM text with `textContent`. Never put data into `innerHTML`.
- All user-facing text goes in `src/messages.js`.
- Make small, focused changes: one concern per change. Do not reformat files you do not need to touch.

## Test expectations
- Every rule change needs a test that fails before the fix and passes after it. Name it with the next free ID in that file, e.g. `A08`.
- Do not delete, skip (`.skip`, `.only`) or weaken existing tests. Tests T01–T10 are the original contract and must stay byte-identical.
- Before you report, run `npm test` and `npm run build` and paste the real summary lines (`Tests  N passed (N)`, build exit code). Never claim a result you did not run.
- `ACCEPTANCE.md` lists AC-1..AC-5. They must stay true.

## Forbidden actions (stop and ask a human)
- **Secrets:** never add API keys, tokens, passwords, `.env` files or real personal data. All data stays fictional.
- **Deployment:** no deploys or publishing of any kind (Bolt publish, `npm publish`, hosting, DNS).
- **Destructive commands:** no `rm -rf` outside `dist/` or `node_modules/`, no `git push --force`, no `git reset --hard` on shared branches, no history rewriting, no deleting tests.
- **Dependencies:** do not add, remove or upgrade packages, and do not run `npm audit fix` or `npm audit fix --force`, without human review of the exact `package.json` and `package-lock.json` diff.
- **Network:** do not change the app to call any external service.
- **Scope:** do not touch files outside this repository, and do not edit `package-lock.json` by hand.

## Review gates
1. Work on a branch, never directly on `main`.
2. A human reviews the diff, the test output and the build output before any merge.
3. Any change to `package.json`, `package-lock.json`, `AGENTS.md` or `tests/availability.test.js` needs explicit human approval.
4. If a check fails and you cannot fix it within the task scope, stop and report the failure. Do not work around it.

## What to report after a task
A short change summary, the list of files changed, `git diff --stat`, the real `npm test` and `npm run build` output, and any risks or open questions.
