import { BaseElement, html, element, property } from '../../base-element.js';
import { flexStyles } from '../../flex-styles.js';
import { Layer, model } from '../../model';
import '../../components/dac-icon';

@element('layer-item')
export class LayerItem extends BaseElement {
  @property() layer?: Layer;

  render() {
    if (!this.layer) return html``;
    return html`
    ${flexStyles}
    <style>
      :host {
        display: block;
        font-size: 12px;
        letter-spacing: 1px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        user-select: none;
      }
      .name {
        padding: 0 8px;
        text-transform: capitalize;
      }
      dac-icon {
        padding: 8px;
        width: 16px;
        height: 16px;
        cursor: pointer;
        border-right: 1px solid rgba(255,255,255,0.1);
      }
      .transparent {
        color: transparent;
      }
    </style>
    <div class="horizontal layout center">
      <dac-icon icon="eye" class="${this.layer.visible ? '' : 'transparent'}" @click="${this.toggleVisibility}"></dac-icon>
      <div class="name flex">${this.layer.shape.type}</div>
    </div>
    `;
  }

  private toggleVisibility() {
    if (this.layer) {
      this.layer.visible = !this.layer.visible;
      model.setLayerVisibility(this.layer.shape.id, this.layer.visible);
      this.requestUpdate();
    }
  }
}