import { RectangleRenderer } from './rectangle';
import { Point } from 'src/designer/design-tool';

export class EllipseRenderer extends RectangleRenderer {
  draw(ctx: CanvasRenderingContext2D): void {
    if (this.p1 && this.p2) {
      const center: Point = [(this.p2[0] + this.p1[0]) / 2, (this.p2[1] + this.p1[1]) / 2];
      const rx = Math.abs((this.p2[0] - this.p1[0]) / 2);
      const ry = Math.abs((this.p2[1] - this.p1[0]) / 2);
      ctx.beginPath();
      ctx.ellipse(center[0], center[1], rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}