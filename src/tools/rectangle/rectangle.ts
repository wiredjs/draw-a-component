import { Sketcher, SketchDelegate, Tool, ToolType, Shape } from '../../designer/design-tool';
import { RectSketcher } from './rect-sketcher';

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

  draw(_shape: Shape, _parent: SVGElement): void {
  }

  editor(_shape: Shape, _parent: SVGElement): void {
  }
}