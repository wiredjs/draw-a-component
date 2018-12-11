import { BaseElement, html, element, property } from '../base-element.js';
import { flexStyles } from '../flex-styles.js';
import { toolManager } from './design-tool.js';
import { Selector } from '../tools/selector/selector.js';
import { Pencil } from '../tools/pencil/pencil.js';
import { Rectangle } from '../tools/rectangle/rectangle.js';
import { Ellipse } from '../tools/ellipse/ellipse.js';
import { Line } from '../tools/line/line.js';
import { ToolType } from './designer-common.js';
import { model, Layer } from '../model';
import { bus } from '../bus';

import './design-palette.js';
import './design-slate';
import './design-canvas';

@element('designer-view')
export class DesignerView extends BaseElement {
  @property() currentTool: ToolType = model.toolType;

  constructor() {
    super();
    toolManager.initialize([
      new Selector(),
      new Pencil(),
      new Rectangle(),
      new Ellipse(),
      new Line()
    ]);
  }

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
        overflow: hidden;
      }
    </style>
    <design-palette .selected="${this.currentTool}"></design-palette>
    <div class="flex" style="position: relative;">
      <design-canvas></design-canvas>
      <design-slate .currentTool="${this.currentTool}" class="${slateClass}"></design-slate>
      <div id="editorPanel" class="hidden"></div>
    </div>
    `;
  }

  firstUpdated() {
    bus.subscribe('select', (_, d) => {
      const selectedShape = (d.layer && (d.layer as Layer).shape) || null;
      let editor: HTMLElement | null = null;
      if (selectedShape) {
        const tool = toolManager.byType(selectedShape.type);
        editor = tool.editor(selectedShape);
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
    });

    bus.subscribe('tool-select', (_, d) => {
      this.currentTool = d.type || 'pencil';
    });
  }

  // private doOp(op: Op, skipSelection?: boolean) {
  //   let s: Shape | null = op.shape;
  //   switch (op.type) {
  //     case 'add':
  //       this.canvas.addShape(s);
  //       break;
  //     case 'delete':
  //       this.selectedShape = null;
  //       this.canvas.deleteShape(s);
  //       s = null;
  //       break;
  //     case 'update':
  //       this.canvas.updateShape(s);
  //       break;
  //     default:
  //       s = null;
  //       break;
  //   }
  //   if (s && (!skipSelection) && (this.currentTool === 'select')) {
  //     this.selectedShape = s;
  //   }
  // }
}