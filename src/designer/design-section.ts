import { BaseElement, html, element, property } from '../base-element.js';
import { flexStyles } from '../flex-styles.js';
import './design-palette.js';

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
    </style>
    <design-palette .selected="${this.currentTool}" @select="${(e: CustomEvent) => { this.currentTool = e.detail.name; }}"></design-palette>
    <div class="flex"></div>
    `;
  }
}