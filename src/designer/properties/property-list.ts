// import { BaseElement, html, element } from '../../base-element.js';
// import { repeat } from 'lit-html/directives/repeat';
// import './property-item';

// @element('property-list')
// export class PropertyList extends BaseElement {
//   render() {
//     const props: Prop[] = [
//       { name: 'fill', defaultValue: 'transparent', type: 'string' },
//       { name: 'stroke', defaultValue: 'transparent', type: 'string' },
//       { name: 'strokeWidth', defaultValue: 'transparent', type: 'number' }
//     ];
//     return html`
//     <style>
//       :host {
//         display: block;
//         color: white;
//         padding: 8px;
//       }
//     </style>
//     ${repeat(
//         props,
//         (p) => p.name,
//         (p) => html`<prop-item .prop="${p}" .sid="shapeid"></prop-item>`
//       )}
//     `;
//   }
// }