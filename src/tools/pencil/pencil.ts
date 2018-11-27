import { Sketcher, SketchDelegate, Tool, ToolType, Shape } from '../../designer/design-tool';
import { PencilSketcher } from './pencil-sketcher';

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

  draw(_shape: Shape, _parent: SVGElement): void {
  }

  editor(_shape: Shape, _parent: SVGElement): void {
  }
}