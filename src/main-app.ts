import { BaseElement, html, element, property } from './base-element.js';
import { flexStyles } from './flex-styles.js';
import { UndoableOp, Op } from './ops.js';
import { UndoRedoElement } from './components/undo-redo.js';
import { DesignerView } from './designer/designer-view';
import './components/dac-tab-bar';
import './components/dac-tab';
import './components/dac-icon';
import './designer/designer-view';
import './components/undo-redo.js';

@element('main-app')
export class MainApp extends BaseElement {
  @property() selectedTab = 'design';

  render() {
    return html`
    ${flexStyles}
    <style>
      :host {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
      }
      #toolbar {
        padding: 0 16px;
        background-color: var(--almost-black);
        color: white;
        height: 50px;
        font-size: 18px;
        letter-spacing: 0.05em;
      }
      #tabBar {
        background-color: var(--dark-grey);
      }
      button {
        background: transparent;
        color: white;
        border: none;
        cursor: pointer;
      }
      button[disabled] {
        opacity: 0.3;
        pointer-events: none;
      }
      #appControls button {
        transition: all .05s ease-in;
      }
      #appControls button:hover {
        transform: scale(1.1);
      }
    </style>
    <div id="toolbar" class="horizontal layout center">
      <div class="flex">Draw A Component</div>
      <div id="appControls">
        <button id="undoBtn" disabled title="Undo" @click="${() => this.ur.undo()}">
          <dac-icon icon="undo"></dac-icon>
          <div>Undo</div>
        </button>
        <button id="redoBtn" disabled title="Redo" @click="${() => this.ur.redo()}">
          <dac-icon icon="redo"></dac-icon>
          <div>Redo</div>
        </button>
        <button id="downloadBtn" disabled title="Download component">
          <dac-icon icon="download"></dac-icon>
          <div>Save</div>
        </button>
      </div>
    </div>
    <div id="tabBar" class="horizontal layout center">
      <dac-tab-bar .selected="${this.selectedTab}" class="flex">
        <dac-tab name="design" @click="${this.tabClick}"><button>Design</button></dac-tab>
        <dac-tab name="preview" @click="${this.tabClick}"><button>Preview</button></dac-tab>
      </dac-tab-bar>
    </div>
    <main class="flex horizontal layout">
      <designer-view class="flex" style="${this.selectedTab === 'design' ? '' : 'display: none;'}" @op="${this.onOp}"></designer-view>
      <div class="flex" style="${this.selectedTab === 'preview' ? '' : 'display: none;'}">
        <p>Preview goes here</p>
      </div>
    </div>
    <undo-redo @do-op="${this.doOp}" @undo-state-change="${this.updateUndoState}"></undo-redo>
    `;
  }

  private get ur(): UndoRedoElement {
    return this.$$('undo-redo') as UndoRedoElement;
  }

  private get designer(): DesignerView {
    return this.$$('designer-view') as DesignerView;
  }

  private tabClick(e: Event) {
    this.selectedTab = (e.currentTarget as HTMLElement).getAttribute('name') || 'design';
  }

  private onOp(e: CustomEvent) {
    const uop = e.detail as UndoableOp;
    if (uop) {
      this.ur.push(uop);
    }
  }

  private doOp(e: CustomEvent) {
    const op = e.detail as Op;
    if (op) {
      this.designer.doOp(op);
    }
  }

  private updateUndoState(e: CustomEvent) {
    const detail = e.detail;
    (this.$('undoBtn') as HTMLButtonElement).disabled = !detail.canUndo;
    (this.$('redoBtn') as HTMLButtonElement).disabled = !detail.canRedo;
  }
}