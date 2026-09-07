import { useRef, useState } from 'react';

export type AgendaPlane = 'settings' | 'sixMonth' | 'month' | 'agenda';
export const AGENDA_PLANES: AgendaPlane[] = ['settings', 'sixMonth', 'month', 'agenda'];
const EDGE_THRESHOLD = 24;
const COMMIT_THRESHOLD = 72;
const LOCK_THRESHOLD = 8;

export function useAgendaNavigation(initial: AgendaPlane = 'agenda') {
  const [plane, setPlane] = useState<AgendaPlane>(initial);
  const [dragOffset, setDragOffset] = useState(0);
  const gesture = useRef({ startX: 0, startY: 0, dx: 0, dy: 0, edge: false, locked: '' as '' | 'x' | 'y' });

  function beginDrag(x: number, y: number) {
    gesture.current = { startX: x, startY: y, dx: 0, dy: 0, edge: x <= EDGE_THRESHOLD, locked: '' };
    setDragOffset(0);
  }

  function moveDrag(x: number, y: number) {
    const g = gesture.current;
    g.dx = x - g.startX; g.dy = y - g.startY;
    if (!g.locked && Math.max(Math.abs(g.dx), Math.abs(g.dy)) > LOCK_THRESHOLD) {
      g.locked = Math.abs(g.dx) > Math.abs(g.dy) ? 'x' : 'y';
    }
    if (g.locked !== 'x') return;
    const index = AGENDA_PLANES.indexOf(plane);
    const enteringSettingsWithoutEdge = plane === 'sixMonth' && g.dx > 0 && !g.edge;
    const beyondLeft = index === 0 && g.dx > 0;
    const beyondRight = index === AGENDA_PLANES.length - 1 && g.dx < 0;
    setDragOffset(enteringSettingsWithoutEdge || beyondLeft || beyondRight ? g.dx * 0.12 : g.dx);
  }

  function endDrag() {
    const g = gesture.current;
    let next = plane;
    if (g.locked === 'x' && Math.abs(g.dx) >= COMMIT_THRESHOLD) {
      const index = AGENDA_PLANES.indexOf(plane);
      if (g.dx < 0 && index < AGENDA_PLANES.length - 1) next = AGENDA_PLANES[index + 1];
      if (g.dx > 0 && index > 0 && !(plane === 'sixMonth' && !g.edge)) next = AGENDA_PLANES[index - 1];
    }
    setPlane(next);
    setDragOffset(0);
    gesture.current.locked = '';
  }

  return { plane, setPlane, dragOffset, beginDrag, moveDrag, endDrag };
}
