import { Point } from './design-common.js';
import { Selector } from '../tools/selector/selector.js';
import { Pencil } from '../tools/pencil/pencil.js';
import { Rectangle } from '../tools/rectangle/rectangle.js';
import { Ellipse } from '../tools/ellipse/ellipse.js';
import { Line } from '../tools/line/line.js';

export type ToolType = 'select' | 'pencil' | 'rectangle' | 'ellipse' | 'line';

export interface Tool {
  readonly type: ToolType;
  readonly icon: string;
  readonly sketches: boolean;
  getSketcher(delegate: SketchDelegate): Sketcher | null;
  draw(shape: Shape, parent: SVGElement): void;
  editor(shape: Shape, parent: SVGElement): void;
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
  type: ToolType;
  points: Point[];
  properties?: any;
}

export class ToolManager {
  private tools: Tool[] = [];
  private toolMap: Map<string, Tool> = new Map();

  private initialize() {
    if (!this.tools.length) {
      this.tools.push(new Selector());
      this.tools.push(new Pencil());
      this.tools.push(new Rectangle());
      this.tools.push(new Ellipse());
      this.tools.push(new Line());
      this.tools.forEach((d) => {
        this.toolMap.set(d.type, d);
      });
    }
  }

  get list(): Tool[] {
    this.initialize();
    return this.tools;
  }

  byType(type: ToolType): Tool {
    this.initialize();
    return this.toolMap.get(type)!;
  }

}
export const toolManager = new ToolManager();