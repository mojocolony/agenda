import type { AgendaPlane } from '../../state/useAgendaNavigation';
import { AGENDA_PLANES } from '../../state/useAgendaNavigation';

export function PositionIndicator({ plane, dragOffset, viewportWidth }: { plane: AgendaPlane; dragOffset: number; viewportWidth: number }) {
  const index = AGENDA_PLANES.indexOf(plane);
  const progress = viewportWidth > 0 ? index - dragOffset / viewportWidth : index;
  const left = Math.max(0, Math.min(75, progress * 25));
  return <div className="position-indicator" aria-hidden="true"><div className="position-indicator__marker" style={{ left: `${left}%` }} /></div>;
}
