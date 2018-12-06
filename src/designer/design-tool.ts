import { Tool, ToolType } from './designer-common';

export class ToolManager {
  private tools: Tool[] = [];
  private toolMap: Map<string, Tool> = new Map();

  initialize(tools: Tool[]) {
    this.tools = [...tools];
    this.toolMap.clear();
    this.tools.forEach((d) => {
      this.toolMap.set(d.type, d);
    });
  }

  get list(): Tool[] {
    return this.tools;
  }

  byType(type: ToolType): Tool {
    return this.toolMap.get(type)!;
  }
}
export const toolManager = new ToolManager();


// this.tools.push(new Selector());
// this.tools.push(new Pencil());
// this.tools.push(new Rectangle());
// this.tools.push(new Ellipse());
// this.tools.push(new Line());