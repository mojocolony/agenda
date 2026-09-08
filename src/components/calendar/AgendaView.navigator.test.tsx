import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgendaView } from './AgendaView';

describe('AgendaView month navigator invocation', () => {
  it('does not expose the fading month label as an interactive control', () => {
    render(<AgendaView anchor={new Date(2026, 8, 7)} calendars={[]} events={[]} />);
    expect(screen.queryByRole('navigation', { name: 'Month navigator' })).not.toBeInTheDocument();
  });
});
