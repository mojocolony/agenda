import { useState } from 'react';
import { SpatialPlanes } from './components/navigation/SpatialPlanes';
import { SixMonthView } from './components/calendar/SixMonthView';
import { PlaceholderView } from './components/PlaceholderView';
import { MonthView } from './components/calendar/MonthView';
import { AgendaPlane } from './components/calendar/AgendaView';
import { EventEditor, type EventDraft } from './components/event/EventEditor';
import { useCalendar } from './state/CalendarContext';
import { addDays } from './domain/dates';
import './styles/navigation.css';
import './styles/six-month.css';
import './styles/month.css';
import './styles/agenda.css';
import './styles/event-editor.css';

function localDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`).toISOString();
}

function AgendaApp() {
  const { calendars, events, preferences, createCalendar, createEvent } = useCalendar();
  const [editorDate, setEditorDate] = useState<Date | null>(null);

  async function saveEvent(draft: EventDraft) {
    let calendarId = preferences?.defaultCalendarId ?? calendars[0]?.id ?? null;
    if (!calendarId) {
      const calendar = await createCalendar({ name: 'Personal', color: '#7c72b8', visible: true });
      calendarId = calendar.id;
    }

    if (draft.allDay) {
      const start = new Date(`${draft.date}T12:00:00`);
      const end = addDays(start, 1);
      const endDate = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
      await createEvent({
        calendarId, title: draft.title, allDay: true,
        start: draft.date, end: endDate,
        location: draft.location, notes: draft.notes, alerts: []
      });
    } else {
      await createEvent({
        calendarId, title: draft.title, allDay: false,
        start: localDateTime(draft.date, draft.startTime),
        end: localDateTime(draft.date, draft.endTime),
        location: draft.location, notes: draft.notes, alerts: []
      });
    }
    setEditorDate(null);
  }

  return (
    <main className="agenda-shell">
      <SpatialPlanes
        settings={<PlaceholderView label="SETTINGS" />}
        sixMonth={<SixMonthView onAdd={() => setEditorDate(new Date())} />}
        month={<MonthView anchor={new Date()} today={new Date()} events={events} calendars={calendars} onAdd={setEditorDate} />}
        agenda={<AgendaPlane onAdd={setEditorDate} />}
      />
      {editorDate && <EventEditor date={editorDate} onCancel={() => setEditorDate(null)} onSave={saveEvent} />}
    </main>
  );
}

export default function App() {
  return <AgendaApp />;
}
