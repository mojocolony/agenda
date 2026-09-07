import { useMemo, useState } from 'react';
import { localISODate, monthGrid, weekContaining } from '../../domain/dates';
import type { AgendaCalendar, AgendaEvent } from '../../domain/types';

const MONTH_NAMES = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const MONTH_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const WEEKDAYS = ['S','M','T','W','T','F','S'];
const DAY_NAMES = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];

interface MonthViewProps {
  anchor?: Date;
  today?: Date;
  events?: AgendaEvent[];
  calendars?: AgendaCalendar[];
  onAdd?: (date: Date) => void;
  onSelectEvent?: (event: AgendaEvent) => void;
}

function sameLocalDay(event: AgendaEvent, date: Date) {
  const key = localISODate(date);
  if (event.allDay) return event.start <= key && event.end > key;
  return localISODate(new Date(event.start)) === key;
}

function dateLabel(date: Date) {
  return `${MONTH_NAMES[date.getMonth()][0]}${MONTH_NAMES[date.getMonth()].slice(1).toLowerCase()} ${date.getDate()}, ${date.getFullYear()}`;
}

function stripLabel(date: Date) {
  return `${DAY_NAMES[date.getDay()]} ${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`;
}

function timeLabel(event: AgendaEvent) {
  if (event.allDay) return 'all-day';
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(event.start));
}

export function MonthView({ anchor = new Date(), today = new Date(), events = [], calendars = [], onAdd, onSelectEvent }: MonthViewProps) {
  const monthAnchor = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const initialSelected = anchor.getMonth() === today.getMonth() && anchor.getFullYear() === today.getFullYear()
    ? today
    : monthAnchor;
  const [selectedDate, setSelectedDate] = useState(() => new Date(initialSelected.getFullYear(), initialSelected.getMonth(), initialSelected.getDate()));
  const [weekMode, setWeekMode] = useState(false);
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => weekContaining(initialSelected)[0]);
  const cells = useMemo(() => monthGrid(monthAnchor.getFullYear(), monthAnchor.getMonth()), [monthAnchor.getFullYear(), monthAnchor.getMonth()]);
  const todayKey = localISODate(today);
  const selectedKey = localISODate(selectedDate);
  const selectedWeek = new Set(weekContaining(selectedWeekStart).map(localISODate));
  const dayEvents = events.filter(event => sameLocalDay(event, selectedDate));
  const calendarById = new Map(calendars.map(calendar => [calendar.id, calendar]));

  function selectDate(date: Date) {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    setSelectedWeekStart(weekContaining(date)[0]);
  }

  return (
    <div className="month-view">
      <div className={`month-top${weekMode ? ' month-top--week' : ''}`}>
        {!weekMode ? (
          <>
            <div className="month-title-row">
              <h1>{MONTH_NAMES[monthAnchor.getMonth()]} {monthAnchor.getFullYear()}</h1>
              <button className="agenda-plus month-view__add" aria-label="Add event" onClick={() => onAdd?.(selectedDate)}>+</button>
            </div>
            <div className="month-calendar month-calendar--large">
              <div className="month-weekdays">{WEEKDAYS.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
              <div className="month-days">
                {cells.map(cell => {
                  const key = localISODate(cell.date);
                  const hasEvents = events.some(event => sameLocalDay(event, cell.date));
                  return (
                    <button
                      type="button"
                      aria-label={`Select ${dateLabel(cell.date)}`}
                      data-date={key}
                      key={key}
                      onClick={() => selectDate(cell.date)}
                      className={`month-day${!cell.inDisplayedMonth ? ' month-day--outside' : ''}${key === todayKey ? ' month-day--today' : ''}${key === selectedKey ? ' month-day--selected' : ''}`}
                    >
                      <span className="month-day__number">{cell.day}</span>
                      {hasEvents && <span className="month-day__dots" aria-hidden="true"><i /></span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="month-week-selector">
            <div className="month-week-selector__date">
              <div className="month-week-selector__dow">{DAY_NAMES[selectedDate.getDay()].slice(0,3)}</div>
              <div className="month-week-selector__mon">{MONTH_SHORT[selectedDate.getMonth()]}</div>
              <div className="month-week-selector__day">{selectedDate.getDate()}</div>
              <div className="month-week-selector__year">{selectedDate.getFullYear()}</div>
            </div>
            <div className="month-calendar month-calendar--compact">
              <div className="month-weekdays">{WEEKDAYS.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
              <div className="compact-weeks">
                {Array.from({ length: 6 }, (_, row) => cells.slice(row * 7, row * 7 + 7)).map((week, row) => {
                  const weekStart = week[0].date;
                  const active = week.some(cell => selectedWeek.has(localISODate(cell.date)));
                  return (
                    <button type="button" aria-label={`Select week of ${MONTH_NAMES[weekStart.getMonth()][0]}${MONTH_NAMES[weekStart.getMonth()].slice(1).toLowerCase()} ${weekStart.getDate()}`} className={`compact-week${active ? ' compact-week--selected' : ''}`} key={row} onClick={() => { setSelectedWeekStart(weekStart); selectDate(week.find(cell => cell.inDisplayedMonth)?.date ?? weekStart); }}>
                      {week.map(cell => <span key={localISODate(cell.date)} className={`${!cell.inDisplayedMonth ? ' compact-day--outside' : ''}${localISODate(cell.date) === todayKey ? ' compact-day--today' : ''}`}>{cell.day}</span>)}
                    </button>
                  );
                })}
              </div>
            </div>
            <button className="agenda-plus month-week-selector__add" aria-label="Add event" onClick={() => onAdd?.(selectedDate)}>+</button>
          </div>
        )}
      </div>

      <div className="month-date-strip">
        <span>{stripLabel(selectedDate)}</span>
        <button className={`month-mode-toggle${weekMode ? ' month-mode-toggle--active' : ''}`} type="button" aria-label="Toggle week selector" onClick={() => setWeekMode(value => !value)}>
          <i /><i /><i />
        </button>
      </div>

      <div className="month-events">
        {dayEvents.length === 0 ? (
          <button className="month-empty-add" aria-label={`Add event on ${dateLabel(selectedDate)}`} onClick={() => onAdd?.(selectedDate)}>+</button>
        ) : dayEvents.map(event => (
          <button className="month-event" type="button" key={event.id} onClick={() => onSelectEvent?.(event)}>
            <span className="month-event__dot" style={{ background: calendarById.get(event.calendarId)?.color ?? '#7b7f89' }} />
            <span className="month-event__copy"><strong>{event.title}</strong>{event.location && <small>{event.location}</small>}</span>
            <span className="month-event__time">{timeLabel(event)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
