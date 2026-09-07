import { afterEach, describe, expect, it } from 'vitest';
import { AgendaRepository, DEFAULT_PREFERENCES } from './AgendaRepository';
import { marketEvent, personalCalendar } from '../test/fixtures';

let sequence = 0;
let openRepos: AgendaRepository[] = [];
function repository() {
  const repo = new AgendaRepository(`agenda-v01-test-${sequence++}`);
  openRepos.push(repo);
  return repo;
}
afterEach(() => { openRepos.forEach(repo => repo.close()); openRepos = []; });

describe('AgendaRepository', () => {
  it('persists calendars, events and preferences across repository reopen', async () => {
    const repo = repository();
    await repo.open();
    await repo.putCalendar(personalCalendar);
    await repo.putEvent(marketEvent);
    await repo.putPreferences({ ...DEFAULT_PREFERENCES, defaultCalendarId: personalCalendar.id });
    const dbName = repo.dbName;
    repo.close();

    const reopened = new AgendaRepository(dbName);
    openRepos.push(reopened);
    await reopened.open();
    expect(await reopened.listCalendars()).toEqual([personalCalendar]);
    expect((await reopened.listEvents()).map(item => item.id)).toEqual(['market']);
    expect((await reopened.getPreferences()).defaultCalendarId).toBe('personal');
  });

  it('queries events by intersecting date range and deletes calendar events', async () => {
    const repo = repository();
    await repo.open();
    await repo.putCalendar(personalCalendar);
    await repo.putEvent(marketEvent);
    expect((await repo.eventsBetween(new Date(2026, 8, 13), new Date(2026, 8, 14))).map(item => item.id)).toEqual(['market']);
    expect(await repo.eventsBetween(new Date(2026, 8, 14), new Date(2026, 8, 15))).toEqual([]);
    await repo.deleteCalendar(personalCalendar.id);
    expect(await repo.listEvents()).toEqual([]);
  });
});
