import { html, element } from '../../base-element.js';
import { ShapeEditor, baseStyles } from '../editor.js';
import { normalizeLine } from '../../utils';
import { Point } from '../../designer/design-common';

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

  protected overlayTrack(event: CustomEvent) {
    const p: Point = [event.detail.x, event.detail.y];
    switch (this.state) {
      case 'r': {
        const diff: Point = [p[0] - this.originPoint![0], p[1] - this.originPoint![1]];
        this.shadowShape!.points[1][0] = this.shape!.points[1][0] + diff[0];
        this.shadowShape!.points[1][1] = this.shape!.points[1][1] + diff[1];
        this.microTaskRedraw();
        break;
      }
      case 'l': {
        const diff: Point = [p[0] - this.originPoint![0], p[1] - this.originPoint![1]];
        this.shadowShape!.points[0][0] = this.shape!.points[0][0] + diff[0];
        this.shadowShape!.points[0][1] = this.shape!.points[0][1] + diff[1];
        this.microTaskRedraw();
        break;
      }
      default:
        super.overlayTrack(event);
        break;
    }
  }
}