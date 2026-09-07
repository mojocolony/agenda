import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SpatialPlanes } from './SpatialPlanes';

class ResizeObserverStub {
  observe() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

describe('SpatialPlanes navigation request', () => {
  it('moves to Month when a new one-way navigation request arrives', () => {
    const props = {
      settings: <div>Settings</div>,
      sixMonth: <div>Six Month</div>,
      month: <div>Month</div>,
      agenda: <div>Agenda</div>
    };

    const { container, rerender } = render(<SpatialPlanes {...props} navigationRequest={null} />);
    expect((container.querySelector('.position-indicator__marker') as HTMLElement).style.left).toBe('25%');

    rerender(<SpatialPlanes {...props} navigationRequest={{ plane: 'month', id: 1 }} />);
    expect((container.querySelector('.position-indicator__marker') as HTMLElement).style.left).toBe('50%');
  });
});
