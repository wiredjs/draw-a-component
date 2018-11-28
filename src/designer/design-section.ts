import { BaseElement, html, element, property } from '../base-element.js';
import { flexStyles } from '../flex-styles.js';
import { Shape, ToolType } from './design-tool.js';
import { DesignCanvas } from './design-canvas';
import './design-palette.js';
import './design-slate';
import './design-canvas';

@element('design-section')
export class DesignSection extends BaseElement {
  @property() currentTool: ToolType = 'pencil';

  render() {
    return html`
    ${flexStyles}
    <style>
      :host {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
      }
      design-slate {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    </style>
    <design-palette .selected="${this.currentTool}" @select="${(e: CustomEvent) => { this.currentTool = e.detail.name; }}"></design-palette>
    <div class="flex" style="position: relative;">
      <design-canvas id="dc" ></design-canvas>
      <design-slate .currentTool="${this.currentTool}" @shape="${this.addShape}"></design-slate>
    </div>
    `;
  }

  get canvas(): DesignCanvas {
    return this.$('dc') as DesignCanvas;
  }

  private addShape(e: CustomEvent) {
    const shape = e.detail as Shape;
    if (shape) {
      this.canvas.addShape(shape);
    }
  }
}