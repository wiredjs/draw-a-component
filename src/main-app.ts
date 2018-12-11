import { BaseElement, html, element, property } from './base-element.js';
import { flexStyles } from './flex-styles.js';
import { UndoRedoElement } from './components/undo-redo.js';
import { model, UndoableOp } from './model.js';

import './components/dac-tab-bar';
import './components/dac-tab';
import './components/dac-icon';
import './designer/designer-view';
import './components/undo-redo.js';
import './designer/layers/layers-view';
import './designer/properties/property-list';

@element('main-app')
export class MainApp extends BaseElement {
  @property() selectedTab = 'design';
  @property() drawerTab = 'props';

  render() {
    const designOnly = this.selectedTab === 'design' ? '' : 'display: none;';
    const previewOnly = this.selectedTab === 'preview' ? '' : 'display: none;';
    const layersOnly = this.drawerTab === 'layers' ? '' : 'display: none;';
    const propsOnly = this.drawerTab === 'props' ? '' : 'display: none;';
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
        outline: none;
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
      #appControls button:active {
        color: var(--highlight-blue);
      }
      #drawerBuffer {
        min-width: 270px;
        width: 270px;
        height: 100%;
        overflow: hidden;
        background: var(--medium-grey);
      }
      .drawer {
        min-width: 270px;
        width: 270px;
        height: 100%;
        overflow: hidden;
        background: var(--medium-grey);
        position: absolute;
        top: 0;
        right: 0;
        transform: translate3d(0,0,0);
        transition: transform 0.3s ease-out;
      }
      #drawerGlass {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        display: none;
      }
      #bodyPanel {
        position: relative;
      }
      .hidden {
        display: none;
      }
      #openDrawer, #closeDrawer {
        position: absolute;
        top: 0;
        right: 0;
        padding: 7px 8px;
        cursor: pointer;
        color: white;
        display: none;
      }
      .drawerContent {
        overflow: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }

      @media (max-width: 1000px) {
        #drawerBuffer {
          display: none;
        }
        .drawer {
          transform: translate3d(280px,0,0);
        }
        .drawer.open {
          transform: translate3d(0,0,0);
        }
        #drawerGlass.open {
          display: block;
        }
        #openDrawer, #closeDrawer {
          display: block;
        }
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
    <div id="bodyPanel" class="flex horizontal layout">
      <div class="flex vertical layout">
        <div id="tabBar" class="horizontal layout center">
          <dac-tab-bar .selected="${this.selectedTab}" class="flex">
            <dac-tab name="design" @click="${this.tabClick}"><button>Design</button></dac-tab>
            <dac-tab name="preview" @click="${this.tabClick}"><button>Preview</button></dac-tab>
          </dac-tab-bar>
        </div>
        <main class="flex horizontal layout">
          <designer-view class="flex" style="${designOnly}" @op="${this.onUndoableOp}"></designer-view>
          <div class="flex" style="${previewOnly}">
            <p>Preview goes here</p>
          </div>
        </main>
      </div>
      <dac-icon style="${designOnly}" id="openDrawer" icon="more" @click="${this.openDrawer}" title="Properties and Shapes"></dac-icon>
      <div style="${designOnly}" id="drawerBuffer"></div>
      <div id="drawerGlass" @click="${this.closeDrawer}"></div>
      <div style="${designOnly}" class="drawer vertical layout">
        <dac-tab-bar .selected="${this.drawerTab}">
          <dac-tab name="props" @click="${this.drawerTabClick}"><button>Properties</button></dac-tab>
          <dac-tab name="layers" @click="${this.drawerTabClick}"><button>Shapes</button></dac-tab>
        </dac-tab-bar>
        <dac-icon id="closeDrawer" icon="close" @click="${this.closeDrawer}" title="Close"></dac-icon>
        <div class="flex drawerContent">
          <layers-view style="${layersOnly}" @op="${this.onUndoableOp}"></layers-view>
          <property-list style="${propsOnly}"></property-list>
        </div>
      </div>
    </div>

    <undo-redo @undo-state-change="${this.updateUndoState}"></undo-redo>
    `;
  }

  private get ur(): UndoRedoElement {
    return this.$$('undo-redo') as UndoRedoElement;
  }

  private tabClick(e: Event) {
    this.selectedTab = (e.currentTarget as HTMLElement).getAttribute('name') || 'design';
  }

  private drawerTabClick(e: Event) {
    this.drawerTab = (e.currentTarget as HTMLElement).getAttribute('name') || 'design';
  }

  private onUndoableOp(e: CustomEvent) {
    const uop = e.detail as UndoableOp;
    if (uop) {
      this.ur.push(uop);
      model.op(uop.do, false);
    }
  }

  private updateUndoState(e: CustomEvent) {
    const detail = e.detail;
    (this.$('undoBtn') as HTMLButtonElement).disabled = !detail.canUndo;
    (this.$('redoBtn') as HTMLButtonElement).disabled = !detail.canRedo;
  }

  private openDrawer() {
    this.$$('.drawer').classList.add('open');
    this.$('drawerGlass').classList.add('open');
  }

  private closeDrawer() {
    this.$$('.drawer').classList.remove('open');
    this.$('drawerGlass').classList.remove('open');
  }
}