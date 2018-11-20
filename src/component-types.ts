export interface ComponentType {
  name: string;
  description: string;
}

export const supportedTypes: ComponentType[] = [
  { name: 'Container', description: `A simple container for other nodes. It's like a <div> element.` },
  { name: 'Button', description: 'Similar to a <button> element. Add a click handler to know when the button is pressed.' },
  { name: 'Textbox', description: 'A multi-line text input control. Similar to <textarea>.' },
  { name: 'Toggle', description: 'A component that has two states. It can be used as a toggle button, or as an indicator of true/false value.' },
  { name: 'slider', description: 'A slider component when you move the carat over a path. Values range from 0 to 100' },
  { name: 'progress', description: 'A progress indicator with values from 0-100' }
];