# Build 003b

Fixes a startup crash introduced in Build 003.

## Root cause

`AgendaPlane` uses `useCalendar()`, but the application root was not wrapped in `CalendarProviderRoot`. React therefore threw during initial render and GitHub Pages showed a blank page.

## Change

`src/main.tsx` now:

1. opens the IndexedDB `AgendaRepository`;
2. creates the `LocalCalendarProvider`;
3. wraps `<App />` in `<CalendarProviderRoot provider={provider}>`;
4. shows a minimal startup error message if IndexedDB/bootstrap fails instead of leaving a blank page.

No Agenda-view visual or interaction code changed.
