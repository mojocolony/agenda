import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAgendaNavigation } from './useAgendaNavigation';

function drag(result: { current: ReturnType<typeof useAgendaNavigation> }, fromX: number, fromY: number, toX: number, toY: number) {
  act(() => { result.current.beginDrag(fromX, fromY); result.current.moveDrag(toX, toY); result.current.endDrag(); });
}

describe('Agenda spatial navigation', () => {
  it('moves normally among Six Month, Month and Agenda', () => {
    const { result } = renderHook(() => useAgendaNavigation('month'));
    drag(result, 200, 300, 100, 302);
    expect(result.current.plane).toBe('agenda');
    drag(result, 200, 300, 300, 302);
    expect(result.current.plane).toBe('month');
  });

  it('requires a left-edge-origin drag to enter Settings from Six Month', () => {
    const { result } = renderHook(() => useAgendaNavigation('sixMonth'));
    drag(result, 120, 300, 230, 301);
    expect(result.current.plane).toBe('sixMonth');
    drag(result, 12, 300, 120, 301);
    expect(result.current.plane).toBe('settings');
    drag(result, 200, 300, 100, 301);
    expect(result.current.plane).toBe('sixMonth');
  });

  it('rejects short and vertically dominant gestures', () => {
    const { result } = renderHook(() => useAgendaNavigation('month'));
    drag(result, 200, 300, 155, 302);
    expect(result.current.plane).toBe('month');
    drag(result, 200, 300, 120, 430);
    expect(result.current.plane).toBe('month');
  });
});
