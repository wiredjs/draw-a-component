import { BaseElement, html, element } from '../base-element.js';
import { Shape, toolManager } from './design-tool.js';
import { svgNode } from './design-common.js';

@element('design-canvas')
export class DesignCanvas extends BaseElement {
  private readonly shapes: Shape[] = [];
  private readonly shapeMap: Map<string, Shape> = new Map();

  render() {
    return html`
    <style>
      :host {
        display: block;
        position: relative;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }
      svg {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      g {
        fill: none;
        stroke: #000;
      }
    </style>
    <svg></svg>
    `;
  }

  // private clearSvg() {
  //   const svg = this.$$('svg');
  //   while (svg.hasChildNodes()) {
  //     svg.removeChild(svg.lastChild!);
  //   }
  // }

  get svg(): SVGSVGElement {
    return this.$$('svg') as any as SVGSVGElement;
  }

  addShape(shape: Shape) {
    if (shape && shape.type) {
      const tool = toolManager.byType(shape.type);
      const node = tool.draw(shape);
      if (node) {
        const g = svgNode('g', { id: `g-${shape.id}` });
        g.appendChild(node);
        g.addEventListener('click', () => this.onSelect(shape));
        this.svg.appendChild(g);
      }
    }
    this.shapes.push(shape);
    this.shapeMap.set(shape.id, shape);
  }

  private onSelect(shape: Shape) {
    console.log('shape select', shape.id, shape.type);
  }

}