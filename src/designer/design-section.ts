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
  @property() selectedShape: string | null = null;

  render() {
    const slateClass = (this.currentTool === 'select') ? 'hidden' : '';
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
      .hidden {
        display: none;
      }
    </style>
    <design-palette .selected="${this.currentTool}" @select="${(e: CustomEvent) => { this.currentTool = e.detail.name; }}"></design-palette>
    <div class="flex" style="position: relative;">
      <design-canvas .selected="${this.selectedShape}" id="dc" @select="${this.onSelect}"></design-canvas>
      <design-slate .currentTool="${this.currentTool}" class="${slateClass}" @shape="${this.addShape}"></design-slate>
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

  private onSelect(e: CustomEvent) {
    const shape = e.detail as Shape;
    if (shape) {
      this.selectedShape = shape.id;
    } else {
      this.selectedShape = null;
    }
  }
}