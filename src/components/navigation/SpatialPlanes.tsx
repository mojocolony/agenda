import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useAgendaNavigation } from '../../state/useAgendaNavigation';
import { PositionIndicator } from './PositionIndicator';

interface Props { settings: ReactNode; sixMonth: ReactNode; month: ReactNode; agenda: ReactNode; plane?: 'settings' | 'sixMonth' | 'month' | 'agenda'; onPlaneChange?: (plane: 'settings' | 'sixMonth' | 'month' | 'agenda') => void; }

const CAPTURE_THRESHOLD = 10;

export function SpatialPlanes({ settings, sixMonth, month, agenda, plane, onPlaneChange }: Props) {
  const navigation = useAgendaNavigation(plane ?? 'sixMonth');

  useEffect(() => {
    if (plane && plane !== navigation.plane) navigation.setPlane(plane);
  }, [plane, navigation.plane]);

  useEffect(() => {
    onPlaneChange?.(navigation.plane);
  }, [navigation.plane, onPlaneChange]);
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ id: number; startX: number; startY: number; captured: boolean } | null>(null);
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

  function localX(element: HTMLElement, clientX: number) {
    return clientX - element.getBoundingClientRect().left;
  }

  return (
    <div
      ref={rootRef}
      className="spatial-root"
      onPointerDown={event => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        const x = localX(event.currentTarget, event.clientX);
        pointerRef.current = { id: event.pointerId, startX: x, startY: event.clientY, captured: false };
        navigation.beginDrag(x, event.clientY);
      }}
      onPointerMove={event => {
        const pointer = pointerRef.current;
        if (!pointer || pointer.id !== event.pointerId) return;

        const x = localX(event.currentTarget, event.clientX);
        const dx = x - pointer.startX;
        const dy = event.clientY - pointer.startY;

        navigation.moveDrag(x, event.clientY);

        if (
          !pointer.captured &&
          Math.abs(dx) >= CAPTURE_THRESHOLD &&
          Math.abs(dx) > Math.abs(dy)
        ) {
          event.currentTarget.setPointerCapture(event.pointerId);
          pointer.captured = true;
        }
      }}
      onPointerUp={event => {
        const pointer = pointerRef.current;
        if (!pointer || pointer.id !== event.pointerId) return;
        if (pointer.captured && event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        navigation.endDrag();
        pointerRef.current = null;
      }}
      onPointerCancel={event => {
        if (pointerRef.current?.id !== event.pointerId) return;
        navigation.endDrag();
        pointerRef.current = null;
      }}
    >
      <div
        className="spatial-track"
        style={{
          transform: `translate3d(${transform}px,0,0)`,
          transition: navigation.dragOffset === 0 ? 'transform 260ms ease-out' : 'none'
        }}
      >
        <section className="spatial-plane">{settings}</section>
        <section className="spatial-plane">{sixMonth}</section>
        <section className="spatial-plane">{month}</section>
        <section className="spatial-plane">{agenda}</section>
      </div>
      <PositionIndicator plane={navigation.plane} dragOffset={navigation.dragOffset} viewportWidth={width} />
    </div>
  );
}
