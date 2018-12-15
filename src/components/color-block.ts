import { BaseElement, html, element, property } from '../base-element.js';

@element('color-block')
export class ColorBlock extends BaseElement {
  @property() color = 'transparent';

  render() {
    const c = this.color || 'transparent';
    return html`
    <style>
      :host {
        display: block;
        height: 30px;
        width: 30px;
        overflow: hidden;
        background-color: white;
        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M1 2V0h1v1H0v1z" fill-opacity="0.1"/></svg>');
        background-size: 15px 15px;
        border: 1px solid rgba(255,255,255,0.2);
        position: relative;
      }
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    </style>
    <div class="overlay" title="${c}" style="${`background: ${c};`}"><slot></slot></div>
    `;
  }
}