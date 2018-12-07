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