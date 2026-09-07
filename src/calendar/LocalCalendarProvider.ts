import type { AgendaCalendar, AgendaEvent, AgendaPreferences, CalendarId, EventId } from '../domain/types';
import { AgendaRepository } from '../storage/AgendaRepository';
import type { CalendarChanges, CalendarProvider, EventChanges, EventRange, NewCalendar, NewEvent } from './CalendarProvider';

export class LocalCalendarProvider implements CalendarProvider {
  constructor(
    private readonly repository: AgendaRepository,
    private readonly now: () => string = () => new Date().toISOString(),
    private readonly id: () => string = () => crypto.randomUUID()
  ) {}

  listCalendars(): Promise<AgendaCalendar[]> { return this.repository.listCalendars(); }

  async createCalendar(input: NewCalendar): Promise<AgendaCalendar> {
    const stamp = this.now();
    const calendar: AgendaCalendar = {
      id: this.id(), name: input.name, color: input.color, visible: input.visible ?? true,
      createdAt: stamp, updatedAt: stamp
    };
    await this.repository.putCalendar(calendar);
    const preferences = await this.repository.getPreferences();
    if (!preferences.defaultCalendarId) {
      await this.repository.putPreferences({ ...preferences, defaultCalendarId: calendar.id });
    }
    return calendar;
  }

  async updateCalendar(id: CalendarId, changes: CalendarChanges): Promise<AgendaCalendar> {
    const current = (await this.repository.listCalendars()).find(item => item.id === id);
    if (!current) throw new Error('Calendar not found');
    const updated = { ...current, ...changes, id, updatedAt: this.now() };
    await this.repository.putCalendar(updated);
    return updated;
  }

  async deleteCalendar(id: CalendarId): Promise<void> {
    await this.repository.deleteCalendar(id);
    const preferences = await this.repository.getPreferences();
    if (preferences.defaultCalendarId === id) {
      const replacement = (await this.repository.listCalendars())[0]?.id ?? null;
      await this.repository.putPreferences({ ...preferences, defaultCalendarId: replacement });
    }
  }

  async eventsInRange(range: EventRange): Promise<AgendaEvent[]> {
    const visibleIds = new Set((await this.repository.listCalendars()).filter(item => item.visible).map(item => item.id));
    return (await this.repository.eventsBetween(range.start, range.end)).filter(event => visibleIds.has(event.calendarId));
  }

  getEvent(id: EventId): Promise<AgendaEvent | undefined> { return this.repository.getEvent(id); }

  async createEvent(input: NewEvent): Promise<AgendaEvent> {
    const stamp = this.now();
    const event = { ...input, id: this.id(), createdAt: stamp, updatedAt: stamp } as AgendaEvent;
    await this.repository.putEvent(event);
    return event;
  }

  async updateEvent(id: EventId, changes: EventChanges): Promise<AgendaEvent> {
    const current = await this.repository.getEvent(id);
    if (!current) throw new Error('Event not found');
    const updated = { ...current, ...changes, id, updatedAt: this.now() } as AgendaEvent;
    await this.repository.putEvent(updated);
    return updated;
  }

  deleteEvent(id: EventId): Promise<void> { return this.repository.deleteEvent(id); }
  getPreferences(): Promise<AgendaPreferences> { return this.repository.getPreferences(); }

  async updatePreferences(changes: Partial<AgendaPreferences>): Promise<AgendaPreferences> {
    const updated = { ...(await this.repository.getPreferences()), ...changes };
    await this.repository.putPreferences(updated);
    return updated;
  }
}
