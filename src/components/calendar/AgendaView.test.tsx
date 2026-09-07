import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgendaView, buildAgendaDays, monthLabelForDate } from './AgendaView';
import type { AgendaCalendar, AgendaEvent } from '../../domain/types';

const calendar: AgendaCalendar = {
  id: 'personal', name: 'Personal', color: '#7c72b8', visible: true,
  createdAt: '2026-09-01T00:00:00.000Z', updatedAt: '2026-09-01T00:00:00.000Z'
};

const events: AgendaEvent[] = [
  {
    id: 'all-day', calendarId: 'personal', title: 'Artisan Market', allDay: true,
    start: '2026-09-13', end: '2026-09-14', location: 'Dundas, Ontario', notes: '', alerts: [],
    createdAt: '2026-09-01T00:00:00.000Z', updatedAt: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'timed', calendarId: 'personal', title: 'Dinner', allDay: false,
    start: '2026-09-14T18:30:00-04:00', end: '2026-09-14T20:00:00-04:00', location: 'Hamilton', notes: '', alerts: [],
    createdAt: '2026-09-01T00:00:00.000Z', updatedAt: '2026-09-01T00:00:00.000Z'
  }
];

describe('AgendaView', () => {
  it('builds a continuous sequence including empty days', () => {
    const days = buildAgendaDays(new Date(2026, 8, 12), new Date(2026, 8, 16), events);
    expect(days.map(day => day.events.length)).toEqual([0, 1, 1, 0]);
  });

  it('formats the floating month heading in Agenda style', () => {
    expect(monthLabelForDate(new Date(2026, 8, 7))).toBe("SEPTEMBER ’26");
  });

  it('renders compact empty days and populated event details', () => {
    render(<AgendaView anchor={new Date(2026, 8, 12)} calendars={[calendar]} events={events} />);
    expect(screen.getByText('Artisan Market')).toBeInTheDocument();
    expect(screen.getByText('all-day')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
    const dinner = screen.getByText('Dinner').closest('.agenda-event');
    expect(dinner).not.toBeNull();
    expect(dinner?.textContent).toMatch(/\d{1,2}:30 PM/);
    expect(screen.getByText('Hamilton')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Add event').length).toBeGreaterThan(0);
  });
});
