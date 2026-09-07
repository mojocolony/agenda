import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SpatialPlanes } from './SpatialPlanes';

class ResizeObserverStub {
  observe() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

describe('SpatialPlanes', () => {
  it('allows a horizontal swipe that begins on a button while preserving a tap', () => {
    render(
      <SpatialPlanes
        settings={<div>Settings</div>}
        sixMonth={<div>Six Month</div>}
        month={<button type="button">Month date</button>}
        agenda={<div>Agenda list</div>}
      />
    );

    const root = screen.getByText('Six Month').closest('.spatial-root') as HTMLElement;

    // Move from Six Month to Month.
    fireEvent.pointerDown(root, { pointerId: 1, clientX: 300, clientY: 300, button: 0 });
    fireEvent.pointerMove(root, { pointerId: 1, clientX: 180, clientY: 302 });
    fireEvent.pointerUp(root, { pointerId: 1, clientX: 180, clientY: 302 });

    // A second horizontal gesture may begin directly on an interactive date button.
    const date = screen.getByRole('button', { name: 'Month date' });
    fireEvent.pointerDown(date, { pointerId: 2, clientX: 300, clientY: 300, button: 0 });
    fireEvent.pointerMove(root, { pointerId: 2, clientX: 180, clientY: 302 });
    fireEvent.pointerUp(root, { pointerId: 2, clientX: 180, clientY: 302 });

    const marker = document.querySelector('.position-indicator__marker') as HTMLElement;
    expect(marker.style.left).toBe('75%');
  });
});
