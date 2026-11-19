// Smart Campus — room filtering rules (F1, F2). Pure functions: no DOM, input arrays are never changed.
// Blocked rooms are NOT hidden here: they stay visible with a "Blocked" label and the
// availability check always answers Unavailable for them (F3).

/** Parses the attendees field. Returns a whole number >= 1, or null when the text is not valid. */
export function parseAttendees(text) {
  const t = String(text ?? '').trim();
  if (!/^\d+$/.test(t)) return null;
  const n = Number(t);
  return n >= 1 ? n : null;
}

/** F1: capacity must be greater than or equal to the requested attendees. */
export function meetsCapacity(room, attendees) {
  return room.capacity >= attendees;
}

/** F2: the room must contain ALL required equipment items (no items required -> true). */
export function hasAllEquipment(room, required) {
  return required.every((item) => room.equipment.includes(item));
}

/**
 * Returns a NEW array with the rooms that satisfy every selected requirement.
 * An empty result is valid: the UI then shows the empty state (F4).
 * @param {Array} rooms
 * @param {{attendees: number, equipment?: string[]}} criteria
 */
export function filterRooms(rooms, { attendees, equipment = [] }) {
  return rooms.filter((room) => meetsCapacity(room, attendees) && hasAllEquipment(room, equipment));
}
