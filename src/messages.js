// Smart Campus — user-facing text (AC6). One place for every message, so the UI never builds them itself.
import { MAX_DURATION_MINUTES } from './availability.js';
import { EQUIPMENT } from './rooms.js';

export const MESSAGES = {
  OK: 'The room is free for this time slot.',
  INVALID_TIME: 'Enter both a start time and an end time.',
  START_NOT_BEFORE_END: 'The start time must be earlier than the end time.',
  IN_THE_PAST: 'This time is already in the past. Choose a later start time.',
  TOO_LONG: `A booking can last at most ${MAX_DURATION_MINUTES} minutes.`,
  ROOM_BLOCKED: 'This room is blocked and cannot be booked right now.',
  OVERLAP: 'This time overlaps with an existing booking.',
  INVALID_BOOKING_DATA: 'This room has a booking with an unreadable time, so it cannot be checked. Please contact the campus office.',
};

/** "2026-10-28T14:00:00" -> "14:00" */
export const formatTime = (iso) => iso.slice(11, 16);

/** Turns a checkAvailability() result into the text and colour of the result box. */
export function describeResult({ status, reason }) {
  return {
    tone: status === 'Available' ? 'ok' : 'error',
    text: `${status}: ${MESSAGES[reason] ?? reason}`,
  };
}

/** Message for the empty state (F4): repeats what the user asked for. */
export function emptyStateText(attendees, equipment) {
  const items = equipment.map((id) => EQUIPMENT[id] ?? id).join(', ');
  const wanted = items ? `${attendees} attendees with ${items}` : `${attendees} attendees`;
  return `No rooms match ${wanted}. Try fewer attendees or remove some equipment.`;
}

export const INVALID_ATTENDEES = 'Enter a whole number of attendees (1 or more).';
