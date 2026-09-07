import { describe, expect, it } from 'vitest';
import { eventIntersectsRange, monthGrid, sixMonthRange, weekContaining } from './dates';
import type { AgendaEvent } from './types';

describe('date helpers', () => {
  it('builds a 42-cell month grid including leap day', () => {
    const cells = monthGrid(2028, 1);
    expect(cells).toHaveLength(42);
    expect(cells.some(cell => cell.inDisplayedMonth && cell.day === 29)).toBe(true);
    expect(cells[0].date.getMonth()).toBe(0);
  });

  it('groups months into Jan-Jun or Jul-Dec half-years', () => {
    expect(sixMonthRange(new Date(2026, 8, 6)).map(item => item.monthIndex)).toEqual([6, 7, 8, 9, 10, 11]);
    expect(sixMonthRange(new Date(2026, 2, 1)).map(item => item.monthIndex)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('returns Sunday through Saturday for the containing week', () => {
    const week = weekContaining(new Date(2026, 8, 9));
    expect(week[0].getDay()).toBe(0);
    expect(week[6].getDay()).toBe(6);
    expect(week[0].getDate()).toBe(6);
    expect(week[6].getDate()).toBe(12);
  });

  it('detects timed and all-day event range intersections', () => {
    const base = {
      id: '1', calendarId: 'c', title: '', location: '', notes: '', alerts: [],
      createdAt: '', updatedAt: ''
    };
    const timed: AgendaEvent = { ...base, allDay: false, start: '2026-09-07T10:00:00-04:00', end: '2026-09-07T11:00:00-04:00' };
    const allDay: AgendaEvent = { ...base, id: '2', allDay: true, start: '2026-09-13', end: '2026-09-14' };
    expect(eventIntersectsRange(timed, new Date('2026-09-07T09:30:00-04:00'), new Date('2026-09-07T10:30:00-04:00'))).toBe(true);
    expect(eventIntersectsRange(allDay, new Date(2026, 8, 13), new Date(2026, 8, 14))).toBe(true);
    expect(eventIntersectsRange(allDay, new Date(2026, 8, 14), new Date(2026, 8, 15))).toBe(false);
  });
});
