# Acceptance criteria (Assignment #05)

These must stay true after every change. Each one is checked by automated tests (`npm test`).

| ID | Criterion | Tests |
|---|---|---|
| AC-1 | **Valid time.** Missing or unreadable times, start >= end and a start before the fixed current time are Unavailable. The longest allowed booking is 120 minutes (120 passes, 121 fails). | T01–T04, A01–A03 |
| AC-2 | **Blocked room.** A blocked room is always Unavailable. It stays in the list with a "Blocked" label and is not hidden. | T05, A06, F07, U-tests |
| AC-3 | **Overlap.** An overlapping booking makes the slot Unavailable. A booking that only touches the slot at its start or end does not block it. The check uses only the bookings of the selected room. | T06–T09, A04–A05, U-tests |
| AC-4 | **Room filter.** A room is listed only if its capacity >= attendees and it has every required equipment item. When nothing matches, a clear empty-state message is shown and the check button is disabled. | F01–F10, U-tests |
| AC-5 | **No side effects, green pipeline.** Checking or filtering never changes the catalog or its bookings. `npm test` passes with 0 failures and `npm run build` exits with code 0. | T10, A07, C03, F09, CI commands |
