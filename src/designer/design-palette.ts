import { BaseElement, html, element } from '../base-element.js';
import { toolManager } from './design-tool-manager.js';
import { property } from '@polymer/lit-element';
import { ToolInfo } from './design-tool.js';
import { repeat } from 'lit-html/directives/repeat';
import '../components/dac-icon.js';

@element('design-palette')
export class DesignPalette extends BaseElement {
  @property() tools: ToolInfo[];
  @property() selected: string = '';

  constructor() {
    super();
    this.tools = toolManager.tools;
  }

  render() {
    return html`
    <style>
      :host {
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        width: 65px;
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
      }
      button:hover {
        color: var(--highlight-blue);
      }
      button.selected {
        background: var(--highlight-blue);
        color: white;
      }
    </style>
    ${repeat(
        this.tools,
        (d) => d.name,
        (d) => {
          return html`
            <div>
              <button name="${d.name}" title="${d.title}" class="${this.selected === d.name ? 'selected' : ''}" @click="${() => this.fireEvent('select', { name: d.name })}">
                <dac-icon .icon="${d.icon}"></dac-icon>
                <div>${d.name}</div>
              </button>
            </div>
          `;
        })}
    `;
  }
}