import { describe, it, expect } from 'vitest';
import { checkAvailability } from '../src/availability.js';
import { ROOMS, NOW, findRoom } from '../src/rooms.js';

// New regression tests for Assignment #04. The original T01-T10 stay unchanged in availability.test.js.
const at = (hhmm) => `2026-10-28T${hhmm}:00`;
const check = (roomId, from, to) => {
  const room = findRoom(ROOMS, roomId);
  return checkAvailability({ start: at(from), end: at(to) }, room, room.bookings, NOW);
};

describe('AC1 — missing or unreadable times (found by a probe on the baseline)', () => {
  it('A01 empty start/end is Unavailable, not Available', () => {
    const room = findRoom(ROOMS, 'R-101');
    expect(checkAvailability({ start: '', end: '' }, room, room.bookings, NOW))
      .toEqual({ status: 'Unavailable', reason: 'INVALID_TIME' });
  });
  it('A02 text that is not a date is Unavailable', () => {
    const room = findRoom(ROOMS, 'R-101');
    expect(checkAvailability({ start: 'abc', end: 'xyz' }, room, room.bookings, NOW).reason).toBe('INVALID_TIME');
  });
});

describe('Boundaries on catalog rooms', () => {
  it('A03 exactly 120 minutes is Available, 121 minutes is TOO_LONG (AC2)', () => {
    expect(check('R-303', '15:00', '17:00')).toEqual({ status: 'Available', reason: 'OK' });
    expect(check('R-303', '15:00', '17:01')).toEqual({ status: 'Unavailable', reason: 'TOO_LONG' });
  });
  it('A04 touching is Available, overlapping by one minute is OVERLAP (AC4)', () => {
    // R-303 is booked 13:00-15:00
    expect(check('R-303', '11:00', '13:00').status).toBe('Available');
    expect(check('R-303', '15:00', '16:00').status).toBe('Available');
    expect(check('R-303', '12:00', '13:01').reason).toBe('OVERLAP');
    expect(check('R-303', '14:59', '16:00').reason).toBe('OVERLAP');
  });
});

describe('F3 / F5 — the chosen room decides the answer', () => {
  it('A05 a blocked catalog room is never Available, even for a free slot (F3, AC3)', () => {
    const blocked = ROOMS.filter((r) => r.blocked);
    expect(blocked.length).toBeGreaterThan(0);
    for (const room of blocked) {
      for (const [from, to] of [['09:30', '10:00'], ['12:00', '13:00'], ['18:00', '20:00']]) {
        expect(checkAvailability({ start: at(from), end: at(to) }, room, room.bookings, NOW).status).toBe('Unavailable');
      }
    }
  });
  it('A06 the same slot gives different answers for different rooms, using each room\'s own bookings (F5)', () => {
    // 10:00-11:00: R-101 has B1 10:00-11:00, R-202 has B3 09:30-11:30, R-303 and R-404 are free
    expect(check('R-101', '10:00', '11:00').reason).toBe('OVERLAP');
    expect(check('R-202', '10:00', '11:00').reason).toBe('OVERLAP');
    expect(check('R-303', '10:00', '11:00').status).toBe('Available');
    expect(check('R-404', '10:00', '11:00').status).toBe('Available');
    expect(check('R-505', '10:00', '11:00').reason).toBe('ROOM_BLOCKED');
  });
  it('A07 many checks do not change any room or booking (AC5)', () => {
    const snapshot = structuredClone(ROOMS);
    for (const room of ROOMS) check(room.id, '10:30', '12:00');
    expect(ROOMS).toEqual(snapshot);
  });
});
