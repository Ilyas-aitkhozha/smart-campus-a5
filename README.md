# Smart Campus — room availability with room catalog (Assignment #04, final version)

Vite + vanilla JavaScript. Fictional data only, fixed current time 2026-10-28 09:00.
No login, payments, live APIs or database. No runtime dependencies (only dev tools: vite, vitest, jsdom).

## Files sent by e-mail (no archive allowed)

The attachments are flat. To run the project, put them in this layout:

    README.md  package.json  index.html
    src/    style.css rooms.js availability.js filters.js messages.js app.js main.js
    tests/  availability.test.js availability.extra.test.js filters.test.js catalog.test.js ui.test.js

Initial version (Practice #09 baseline) for comparison: `initial_availability.js`, `initial_main.js`,
`initial_index.html`, `initial_style.css` (rename without the `initial_` prefix into the same layout).
Its test file was `tests/availability.test.js`, byte-identical to the one sent; its package.json had no `jsdom` line.
Raw test outputs and other evidence: `test_results.txt`.

## Setup, run and test

    npm install
    npm run dev      # open the printed http://localhost:5173 address
    npm test         # = vitest run  -> expected: 38 passed (38)
    npx vitest run --reporter=verbose   # same tests, one line per test
    npm run build    # production build into dist/

Node 18+ is enough (tested with Node 22.23.4, Vitest 3.2.7).

## What the app does

1. Enter the number of attendees and tick the equipment you need.
2. Only rooms that satisfy BOTH requirements are listed (F1 capacity >= attendees, F2 all items present).
   A blocked room stays visible with a "Blocked" label but is never Available (F3).
   If nothing matches, a clear empty-state message is shown and the check button is disabled (F4).
3. Choose a room, enter a start and end time, press "Check availability".
   Switching to another room refreshes the answer using that room's own bookings (F5).

Original rules kept: AC1 valid time (start < end, not in the past, missing/invalid times rejected), AC2 max 120 minutes,
AC3 blocked room, AC4 overlap rejected / touching allowed, AC5 booking data never changed (catalog is frozen),
AC6 clear messages and phone layout.

## Files

| File | Responsibility |
|---|---|
| `src/rooms.js` | Data only: 5 fictional rooms (id, name, capacity, equipment, blocked, own bookings), fixed NOW, deep-frozen |
| `src/availability.js` | Booking rules AC1–AC5: pure `checkAvailability(request, room, bookings, now)` |
| `src/filters.js` | Filtering rules F1–F2: `parseAttendees`, `meetsCapacity`, `hasAllEquipment`, `filterRooms` |
| `src/messages.js` | All user-facing text: reason → message, result tone, empty-state text |
| `src/app.js` | UI presentation: renders filters, room list, details, result; event handlers |
| `src/main.js` | Entry point: `createApp(document, catalog)` |
| `index.html`, `src/style.css` | Markup and responsive styles |
| `tests/availability.test.js` | Original T01–T10 (unchanged from the initial version) |
| `tests/availability.extra.test.js` | A01–A07: invalid time, 120/121, touching/overlap, blocked, per-room bookings, immutability |
| `tests/filters.test.js` | F01–F10: capacity, equipment, blocked stays listed, empty result, parsing |
| `tests/catalog.test.js` | C01–C03: catalog shape, ids, frozen data |
| `tests/ui.test.js` | U01–U08: jsdom UI tests on the real `index.html` (filtering, empty state, room switching) |
