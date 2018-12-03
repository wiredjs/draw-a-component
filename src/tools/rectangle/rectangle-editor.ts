import { BaseElement, html, element, property } from '../../base-element.js';
import { Shape, toolManager } from '../../designer/design-tool';
import { svgNode, Point } from '../../designer/design-common';
import { PropertyValues } from '@polymer/lit-element';
import { addListener, removeListener } from '@polymer/polymer/lib/utils/gestures';

type State = 'default' | 'moving' | 'tl' | 't' | 'tr' | 'r' | 'br' | 'b' | 'bl' | 'l';

@element('rectangle-editor')
export class RectangleEditor extends BaseElement {
  @property() shape?: Shape;

  private shadowShape?: Shape;
  private gShadow: SVGElement | null = null;
  private originPoint?: Point;
  private dragState?: State;
  private shapeString = '';

  private overlayUpHandler = () => this.overlayUp();
  private overlayDownHandler = (e: Event) => this.overlayDown(e as CustomEvent);
  private overlayTrackHandler = (e: Event) => this.overlayTrack(e as CustomEvent);

  private get svg(): SVGSVGElement {
    return this.$$('svg') as any as SVGSVGElement;
  }

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
        display: none;
      }
      :host(.re-default) #overlay {
        display: block;
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

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.detachListeners();
  }

  private get state(): State {
    return this.dragState || 'default';
  }

  private set state(value: State) {
    if (value !== this.dragState) {
      this.classList.remove(`re-${this.dragState}`);
      this.dragState = value;
      this.classList.add(`re-${this.dragState}`);
    }
  }

  private detachListeners() {
    const overlay = this.$('overlay');
    removeListener(overlay, 'up', this.overlayUpHandler);
    removeListener(overlay, 'down', this.overlayDownHandler);
    removeListener(overlay, 'track', this.overlayTrackHandler);
  }

  private attachListeners() {
    this.detachListeners();
    const overlay = this.$('overlay');
    addListener(overlay, 'up', this.overlayUpHandler);
    addListener(overlay, 'down', this.overlayDownHandler);
    addListener(overlay, 'track', this.overlayTrackHandler);
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('shape')) {
      this.state = 'default';
      this.resetShape();
      this.refreshControls();
      this.attachListeners();
    }
  }

  private resetShape() {
    const svg = this.svg;
    while (svg.lastChild) {
      svg.removeChild(svg.lastChild);
    }
    this.gShadow = null;
    if (this.shape) {
      this.shapeString = JSON.stringify(this.shape);
      this.shadowShape = JSON.parse(this.shapeString) as Shape;
      this.redrawShadow();
    } else {
      this.shadowShape = undefined;
    }
  }

  private redrawShadow() {
    if (this.gShadow) {
      this.svg.removeChild(this.gShadow);
      this.gShadow = null;
    }
    if (this.shadowShape) {
      this.gShadow = this.drawShape(this.shadowShape);
      if (this.gShadow) {
        this.gShadow.classList.add('overlay');
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

  private overlayUp() {
    if (this.state !== 'default') {
      this.state = 'default';
      const shadowString = JSON.stringify(this.shadowShape);
      if (shadowString !== this.shapeString) {
        this.fireEvent('update-shape', this.shadowShape);
        this.shape = JSON.parse(shadowString) as Shape;
      }
    }
  }

  private overlayDown(event: CustomEvent) {
    if (this.state === 'default') {
      this.state = 'moving';
      this.originPoint = [event.detail.x, event.detail.y];
    }
  }

  private overlayTrack(event: CustomEvent) {
    if (this.state === 'moving') {
      const p: Point = [event.detail.x, event.detail.y];
      const diff: Point = [p[0] - this.originPoint![0], p[1] - this.originPoint![1]];
      if (this.shadowShape) {
        this.shadowShape.points.forEach((p, i) => {
          p[0] = this.shape!.points[i][0] + diff[0];
          p[1] = this.shape!.points[i][1] + diff[1];
          setTimeout(() => this.redrawShadow());
        });
      }
    }
  }
}