import { localISODate, monthGrid, sixMonthRange, weekContaining } from '../../domain/dates';

const MONTH_NAMES = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const WEEKDAYS = ['S','M','T','W','T','F','S'];

export function SixMonthView({ anchor = new Date(), today = new Date(), onAdd, onSelectDate }: { anchor?: Date; today?: Date; onAdd?: () => void; onSelectDate?: (date: Date) => void }) {
  const todayKey = localISODate(today);
  const currentWeek = new Set(weekContaining(today).map(localISODate));

  return (
    <div className="six-month-view">
      <button className="agenda-plus six-month-view__add" aria-label="Add event" onClick={onAdd}>+</button>
      <div className="six-month-grid">
        {sixMonthRange(anchor).map(month => {
          const rows = Array.from({ length: 6 }, (_, row) => monthGrid(month.year, month.monthIndex).slice(row * 7, row * 7 + 7));
          return (
            <section className="mini-month" key={`${month.year}-${month.monthIndex}`}>
              <h2>{MONTH_NAMES[month.monthIndex]}</h2>
              <div className="mini-weekdays">{WEEKDAYS.map((day, i) => <span key={`${day}-${i}`}>{day}</span>)}</div>
              <div className="mini-weeks">
                {rows.map((week, rowIndex) => {
                  const isCurrentWeek = week.some(cell => currentWeek.has(localISODate(cell.date)) && cell.inDisplayedMonth);
                  return (
                    <div className={`mini-week${isCurrentWeek ? ' mini-week--current' : ''}`} key={rowIndex}>
                      {week.map(cell => {
                        const key = localISODate(cell.date);
                        return <button type="button" data-date={key} key={key} onClick={() => onSelectDate?.(cell.date)} className={`mini-day${!cell.inDisplayedMonth ? ' mini-day--outside' : ''}${key === todayKey ? ' mini-day--today' : ''}`}>{cell.day}</button>;
                      })}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
