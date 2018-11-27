import { Sketcher, SketchDelegate, Tool, ToolType, Shape } from '../../designer/design-tool';
import { LineSketcher } from './line-sketcher';

export class Line implements Tool {
  private sketcher?: LineSketcher;

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

  draw(_shape: Shape, _parent: SVGElement): void {
  }

  editor(_shape: Shape, _parent: SVGElement): void {
  }
}