import { BaseElement, html, element, property } from '../../base-element.js';
import { Shape, toolManager } from '../../designer/design-tool';
import { svgNode } from '../../designer/design-common';
import { PropertyValues } from '@polymer/lit-element';

@element('rectangle-editor')
export class RectangleEditor extends BaseElement {
  @property() shape?: Shape;

  private g: SVGElement | null = null;
  private go: SVGElement | null = null;

  render() {
    return html`
    <style>
      :host {
        display: block;
        pointer-events: none;
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
      g.overlay {
        stroke: var(--highlight-blue);
      }
      #overlay {
        position: absolute;
        pointer-events: auto;
        color: var(--highlight-blue);
      }
      .hidden {
        display: none;
      }
      .round {
        position: absolute;
        background: currentColor;
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }
      .square {
        position: absolute;
        background: white;
        width: 5px;
        height: 5px;
        border: 1px solid;
      }
      #pCenter {
        top: 50%;
        left: 50%;
        margin-top: -3px;
        margin-left: -3px;
      }
      #pTopLeft {
        top: -3px;
        left: -3px;
      }
      #pTopRight {
        top: -3px;
        right: -3px;
      }
      #pBottomRight {
        bottom: -3px;
        right: -3px;
      }
      #pBottomLeft {
        bottom: -3px;
        left: -3px;
      }
      #pTop {
        top: -3px;
        left: 50%;
        margin-left: -3px;
      }
      #pBottom {
        bottom: -3px;
        left: 50%;
        margin-left: -3px;
      }
      #pLeft {
        top: 50%;
        margin-top: -3px;
        left: -3px;
      }
      #pRight {
        top: 50%;
        margin-top: -3px;
        right: -3px;
      }
    </style>
    <svg></svg>
    <div id="overlay">
      <div id="pCenter" class="round"></div>
      <div id="pTopLeft" class="square"></div>
      <div id="pTopRight" class="square"></div>
      <div id="pBottomRight" class="square"></div>
      <div id="pBottomLeft" class="square"></div>
      <div id="pTop" class="square"></div>
      <div id="pBottom" class="square"></div>
      <div id="pLeft" class="square"></div>
      <div id="pRight" class="square"></div>
    </div>
    `;
  }

  private get svg(): SVGSVGElement {
    return this.$$('svg') as any as SVGSVGElement;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('shape')) {
      this.redrawShape();
      this.refreshControls();
    }
  }

  private redrawShape() {
    const svg = this.svg;
    while (svg.lastChild) {
      svg.removeChild(svg.lastChild);
    }
    if (this.shape) {
      this.g = this.drawShape(this.shape);
      this.go = this.drawShape(this.shape);
      if (this.go) {
        this.go.classList.add('overlay');
      }
    }
  }

  private drawShape(shape: Shape): SVGElement | null {
    const tool = toolManager.byType(shape.type);
    const node = tool.draw(shape);
    if (node) {
      const g = svgNode('g', { id: `g-${shape.id}` });
      g.appendChild(node);
      this.svg.appendChild(g);
      return g;
    }
    return null;
  }

  private refreshControls() {
    const overlay = this.$('overlay');
    if (this.shape) {
      overlay.classList.remove('hidden');
      const p1 = this.shape.points[0];
      const p2 = this.shape.points[1];
      const x = Math.min(p1[0], p2[0]);
      const y = Math.min(p1[1], p2[1]);
      const xp = Math.max(p1[0], p2[0]);
      const yp = Math.max(p1[1], p2[1]);
      const ostyle = overlay.style;
      ostyle.left = `${x}px`;
      ostyle.top = `${y}px`;
      ostyle.width = `${xp - x}px`;
      ostyle.height = `${yp - y}px`;
    } else {
      overlay.classList.add('hidden');
    }
  }
}