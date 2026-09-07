import type { AgendaCalendar, AgendaEvent, AgendaPreferences, CalendarId, EventId } from '../domain/types';

export interface EventRange { start: Date; end: Date; }
export type NewCalendar = Pick<AgendaCalendar, 'name' | 'color'> & Partial<Pick<AgendaCalendar, 'visible'>>;
export type CalendarChanges = Partial<Pick<AgendaCalendar, 'name' | 'color' | 'visible'>>;
export type NewEvent = Omit<AgendaEvent, 'id' | 'createdAt' | 'updatedAt'>;
export type EventChanges = Partial<Omit<AgendaEvent, 'id' | 'createdAt' | 'updatedAt'>>;

export interface CalendarProvider {
  listCalendars(): Promise<AgendaCalendar[]>;
  createCalendar(input: NewCalendar): Promise<AgendaCalendar>;
  updateCalendar(id: CalendarId, changes: CalendarChanges): Promise<AgendaCalendar>;
  deleteCalendar(id: CalendarId): Promise<void>;
  eventsInRange(range: EventRange): Promise<AgendaEvent[]>;
  getEvent(id: EventId): Promise<AgendaEvent | undefined>;
  createEvent(input: NewEvent): Promise<AgendaEvent>;
  updateEvent(id: EventId, changes: EventChanges): Promise<AgendaEvent>;
  deleteEvent(id: EventId): Promise<void>;
  getPreferences(): Promise<AgendaPreferences>;
  updatePreferences(changes: Partial<AgendaPreferences>): Promise<AgendaPreferences>;
}
