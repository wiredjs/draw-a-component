import { ShapeRenderer, ShapeDelegate, Point } from '../designer/design-tool';

export class PencilRenderer implements ShapeRenderer {
  delegate?: ShapeDelegate;
  private points: Point[] = [];

  reset(): void {
    this.points = [];
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.points.length > 1) {
      ctx.beginPath();
      this.points.forEach((p, i) => {
        if (i) {
          ctx.lineTo(...p);
        } else {
          ctx.moveTo(...p);
        }
      });
      ctx.stroke();
    }
  }

  down(p: Point): void {
    this.points = [p];
  }

  move(p: Point, _metaKey: boolean): void {
    this.points.push(p);
  }

  up(): void {
    if (this.delegate && (this.points.length > 1)) {
      this.delegate.addShape({});
    }
    this.reset();
  }
}