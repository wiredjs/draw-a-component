export type Point = [number, number];

export function isSamePoint(p1: Point, p2: Point): boolean {
  return (p1[0] === p2[0] && p1[1] === p2[1]);
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