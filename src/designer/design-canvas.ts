import { BaseElement, html, element } from '../base-element.js';
import { Shape, toolManager } from './design-tool.js';
import { svgNode } from './design-common.js';

interface ShapeItem {
  shape: Shape;
  node: SVGElement;
}

@element('design-canvas')
export class DesignCanvas extends BaseElement {
  private readonly shapes: Shape[] = [];
  private readonly shapeMap: Map<string, ShapeItem> = new Map();
  private selectedId: string | null = null;

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
        fill: transparent;
        stroke: #000;
      }
      .hidden {
        display: none;
      }
    </style>
    <svg @click="${this.onBgClick}"></svg>
    `;
  }

  // private clearSvg() {
  //   const svg = this.$$('svg');
  //   while (svg.hasChildNodes()) {
  //     svg.removeChild(svg.lastChild!);
  //   }
  // }

  private get svg(): SVGSVGElement {
    return this.$$('svg') as any as SVGSVGElement;
  }

  addShape(shape: Shape) {
    if (shape && shape.type) {
      const tool = toolManager.byType(shape.type);
      const node = tool.draw(shape);
      if (node) {
        const g = svgNode('g', { id: `g-${shape.id}` });
        g.appendChild(node);
        g.addEventListener('click', (e) => {
          e.stopPropagation();
          this.onSelect(shape);
        });
        this.svg.appendChild(g);
        this.shapes.push(shape);
        this.shapeMap.set(shape.id, { shape, node: g });
      }
    }
  }

  private onBgClick() {
    this.fireEvent('select');
  }

  private onSelect(shape: Shape) {
    this.fireEvent('select', shape);
  }

  set selected(id: string | null) {
    if (id !== this.selectedId) {
      if (this.selectedId) {
        const s = this.shapeMap.get(this.selectedId);
        if (s) {
          s.node.classList.remove('hidden');
        }
      }
      this.selectedId = id;
      if (this.selectedId) {
        const s = this.shapeMap.get(this.selectedId);
        if (s) {
          s.node.classList.add('hidden');
        }
      }
    }
  }

}