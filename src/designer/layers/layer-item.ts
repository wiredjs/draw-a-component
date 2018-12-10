import { BaseElement, html, element, property } from '../../base-element.js';
import { flexStyles } from '../../flex-styles.js';
import { Layer, UndoableOp } from '../../model';
import { bus } from '../../bus';
import '../../components/dac-icon';

@element('layer-item')
export class LayerItem extends BaseElement {
  @property() layer?: Layer;
  private listenerToken?: number;

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
      const data = !this.layer.visible;
      const ops: UndoableOp = {
        do: { type: 'visibility', shapeId: this.layer.shape.id, data },
        undo: { type: 'visibility', shapeId: this.layer.shape.id, data: !data }
      };
      this.fireEvent('op', ops);
    }
  }

  private disconnectBus() {
    if (this.listenerToken) {
      bus.unsubscrive('layer-visibility', this.listenerToken);
      delete this.listenerToken;
    }

  }

  connectedCallback() {
    super.connectedCallback();
    this.disconnectBus();
    this.listenerToken = bus.subscribe('layer-visibility', (_, l: Layer) => {
      if (this.layer && (this.layer.shape.id === l.shape.id)) {
        this.layer.visible = l.visible;
        this.requestUpdate();
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.disconnectBus();
  }
}