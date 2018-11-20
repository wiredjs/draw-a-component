import { ToolInfo, ShapeRenderer } from './design-tool';
// import { PencilRenderer } from 'src/shapes/pencil';
// import { RectangleRenderer } from 'src/shapes/rectangle';
// import { EllipseRenderer } from 'src/shapes/ellipse';
import { LineRenderer } from '../shapes/line';

export class DesignToolManager {
  private _renderers?: Map<string, ShapeRenderer>;
  private _tools: ToolInfo[] = [
    { name: 'selct', icon: 'pointer', renders: false, title: 'Select a shape' },
    { name: 'draw', icon: 'pen', title: 'Draw', renders: true },
    { name: 'rectangle', icon: 'box', title: 'Rectangle', renders: true },
    { name: 'ellipse', icon: 'circle', title: 'Ellipse', renders: true },
    { name: 'line', icon: 'line', title: 'Line', renders: true }
  ];

  get tools(): ToolInfo[] {
    return this._tools;
  }

  get renderers(): Map<string, ShapeRenderer> {
    if (!this._renderers) {
      this._renderers = new Map();
      this._tools.forEach((d) => {
        if (d.renders) {
          switch (d.name) {
            // case 'draw':
            //   this._renderers!.set(d.name, new PencilRenderer());
            //   break;
            // case 'rectangle':
            //   this._renderers!.set(d.name, new RectangleRenderer());
            //   break;
            // case 'ellipse':
            //   this._renderers!.set(d.name, new EllipseRenderer());
            //   break;
            case 'line':
              this._renderers!.set(d.name, new LineRenderer());
              break;
            default:
              break;
          }
        }
      });
    }
    return this._renderers;
  }
}

export const toolManager = new DesignToolManager();