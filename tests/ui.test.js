// @vitest-environment jsdom
// UI behaviour / integration tests: the real index.html markup + createApp + the real catalog.
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { URL as NodeURL } from 'node:url'; // jsdom replaces the global URL
import { createApp } from '../src/app.js';
import { ROOMS, NOW, NOW_ISO, DAY } from '../src/rooms.js';

const html = readFileSync(new NodeURL('../index.html', import.meta.url), 'utf8');
const $ = (id) => document.getElementById(id);
const roomIds = () => [...document.querySelectorAll('input[name="room"]')].map((r) => r.value);

function setAttendees(value) {
  $('attendees').value = value;
  $('attendees').dispatchEvent(new Event('input', { bubbles: true }));
}
function tickEquipment(id) {
  const box = document.querySelector(`#equipment-options input[value="${id}"]`);
  box.checked = !box.checked;
  box.dispatchEvent(new Event('change', { bubbles: true }));
}
function chooseRoom(id) {
  const radio = document.querySelector(`input[name="room"][value="${id}"]`);
  radio.checked = true;
  radio.dispatchEvent(new Event('change', { bubbles: true }));
}
function check(start, end) {
  $('start').value = start;
  $('end').value = end;
  $('check-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  return $('result').textContent;
}

let app;
beforeEach(() => {
  document.body.innerHTML = new DOMParser().parseFromString(html, 'text/html').body.innerHTML;
  app = createApp(document, { rooms: ROOMS, now: NOW, nowIso: NOW_ISO, day: DAY });
});

describe('UI — filtering, empty state and room switching', () => {
  it('U01 shows all rooms at start, the blocked one with a label, and no result yet', () => {
    expect(roomIds()).toEqual(['R-101', 'R-202', 'R-303', 'R-404', 'R-505']);
    expect(document.querySelector('.room.blocked .badge').textContent).toMatch(/Blocked/);
    expect($('result').hidden).toBe(true);
  });

  it('U02 capacity + equipment filters update the visible list (F1, F2)', () => {
    setAttendees('21');
    expect(roomIds()).toEqual(['R-202', 'R-303']);
    tickEquipment('computers');
    expect(roomIds()).toEqual(['R-303']);
    expect($('room-count').textContent).toBe('1 of 5 rooms match.');
  });

  it('U03 no match shows a clear empty state and disables the check (F4)', () => {
    setAttendees('50');
    tickEquipment('computers');
    expect(roomIds()).toEqual([]);
    expect($('empty-state').hidden).toBe(false);
    expect($('empty-state').textContent).toBe(
      'No rooms match 50 attendees with Computers. Try fewer attendees or remove some equipment.');
    expect($('check-button').disabled).toBe(true);
  });

  it('U04 invalid attendees text gives a field message instead of a list', () => {
    setAttendees('2.5');
    expect($('filter-error').hidden).toBe(false);
    expect($('filter-error').textContent).toBe('Enter a whole number of attendees (1 or more).');
    expect(roomIds()).toEqual([]);
  });

  it('U05 switching the room refreshes the answer with that room\'s bookings (F5)', () => {
    chooseRoom('R-101');
    expect(check('10:00', '11:00')).toBe('Unavailable: This time overlaps with an existing booking. (Seminar Room 101)');
    chooseRoom('R-404');
    expect($('result').textContent).toBe('Available: The room is free for this time slot. (Meeting Room 404)');
    expect($('result').className).toBe('result ok');
    expect($('booking-list').textContent).toContain('16:00–17:00 (B6)');
  });

  it('U06 the blocked room is never shown as available in the UI (F3)', () => {
    chooseRoom('R-505');
    expect(check('18:00', '19:00')).toBe('Unavailable: This room is blocked and cannot be booked right now. (Media Studio 505)');
  });

  it('U07 a filter that removes the selected room moves the selection and refreshes the answer (F5)', () => {
    chooseRoom('R-101');
    check('11:00', '12:00');
    expect($('result').textContent).toMatch(/^Available.*Seminar Room 101/);
    tickEquipment('microphone'); // R-101 has no microphone -> first match R-202 is selected
    expect(app.getSelectedId()).toBe('R-202');
    // R-202 is booked 09:30-11:30, so the refreshed answer for 11:00-12:00 is now Unavailable
    expect($('result').textContent).toBe('Unavailable: This time overlaps with an existing booking. (Lecture Hall 202)');
  });

  it('U08 original messages still appear: 120 vs 121 minutes, empty fields (AC2, AC6)', () => {
    chooseRoom('R-303');
    expect(check('15:00', '17:00')).toMatch(/^Available/);
    expect(check('15:00', '17:01')).toBe('Unavailable: A booking can last at most 120 minutes. (Computer Lab 303)');
    expect(check('', '')).toBe('Unavailable: Enter both a start time and an end time. (Computer Lab 303)');
  });
});
