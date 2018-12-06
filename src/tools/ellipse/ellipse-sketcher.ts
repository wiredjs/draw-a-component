import { Sketcher, SketchDelegate } from '../../designer/design-tool';
import { Point, isSamePoint } from '../../geometry';
import { newId } from '../../utils';

export class EllipseSketcher implements Sketcher {
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
      const center: Point = [(this.p2[0] + this.p1[0]) / 2, (this.p2[1] + this.p1[1]) / 2];
      const rx = Math.abs((this.p2[0] - this.p1[0]) / 2);
      const ry = Math.abs((this.p2[1] - this.p1[1]) / 2);
      ctx.beginPath();
      ctx.ellipse(center[0], center[1], rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
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
      this.delegate.addShape({
        id: newId(),
        type: 'ellipse',
        points: [this.p1!, this.p2!]
      });
    }
  }
}