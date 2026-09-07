export type CalendarId = string;
export type EventId = string;

export interface AgendaAlert {
  offsetMinutes: number;
}

export interface AgendaCalendar {
  id: CalendarId;
  name: string;
  color: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BaseAgendaEvent {
  id: EventId;
  calendarId: CalendarId;
  title: string;
  location: string;
  notes: string;
  alerts: AgendaAlert[];
  createdAt: string;
  updatedAt: string;
}

export interface TimedAgendaEvent extends BaseAgendaEvent {
  allDay: false;
  start: string;
  end: string;
}

export interface AllDayAgendaEvent extends BaseAgendaEvent {
  allDay: true;
  /** Local YYYY-MM-DD inclusive start date. */
  start: string;
  /** Local YYYY-MM-DD exclusive end date. */
  end: string;
}

export type AgendaEvent = TimedAgendaEvent | AllDayAgendaEvent;

export interface AgendaPreferences {
  defaultCalendarId: CalendarId | null;
  weekStartsOn: 0;
  use24HourTime: boolean;
  soundEffects: boolean;
}
