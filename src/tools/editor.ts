import { BaseElement, property, TemplateResult, html, PropertyValues } from '../base-element.js';
import { toolManager } from '../designer/design-tool';
import { addListener, removeListener } from '@polymer/polymer/lib/utils/gestures';
import { svgNode } from '../utils';
import { Point } from '../geometry';
import { Shape, UndoableOp } from '../model';
import { bus } from '..//bus.js';

export const baseStyles: TemplateResult = html`
<style>
  :host {
    display: block;
    outline: none;
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
  :host(.editor-default) #overlay {
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
</style>
`;

export abstract class ShapeEditor extends BaseElement {
  @property() shape?: Shape;
  protected shadowShape?: Shape;
  protected gShadow: SVGElement | null = null;

  protected dragState?: string;
  protected originPoint?: Point;
  protected shapeString = '';
  private updatePending = false;

  private overlayUpHandler = this.overlayUp.bind(this);
  private overlayDownHandler = (e: Event) => this.overlayDown(e as CustomEvent);
  private overlayTrackHandler = (e: Event) => this.overlayTrack(e as CustomEvent);
  private keyboardListener = this.onKeyDown.bind(this);

  private connected = false;

  connectedCallback() {
    super.connectedCallback();
    this.connected = true;
    if (this.shape) {
      this.state = 'default';
      this.focus();
      this.attachListeners();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.connected = false;
    this.detachListeners();
  }

  firstUpdated() {
    this.tabIndex = 0;
    bus.subscribe('update-shape', (_, s: Shape) => {
      if (this.connected && this.shape && (this.shape.id === s.id)) {
        this.shape = s;
      }
    });
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('shape')) {
      this.onShapeUpdate();
    }
  }

  private onShapeUpdate() {
    this.state = 'default';
    this.resetShape();
    this.refreshControls();
    if (this.shape) {
      this.attachListeners();
      this.focus();
    } else {
      this.detachListeners();
    }
  }

  private detachListeners() {
    const overlay = this.$('overlay');
    if (!overlay) {
      return;
    }
    this.removeEventListener('keydown', this.keyboardListener);
    removeListener(overlay, 'up', this.overlayUpHandler);
    removeListener(overlay, 'down', this.overlayDownHandler);
    removeListener(overlay, 'track', this.overlayTrackHandler);
  }

  private attachListeners() {
    const overlay = this.$('overlay');
    if (!overlay) {
      return;
    }
    this.detachListeners();
    this.addEventListener('keydown', this.keyboardListener);
    addListener(overlay, 'up', this.overlayUpHandler);
    addListener(overlay, 'down', this.overlayDownHandler);
    addListener(overlay, 'track', this.overlayTrackHandler);
  }

  protected get state(): string {
    return this.dragState || 'default';
  }

  protected set state(value: string) {
    if (value !== this.dragState) {
      this.classList.remove(`editor-${this.dragState}`);
      this.dragState = value;
      this.classList.add(`editor-${this.dragState}`);
    }
  }

  protected get svg(): SVGSVGElement {
    return this.$$('svg') as any as SVGSVGElement;
  }

  protected deferredUpdateShape() {
    if (!this.updatePending) {
      this.updatePending = true;
      setTimeout(() => {
        this.updatePending = false;
        this.updateShape();
      }, 200);
    }
  }

  protected resetShape() {
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

  protected redrawShadow() {
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

  protected drawShape(shape: Shape): SVGElement | null {
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

  protected overlayUp() {
    if (this.state !== 'default') {
      this.state = 'default';
      this.updateShape();
    }
  }

  protected overlayDown(event: CustomEvent) {
    if (this.state === 'default') {
      this.state = 'moving';
      this.originPoint = [event.detail.x, event.detail.y];
    }
  }

  protected overlayTrack(event: CustomEvent) {
    const p: Point = [event.detail.x, event.detail.y];
    switch (this.state) {
      case 'moving':
        const diff: Point = [p[0] - this.originPoint![0], p[1] - this.originPoint![1]];
        this.shiftShadowShape(diff);
        break;
      default:
        break;
    }
  }

  protected onKeyDown(event: KeyboardEvent) {
    if (this.shadowShape && this.state === 'default') {
      const meta = event.shiftKey || event.metaKey || event.ctrlKey || event.altKey;
      switch (event.keyCode) {
        case 37:
          this.shiftShadowShape([meta ? -5 : -1, 0]);
          this.deferredUpdateShape();
          break;
        case 38:
          this.shiftShadowShape([0, meta ? -5 : -1]);
          this.deferredUpdateShape();
          break;
        case 39:
          this.shiftShadowShape([meta ? 5 : 1, 0]);
          this.deferredUpdateShape();
          break;
        case 40:
          this.shiftShadowShape([0, meta ? 5 : 1]);
          this.deferredUpdateShape();
          break;
        case 8:
        case 46:
          // delete
          const ops: UndoableOp = {
            do: { type: 'delete', shapeId: this.shape!.id },
            undo: { type: 'add', shapeId: this.shape!.id, data: this.shape! }
          };
          this.fireEvent('op', ops);
          break;
      }
    }
  }

  protected shiftShadowShape(diff: Point) {
    if (this.shadowShape) {
      this.shadowShape.points.forEach((p, i) => {
        p[0] = this.shape!.points[i][0] + diff[0];
        p[1] = this.shape!.points[i][1] + diff[1];
      });
      this.microTaskRedraw();
    }
  }

  protected microTaskRedraw() {
    Promise.resolve().then(() => this.redrawShadow());
  }

  protected updateShape() {
    this.normalizeShape();
    const shadowString = JSON.stringify(this.shadowShape);
    if (shadowString !== this.shapeString) {
      const ops: UndoableOp = {
        do: { type: 'update', shapeId: this.shadowShape!.id, data: JSON.parse(shadowString) as Shape },
        undo: { type: 'update', shapeId: this.shadowShape!.id, data: JSON.parse(JSON.stringify(this.shape)) as Shape }
      };
      this.fireEvent('op', ops);
      this.shape = JSON.parse(shadowString) as Shape;
    }
  }

  protected refreshControls(): void {
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

  protected abstract normalizeShape(): void;
  abstract render(): TemplateResult;
}