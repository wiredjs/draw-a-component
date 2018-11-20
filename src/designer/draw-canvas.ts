import { BaseElement, html, element, property } from '../base-element.js';
import { debounce } from '../utils.js';

export type Point = [number, number];

@element('draw-canvas')
export class DrawCanvas extends BaseElement {
  @property({ type: Number }) width = 300;
  @property({ type: Number }) height = 300;

  private drawing = false;
  private points: Point[] = [];
  private segments: Point[][] = [];
  private _dirty = false;
  private resizeHandler = debounce(this.onResize.bind(this), 250, false, this);

  render() {
    return html`
    <style>
      :host {
        display: block;
        position: relative;
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

  firstUpdated() {
    setTimeout(() => this.resizeCanvas());
    window.addEventListener('resize', this.resizeHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.resizeHandler);
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

  get canvas(): HTMLCanvasElement {
    return this.$('canvas') as HTMLCanvasElement;
  }

  get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d')!;
  }

  clear() {
    this.drawing = false;
    this.dirty = false;
    this.points = [];
    this.segments = [];
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  private coordinates(e: any): Point {
    return [(e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft, (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop];
  }

  private down(e: MouseEvent | TouchEvent) {
    if (!this.drawing) {
      this.drawing = true;
      this.points = [this.coordinates(e)];
    }
  }

  private move(e: MouseEvent | TouchEvent) {
    if (this.drawing) {
      this.points.push(this.coordinates(e));
      this.dirty = true;
    }
  }

  private up() {
    if (this.drawing) {
      this.drawing = false;
      if (this.points.length > 1) {
        this.segments.push([...this.points]);
        this.dirty = true;
      }
      this.points = [];
    }
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
    this.segments.forEach((d) => this.drawSegment(ctx, d));
    if (this.points.length > 1) {
      this.drawSegment(ctx, this.points);
    }
    this.dirty = false;
  }

  private drawSegment(ctx: CanvasRenderingContext2D, d: Point[]) {
    ctx.beginPath();
    d.forEach((p, i) => {
      if (i) {
        ctx.lineTo(...p);
      } else {
        ctx.moveTo(...p);
      }
    });
    ctx.stroke();
  }
}