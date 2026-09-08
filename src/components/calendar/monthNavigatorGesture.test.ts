import { describe, expect, it } from 'vitest';
import { shouldOpenMonthNavigator } from './monthNavigatorGesture';

describe('month navigator edge gesture', () => {
  it('opens only for a strong leftward drag that begins at the right edge', () => {
    expect(shouldOpenMonthNavigator(384, 390, -90, 8)).toBe(true);
    expect(shouldOpenMonthNavigator(300, 390, -90, 8)).toBe(false);
    expect(shouldOpenMonthNavigator(384, 390, -40, 4)).toBe(false);
    expect(shouldOpenMonthNavigator(384, 390, -90, 100)).toBe(false);
    expect(shouldOpenMonthNavigator(4, 390, -90, 8)).toBe(false);
  });
});
