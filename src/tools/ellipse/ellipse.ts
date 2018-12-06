import { Sketcher, SketchDelegate, Tool, ToolType, Shape } from '../../designer/design-tool';
import { EllipseSketcher } from './ellipse-sketcher';
import { svgNode } from '../../utils';
import { RectangleEditor } from '../rectangle/rectangle-editor';
import '../rectangle/rectangle-editor';

export class Ellipse implements Tool {
  private sketcher?: EllipseSketcher;
  private _editor?: RectangleEditor;

  get type(): ToolType {
    return 'ellipse';
  }

  get icon(): string {
    return 'circle';
  }

  get sketches(): boolean {
    return true;
  }

  getSketcher(delegate: SketchDelegate): Sketcher | null {
    if (!this.sketcher) {
      this.sketcher = new EllipseSketcher();
    }
    this.sketcher.setDelegate(delegate);
    return this.sketcher;
  }

  draw(shape: Shape): SVGElement | null {
    const p1 = shape.points[0];
    const p2 = shape.points[1];
    const cx = `${(p1[0] + p2[0]) / 2}`;
    const cy = `${(p1[1] + p2[1]) / 2}`;
    const rx = `${Math.abs((p2[0] - p1[0]) / 2)}`;
    const ry = `${Math.abs((p2[1] - p1[1]) / 2)}`;
    return svgNode('ellipse', { cx, cy, rx, ry });
  }

  editor(shape: Shape): HTMLElement | null {
    if (!this._editor) {
      this._editor = new RectangleEditor();
    }
    this._editor.shape = shape;
    return this._editor;
  }
}