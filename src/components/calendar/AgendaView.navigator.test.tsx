import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AgendaView } from './AgendaView';

describe('AgendaView month navigator', () => {
  it('opens from the month heading and forwards month jumps', () => {
    const onJumpMonth = vi.fn();
    render(<AgendaView anchor={new Date(2026, 8, 7)} calendars={[]} events={[]} onJumpMonth={onJumpMonth} />);

    fireEvent.click(screen.getByRole('button', { name: /Open month navigator/ }));
    fireEvent.click(screen.getByRole('button', { name: '2026' }));
    fireEvent.click(screen.getByRole('button', { name: 'April 2027' }));

    expect(onJumpMonth).toHaveBeenCalledTimes(1);
    const date = onJumpMonth.mock.calls[0][0] as Date;
    expect(date.getFullYear()).toBe(2027);
    expect(date.getMonth()).toBe(3);
  });
});
