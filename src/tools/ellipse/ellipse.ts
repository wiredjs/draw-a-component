import { Sketcher, SketchDelegate, Tool, ToolType, Shape } from '../../designer/design-tool';
import { EllipseSketcher } from './ellipse-sketcher';

export class Ellipse implements Tool {
  private sketcher?: EllipseSketcher;

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

  draw(_shape: Shape, _parent: SVGElement): void {
  }

  editor(_shape: Shape, _parent: SVGElement): void {
  }
}