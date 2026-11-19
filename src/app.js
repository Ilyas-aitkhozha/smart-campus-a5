// Smart Campus — UI presentation only. It reads the DOM, calls the pure rules and renders the answers.
// No booking rule or filter rule is written here; they live in availability.js and filters.js.
import { checkAvailability } from './availability.js';
import { filterRooms, parseAttendees } from './filters.js';
import { EQUIPMENT, findRoom } from './rooms.js';
import { describeResult, emptyStateText, formatTime, INVALID_ATTENDEES } from './messages.js';

/**
 * Wires the page in `doc` to the given data. Exported so the UI can be tested with jsdom.
 * @param {Document} doc
 * @param {{rooms: Array, now: Date, nowIso: string, day: string}} data
 */
export function createApp(doc, { rooms, now, nowIso, day }) {
  const $ = (id) => doc.getElementById(id);
  const el = {
    attendees: $('attendees'), filterError: $('filter-error'), equipment: $('equipment-options'),
    roomCount: $('room-count'), roomList: $('room-list'), empty: $('empty-state'),
    selected: $('selected-room'), nowLabel: $('now-label'), bookings: $('booking-list'),
    form: $('check-form'), start: $('start'), end: $('end'), button: $('check-button'), result: $('result'),
  };
  let selectedId = null;

  el.nowLabel.textContent = `${day}, ${formatTime(nowIso)}`;
  for (const [id, label] of Object.entries(EQUIPMENT)) {
    const option = doc.createElement('label');
    option.className = 'chip';
    option.innerHTML = `<input type="checkbox" value="${id}" /> ${label}`;
    el.equipment.appendChild(option);
  }

  const requiredEquipment = () =>
    [...el.equipment.querySelectorAll('input:checked')].map((input) => input.value);

  function hideResult() {
    el.result.hidden = true;
    el.result.textContent = '';
  }

  function showResult() {
    const room = findRoom(rooms, selectedId);
    if (!room) return hideResult();
    const request = {
      start: el.start.value && `${day}T${el.start.value}:00`,
      end: el.end.value && `${day}T${el.end.value}:00`,
    };
    // F5: the check always uses the bookings of the room that is selected right now
    const { tone, text } = describeResult(checkAvailability(request, room, room.bookings, now));
    el.result.hidden = false;
    el.result.className = `result ${tone}`;
    el.result.textContent = `${text} (${room.name})`;
  }

  function renderRoomDetails() {
    const room = findRoom(rooms, selectedId);
    el.selected.textContent = room ? `${room.name} (${room.id})` : 'none selected';
    el.bookings.replaceChildren(
      ...(room ? room.bookings : []).map((b) => {
        const li = doc.createElement('li');
        li.textContent = `${formatTime(b.start)}–${formatTime(b.end)} (${b.id})`;
        return li;
      }),
    );
    if (room && room.bookings.length === 0) {
      const li = doc.createElement('li');
      li.textContent = 'No bookings today.';
      el.bookings.appendChild(li);
    }
    el.button.disabled = !room;
  }

  function renderRoomCard(room) {
    const card = doc.createElement('label');
    card.className = `room${room.blocked ? ' blocked' : ''}`;
    const equipment = room.equipment.map((id) => EQUIPMENT[id]).join(', ');
    card.innerHTML = `
      <input type="radio" name="room" value="${room.id}" ${room.id === selectedId ? 'checked' : ''} />
      <span class="room-name">${room.name} <small>${room.id}</small></span>
      <span class="room-meta">Capacity ${room.capacity} · ${equipment}</span>
      ${room.blocked ? '<span class="badge">Blocked — cannot be booked</span>' : ''}`;
    return card;
  }

  /** Recomputes the matching rooms and keeps the selection consistent with them. */
  function render() {
    const attendees = parseAttendees(el.attendees.value);
    const equipment = requiredEquipment();
    const matching = attendees === null ? [] : filterRooms(rooms, { attendees, equipment });

    el.filterError.hidden = attendees !== null;
    el.filterError.textContent = attendees === null ? INVALID_ATTENDEES : '';

    const previous = selectedId;
    if (!matching.some((room) => room.id === selectedId)) selectedId = matching[0]?.id ?? null;

    el.roomList.replaceChildren(...matching.map(renderRoomCard));
    el.roomCount.textContent = `${matching.length} of ${rooms.length} rooms match.`;
    // F4: clear empty state
    el.empty.hidden = matching.length > 0;
    el.empty.textContent = matching.length > 0 ? ''
      : attendees === null ? INVALID_ATTENDEES : emptyStateText(attendees, equipment);

    renderRoomDetails();
    // F5: if the selected room changed, an old answer would belong to another room -> refresh it
    if (selectedId !== previous && !el.result.hidden) showResult();
  }

  el.attendees.addEventListener('input', render);
  el.equipment.addEventListener('change', render);
  el.roomList.addEventListener('change', (event) => {
    if (event.target.name !== 'room') return;
    selectedId = event.target.value;
    renderRoomDetails();
    if (!el.result.hidden) showResult(); // F5
  });
  el.form.addEventListener('submit', (event) => {
    event.preventDefault();
    showResult();
  });

  render();
  return { getSelectedId: () => selectedId };
}
