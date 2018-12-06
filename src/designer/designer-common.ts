import { Point } from '../geometry';

export type ToolType = 'select' | 'pencil' | 'rectangle' | 'ellipse' | 'line';

export interface Tool {
  readonly type: ToolType;
  readonly icon: string;
  readonly sketches: boolean;
  getSketcher(delegate: SketchDelegate): Sketcher | null;
  draw(shape: Shape): SVGElement | null;
  editor(shape: Shape): HTMLElement | null;
}

export interface Sketcher {
  draw(ctx: CanvasRenderingContext2D): void;
  down(p: Point): void;
  move(p: Point, metaKey: boolean): void;
  up(): void;
}

export interface SketchDelegate {
  addShape(shape: Shape): void;
}

export interface Shape {
  id: string;
  type: ToolType;
  points: Point[];
  properties?: any;
}