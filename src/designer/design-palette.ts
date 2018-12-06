import { BaseElement, html, element } from '../base-element.js';
import { property } from '@polymer/lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { toolManager } from './design-tool.js';
import { Tool } from './designer-common.js';
import '../components/dac-icon.js';

@element('design-palette')
export class DesignPalette extends BaseElement {
  @property() tools: Tool[];
  @property() selected: string = '';

  constructor() {
    super();
    this.tools = toolManager.list;
  }

  render() {
    return html`
    <style>
      :host {
        position: relative;
        width: 50px;
        background: var(--medium-grey);
        color: white;
      }
      button {
        background: transparent;
        color: white;
        border: none;
        cursor: pointer;
        outline: none;
        width: 100%;
        padding: 12px 2px;
        box-sizing: border-box;
        text-transform: capitalize;
        letter-spacing: 0.05em;
        transition: color 0.1s ease, background 0.1s ease;
        position: relative;
      }
      button:hover {
        color: var(--highlight-blue);
      }
      button.selected {
        background: var(--highlight-blue);
        color: white;
      }
      button .buttonName {
        display: none;
        position: absolute;
        top: 50%;
        left: 100%;
        background: var(--medium-grey);
        padding: 8px 6px 8px 2px;
        line-height: 1;
        border-radius: 0 3px 3px 0;
        margin-top: -13px;
        color: white;
      }
      button:hover .buttonName {
        display: block;
      }
      button.selected:hover .buttonName {
        background: var(--highlight-blue);
        color: white;
      }
    </style>
    ${repeat(
        this.tools,
        (d) => d.type,
        (d) => {
          return html`
            <div>
              <button name="${d.type}" class="${this.selected === d.type ? 'selected' : ''}" @click="${() => this.fireEvent('select', { name: d.type })}">
                <dac-icon .icon="${d.icon}"></dac-icon>
                <div class="buttonName">${d.type}</div>
              </button>
            </div>
          `;
        })}
    `;
  }
}