# Smart Campus — room availability checker (Assignment #05 version)

Vite + vanilla JavaScript. Fictional data only, fixed current time 2026-10-28 09:00.
No login, payments, live APIs or database. No runtime dependencies (dev tools only: vite, vitest, jsdom).
Coding agents: read `AGENTS.md` first. Acceptance criteria: `ACCEPTANCE.md`.

## Setup, run, test, build

    npm ci           # exact versions from package-lock.json
    npm test         # = vitest run  -> expected: 47 passed (47)
    npx vitest run --reporter=verbose
    npm run build    # production build into dist/ (exit 0)
    npm run dev      # local server, open the printed http://localhost:5173 address

Node 18+ (verified with Node 22.23.5, Vitest 3.2.7, Vite 6.4.5). There is no lint or type-check script yet (see the report, risk R04).

## Layout

    README.md  AGENTS.md  ACCEPTANCE.md  package.json  package-lock.json  index.html
    src/    style.css rooms.js availability.js filters.js roomView.js messages.js app.js main.js
    tests/  availability.test.js availability.extra.test.js filters.test.js catalog.test.js roomView.test.js ui.test.js

If you received the files as separate e-mail attachments, put them into this layout. Files named `baseline_*`
are the versions before Assignment #05 (only the files that changed), for comparison.

## Files

| File | Responsibility |
|---|---|
| `src/rooms.js` | Data only: 5 fictional rooms with their own bookings, equipment list, fixed NOW, deep-frozen |
| `src/availability.js` | Booking rules AC-1..AC-3: pure `checkAvailability(request, room, bookings, now)`; unreadable booking data fails closed |
| `src/filters.js` | Filter rules: `parseAttendees`, `meetsCapacity`, `hasAllEquipment`, `filterRooms` |
| `src/roomView.js` | Room-list view model: matching rooms, kept/new selection, error and empty-state text (pure) |
| `src/messages.js` | All user-facing text |
| `src/app.js` | DOM rendering and events only |
| `src/main.js` | Entry point |
| `tests/availability.test.js` | Original T01–T10 (unchanged since Practice #09) |
| `tests/availability.extra.test.js` | A01–A09 incl. broken booking data (A08, A09) |
| `tests/filters.test.js` | F01–F10 |
| `tests/catalog.test.js` | C01–C04 incl. readable booking times (C04) |
| `tests/roomView.test.js` | V01–V05 for the view model |
| `tests/ui.test.js` | U01–U09 jsdom UI tests incl. no stale answer after editing times (U09) |
