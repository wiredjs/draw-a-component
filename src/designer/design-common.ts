export type Point = [number, number];

export function isSamePoint(p1: Point, p2: Point): boolean {
  return (p1[0] === p2[0] && p1[1] === p2[1]);
}