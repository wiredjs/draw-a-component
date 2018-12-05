export function debounce(func: Function, wait: number, immediate: boolean, context: any): EventListener {
  let timeout: number = 0;
  return () => {
    const args = arguments;
    const later = () => {
      timeout = 0;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

export function newId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;
}

export declare type AttributeMap = { [name: string]: string };

export function svgNode(name: string, attrs?: AttributeMap): SVGElement {
  const node = document.createElementNS('http://www.w3.org/2000/svg', name);
  if (attrs) {
    for (const name in attrs) {
      node.setAttribute(name, attrs[name]);
    }
  }
  return node;
}