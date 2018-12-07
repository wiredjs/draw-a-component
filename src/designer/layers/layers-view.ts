import { BaseElement, html, element } from '../../base-element.js';
import './layer-item';

@element('layers-view')
export class LayersView extends BaseElement {
  render() {
    return html`
    <style>
      :host {
        display: block;
        color: white;
      }
    </style>
    <layer-item></layer-item>
    <layer-item></layer-item>
    <layer-item></layer-item>
    <layer-item></layer-item>
    `;
  }
}