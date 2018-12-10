import { BaseElement, html, element, property } from '../base-element.js';
import { debounce } from '../utils.js';
import { toolManager } from './design-tool.js';
import { Shape, UndoableOp } from '../model';
import { SketchDelegate, Sketcher, ToolType } from './designer-common.js';
import { Point } from '../geometry';

@element('design-slate')
export class DesignSlate extends BaseElement implements SketchDelegate {
  @property({ type: Number }) width = 300;
  @property({ type: Number }) height = 300;
  @property({ type: String }) currentTool?: ToolType;

  private drawing = false;
  private _dirty = false;
  private resizeHandler = debounce(this.onResize.bind(this), 250, false, this);

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

  private get canvas(): HTMLCanvasElement {
    return this.$('canvas') as HTMLCanvasElement;
  }

  private get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d')!;
  }

  private get current(): Sketcher | undefined {
    if (this.currentTool) {
      const tool = toolManager.byType(this.currentTool);
      if (tool && tool.sketches) {
        return tool.getSketcher(this)!;
      }
    }
    return undefined;
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

  addShape(shape: Shape) {
    const ops: UndoableOp = {
      do: { type: 'add', shapeId: shape.id, data: shape },
      undo: { type: 'delete', shapeId: shape.id }
    };
    this.fireEvent('op', ops);
  }
}