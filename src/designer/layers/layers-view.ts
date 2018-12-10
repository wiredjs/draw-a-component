import { BaseElement, html, element } from '../../base-element.js';
import { repeat } from 'lit-html/directives/repeat';
import { model } from '../../model';
import { bus } from '../../bus.js';
import './layer-item';

@element('layers-view')
export class LayersView extends BaseElement {
  render() {
    const layers = model.layers;
    return html`
    <style>
      :host {
        display: block;
        color: white;
      }
    </style>
    ${repeat(
        layers,
        (l) => l.shape.id,
        (l) => html`<layer-item .layer="${l}"></layer-item>`
      )}
    `;
  }

  firstUpdated() {
    bus.subscribe('new-shape', () => this.requestUpdate());
    bus.subscribe('delete-shape', () => this.requestUpdate());
  }
}