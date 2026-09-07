import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { describe, expect, it } from 'vitest';
import type { AgendaCalendar, AgendaEvent, AgendaPreferences } from '../domain/types';
import type { CalendarProvider, CalendarChanges, EventChanges, EventRange, NewCalendar, NewEvent } from '../calendar/CalendarProvider';
import { CalendarProviderRoot, useCalendar } from './CalendarContext';

class MemoryProvider implements CalendarProvider {
  calendars: AgendaCalendar[] = [{ id: 'c', name: 'Personal', color: '#8f93ff', visible: true, createdAt: '', updatedAt: '' }];
  events: AgendaEvent[] = [];
  preferences: AgendaPreferences = { defaultCalendarId: 'c', weekStartsOn: 0, use24HourTime: false, soundEffects: true };
  async listCalendars() { return this.calendars; }
  async createCalendar(input: NewCalendar) { const c = { id: 'n', name: input.name, color: input.color, visible: true, createdAt: '', updatedAt: '' }; this.calendars.push(c); return c; }
  async updateCalendar(id: string, changes: CalendarChanges) { const c = { ...this.calendars.find(x => x.id === id)!, ...changes }; return c; }
  async deleteCalendar() {}
  async eventsInRange(_range: EventRange) { return this.events; }
  async getEvent(id: string) { return this.events.find(event => event.id === id); }
  async createEvent(input: NewEvent) { const event = { ...input, id: 'e', createdAt: '', updatedAt: '' } as AgendaEvent; this.events.push(event); return event; }
  async updateEvent(id: string, changes: EventChanges) { const event = { ...this.events.find(x => x.id === id)!, ...changes } as AgendaEvent; return event; }
  async deleteEvent() {}
  async getPreferences() { return this.preferences; }
  async updatePreferences(changes: Partial<AgendaPreferences>) { this.preferences = { ...this.preferences, ...changes }; return this.preferences; }
}

describe('CalendarContext', () => {
  it('refreshes the visible range after creating an event', async () => {
    const provider = new MemoryProvider();
    const wrapper = ({ children }: PropsWithChildren) => <CalendarProviderRoot provider={provider}>{children}</CalendarProviderRoot>;
    const { result } = renderHook(() => useCalendar(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    await result.current.createEvent({ calendarId: 'c', title: 'Coffee', start: '2026-09-07T10:00:00-04:00', end: '2026-09-07T11:00:00-04:00', allDay: false, location: '', notes: '', alerts: [] });
    await waitFor(() => expect(result.current.events).toHaveLength(1));
  });
});
