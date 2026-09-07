import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Agenda floating month heading geometry', () => {
  it('keeps the floating heading clear of the weekday/date column', () => {
    const css = fs.readFileSync(path.resolve('src/styles/agenda.css'), 'utf8');
    const rule = css.match(/\.agenda-floating-month\s*\{([^}]*)\}/s)?.[1] ?? '';
    const left = Number(rule.match(/left:\s*(\d+)px/)?.[1] ?? 0);
    expect(left).toBeGreaterThanOrEqual(112);
  });
});
