import { useMemo, useState } from 'react';
import { localISODate } from '../../domain/dates';

export interface EventDraft {
  title: string;
  date: string;
  allDay: boolean;
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
}

function prettyDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
  }).toUpperCase();
}

export function EventEditor({
  date,
  onCancel,
  onSave
}: {
  date: Date;
  onCancel: () => void;
  onSave: (draft: EventDraft) => void | Promise<void>;
}) {
  const initialDate = useMemo(() => localISODate(date), [date]);
  const [title, setTitle] = useState('');
  const [dateValue, setDateValue] = useState(initialDate);
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!title.trim() || saving) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(), date: dateValue, allDay,
        startTime, endTime, location: location.trim(), notes: notes.trim()
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="event-editor-layer" role="dialog" aria-modal="true" aria-label="Event editor">
      <div className="event-editor">
        <header className="event-editor__header">
          <button type="button" aria-label="Cancel event" onClick={onCancel}>×</button>
          <h1>EVENT</h1>
          <button type="button" aria-label="Save event" disabled={!title.trim() || saving} onClick={() => void submit()}>✓</button>
        </header>

        <input
          className="event-editor__title"
          aria-label="Event title"
          placeholder="Event"
          autoFocus
          value={title}
          onChange={event => setTitle(event.target.value)}
        />

        <section className="event-editor__section">
          <div className="event-editor__date-heading">{prettyDate(new Date(`${dateValue}T12:00:00`))}</div>
          <input aria-label="Event date" type="date" value={dateValue} onChange={event => setDateValue(event.target.value)} />
        </section>

        <section className="event-editor__section event-editor__time">
          <label className="event-editor__toggle">
            <span>ALL-DAY</span>
            <input aria-label="All day" type="checkbox" checked={allDay} onChange={event => setAllDay(event.target.checked)} />
          </label>
          {!allDay && (
            <div className="event-editor__time-row">
              <label>START<input aria-label="Start time" type="time" value={startTime} onChange={event => setStartTime(event.target.value)} /></label>
              <label>END<input aria-label="End time" type="time" value={endTime} onChange={event => setEndTime(event.target.value)} /></label>
            </div>
          )}
        </section>

        <section className="event-editor__section">
          <input aria-label="Location" placeholder="Location" value={location} onChange={event => setLocation(event.target.value)} />
        </section>

        <section className="event-editor__section">
          <textarea aria-label="Notes" placeholder="Notes" value={notes} onChange={event => setNotes(event.target.value)} />
        </section>
      </div>
    </div>
  );
}
