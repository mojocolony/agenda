import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EventEditor } from './EventEditor';

describe('EventEditor', () => {
  it('creates a timed event using the selected date and entered details', () => {
    const onSave = vi.fn();
    render(<EventEditor date={new Date(2026, 8, 7)} onCancel={() => {}} onSave={onSave} />);

    fireEvent.change(screen.getByLabelText('Event title'), { target: { value: 'Coffee' } });
    fireEvent.change(screen.getByLabelText('Start time'), { target: { value: '10:30' } });
    fireEvent.change(screen.getByLabelText('End time'), { target: { value: '11:15' } });
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'Hamilton' } });
    fireEvent.click(screen.getByLabelText('Save event'));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Coffee',
      date: '2026-09-07',
      allDay: false,
      startTime: '10:30',
      endTime: '11:15',
      location: 'Hamilton'
    }));
  });

  it('can create an all-day event', () => {
    const onSave = vi.fn();
    render(<EventEditor date={new Date(2026, 8, 13)} onCancel={() => {}} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText('Event title'), { target: { value: 'Artisan Market' } });
    fireEvent.click(screen.getByLabelText('All day'));
    fireEvent.click(screen.getByLabelText('Save event'));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Artisan Market', date: '2026-09-13', allDay: true
    }));
  });
});
