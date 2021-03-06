import { Sketcher, SketchDelegate, Tool, ToolType } from '../../designer/designer-common';
import { Shape } from '../../model';
import { PencilSketcher } from './pencil-sketcher';
import { svgNode } from '../../utils';
import { PencilEditor } from './pencil-editor';
import './pencil-editor';

export class Pencil implements Tool {
  private sketcher?: PencilSketcher;
  private _editor?: PencilEditor;

  get type(): ToolType {
    return 'pencil';
  }

  get icon(): string {
    return 'pen';
  }

  get sketches(): boolean {
    return true;
  }

  getSketcher(delegate: SketchDelegate): Sketcher | null {
    if (!this.sketcher) {
      this.sketcher = new PencilSketcher();
    }
    this.sketcher.setDelegate(delegate);
    return this.sketcher;
  }

  draw(shape: Shape): SVGElement | null {
    if (shape.points.length < 2) {
      return null;
    }
    let d = '';
    shape.points.forEach((p, i) => {
      d = i ? `${d} L${p[0]} ${p[1]}` : `M${p[0]} ${p[1]}`;
    });
    return svgNode('path', { d });
  }

  editor(shape: Shape): HTMLElement | null {
    if (!this._editor) {
      this._editor = new PencilEditor();
    }
    this._editor.shape = shape;
    return this._editor;
  }
}