// import { BaseElement, html, element, property } from '../../base-element.js';
// import { Prop } from '../../model';
// import { flexStyles } from '../../flex-styles.js';

// @element('prop-item')
// export class PropertyItem extends BaseElement {
//   @property() prop?: Prop;
//   @property() sid?: string;

//   render() {
//     if (!this.prop) return html``;
//     return html`
//     ${flexStyles}
//     <style>
//       :host {
//         display: block;
//         padding: 3px 0;
//       }
//       label {
//         width: 130px;
//         box-sizing: border-box;
//         overflow: hidden;
//         text-overflow: ellipsis;
//         font-size: 13px;
//         padding: 0 8px 0 0;
//         letter-spacing: 0.05em;
//       }
//       input {
//         background: none;
//         border: 1px solid #f0f0f0;
//         color: white;
//         padding: 3px 4px;
//         font-size: 11px;
//         font-family: monospace;
//         outline: none;
//         width: 100%;
//         display: block;
//         box-sizing: border-box;
//       }
//       input:focus {
//         border-color: var(--highlight-blue);
//       }
//     </style>
//     <div class="container horizontal layout center">
//       <label>${this.prop.name}</label>
//       <div class="flex">
//         <input type="${this.prop.type === 'number' ? 'number' : 'text'}">
//       </div>
//     </div>
//     `;
//   }
// }