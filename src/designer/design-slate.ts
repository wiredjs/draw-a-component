import { BaseElement, html, element, property } from '../base-element.js';
import { debounce } from '../utils.js';
import { toolManager } from './design-tool-manager.js';
import { ShapeRenderer, Point } from './design-tool.js';

@element('design-slate')
export class DesignSlate extends BaseElement {
  @property({ type: Number }) width = 300;
  @property({ type: Number }) height = 300;
  @property({ type: String }) currentTool = '';

  private renderers: Map<string, ShapeRenderer>;
  private drawing = false;
  private _dirty = false;
  private resizeHandler = debounce(this.onResize.bind(this), 250, false, this);

  constructor() {
    super();
    this.renderers = toolManager.renderers;
  }

  render() {
    return html`
    <style>
      :host {
        display: block;
        position: relative;
        box-sizing: border-box;
      }
      canvas {
        display: block;
        outline: 1px solid;
        position: absolute;
        top: 0;
        left: 0;
      }
    </style>
    <canvas id="canvas" width="${this.width}" height="${this.height}"
      @mousedown="${this.down}" @touchstart="${this.down}"
      @mouseup="${this.up}" @touchend="${this.up}"
      @mousemove="${this.move}" @touchmove="${this.move}"
      @mouseout="${this.up}" @touchcancel="${this.up}"></canvas>
    `;
  }

  get canvas(): HTMLCanvasElement {
    return this.$('canvas') as HTMLCanvasElement;
  }

  get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d')!;
  }

  get current(): ShapeRenderer | undefined {
    return this.renderers.get(this.currentTool);
  }

  firstUpdated() {
    setTimeout(() => this.resizeCanvas());
    window.addEventListener('resize', this.resizeHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.resizeHandler);
  }

  updated() {
    this.clear();
  }

  clear() {
    this.drawing = false;
    this.dirty = false;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  private onResize() {
    this.resizeCanvas();
    setTimeout(() => this.resizeCanvas(), 100);
  }

  private resizeCanvas() {
    const size = this.getBoundingClientRect();
    this.width = Math.max(100, size.width);
    this.height = Math.max(100, size.height);
    this.dirty = true;
  }

  private set dirty(value: boolean) {
    if (this._dirty !== value) {
      this._dirty = value;
      if (value) {
        requestAnimationFrame(() => this.draw());
      }
    }
  }

  private draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    if (this.current) {
      this.current.draw(ctx);
    }
    this.dirty = false;
  }

  private coordinates(e: any): Point {
    const rect = this.getBoundingClientRect();
    return [(e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - rect.left, (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - rect.top];
  }

  private down(e: MouseEvent | TouchEvent) {
    if (!this.drawing) {
      this.drawing = true;
      if (this.current) {
        this.current.down(this.coordinates(e));
      }
    }
  }

  private move(e: MouseEvent | TouchEvent) {
    if (this.drawing) {
      if (this.current) {
        this.current.move(this.coordinates(e), e.shiftKey);
        this.dirty = true;
      }
    }
  }

  private up() {
    if (this.drawing) {
      this.drawing = false;
      if (this.current) {
        this.current.up();
        this.dirty = true;
      }
    }
  }
}