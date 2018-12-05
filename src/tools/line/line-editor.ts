import { html, element } from '../../base-element.js';
import { ShapeEditor, baseStyles } from '../editor.js';
import { Point, normalizeLine } from '../../geometry';

type State = 'default' | 'moving' | 'r' | 'l';

@element('line-editor')
export class LineEditor extends ShapeEditor {
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
      .pTopLeft {
        top: -3px;
        left: -3px;
      }
      .pTopRight {
        top: -3px;
        right: -3px;
      }
      .pBottomRight {
        bottom: -3px;
        right: -3px;
      }
      .pBottomLeft {
        bottom: -3px;
        left: -3px;
      }
    </style>
    <svg></svg>
    <div id="overlay">
      <div id="pCenter" class="round"></div>
      <div id="pLeft" data-state="l" class="square"></div>
      <div id="pRight" data-state="r" class="square"></div>
    </div>
    `;
  }

  protected refreshControls(): void {
    super.refreshControls();
    if (this.shape) {
      const p1 = this.shape.points[0];
      const p2 = this.shape.points[1];
      if (p1[1] <= p2[1]) {
        this.$('pLeft').classList.add('pTopLeft');
        this.$('pLeft').classList.remove('pBottomLeft');
        this.$('pRight').classList.add('pBottomRight');
        this.$('pRight').classList.remove('pTopRight');
      } else {
        this.$('pLeft').classList.remove('pTopLeft');
        this.$('pLeft').classList.add('pBottomLeft');
        this.$('pRight').classList.remove('pBottomRight');
        this.$('pRight').classList.add('pTopRight');
      }
    }
  }

  protected normalizeShape() {
    normalizeLine(this.shadowShape!.points);
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

  private adjustMeta(d: Point, p0: Point): void {
    const angle = Math.abs((180 / Math.PI) * Math.atan((d[1] - p0[1]) / (d[0] - p0[0])));
    if (angle < 30) {
      d[1] = p0[1];
    } else if (angle > 60) {
      d[0] = p0[0];
    } else {
      const dx = d[0] - p0[0];
      const dy = d[1] - p0[1];
      const sign = (dx * dy) ? ((dx * dy) / Math.abs(dx * dy)) : 1;
      d[1] = p0[1] + sign * dx;
    }
  }

  protected overlayTrack(event: CustomEvent) {
    const p: Point = [event.detail.x, event.detail.y];
    const metaKey = !!(event.detail.sourceEvent && event.detail.sourceEvent.shiftKey);
    const diff: Point = [p[0] - this.originPoint![0], p[1] - this.originPoint![1]];
    switch (this.state) {
      case 'r': {
        const d: Point = [this.shape!.points[1][0] + diff[0], this.shape!.points[1][1] + diff[1]];
        if (metaKey) {
          this.adjustMeta(d, this.shape!.points[0]);
        }
        this.shadowShape!.points[1] = d;
        this.microTaskRedraw();
        break;
      }
      case 'l': {
        const d: Point = [this.shape!.points[0][0] + diff[0], this.shape!.points[0][1] + diff[1]];
        if (metaKey) {
          this.adjustMeta(d, this.shape!.points[1]);
        }
        this.shadowShape!.points[0] = d;
        this.microTaskRedraw();
        break;
      }
      default:
        super.overlayTrack(event);
        break;
    }
  }
}