import { BaseElement, html, element, property } from '../base-element.js';

@element('dac-toggle')
export class DacToggle extends BaseElement {
  @property() checked = false;

  render() {
    return html`
    <style>
      :host {
        display: inline-block;
        position: relative;
        width: 36px;
        height: 14px;
        margin: 4px 1px;
      }
      .toggle-bar {
        position: absolute;
        height: 100%;
        width: 100%;
        border-radius: 8px;
        pointer-events: none;
        opacity: 0.4;
        transition: background-color linear .08s;
        background-color: #000;
      }
      :host(.checked) .toggle-bar {
        opacity: 0.5;
        background-color: var(--highlight-blue);
      }
      .toggle-button {
        position: absolute;
        top: -3px;
        left: 0;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
        transition: transform linear .08s, background-color linear .08s;
        will-change: transform;
        background-color: rgb(250, 250, 250);
      }
      :host(:checked) .toggle-button {
        transform: translate(16px, 0);
        background-color: var(--highlight-blue);
      }
    </style>
    <div class="toggle-bar"><div class="toggle-button"></div></div>
    `;
  }

  updated() {
    if (this.checked) {
      this.classList.add('checked');
    } else {
      this.classList.remove('checked');
    }
  }
}