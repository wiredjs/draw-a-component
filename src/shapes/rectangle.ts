import { ShapeRenderer, ShapeDelegate, Point, isSamePoint } from '../designer/design-tool';

export class RectangleRenderer implements ShapeRenderer {
  delegate?: ShapeDelegate;
  private p1?: Point;
  private p2?: Point;

  reset(): void {
    delete this.p1;
    delete this.p2;
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
        if (this.delegate) {
          this.delegate.addShape({});
        }
      }
    }
    this.reset();
  }
}