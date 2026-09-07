import type { AgendaEvent } from './types';

export interface MonthCell {
  date: Date;
  day: number;
  inDisplayedMonth: boolean;
}

export interface MonthDescriptor {
  year: number;
  monthIndex: number;
  date: Date;
}

export function localISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, amount: number): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + amount);
  return copy;
}

export function monthGrid(year: number, monthIndex: number): MonthCell[] {
  const first = new Date(year, monthIndex, 1);
  const start = addDays(first, -first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index);
    return {
      date,
      day: date.getDate(),
      inDisplayedMonth: date.getMonth() === monthIndex && date.getFullYear() === year
    };
  });
}

export function sixMonthRange(anchor: Date): MonthDescriptor[] {
  const startMonth = anchor.getMonth() < 6 ? 0 : 6;
  const year = anchor.getFullYear();
  return Array.from({ length: 6 }, (_, offset) => ({
    year,
    monthIndex: startMonth + offset,
    date: new Date(year, startMonth + offset, 1)
  }));
}

export function weekContaining(date: Date): Date[] {
  const sunday = addDays(date, -date.getDay());
  return Array.from({ length: 7 }, (_, offset) => addDays(sunday, offset));
}

function localDateBoundary(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function eventIntersectsRange(event: AgendaEvent, start: Date, end: Date): boolean {
  if (event.allDay) {
    const eventStart = localDateBoundary(event.start);
    const eventEnd = localDateBoundary(event.end);
    return eventStart < end && eventEnd > start;
  }
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  return eventStart < end && eventEnd > start;
}
