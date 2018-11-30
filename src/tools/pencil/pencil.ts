import { Sketcher, SketchDelegate, Tool, ToolType, Shape } from '../../designer/design-tool';
import { PencilSketcher } from './pencil-sketcher';
import { svgNode } from '../../designer/design-common';

export class Pencil implements Tool {
  private sketcher?: PencilSketcher;

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

  editor(_shape: Shape, _parent: SVGElement): void {
  }
}