// Smart Campus — fictional room catalog (data only, no logic besides freezing).
// Every room owns its bookings, so an availability check can only use the chosen room's data (F5).

export const DAY = '2026-10-28';
export const NOW_ISO = '2026-10-28T09:00:00'; // fixed "current time" for the demo
export const NOW = new Date(NOW_ISO);

/** Equipment that a user can require (id -> label shown in the UI). */
export const EQUIPMENT = Object.freeze({
  projector: 'Projector',
  whiteboard: 'Whiteboard',
  computers: 'Computers',
  video: 'Video conferencing',
  microphone: 'Microphone',
});

const at = (hhmm) => `${DAY}T${hhmm}:00`;

/** Recursively freezes plain objects/arrays so booking data cannot be changed (AC5). */
export function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.keys(value)) deepFreeze(value[key]);
  }
  return value;
}

export const ROOMS = deepFreeze([
  {
    id: 'R-101',
    name: 'Seminar Room 101',
    capacity: 20,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    // same two bookings as the original single-room version (order kept: B2 before B1)
    bookings: [
      { id: 'B2', roomId: 'R-101', start: at('14:00'), end: at('15:00') },
      { id: 'B1', roomId: 'R-101', start: at('10:00'), end: at('11:00') },
    ],
  },
  {
    id: 'R-202',
    name: 'Lecture Hall 202',
    capacity: 80,
    equipment: ['projector', 'microphone', 'video'],
    blocked: false,
    bookings: [
      { id: 'B3', roomId: 'R-202', start: at('09:30'), end: at('11:30') },
      { id: 'B4', roomId: 'R-202', start: at('12:00'), end: at('13:30') },
    ],
  },
  {
    id: 'R-303',
    name: 'Computer Lab 303',
    capacity: 30,
    equipment: ['computers', 'projector', 'whiteboard'],
    blocked: false,
    bookings: [{ id: 'B5', roomId: 'R-303', start: at('13:00'), end: at('15:00') }],
  },
  {
    id: 'R-404',
    name: 'Meeting Room 404',
    capacity: 8,
    equipment: ['whiteboard', 'video'],
    blocked: false,
    bookings: [{ id: 'B6', roomId: 'R-404', start: at('16:00'), end: at('17:00') }],
  },
  {
    id: 'R-505',
    name: 'Media Studio 505',
    capacity: 12,
    equipment: ['projector', 'video', 'microphone'],
    blocked: true, // closed for maintenance: never available (F3 / AC3)
    bookings: [],
  },
]);

/** Returns the room with this id, or undefined. */
export function findRoom(rooms, id) {
  return rooms.find((room) => room.id === id);
}
