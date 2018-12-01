import { BaseElement, html, element, property } from '../../base-element.js';
import { Shape } from '../../designer/design-tool';

@element('line-editor')
export class LineEditor extends BaseElement {
  @property() shape?: Shape;

  render() {
    return html`
    <style>
      :host {
        display: block;
        background: rgba(0,0,0,0.2);
      }
    </style>
    `;
  }
}