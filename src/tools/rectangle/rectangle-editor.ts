import { html, element } from '../../base-element.js';
import { ShapeEditor, baseStyles } from '../editor.js';
import { Point, normalizeRect } from '../../geometry';

type State = 'default' | 'moving' | 'tl' | 't' | 'tr' | 'r' | 'br' | 'b' | 'bl' | 'l';

@element('rectangle-editor')
export class RectangleEditor extends ShapeEditor {
  render() {
    return html`
    ${baseStyles}
    <style>
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
      <div id="pTopLeft" data-state="tl" class="square"></div>
      <div id="pTopRight"  data-state="tr" class="square"></div>
      <div id="pBottomRight" data-state="br" class="square"></div>
      <div id="pBottomLeft" data-state="bl" class="square"></div>
      <div id="pTop" data-state="t" class="square"></div>
      <div id="pBottom" data-state="b" class="square"></div>
      <div id="pLeft" data-state="l" class="square"></div>
      <div id="pRight" data-state="r" class="square"></div>
    </div>
    `;
  }

  protected overlayDown(event: CustomEvent) {
    if (this.state === 'default') {
      const targetState = (event.target as HTMLElement).dataset.state;
      if (targetState) {
        this.state = targetState as State;
        this.originPoint = [event.detail.x, event.detail.y];
      } else {
        super.overlayDown(event);
      }
    }
  }

  protected overlayTrack(event: CustomEvent) {
    const p: Point = [event.detail.x, event.detail.y];
    switch (this.state) {
      case 't': {
        const dy = p[1] - this.originPoint![1];
        this.shadowShape!.points[0][1] = this.shape!.points[0][1] + dy;
        this.microTaskRedraw();
        break;
      }
      case 'b': {
        const dy = p[1] - this.originPoint![1];
        this.shadowShape!.points[1][1] = this.shape!.points[1][1] + dy;
        this.microTaskRedraw();
        break;
      }
      case 'r': {
        const dx = p[0] - this.originPoint![0];
        this.shadowShape!.points[1][0] = this.shape!.points[1][0] + dx;
        this.microTaskRedraw();
        break;
      }
      case 'l': {
        const dx = p[0] - this.originPoint![0];
        this.shadowShape!.points[0][0] = this.shape!.points[0][0] + dx;
        this.microTaskRedraw();
        break;
      }
      case 'tl': {
        const diff: Point = [p[0] - this.originPoint![0], p[1] - this.originPoint![1]];
        this.shadowShape!.points[0][0] = this.shape!.points[0][0] + diff[0];
        this.shadowShape!.points[0][1] = this.shape!.points[0][1] + diff[1];
        this.microTaskRedraw();
        break;
      }
      case 'tr': {
        const diff: Point = [p[0] - this.originPoint![0], p[1] - this.originPoint![1]];
        this.shadowShape!.points[1][0] = this.shape!.points[1][0] + diff[0];
        this.shadowShape!.points[0][1] = this.shape!.points[0][1] + diff[1];
        this.microTaskRedraw();
        break;
      }
      case 'bl': {
        const diff: Point = [p[0] - this.originPoint![0], p[1] - this.originPoint![1]];
        this.shadowShape!.points[0][0] = this.shape!.points[0][0] + diff[0];
        this.shadowShape!.points[1][1] = this.shape!.points[1][1] + diff[1];
        this.microTaskRedraw();
        break;
      }
      case 'br': {
        const diff: Point = [p[0] - this.originPoint![0], p[1] - this.originPoint![1]];
        this.shadowShape!.points[1][0] = this.shape!.points[1][0] + diff[0];
        this.shadowShape!.points[1][1] = this.shape!.points[1][1] + diff[1];
        this.microTaskRedraw();
        break;
      }
      default:
        super.overlayTrack(event);
        break;
    }
  }

  protected normalizeShape() {
    normalizeRect(this.shadowShape!.points);
  }
}