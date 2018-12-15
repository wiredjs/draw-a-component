import { Sketcher, SketchDelegate } from '../../designer/designer-common.js';
import { newId } from '../../utils';
import { Point } from '../../geometry';
import { model } from '../../model';

export class PencilSketcher implements Sketcher {
  private delegate?: SketchDelegate;
  private points: Point[] = [];

  private reset(): void {
    this.points = [];
  }

  setDelegate(delegate: SketchDelegate): void {
    this.delegate = delegate;
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
      this.delegate.addShape({
        id: newId(),
        type: 'pencil',
        points: this.points,
        props: model.currentSketchProps()
      });
    }
    this.reset();
  }
}