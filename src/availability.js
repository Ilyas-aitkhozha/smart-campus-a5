// Smart Campus — booking / availability rules (AC1-AC5). Pure: no DOM, no data of its own.
// History: Practice #08 fixed BUG-A (strict < and > in the overlap test) and BUG-B (in-place sort).
// Assignment #04: INVALID_TIME guard added; the unnecessary sort was removed.

export const MAX_DURATION_MINUTES = 120;

/**
 * Checks whether a room can be booked for [start, end).
 * @param {{start: string, end: string}} request  ISO date-time strings
 * @param {{id: string, blocked: boolean}} room
 * @param {Array<{id: string, roomId: string, start: string, end: string}>} bookings
 * @param {Date} now  fixed "current time" (injected so tests are deterministic)
 * @returns {{status: 'Available'|'Unavailable', reason: string}}
 */
export function checkAvailability(request, room, bookings, now) {
  const start = new Date(request.start);
  const end = new Date(request.end);

  // AC1: missing or unreadable times are never Available
  // (before this guard every comparison with NaN was false and the function returned Available)
  if (!request.start || !request.end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { status: 'Unavailable', reason: 'INVALID_TIME' };
  }

  // AC1: start must be before end, and not in the past
  if (start >= end) return { status: 'Unavailable', reason: 'START_NOT_BEFORE_END' };
  if (start < now) return { status: 'Unavailable', reason: 'IN_THE_PAST' };

  // AC2: maximum duration 120 minutes
  const minutes = (end - start) / 60000;
  if (minutes > MAX_DURATION_MINUTES) return { status: 'Unavailable', reason: 'TOO_LONG' };

  // AC3: blocked room
  if (room.blocked) return { status: 'Unavailable', reason: 'ROOM_BLOCKED' };

  // AC4: overlap check. The order of bookings does not matter (we stop at the first conflict),
  // so no sorting is needed; the bookings array is only read, never changed (AC5, former BUG-B).
  for (const b of bookings) {
    if (b.roomId !== room.id) continue;
    const bStart = new Date(b.start);
    const bEnd = new Date(b.end);
    // A5 mitigation R02: a booking we cannot read must block the slot (fail closed).
    // Before, every comparison with NaN was false, so a broken booking was silently ignored -> Available.
    if (Number.isNaN(bStart.getTime()) || Number.isNaN(bEnd.getTime()) || bStart >= bEnd) {
      return { status: 'Unavailable', reason: 'INVALID_BOOKING_DATA' };
    }
    // FIX BUG-A: strict < and > — "10:00-11:00" and "11:00-12:00" do NOT conflict
    if (start < bEnd && end > bStart) {
      return { status: 'Unavailable', reason: 'OVERLAP' };
    }
  }

  // AC5
  return { status: 'Available', reason: 'OK' };
}
