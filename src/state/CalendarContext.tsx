import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { CalendarProvider, CalendarChanges, EventChanges, EventRange, NewCalendar, NewEvent } from '../calendar/CalendarProvider';
import type { AgendaCalendar, AgendaEvent, AgendaPreferences, CalendarId, EventId } from '../domain/types';

interface CalendarContextValue {
  calendars: AgendaCalendar[];
  events: AgendaEvent[];
  preferences: AgendaPreferences | null;
  loading: boolean;
  error: string | null;
  range: EventRange;
  setRange(range: EventRange): void;
  refresh(): Promise<void>;
  createCalendar(input: NewCalendar): Promise<AgendaCalendar>;
  updateCalendar(id: CalendarId, changes: CalendarChanges): Promise<AgendaCalendar>;
  deleteCalendar(id: CalendarId): Promise<void>;
  createEvent(input: NewEvent): Promise<AgendaEvent>;
  updateEvent(id: EventId, changes: EventChanges): Promise<AgendaEvent>;
  deleteEvent(id: EventId): Promise<void>;
  updatePreferences(changes: Partial<AgendaPreferences>): Promise<AgendaPreferences>;
}

const CalendarContext = createContext<CalendarContextValue | null>(null);
const initialRange = { start: new Date(2026, 6, 1), end: new Date(2027, 0, 1) };

export function CalendarProviderRoot({ provider, children }: PropsWithChildren<{ provider: CalendarProvider }>) {
  const [calendars, setCalendars] = useState<AgendaCalendar[]>([]);
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [preferences, setPreferences] = useState<AgendaPreferences | null>(null);
  const [range, setRange] = useState<EventRange>(initialRange);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [nextCalendars, nextEvents, nextPreferences] = await Promise.all([
        provider.listCalendars(), provider.eventsInRange(range), provider.getPreferences()
      ]);
      setCalendars(nextCalendars); setEvents(nextEvents); setPreferences(nextPreferences); setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Calendar data could not be loaded');
    } finally { setLoading(false); }
  }, [provider, range]);

  useEffect(() => { void refresh(); }, [refresh]);

  const mutate = useCallback(async <T,>(operation: () => Promise<T>): Promise<T> => {
    try { const result = await operation(); await refresh(); return result; }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Calendar change failed'); throw cause; }
  }, [refresh]);

  const value = useMemo<CalendarContextValue>(() => ({
    calendars, events, preferences, loading, error, range, setRange, refresh,
    createCalendar: input => mutate(() => provider.createCalendar(input)),
    updateCalendar: (id, changes) => mutate(() => provider.updateCalendar(id, changes)),
    deleteCalendar: id => mutate(() => provider.deleteCalendar(id)),
    createEvent: input => mutate(() => provider.createEvent(input)),
    updateEvent: (id, changes) => mutate(() => provider.updateEvent(id, changes)),
    deleteEvent: id => mutate(() => provider.deleteEvent(id)),
    updatePreferences: changes => mutate(() => provider.updatePreferences(changes))
  }), [calendars, events, preferences, loading, error, range, refresh, mutate, provider]);

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar(): CalendarContextValue {
  const value = useContext(CalendarContext);
  if (!value) throw new Error('useCalendar must be used inside CalendarProviderRoot');
  return value;
}
