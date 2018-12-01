import { Sketcher, SketchDelegate, Tool, ToolType, Shape } from '../../designer/design-tool';
import { LineSketcher } from './line-sketcher';
import { svgNode } from '../../designer/design-common';
import { LineEditor } from './line-editor';
import './line-editor';

export class Line implements Tool {
  private sketcher?: LineSketcher;
  private _editor?: LineEditor;

  get type(): ToolType {
    return 'line';
  }

  get icon(): string {
    return 'line';
  }

  get sketches(): boolean {
    return true;
  }

  getSketcher(delegate: SketchDelegate): Sketcher | null {
    if (!this.sketcher) {
      this.sketcher = new LineSketcher();
    }
    this.sketcher.setDelegate(delegate);
    return this.sketcher;
  }

  draw(shape: Shape): SVGElement | null {
    const p1 = shape.points[0];
    const p2 = shape.points[1];
    return svgNode('line', {
      x1: `${p1[0]}`,
      y1: `${p1[1]}`,
      x2: `${p2[0]}`,
      y2: `${p2[1]}`
    });
  }

  editor(shape: Shape): HTMLElement | null {
    if (!this._editor) {
      this._editor = new LineEditor();
    }
    this._editor.shape = shape;
    return this._editor;
  }
}