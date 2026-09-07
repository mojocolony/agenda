import { eventIntersectsRange } from '../domain/dates';
import type { AgendaCalendar, AgendaEvent, AgendaPreferences, EventId } from '../domain/types';

const DB_VERSION = 1;
const CALENDARS = 'calendars';
const EVENTS = 'events';
const PREFERENCES = 'preferences';
const PREFERENCES_KEY = 'main';

export const DEFAULT_PREFERENCES: AgendaPreferences = {
  defaultCalendarId: null,
  weekStartsOn: 0,
  use24HourTime: false,
  soundEffects: true
};

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed'));
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted'));
  });
}

export class AgendaRepository {
  private db: IDBDatabase | null = null;

  constructor(readonly dbName = 'agenda-v01') {}

  async open(): Promise<void> {
    if (this.db) return;
    const request = indexedDB.open(this.dbName, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CALENDARS)) {
        const calendars = db.createObjectStore(CALENDARS, { keyPath: 'id' });
        calendars.createIndex('name', 'name');
      }
      if (!db.objectStoreNames.contains(EVENTS)) {
        const events = db.createObjectStore(EVENTS, { keyPath: 'id' });
        events.createIndex('calendarId', 'calendarId');
        events.createIndex('start', 'start');
      }
      if (!db.objectStoreNames.contains(PREFERENCES)) {
        db.createObjectStore(PREFERENCES);
      }
    };
    this.db = await requestResult(request);
  }

  close(): void {
    this.db?.close();
    this.db = null;
  }

  private database(): IDBDatabase {
    if (!this.db) throw new Error('AgendaRepository must be opened first');
    return this.db;
  }

  async listCalendars(): Promise<AgendaCalendar[]> {
    const tx = this.database().transaction(CALENDARS, 'readonly');
    return requestResult(tx.objectStore(CALENDARS).getAll());
  }

  async putCalendar(calendar: AgendaCalendar): Promise<void> {
    const tx = this.database().transaction(CALENDARS, 'readwrite');
    tx.objectStore(CALENDARS).put(calendar);
    await transactionDone(tx);
  }

  async deleteCalendar(id: string): Promise<void> {
    const relatedEvents = (await this.listEvents()).filter(event => event.calendarId === id);
    const tx = this.database().transaction([CALENDARS, EVENTS], 'readwrite');
    tx.objectStore(CALENDARS).delete(id);
    const eventStore = tx.objectStore(EVENTS);
    for (const event of relatedEvents) eventStore.delete(event.id);
    await transactionDone(tx);
  }

  async listEvents(): Promise<AgendaEvent[]> {
    const tx = this.database().transaction(EVENTS, 'readonly');
    return requestResult(tx.objectStore(EVENTS).getAll());
  }

  async getEvent(id: EventId): Promise<AgendaEvent | undefined> {
    const tx = this.database().transaction(EVENTS, 'readonly');
    return requestResult(tx.objectStore(EVENTS).get(id));
  }

  async putEvent(event: AgendaEvent): Promise<void> {
    const tx = this.database().transaction(EVENTS, 'readwrite');
    tx.objectStore(EVENTS).put(event);
    await transactionDone(tx);
  }

  async deleteEvent(id: EventId): Promise<void> {
    const tx = this.database().transaction(EVENTS, 'readwrite');
    tx.objectStore(EVENTS).delete(id);
    await transactionDone(tx);
  }

  async eventsBetween(start: Date, end: Date): Promise<AgendaEvent[]> {
    const events = await this.listEvents();
    return events.filter(event => eventIntersectsRange(event, start, end));
  }

  async getPreferences(): Promise<AgendaPreferences> {
    const tx = this.database().transaction(PREFERENCES, 'readonly');
    const value = await requestResult<AgendaPreferences | undefined>(tx.objectStore(PREFERENCES).get(PREFERENCES_KEY));
    return value ?? DEFAULT_PREFERENCES;
  }

  async putPreferences(preferences: AgendaPreferences): Promise<void> {
    const tx = this.database().transaction(PREFERENCES, 'readwrite');
    tx.objectStore(PREFERENCES).put(preferences, PREFERENCES_KEY);
    await transactionDone(tx);
  }
}
