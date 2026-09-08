export const MONTH_NAVIGATOR_EDGE = 24;
export const MONTH_NAVIGATOR_COMMIT = 72;

export function isMonthNavigatorRightEdge(startX: number, width: number): boolean {
  return startX >= width - MONTH_NAVIGATOR_EDGE;
}

export function shouldOpenMonthNavigator(
  startX: number,
  width: number,
  dx: number,
  dy: number
): boolean {
  return (
    isMonthNavigatorRightEdge(startX, width) &&
    dx <= -MONTH_NAVIGATOR_COMMIT &&
    Math.abs(dx) > Math.abs(dy) * 1.25
  );
}
