import { BaseElement, html, element, property } from '../base-element.js';
import { flexStyles } from '../flex-styles.js';
import { Shape, ToolType, toolManager } from './design-tool.js';
import { DesignCanvas } from './design-canvas';
import { PropertyValues } from '@polymer/lit-element';
import './design-palette.js';
import './design-slate';
import './design-canvas';

@element('design-section')
export class DesignSection extends BaseElement {
  @property() currentTool: ToolType = 'pencil';
  @property() selectedShape: Shape | null = null;

  render() {
    const slateClass = (this.currentTool === 'select') ? 'hidden' : '';
    return html`
    ${flexStyles}
    <style>
      :host {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
      }
      design-slate {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .hidden {
        display: none;
      }
      #editorPanel * {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    </style>
    <design-palette .selected="${this.currentTool}" @select="${(e: CustomEvent) => { this.currentTool = e.detail.name; }}"></design-palette>
    <div class="flex" style="position: relative;">
      <design-canvas .selected="${this.selectedShape ? this.selectedShape.id : null}" id="dc" @select="${this.onSelect}"></design-canvas>
      <design-slate .currentTool="${this.currentTool}" class="${slateClass}" @shape="${this.addShape}"></design-slate>
      <div id="editorPanel" class="hidden" @update-shape="${this.updateShape}"></div>
    </div>
    `;
  }

  get canvas(): DesignCanvas {
    return this.$('dc') as DesignCanvas;
  }

  private addShape(e: CustomEvent) {
    const shape = e.detail as Shape;
    if (shape) {
      this.canvas.addShape(shape);
    }
  }

  private updateShape(e: CustomEvent) {
    const shape = e.detail as Shape;
    if (shape) {
      this.canvas.updateShape(shape);
    }
  }

  private onSelect(e: CustomEvent) {
    const shape = e.detail as Shape;
    if (shape) {
      this.selectedShape = shape;
    } else {
      this.selectedShape = null;
    }
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('selectedShape')) {
      this.refreshEditor();
    }
  }

  private refreshEditor() {
    let editor: HTMLElement | null = null;
    if (this.selectedShape) {
      const tool = toolManager.byType(this.selectedShape.type);
      editor = tool.editor(this.selectedShape);
    }
    const ep = this.$('editorPanel');
    if (editor) {
      ep.classList.remove('hidden');
      while (ep.lastChild) {
        ep.removeChild(ep.lastChild);
      }
      ep.appendChild(editor);
    } else {
      ep.classList.add('hidden');
    }
  }
}