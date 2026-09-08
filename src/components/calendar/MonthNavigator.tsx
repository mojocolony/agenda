import { useMemo, useState } from 'react';

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const MONTH_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export function MonthNavigator({
  currentDate,
  onClose,
  onJumpMonth
}: {
  currentDate: Date;
  onClose: () => void;
  onJumpMonth: (date: Date) => void;
}) {
  const currentYear = currentDate.getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const years = useMemo(
    () => Array.from({ length: 18 }, (_, index) => currentYear - 4 + index),
    [currentYear]
  );

  const monthEntries = useMemo(() => {
    if (selectedYear === null) return [];
    const firstMonth = selectedYear === currentYear ? currentDate.getMonth() : 0;
    return Array.from({ length: 18 }, (_, index) => {
      const absolute = firstMonth + index;
      return {
        year: selectedYear + Math.floor(absolute / 12),
        month: absolute % 12
      };
    });
  }, [selectedYear, currentYear, currentDate]);

  return (
    <>
      <button className="month-navigator-shade" type="button" aria-label="Close month navigator" onClick={onClose} />
      <aside className="month-navigator" role="navigation" aria-label="Month navigator">
        {selectedYear === null ? (
          <div className="month-navigator__years">
            {years.map(year => (
              <button
                type="button"
                className={`month-navigator__year${year === currentYear ? ' is-current' : ''}`}
                key={year}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        ) : (
          <div className="month-navigator__months">
            <button
              type="button"
              className="month-navigator__back"
              aria-label="Back to years"
              onClick={() => setSelectedYear(null)}
            >
              ‹
            </button>
            {monthEntries.map((entry, index) => {
              const previousYear = index === 0 ? null : monthEntries[index - 1].year;
              const showYear = index === 0 || entry.year !== previousYear;
              return (
                <div className="month-navigator__month-group" key={`${entry.year}-${entry.month}`}>
                  {showYear && <div className="month-navigator__year-band">{entry.year}</div>}
                  <button
                    type="button"
                    className="month-navigator__month"
                    aria-label={`${MONTH_LONG[entry.month]} ${entry.year}`}
                    onClick={() => onJumpMonth(new Date(entry.year, entry.month, 1))}
                  >
                    {MONTHS[entry.month]}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </aside>
    </>
  );
}
