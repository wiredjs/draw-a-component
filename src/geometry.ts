export type Point = [number, number];

export function isSamePoint(p1: Point, p2: Point): boolean {
  return (p1[0] === p2[0] && p1[1] === p2[1]);
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

export function scale(points: Point[], scale: Point, origin: Point = [0, 0]): Point[] {
  return points.map((p) => {
    return [(p[0] - origin[0]) * scale[0] + origin[0], (p[1] - origin[1]) * scale[1] + origin[1]] as Point;
  });
}