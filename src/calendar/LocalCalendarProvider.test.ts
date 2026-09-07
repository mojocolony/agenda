import { afterEach, describe, expect, it } from 'vitest';
import { AgendaRepository } from '../storage/AgendaRepository';
import { LocalCalendarProvider } from './LocalCalendarProvider';

let sequence = 0;
let repo: AgendaRepository | null = null;
afterEach(() => { repo?.close(); repo = null; });

async function createProvider() {
  repo = new AgendaRepository(`agenda-provider-test-${sequence++}`);
  await repo.open();
  let id = 0;
  return new LocalCalendarProvider(repo, () => '2026-09-07T11:00:00.000Z', () => `generated-${++id}`);
}

describe('LocalCalendarProvider', () => {
  it('generates IDs/timestamps, defaults the first calendar and creates events', async () => {
    const provider = await createProvider();
    const calendar = await provider.createCalendar({ name: 'Personal', color: '#8f93ff' });
    expect(calendar.id).toBe('generated-1');
    expect(calendar.createdAt).toBe('2026-09-07T11:00:00.000Z');
    expect((await provider.getPreferences()).defaultCalendarId).toBe(calendar.id);

    const event = await provider.createEvent({ calendarId: calendar.id, title: 'Coffee', start: '2026-09-07T10:30:00-04:00', end: '2026-09-07T11:00:00-04:00', allDay: false, location: '', notes: '', alerts: [] });
    expect(event.id).toBe('generated-2');
    expect((await provider.eventsInRange({ start: new Date(2026, 8, 7), end: new Date(2026, 8, 8) }))).toHaveLength(1);
  });

  it('filters events belonging to hidden calendars', async () => {
    const provider = await createProvider();
    const calendar = await provider.createCalendar({ name: 'Personal', color: '#8f93ff' });
    await provider.createEvent({ calendarId: calendar.id, title: 'Coffee', start: '2026-09-07T10:30:00-04:00', end: '2026-09-07T11:00:00-04:00', allDay: false, location: '', notes: '', alerts: [] });
    await provider.updateCalendar(calendar.id, { visible: false });
    expect(await provider.eventsInRange({ start: new Date(2026, 8, 7), end: new Date(2026, 8, 8) })).toEqual([]);
  });
});
