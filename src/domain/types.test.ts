import { describe, expect, it } from 'vitest';
import type { AgendaCalendar, AgendaEvent, AgendaPreferences } from './types';

describe('Agenda domain types', () => {
  it('represent calendars, timed events, all-day events and preferences', () => {
    const calendar: AgendaCalendar = {
      id: 'personal',
      name: 'Personal',
      color: '#8f93ff',
      visible: true,
      createdAt: '2026-09-07T11:00:00.000Z',
      updatedAt: '2026-09-07T11:00:00.000Z'
    };

    const timed: AgendaEvent = {
      id: 'coffee',
      calendarId: calendar.id,
      title: 'Coffee',
      start: '2026-09-07T10:30:00-04:00',
      end: '2026-09-07T11:00:00-04:00',
      allDay: false,
      location: 'Hamilton',
      notes: '',
      alerts: [{ offsetMinutes: -30 }],
      createdAt: '2026-09-07T11:00:00.000Z',
      updatedAt: '2026-09-07T11:00:00.000Z'
    };

    const allDay: AgendaEvent = {
      id: 'market',
      calendarId: calendar.id,
      title: 'Dundas Artisan Market',
      start: '2026-09-13',
      end: '2026-09-14',
      allDay: true,
      location: 'Dundas, Ontario',
      notes: '',
      alerts: [],
      createdAt: '2026-09-07T11:00:00.000Z',
      updatedAt: '2026-09-07T11:00:00.000Z'
    };

    const preferences: AgendaPreferences = {
      defaultCalendarId: calendar.id,
      weekStartsOn: 0,
      use24HourTime: false,
      soundEffects: true
    };

    expect(timed.allDay).toBe(false);
    expect(allDay.end).toBe('2026-09-14');
    expect(preferences.defaultCalendarId).toBe('personal');
  });
});
