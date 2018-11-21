import { BaseElement, html, element, property } from '../base-element.js';
import { flexStyles } from '../flex-styles.js';
import './design-palette.js';
import './design-slate';

@element('design-section')
export class DesignSection extends BaseElement {
  @property() currentTool = 'draw';

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
      <design-slate .currentTool="${this.currentTool}"></design-slate>
    </div>
    `;
  }
}