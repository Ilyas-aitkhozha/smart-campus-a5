// Entry point: connects the page to the fictional catalog. All logic lives in the imported modules.
import { createApp } from './app.js';
import { ROOMS, NOW, NOW_ISO, DAY } from './rooms.js';

createApp(document, { rooms: ROOMS, now: NOW, nowIso: NOW_ISO, day: DAY });