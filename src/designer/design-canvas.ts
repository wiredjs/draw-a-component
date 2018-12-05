import { BaseElement, html, element } from '../base-element.js';
import { Shape, toolManager } from './design-tool.js';
import { svgNode } from '../utils';

interface ShapeItem {
  shape: Shape;
  node: SVGElement;
}

@element('design-canvas')
export class DesignCanvas extends BaseElement {
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
      .selected {
        stroke: #aaa;
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
      const g = this.renderShape(shape);
      if (g) {
        this.svg.appendChild(g);
        this.shapeMap.set(shape.id, { shape, node: g });
      }
    }
  }

  updateShape(shape: Shape) {
    if (shape && this.shapeMap.has(shape.id)) {
      const current = this.shapeMap.get(shape.id)!;
      this.renderShape(shape, current.node);
      current.shape = shape;
    }
  }

  deleteShape(shape: Shape) {
    if (shape && this.shapeMap.has(shape.id)) {
      const current = this.shapeMap.get(shape.id)!;
      current.node.parentElement!.removeChild(current.node);
      this.shapeMap.delete(shape.id);
    }
  }

  private renderShape(shape: Shape, parent?: SVGElement): SVGElement | null {
    const tool = toolManager.byType(shape.type);
    const node = tool.draw(shape);
    if (node) {
      if (parent) {
        while (parent.lastChild) {
          parent.removeChild(parent.lastChild);
        }
        parent.appendChild(node);
        return null;
      } else {
        const g = svgNode('g', { id: `g-${shape.id}` });
        g.appendChild(node);
        g.addEventListener('click', (e) => {
          e.stopPropagation();
          this.onSelect(shape.id);
        });
        return g;
      }
    }
    return null;
  }

  private onBgClick() {
    this.fireEvent('select');
  }

  private onSelect(shapeId: string) {
    if (this.shapeMap.has(shapeId)) {
      this.fireEvent('select', this.shapeMap.get(shapeId)!.shape);
    }
  }

  set selected(id: string | null) {
    if (id !== this.selectedId) {
      if (this.selectedId) {
        const s = this.shapeMap.get(this.selectedId);
        if (s) {
          s.node.classList.remove('selected');
        }
      }
      this.selectedId = id;
      if (this.selectedId) {
        const s = this.shapeMap.get(this.selectedId);
        if (s) {
          s.node.classList.add('selected');
        }
      }
    }
  }

}