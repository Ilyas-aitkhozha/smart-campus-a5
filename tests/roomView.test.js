// Task 03 (Assignment #05): the room-list rules extracted from app.js, tested without a DOM.
import { describe, it, expect } from 'vitest';
import { buildRoomView } from '../src/roomView.js';
import { ROOMS } from '../src/rooms.js';
import { INVALID_ATTENDEES } from '../src/messages.js';

const view = (attendeesText, equipment = [], selectedId = null) =>
  buildRoomView(ROOMS, { attendeesText, equipment, selectedId });

describe('Room list view model (buildRoomView)', () => {
  it('V01 valid input: lists matching rooms, selects the first one, no error or empty text', () => {
    const v = view('1');
    expect(v.matching.map((r) => r.id)).toEqual(['R-101', 'R-202', 'R-303', 'R-404', 'R-505']);
    expect(v.selectedId).toBe('R-101');
    expect(v.filterError).toBe('');
    expect(v.emptyText).toBe('');
    expect(v.countText).toBe('5 of 5 rooms match.');
  });

  it('V02 keeps the current selection while it still matches', () => {
    expect(view('25', [], 'R-303').selectedId).toBe('R-303');
  });

  it('V03 drops a selection that no longer matches and picks the first match', () => {
    // R-404 has capacity 8 -> 25 attendees remove it
    expect(view('25', [], 'R-404').selectedId).toBe('R-202');
  });

  it('V04 no match: empty list, no selection, empty-state text repeats the request', () => {
    const v = view('500');
    expect(v.matching).toEqual([]);
    expect(v.selectedId).toBeNull();
    expect(v.emptyText).toMatch(/No rooms match 500 attendees/);
    expect(v.countText).toBe('0 of 5 rooms match.');
  });

  it('V05 invalid attendees: field error and empty-state both show the input message', () => {
    for (const text of ['', '0', '2.5', 'abc']) {
      const v = view(text, [], 'R-101');
      expect(v.attendees).toBeNull();
      expect(v.filterError).toBe(INVALID_ATTENDEES);
      expect(v.emptyText).toBe(INVALID_ATTENDEES);
      expect(v.selectedId).toBeNull();
    }
  });
});
