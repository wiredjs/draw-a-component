import { BaseElement, html, element, property } from '../base-element.js';

@element('dac-tab-bar')
export class DacTabBar extends BaseElement {
  @property({ type: String }) selected = '';
  private prevSelectedTab?: HTMLElement;
  private static readonly selectedClass = 'tab-selected';

  render() {
    return html`
    <style>
      :host {
        display: block;
        background-color: var(--dark-grey);
        text-transform: uppercase;
        width: 100%;
        box-sizing: border-box;
      }
      #container {
        position: relative;
        width: 100%;
        box-sizing: border-box;
      }
    </style>
    <div id="container"><slot></slot></div>
    `;
  }

  updated() {
    if (this.selected) {
      const matches = (this.$$('slot') as HTMLSlotElement).assignedNodes().filter((d) => {
        if (d.nodeType === Node.ELEMENT_NODE) {
          return (d as HTMLElement).getAttribute('name') === this.selected;
        }
        return false;
      });
      if (matches.length) {
        const selectedTab = matches[0] as HTMLElement;
        if (selectedTab !== this.prevSelectedTab) {
          if (this.prevSelectedTab) {
            this.prevSelectedTab.classList.remove(DacTabBar.selectedClass);
          }
          selectedTab.classList.add(DacTabBar.selectedClass);
          this.prevSelectedTab = selectedTab;
        }
        return;
      }
    }
    if (this.prevSelectedTab) {
      this.prevSelectedTab.classList.remove(DacTabBar.selectedClass);
      this.prevSelectedTab = undefined;
    }
  }
}