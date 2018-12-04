import { Point } from './designer/design-common';

export function debounce(func: Function, wait: number, immediate: boolean, context: any): EventListener {
  let timeout: number = 0;
  return () => {
    const args = arguments;
    const later = () => {
      timeout = 0;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

export function normalizeRect(points: Point[]): void {
  const minX = Math.min(points[0][0], points[1][0]);
  const maxX = Math.max(points[0][0], points[1][0]);
  const minY = Math.min(points[0][1], points[1][1]);
  const maxY = Math.max(points[0][1], points[1][1]);
  points[0] = [minX, minY];
  points[1] = [maxX, maxY];
}

export function normalizeLine(points: Point[]): void {
  const p1 = points[0];
  const p2 = points[1];
  if (p2[0] < p1[0]) {
    points[0] = p2;
    points[1] = p1;
  } else if (p2[0] === p1[0]) {
    if (p2[1] < p1[1]) {
      points[0] = p2;
      points[1] = p1;
    }
  }
}