import { BaseElement, html, element, property } from '../base-element.js';

@element('dac-icon')
export class DacIcon extends BaseElement {
  @property({ type: String }) icon?: string;
  private static readonly Icons: { [name: string]: string } = {
    undo: 'M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z',
    redo: 'M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z',
    download: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
    pen: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    box: 'M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z',
    circle: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
    line: 'M 20.293 2.29297 L 2.29297 20.293 L 3.70703 21.707 L 21.707 3.70703 L 20.293 2.29297 Z',
    pointer: 'M7,2l12,11.2l-5.8,0.5l3.3,7.3l-2.2,1l-3.2-7.4L7,18.5V2',
    polygon: 'M 20 2 A 2 2 0 0 0 18.0352 3.625 L 14.4688 4.64453 A 2 2 0 0 0 13 4 A 2 2 0 0 0 11 6 A 2 2 0 0 0 12.9941 8 L 16.3984 14.8066 A 2 2 0 0 0 16.3398 14.8848 L 11.8809 14.3281 A 2 2 0 0 0 10 13 A 2 2 0 0 0 8 15 A 2 2 0 0 0 8.05273 15.4512 L 4.79492 18.166 A 2 2 0 0 0 4 18 A 2 2 0 0 0 2 20 A 2 2 0 0 0 4 22 A 2 2 0 0 0 6 20 A 2 2 0 0 0 5.94727 19.5488 L 9.20508 16.834 A 2 2 0 0 0 10 17 A 2 2 0 0 0 11.6602 16.1152 L 16.1191 16.6719 A 2 2 0 0 0 18 18 A 2 2 0 0 0 20 16 A 2 2 0 0 0 18.0059 14 L 14.6016 7.19336 A 2 2 0 0 0 14.9648 6.375 L 18.5313 5.35547 A 2 2 0 0 0 20 6 A 2 2 0 0 0 22 4 A 2 2 0 0 0 20 2 Z'
  };

  render() {
    const path = DacIcon.Icons[this.icon || ''] || '';
    return html`
    <style>
      :host {
        display: -ms-inline-flexbox;
        display: -webkit-inline-flex;
        display: inline-flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        position: relative;
        vertical-align: middle;
        fill: currentColor;
        stroke: none;
        width: 24px;
        height: 24px;
        box-sizing: initial;
      }
    
      svg {
        pointer-events: none;
        display: block;
        width: 100%;
        height: 100%;
      }
    </style>
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g>
        <path d="${path}"></path>
      </g>
    </svg>
    `;
  }
}