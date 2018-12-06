import { BaseElement, html, element } from '../base-element.js';

@element('dac-tab')
export class DacTab extends BaseElement {
  render() {
    return html`
    <style>
      :host {
        display: inline-block;
        position: relative;
        border-top: 3px solid transparent;
        color: white;
        transition: border .1s ease-in;
      }
      :host(:hover) {
        border-color: var(--light-grey);
      }
      :host(.tab-selected) {
        background: var(--medium-grey);
        border-color: var(--highlight-pink);
      }
      :host ::slotted(*) {
        display: inline-block;
        background: transparent;
        border: none;
        padding: 10px 5px;
        font-size: 12px;
        letter-spacing: 1px;
        font-weight: 500;
        text-decoration: none;
        text-transform: uppercase;
        color: inherit;
        margin: 0 8px;
        outline: none;
        cursor: pointer;
      }
    </style>
    <slot></slot>
    `;
  }
}