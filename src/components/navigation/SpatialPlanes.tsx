import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useAgendaNavigation } from '../../state/useAgendaNavigation';
import { PositionIndicator } from './PositionIndicator';

interface Props { settings: ReactNode; sixMonth: ReactNode; month: ReactNode; agenda: ReactNode; }

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest('button, a, input, textarea, select, [role=\"button\"]'));
}

export function SpatialPlanes({ settings, sixMonth, month, agenda }: Props) {
  const navigation = useAgendaNavigation('sixMonth');
  const rootRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(390);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const observer = new ResizeObserver(entries => setWidth(entries[0]?.contentRect.width ?? element.clientWidth));
    observer.observe(element);
    setWidth(element.clientWidth);
    return () => observer.disconnect();
  }, []);

  const index = ['settings', 'sixMonth', 'month', 'agenda'].indexOf(navigation.plane);
  const transform = -index * width + navigation.dragOffset;

  return (
    <div ref={rootRef} className="spatial-root"
      onPointerDown={event => {
        if (isInteractiveTarget(event.target)) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        navigation.beginDrag(event.clientX - event.currentTarget.getBoundingClientRect().left, event.clientY);
      }}
      onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) navigation.moveDrag(event.clientX - event.currentTarget.getBoundingClientRect().left, event.clientY); }}
      onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); navigation.endDrag(); }}
      onPointerCancel={() => navigation.endDrag()}>
      <div className="spatial-track" style={{ transform: `translate3d(${transform}px,0,0)`, transition: navigation.dragOffset === 0 ? 'transform 260ms ease-out' : 'none' }}>
        <section className="spatial-plane">{settings}</section>
        <section className="spatial-plane">{sixMonth}</section>
        <section className="spatial-plane">{month}</section>
        <section className="spatial-plane">{agenda}</section>
      </div>
      <PositionIndicator plane={navigation.plane} dragOffset={navigation.dragOffset} viewportWidth={width} />
    </div>
  );
}
