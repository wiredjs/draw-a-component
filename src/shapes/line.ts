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
      ctx.lineTo(this.p1[0], this.p1[1]);
      ctx.stroke();
    }
  }

  down(p: Point): void {
    this.p1 = p;
  }

  move(p: Point, _metaKey: boolean): void {
    this.p2 = p;
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