import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SixMonthView } from './SixMonthView';

describe('SixMonthView', () => {
  it('shows the half-year containing September 2026', () => {
    render(<SixMonthView anchor={new Date(2026, 8, 6)} today={new Date(2026, 8, 6)} />);
    for (const month of ['JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']) {
      expect(screen.getByText(month)).toBeInTheDocument();
    }
    expect(screen.queryByText('JUNE')).not.toBeInTheDocument();
  });

  it('marks today and the week containing today', () => {
    const { container } = render(<SixMonthView anchor={new Date(2026, 8, 6)} today={new Date(2026, 8, 6)} />);
    expect(container.querySelector('[data-date="2026-09-06"]')).toHaveClass('mini-day--today');
    expect(container.querySelectorAll('.mini-week--current')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Add event' })).toBeInTheDocument();
  });
});
