import { Sketcher, SketchDelegate } from '../../designer/designer-common';
import { Shape } from '../../model';
import { newId } from '../../utils';
import { Point, normalizeRect, isSamePoint } from '../../geometry';

export class RectSketcher implements Sketcher {
  private delegate?: SketchDelegate;
  protected p1?: Point;
  protected p2?: Point;

  private reset(): void {
    delete this.p1;
    delete this.p2;
  }

  setDelegate(delegate: SketchDelegate): void {
    this.delegate = delegate;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.p1 && this.p2) {
      ctx.strokeRect(this.p1[0], this.p1[1], this.p2[0] - this.p1[0], this.p2[1] - this.p1[1]);
    }
  }

  down(p: Point): void {
    this.p1 = p;
  }

  move(p: Point, metaKey: boolean): void {
    if (metaKey && this.p1) {
      const dx = p[0] - this.p1[0];
      const dy = p[1] - this.p1[1];
      const sign = (dx * dy) ? ((dx * dy) / Math.abs(dx * dy)) : 1;
      this.p2 = [p[0], this.p1[1] + sign * dx];
    } else {
      this.p2 = p;
    }
  }

  up(): void {
    if (this.p1 && this.p2) {
      if (!isSamePoint(this.p1, this.p2)) {
        this.addShape();
      }
    }
    this.reset();
  }

  protected addShape() {
    if (this.delegate) {
      const shape: Shape = {
        id: newId(),
        type: 'rectangle',
        points: [this.p1!, this.p2!]
      };
      normalizeRect(shape.points);
      this.delegate.addShape(shape);
    }
  }
}