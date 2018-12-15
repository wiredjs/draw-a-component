import { BaseElement, html, element, property } from '../base-element.js';
import { model } from '../model.js';
import { bus } from '../bus.js';

import './dac-icon';
import './color-block';

@element('color-input')
export class ColorInput extends BaseElement {
  @property() selected = 'bg';
  @property() bgColor = 'transparent';
  @property() fgColor = '#000000';

  render() {
    return html`
    <style>
      :host {
        display: block;
        border-top: 1px solid rgba(255,255,255,0.1);
        position: relative;
        padding: 24px 0;
        margin-top: 10px;
      }
      #main {
        position: relative;
        height: 54px;
      }
      .selected {
        z-index: 1;
      }
      #fg, #bg {
        position: absolute;
      }
      #bg {
        top: 4px;
        left: 3px;
      }
      #fg {
        top: 21px;
        right: 3px;
      }
      #fgblocker {
        position: absolute;
        top: 50%;
        left: 50%;
        background-color: var(--medium-grey);
        border: 1px solid #bbb;
        width: 16px;
        height: 16px;
        transform: translate3d(-9px,-9px,0);
      }
      input[type="color"] {
        position: absolute;
        width: 32px;
        height: 32px;
        border: none;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        opacity: 0;
        top: -1px;
        left: -1px;
      }
      #swap {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        padding: 2px;
        cursor: pointer;
        opacity: 0.8;
      }
      #reset {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 20px;
        height: 20px;
        padding: 2px;
        cursor: pointer;
        opacity: 0.8;
      }
    </style>
    <div id="main">
      <color-block id="bg" .color="${this.bgColor}" title="Fill color" class="${this.selected === 'bg' ? 'selected' : ''}" @click="${() => this.selected = 'bg'}">
        <input id="bgColor" type="color" value="${this.bgColor}" @input="${this.onFillChange}">
      </color-block>
      <color-block id="fg" .color="${this.fgColor}" title="Stroke color" @click="${() => this.selected = 'fg'}">
        <div id="fgblocker"></div>
        <input id="fgColor" type="color" value="${this.fgColor}" @input="${this.onStrokeChange}">
      </color-block>
    </div>
    <dac-icon id="swap" icon="swap" title="Swap fill & stroke colors" @click="${this.swapColors}"></dac-icon>
    <dac-icon id="reset" icon="reset-colors" title="Default fill & strok colors" @click="${this.defaultColors}"></dac-icon>
    `;
  }

  firstUpdated() {
    this.refreshColors();
    bus.subscribe('style-props', () => this.refreshColors());
  }

  private onFillChange() {
    model.fill = (this.$('bgColor') as HTMLInputElement).value;
  }

  private onStrokeChange() {
    model.stroke = (this.$('fgColor') as HTMLInputElement).value;
  }

  private swapColors() {
    const obg = model.fill;
    model.fill = model.stroke;
    model.stroke = obg;
  }

  private defaultColors() {
    model.fill = 'transparent';
    model.stroke = '#000000';
  }

  private refreshColors() {
    this.bgColor = model.fill;
    this.fgColor = model.stroke;
  }
}