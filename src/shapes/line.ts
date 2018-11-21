import { ShapeRenderer, ShapeDelegate, Point, isSamePoint } from '../designer/design-tool';

export class LineRenderer implements ShapeRenderer {
  delegate?: ShapeDelegate;
  private p1?: Point;
  private p2?: Point;

  reset(): void {
    delete this.p1;
    delete this.p2;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.p1 && this.p2) {
      ctx.beginPath();
      ctx.moveTo(this.p1[0], this.p1[1]);
      ctx.lineTo(this.p2[0], this.p2[1]);
      ctx.stroke();
    }
  }

  down(p: Point): void {
    this.p1 = p;
  }

  move(p: Point, metaKey: boolean): void {
    this.p2 = p;
    if (metaKey && this.p1) {
      const angle = Math.abs((180 / Math.PI) * Math.atan((this.p2[1] - this.p1[1]) / (this.p2[0] - this.p1[0])));
      if (angle < 30) {
        this.p2 = [p[0], this.p1[1]];
      } else if (angle > 60) {
        this.p2 = [this.p1[0], p[1]];
      } else {
        const dx = p[0] - this.p1[0];
        const dy = p[1] - this.p1[1];
        const sign = (dx * dy) ? ((dx * dy) / Math.abs(dx * dy)) : 1;
        this.p2 = [p[0], this.p1[1] + sign * dx];
      }
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