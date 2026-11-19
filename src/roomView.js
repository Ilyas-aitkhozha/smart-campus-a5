// Smart Campus — room-list view model (Assignment #05, Task 03).
// Pure: turns the raw filter inputs into everything the room list needs to show.
// Before this module, app.js render() mixed these rules with DOM updates and they could only be tested through jsdom.
import { filterRooms, parseAttendees } from './filters.js';
import { emptyStateText, INVALID_ATTENDEES } from './messages.js';

/**
 * @param {Array} rooms  the catalog
 * @param {{attendeesText: string, equipment: string[], selectedId: string|null}} input
 * @returns {{attendees: number|null, matching: Array, selectedId: string|null,
 *            filterError: string, emptyText: string, countText: string}}
 */
export function buildRoomView(rooms, { attendeesText, equipment, selectedId }) {
  const attendees = parseAttendees(attendeesText);
  const matching = attendees === null ? [] : filterRooms(rooms, { attendees, equipment });

  // keep the current selection while it still matches, otherwise select the first match (or none)
  const keepSelection = matching.some((room) => room.id === selectedId);

  let emptyText = '';
  if (matching.length === 0) emptyText = attendees === null ? INVALID_ATTENDEES : emptyStateText(attendees, equipment);

  return {
    attendees,
    matching,
    selectedId: keepSelection ? selectedId : (matching[0]?.id ?? null),
    filterError: attendees === null ? INVALID_ATTENDEES : '',
    emptyText,
    countText: `${matching.length} of ${rooms.length} rooms match.`,
  };
}
