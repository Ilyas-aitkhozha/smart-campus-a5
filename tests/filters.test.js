import { describe, it, expect } from 'vitest';
import { filterRooms, parseAttendees, meetsCapacity, hasAllEquipment } from '../src/filters.js';
import { ROOMS } from '../src/rooms.js';

const ids = (rooms) => rooms.map((r) => r.id);

describe('F1 — capacity filter', () => {
  it('F01 exact capacity is enough: 20 attendees keep Seminar Room 101 (capacity 20)', () => {
    expect(ids(filterRooms(ROOMS, { attendees: 20 }))).toContain('R-101');
  });
  it('F02 insufficient capacity: 21 attendees remove R-101 (20) but keep R-202 (80) and R-303 (30)', () => {
    const result = ids(filterRooms(ROOMS, { attendees: 21 }));
    expect(result).not.toContain('R-101');
    expect(result).toEqual(['R-202', 'R-303']);
  });
  it('F03 meetsCapacity boundary: capacity 8 fits 8, not 9', () => {
    const room = { capacity: 8, equipment: [] };
    expect(meetsCapacity(room, 8)).toBe(true);
    expect(meetsCapacity(room, 9)).toBe(false);
  });
});

describe('F2 — equipment filter (ALL selected items required)', () => {
  it('F04 projector + computers keeps only Computer Lab 303', () => {
    expect(ids(filterRooms(ROOMS, { attendees: 1, equipment: ['projector', 'computers'] }))).toEqual(['R-303']);
  });
  it('F05 a room with only SOME of the items is excluded', () => {
    // R-404 has whiteboard + video, but no projector
    const room = ROOMS.find((r) => r.id === 'R-404');
    expect(hasAllEquipment(room, ['whiteboard'])).toBe(true);
    expect(hasAllEquipment(room, ['whiteboard', 'projector'])).toBe(false);
  });
  it('F06 no equipment selected -> only capacity decides; all rooms for 1 attendee', () => {
    expect(filterRooms(ROOMS, { attendees: 1 })).toHaveLength(ROOMS.length);
  });
});

describe('F3 / F4 — blocked rooms and empty result', () => {
  it('F07 a blocked room that matches is still listed (it is labelled Blocked, not hidden)', () => {
    expect(ids(filterRooms(ROOMS, { attendees: 10, equipment: ['microphone'] }))).toEqual(['R-202', 'R-505']);
  });
  it('F08 no match returns an empty array (UI shows the empty state)', () => {
    expect(filterRooms(ROOMS, { attendees: 50, equipment: ['computers'] })).toEqual([]);
    expect(filterRooms(ROOMS, { attendees: 81 })).toEqual([]);
  });
  it('F09 filtering returns a new array and does not change the catalog', () => {
    const snapshot = structuredClone(ROOMS);
    const result = filterRooms(ROOMS, { attendees: 1 });
    expect(result).not.toBe(ROOMS);
    expect(ROOMS).toEqual(snapshot);
  });
});

describe('Attendees input parsing', () => {
  it('F10 accepts whole numbers >= 1 and rejects 0, negatives, decimals, text and empty', () => {
    expect(parseAttendees('20')).toBe(20);
    expect(parseAttendees(' 3 ')).toBe(3);
    for (const bad of ['0', '-5', '2.5', 'ten', '', null, undefined]) expect(parseAttendees(bad)).toBeNull();
  });
});
