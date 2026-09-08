import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MonthNavigator } from './MonthNavigator';

describe('MonthNavigator', () => {
  it('starts at the year index and drills into months', () => {
    render(<MonthNavigator currentDate={new Date(2026, 8, 7)} onClose={() => {}} onJumpMonth={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: '2026' }));
    expect(screen.getByRole('button', { name: 'September 2026' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'January 2027' })).toBeInTheDocument();
  });

  it('jumps to a month and remains open', () => {
    const onJumpMonth = vi.fn();
    render(<MonthNavigator currentDate={new Date(2026, 8, 7)} onClose={() => {}} onJumpMonth={onJumpMonth} />);
    fireEvent.click(screen.getByRole('button', { name: '2026' }));
    fireEvent.click(screen.getByRole('button', { name: 'April 2027' }));
    expect(onJumpMonth).toHaveBeenCalledWith(expect.any(Date));
    const jumped = onJumpMonth.mock.calls[0][0] as Date;
    expect(jumped.getFullYear()).toBe(2027);
    expect(jumped.getMonth()).toBe(3);
    expect(screen.getByRole('navigation', { name: 'Month navigator' })).toBeInTheDocument();
  });
});
