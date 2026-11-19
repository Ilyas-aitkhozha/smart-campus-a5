import { describe, it, expect } from 'vitest';
import { ROOMS, EQUIPMENT, findRoom } from '../src/rooms.js';

describe('Room catalog (data model)', () => {
  it('C01 has at least four rooms with id, name, capacity, equipment, blocked and bookings', () => {
    expect(ROOMS.length).toBeGreaterThanOrEqual(4);
    for (const room of ROOMS) {
      expect(typeof room.id).toBe('string');
      expect(typeof room.name).toBe('string');
      expect(Number.isInteger(room.capacity) && room.capacity > 0).toBe(true);
      expect(Array.isArray(room.equipment)).toBe(true);
      expect(typeof room.blocked).toBe('boolean');
      expect(Array.isArray(room.bookings)).toBe(true);
    }
  });

  it('C02 room ids are unique, every booking belongs to its own room, equipment ids are known', () => {
    const ids = ROOMS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const room of ROOMS) {
      for (const b of room.bookings) expect(b.roomId).toBe(room.id);
      for (const item of room.equipment) expect(Object.keys(EQUIPMENT)).toContain(item);
    }
    expect(findRoom(ROOMS, 'R-303').name).toBe('Computer Lab 303');
    expect(findRoom(ROOMS, 'NOPE')).toBeUndefined();
  });

  it('C03 catalog data is frozen, so it cannot be changed by mistake (AC5)', () => {
    const room = ROOMS[0];
    expect(Object.isFrozen(ROOMS)).toBe(true);
    expect(Object.isFrozen(room.bookings)).toBe(true);
    expect(Object.isFrozen(room.bookings[0])).toBe(true);
    expect(() => room.bookings.push({})).toThrow(TypeError);
  });
});

describe('Room catalog — booking times (Assignment #05, R02)', () => {
  it('C04 every booking in the catalog has readable times with start before end', () => {
    for (const room of ROOMS) {
      for (const b of room.bookings) {
        const start = new Date(b.start);
        const end = new Date(b.end);
        expect(Number.isNaN(start.getTime()), `${b.id} start`).toBe(false);
        expect(Number.isNaN(end.getTime()), `${b.id} end`).toBe(false);
        expect(start < end, `${b.id} start < end`).toBe(true);
      }
    }
  });
});
