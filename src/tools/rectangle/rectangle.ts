import { Sketcher, SketchDelegate, Tool, ToolType, Shape } from '../../designer/design-tool';
import { RectSketcher } from './rect-sketcher';
import { svgNode } from '../../designer/design-common';

export class Rectangle implements Tool {
  private sketcher?: RectSketcher;

  get type(): ToolType {
    return 'rectangle';
  }

  get icon(): string {
    return 'box';
  }

  get sketches(): boolean {
    return true;
  }

  getSketcher(delegate: SketchDelegate): Sketcher | null {
    if (!this.sketcher) {
      this.sketcher = new RectSketcher();
    }
    this.sketcher.setDelegate(delegate);
    return this.sketcher;
  }

  draw(shape: Shape): SVGElement | null {
    const p1 = shape.points[0];
    const p2 = shape.points[1];
    const x = `${Math.min(p1[0], p2[0])}`;
    const y = `${Math.min(p1[1], p2[1])}`;
    const width = `${Math.abs(p1[0] - p2[0])}`;
    const height = `${Math.abs(p1[1] - p2[1])}`;
    return svgNode('rect', { x, y, width, height });
  }

  editor(_shape: Shape, _parent: SVGElement): void {
  }
}