export interface ToolInfo {
  readonly name: string;
  readonly icon: string;
  readonly title: string;
  readonly renders: boolean;
}

export type Point = [number, number];

export interface Shape {
}

export interface ShapeDelegate {
  addShape(shape: Shape): void;
}

export interface ShapeRenderer {
  delegate?: ShapeDelegate;
  reset(): void;
  draw(ctx: CanvasRenderingContext2D): void;
  down(p: Point): void;
  move(p: Point, metaKey: boolean): void;
  up(): void;
}

export function isSamePoint(p1: Point, p2: Point): boolean {
  return (p1[0] === p2[0] && p1[1] === p2[1]);
}