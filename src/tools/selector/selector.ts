import { Sketcher, SketchDelegate, Tool, ToolType, Shape } from '../../designer/designer-common';

export class Selector implements Tool {
  get type(): ToolType {
    return 'select';
  }

  get icon(): string {
    return 'pointer';
  }

  get sketches(): boolean {
    return false;
  }

  getSketcher(_delegate: SketchDelegate): Sketcher | null {
    return null;
  }

  draw(_shape: Shape): SVGElement | null {
    return null;
  }

  editor(_shape: Shape): HTMLElement | null {
    return null;
  }
}