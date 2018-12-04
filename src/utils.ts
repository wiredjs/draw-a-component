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