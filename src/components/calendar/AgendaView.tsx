import { useEffect, useMemo, useRef, useState } from 'react';
import type { AgendaCalendar, AgendaEvent } from '../../domain/types';
import { addDays, localISODate } from '../../domain/dates';
import { useCalendar } from '../../state/CalendarContext';
import { MonthNavigator } from './MonthNavigator';

export interface AgendaDay { date: Date; iso: string; events: AgendaEvent[]; }

function dateOnly(value: string): Date {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

function eventOccursOn(event: AgendaEvent, date: Date): boolean {
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayEnd = addDays(dayStart, 1);
  if (event.allDay) return dateOnly(event.start) < dayEnd && dateOnly(event.end) > dayStart;
  const start = new Date(event.start);
  const end = new Date(event.end);
  return start < dayEnd && end > dayStart;
}

export function buildAgendaDays(start: Date, end: Date, events: AgendaEvent[]): AgendaDay[] {
  const days: AgendaDay[] = [];
  for (let date = new Date(start.getFullYear(), start.getMonth(), start.getDate()); date < end; date = addDays(date, 1)) {
    days.push({ date, iso: localISODate(date), events: events.filter(event => eventOccursOn(event, date)) });
  }
  return days;
}

export function monthLabelForDate(date: Date): string {
  const month = date.toLocaleDateString('en-CA', { month: 'long' }).toUpperCase();
  return `${month} ’${String(date.getFullYear()).slice(-2)}`;
}

function timeLabel(event: AgendaEvent): string {
  if (event.allDay) return 'all-day';
  return new Date(event.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function DayRow({ day, colors, onAdd }: { day: AgendaDay; colors: Map<string, string>; onAdd?: (date: Date) => void }) {
  const weekday = day.date.toLocaleDateString('en-CA', { weekday: 'short' }).toUpperCase();
  return (
    <section className={`agenda-day ${day.events.length ? 'agenda-day--populated' : 'agenda-day--empty'}`} data-agenda-day={day.iso}>
      <div className="agenda-day__date"><strong>{weekday}</strong> <span>{day.date.getDate()}</span></div>
      <div className="agenda-day__body">
        {day.events.map(event => (
          <div className="agenda-event" key={event.id}>
            <span className="agenda-event__dot" style={{ background: colors.get(event.calendarId) ?? '#888' }} aria-hidden="true" />
            <div className="agenda-event__copy">
              <div className="agenda-event__line"><strong>{event.title}</strong><span>{timeLabel(event)}</span></div>
              {event.location && <div className="agenda-event__location">{event.location}</div>}
            </div>
          </div>
        ))}
      </div>
      {!day.events.length && <button className="agenda-day__add" aria-label="Add event" type="button" onClick={() => onAdd?.(day.date)}>+</button>}
    </section>
  );
}

export function AgendaView({ anchor, calendars, events, onAdd, onJumpMonth }: { anchor: Date; calendars: AgendaCalendar[]; events: AgendaEvent[]; onAdd?: (date: Date) => void; onJumpMonth?: (date: Date) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fadeTimer = useRef<number | undefined>(undefined);
  const [heading, setHeading] = useState(monthLabelForDate(anchor));
  const [headingVisible, setHeadingVisible] = useState(true);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const start = useMemo(() => addDays(anchor, -45), [anchor]);
  const end = useMemo(() => addDays(anchor, 120), [anchor]);
  const days = useMemo(() => buildAgendaDays(start, end, events), [start, end, events]);
  const colors = useMemo(() => new Map(calendars.map(calendar => [calendar.id, calendar.color])), [calendars]);

  const armFade = () => {
    window.clearTimeout(fadeTimer.current);
    fadeTimer.current = window.setTimeout(() => setHeadingVisible(false), 2000);
  };

  useEffect(() => {
    setHeading(monthLabelForDate(anchor));
    const root = scrollRef.current;
    if (!root) return;
    const target = root.querySelector<HTMLElement>(`[data-agenda-day="${localISODate(anchor)}"]`);
    if (target) root.scrollTop = target.offsetTop;
    armFade();
    return () => window.clearTimeout(fadeTimer.current);
  }, [anchor]);

  const handleScroll = () => {
    const root = scrollRef.current;
    if (!root) return;
    const rootTop = root.getBoundingClientRect().top;
    const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-agenda-day]'));
    let active = rows[0];
    for (const row of rows) {
      if (row.getBoundingClientRect().top <= rootTop + 8) active = row;
      else break;
    }
    if (active?.dataset.agendaDay) setHeading(monthLabelForDate(dateOnly(active.dataset.agendaDay)));
    setHeadingVisible(true);
    armFade();
  };

  return (
    <div className="agenda-view">
      <button
        className={`agenda-floating-month ${headingVisible ? 'is-visible' : ''}`}
        type="button"
        aria-label={`Open month navigator, ${heading}`}
        aria-hidden={!headingVisible}
        tabIndex={headingVisible ? 0 : -1}
        onClick={() => setNavigatorOpen(true)}
      >
        {heading}
      </button>
      <div className="agenda-scroll" ref={scrollRef} onScroll={handleScroll}>
        {days.map(day => <DayRow key={day.iso} day={day} colors={colors} onAdd={onAdd} />)}
        <div className="agenda-scroll__tail" />
      </div>
      {navigatorOpen && (
        <MonthNavigator
          currentDate={anchor}
          onClose={() => setNavigatorOpen(false)}
          onJumpMonth={date => onJumpMonth?.(date)}
        />
      )}
    </div>
  );
}

export function AgendaPlane({ onAdd }: { onAdd?: (date: Date) => void }) {
  const { calendars, events, setRange } = useCalendar();
  const [anchor, setAnchor] = useState(() => new Date());

  function jumpMonth(date: Date) {
    const next = new Date(date.getFullYear(), date.getMonth(), 1);
    setAnchor(next);
    setRange({ start: addDays(next, -45), end: addDays(next, 120) });
  }

  return <AgendaView anchor={anchor} calendars={calendars} events={events} onAdd={onAdd} onJumpMonth={jumpMonth} />;
}
