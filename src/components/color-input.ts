import { BaseElement, html, element, property } from '../base-element.js';
import { model } from '../model.js';
import { bus } from '../bus.js';

import './dac-icon';

@element('color-input')
export class ColorInput extends BaseElement {
  @property() selected = 'bg';

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
      #bg {
        height: 30px;
        width: 30px;
        position: absolute;
        top: 4px;
        left: 3px;
        background-color: var(--draw-color-bg);
        border: 1px solid rgba(255,255,255,0.3);
      }
      #fg {
        height: 16px;
        width: 16px;
        position: absolute;
        top: 21px;
        right: 3px;
        border: 8px solid;
        background: var(--medium-grey);
        border-color: var(--draw-color-fg);
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
      }
      #fgColor {
        top: -8px;
        left: -8px;
      }
      #bgColor {
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
      <div id="bg" title="Fill color" class="${this.selected === 'bg' ? 'selected' : ''}" @click="${() => this.selected = 'bg'}">
        <input id="bgColor" type="color" @input="${this.onBgChange}">
      </div>
      <div id="fg" title="Stroke color" @click="${() => this.selected = 'fg'}">
        <input id="fgColor" type="color" @input="${this.onFgChange}">
      </div>
    </div>
    <dac-icon id="swap" icon="swap" title="Swap fill & stroke colors" @click="${this.swapColors}"></dac-icon>
    <dac-icon id="reset" icon="reset-colors" title="Default fill & strok colors" @click="${this.defaultColors}"></dac-icon>
    `;
  }

  firstUpdated() {
    this.refreshColors();
    bus.subscribe('colors', () => this.refreshColors());
  }

  private onBgChange() {
    model.bgColor = (this.$('bgColor') as HTMLInputElement).value;
  }

  private onFgChange() {
    model.fgColor = (this.$('fgColor') as HTMLInputElement).value;
  }

  private swapColors() {
    const obg = model.bgColor;
    model.bgColor = model.fgColor;
    model.fgColor = obg;
  }

  private defaultColors() {
    model.bgColor = 'transparent';
    model.fgColor = '#000000';
  }

  private refreshColors() {
    const bgColor = this.$('bgColor') as HTMLInputElement;
    const fgColor = this.$('fgColor') as HTMLInputElement;
    if (bgColor && fgColor) {
      bgColor.value = model.bgColor;
      fgColor.value = model.fgColor;
    }
    this.style.setProperty('--draw-color-bg', model.bgColor);
    this.style.setProperty('--draw-color-fg', model.fgColor);
  }
}