import { LitElement } from '@polymer/lit-element/lit-element.js';
export { html } from '@polymer/lit-element/lit-element.js';
export { TemplateResult } from 'lit-html/lit-html.js';
export { property } from '@polymer/lit-element/lib/decorators';
import { customElement } from '@polymer/lit-element/lib/decorators';

export class BaseElement extends LitElement {
  $(id: string): HTMLElement {
    return this.shadowRoot!.querySelector(`#${id}`) as HTMLElement;
  }
  $$(selector: string): HTMLElement {
    return this.shadowRoot!.querySelector(selector) as HTMLElement;
  }
  fireEvent(name: string, detail?: any, bubbles: boolean = true, composed: boolean = true) {
    if (name) {
      const init: any = {
        bubbles: (typeof bubbles === 'boolean') ? bubbles : true,
        composed: (typeof composed === 'boolean') ? composed : true
      };
      if (detail) {
        init.detail = detail;
      }
      this.dispatchEvent(new CustomEvent(name, init));
    }
  }
}

export function element(name: string) {
  return customElement(name as any);
}