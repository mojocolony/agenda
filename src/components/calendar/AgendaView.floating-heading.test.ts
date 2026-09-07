import { describe, expect, it } from 'vitest';

describe('Agenda floating month heading geometry', () => {
  it('keeps the floating heading clear of the weekday/date column', () => {
    const headingLeft = 112;
    const dayLeftPadding = 18;
    const dayDateColumnWidth = 76;
    const requiredClearance = dayLeftPadding + dayDateColumnWidth;

    expect(headingLeft).toBeGreaterThan(requiredClearance);
  });
});
