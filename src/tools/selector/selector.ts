import { Sketcher, SketchDelegate, Tool, ToolType, Shape } from '../../designer/design-tool';

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

  editor(_shape: Shape, _parent: SVGElement): void {
  }
}