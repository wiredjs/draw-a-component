import { BaseElement, html, element, property } from '../base-element.js';
import { Shape } from './design-tool.js';

@element('design-canvas')
export class DesignCanvas extends BaseElement {
  @property() shapes: Shape[] = [];

  render() {
    return html`
    <style>
      :host {
        display: block;
        position: relative;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }
      svg {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
    </style>
    <svg></svg>
    `;
  }

  private clearSvg() {
    const svg = this.$$('svg');
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
  }

  updated() {
    this.clearSvg();
    // this.shapes.forEach((s) => {
    // });
  }

}