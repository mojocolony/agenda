import type { AgendaCalendar, AgendaEvent } from '../domain/types';

export const personalCalendar: AgendaCalendar = {
  id: 'personal',
  name: 'Personal',
  color: '#8f93ff',
  visible: true,
  createdAt: '2026-09-07T11:00:00.000Z',
  updatedAt: '2026-09-07T11:00:00.000Z'
};

export const marketEvent: AgendaEvent = {
  id: 'market',
  calendarId: personalCalendar.id,
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
