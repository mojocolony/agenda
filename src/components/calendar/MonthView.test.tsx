import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MonthView } from './MonthView';

describe('MonthView', () => {
  const anchor = new Date(2026, 8, 7, 12);

  it('renders September 2026 with today and selected date independently styled', () => {
    const { container } = render(<MonthView anchor={anchor} today={anchor} />);
    expect(screen.getByText('SEPTEMBER 2026')).toBeInTheDocument();
    const day = container.querySelector('[data-date="2026-09-07"]');
    expect(day).toHaveClass('month-day--today');
    expect(day).toHaveClass('month-day--selected');
  });

  it('selects a date and updates the dark date strip', () => {
    render(<MonthView anchor={anchor} today={anchor} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select September 13, 2026' }));
    expect(screen.getByText('SUNDAY SEP 13')).toBeInTheDocument();
  });

  it('toggles the compact week selector and allows another week to be selected', () => {
    const { container } = render(<MonthView anchor={anchor} today={anchor} />);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle week selector' }));
    expect(container.querySelector('.month-week-selector')).toBeInTheDocument();
    expect(screen.getByText('SEP')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
    const week = screen.getByRole('button', { name: 'Select week of September 13' });
    fireEvent.click(week);
    expect(week).toHaveClass('compact-week--selected');
  });

  it('shows the large empty-day add control when the selected day has no events', () => {
    render(<MonthView anchor={anchor} today={anchor} />);
    expect(screen.getByRole('button', { name: 'Add event on September 7, 2026' })).toBeInTheDocument();
  });
});
