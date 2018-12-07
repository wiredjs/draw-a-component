import { BaseElement, html, element } from '../../base-element.js';
import { flexStyles } from '../../flex-styles.js';
import '../../components/dac-icon';

@element('layer-item')
export class LayerItem extends BaseElement {
  render() {
    return html`
    ${flexStyles}
    <style>
      :host {
        display: block;
        font-size: 12px;
        letter-spacing: 1px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      .name {
        padding: 0 8px;
      }
      .dotContainer {
        padding: 12px 8px;
        cursor: pointer;
      }
      .dot {
        height: 6px;
        width: 6px;
        border: 1px solid;
        border-radius: 50%;
      }
      dac-icon {
        padding: 8px;
        width: 16px;
        height: 16px;
        cursor: pointer;
        border-right: 1px solid rgba(255,255,255,0.1);
      }
    </style>
    <div class="horizontal layout center">
      <dac-icon icon="eye"></dac-icon>
      <div class="name flex">Shape name</div>
      <div class="dotContainer">
        <div class="dot"></div>
      </div>
    </div>
    `;
  }
}