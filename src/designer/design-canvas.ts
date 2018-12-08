import { BaseElement, html, element } from '../base-element.js';
import { toolManager } from './design-tool.js';
import { svgNode } from '../utils';
import { Shape, model, Layer } from '../model';
import { bus } from '../bus.js';

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

  firstUpdated() {
    bus.subscribe('select', () => this.refreshSelection());
    bus.subscribe('new-shape', (_, l: Layer) => {
      this.addShape(l.shape);
    });
    bus.subscribe('delete-shape', (_, id: string) => {
      this.deleteShape(id);
    });
    bus.subscribe('update-shape', (_, s: Shape) => {
      this.updateShape(s);
    });
  }

  private get svg(): SVGSVGElement {
    return this.$$('svg') as any as SVGSVGElement;
  }

  private addShape(shape: Shape) {
    if (shape && shape.type) {
      const g = this.renderShape(shape);
      if (g) {
        this.svg.appendChild(g);
        this.shapeMap.set(shape.id, { shape, node: g });
      }
    }
  }

  private updateShape(shape: Shape) {
    if (shape && this.shapeMap.has(shape.id)) {
      const current = this.shapeMap.get(shape.id)!;
      this.renderShape(shape, current.node);
      current.shape = shape;
    }
  }

  private deleteShape(shapeId: string) {
    if (shapeId && this.shapeMap.has(shapeId)) {
      const current = this.shapeMap.get(shapeId)!;
      current.node.parentElement!.removeChild(current.node);
      this.shapeMap.delete(shapeId);
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
          model.selected = shape.id;
        });
        return g;
      }
    }
    return null;
  }

  private onBgClick() {
    model.selected = null;
  }

  private refreshSelection() {
    const id = model.selected;
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