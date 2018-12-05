import { html, element } from '../../base-element.js';
import { ShapeEditor, baseStyles } from '../editor.js';
import { Point } from '../../geometry';

type State = 'default' | 'moving' | 'tl' | 't' | 'tr' | 'r' | 'br' | 'b' | 'bl' | 'l';

@element('pencil-editor')
export class PencilEditor extends ShapeEditor {
  private min: Point = [0, 0];
  private max: Point = [0, 0];

  render() {
    return html`
    ${baseStyles}
    <style>
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

  protected refreshControls(): void {
    const overlay = this.$('overlay');
    if (this.shape) {
      overlay.classList.remove('hidden');
      let min: Point = [0, 0];
      let max: Point = [0, 0];
      this.shape.points.forEach((p, i) => {
        if (i) {
          min = [Math.min(p[0], min[0]), Math.min(p[1], min[1])];
          max = [Math.max(p[0], max[0]), Math.max(p[1], max[1])];
        } else {
          min = [p[0], p[1]];
          max = [p[0], p[1]];
        }
      });
      const ostyle = overlay.style;
      ostyle.left = `${min[0]}px`;
      ostyle.top = `${min[1]}px`;
      ostyle.width = `${max[0] - min[0]}px`;
      ostyle.height = `${max[1] - min[1]}px`;
      this.min = min;
      this.max = max;
    } else {
      overlay.classList.add('hidden');
    }
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
        break;
      }
      case 'b': {
        const dy = (p[1] - this.originPoint![1]) / ((this.max[1] - this.min[1]) || 1);
        console.log(dy);
        break;
      }
      case 'r': {
        break;
      }
      case 'l': {
        break;
      }
      case 'tl': {
        break;
      }
      case 'tr': {
        break;
      }
      case 'bl': {
        break;
      }
      case 'br': {
        break;
      }
      default:
        super.overlayTrack(event);
        break;
    }
  }

  protected normalizeShape() { }
}