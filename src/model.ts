import { Point } from './geometry';
import { bus } from './bus';

export type ToolType = 'select' | 'pencil' | 'rectangle' | 'ellipse' | 'line';
export type OpType = 'add' | 'update' | 'delete';

export interface Op {
  type: OpType;
  shape: Shape;
}

export interface UndoableOp {
  do: Op;
  undo: Op;
}

export interface Shape {
  id: string;
  type: ToolType;
  points: Point[];
  properties?: any;
}

export interface Layer {
  shape: Shape;
  visible: boolean;
  selected: boolean;
}

export class VectorModel {
  private list: Layer[] = [];
  private map: Map<string, Layer> = new Map();
  private indices: Map<string, number> = new Map();
  private selectionId: string | null = null;
  private currentTool: ToolType = 'pencil';

  op(o: Op, updateSelection: boolean) {
    let s: Shape | null = o.shape;
    switch (o.type) {
      case 'add': {
        const l: Layer = {
          selected: false,
          shape: s,
          visible: true
        };
        this.list.push(l);
        this.map.set(s.id, l);
        this.indices.set(s.id, this.list.length - 1);
        bus.dispatch('new-shape', l);
        break;
      }
      case 'delete': {
        this.selected = null;
        this.map.delete(s.id);
        const index = this.indices.get('s.id');
        if (typeof index !== undefined) {
          this.indices.delete(s.id);
          this.list.splice(index!, 1);
        }
        bus.dispatch('delete-shape', s.id);
        s = null;
        break;
      }
      case 'update': {
        if (this.map.has(s.id)) {
          this.map.get(s.id)!.shape = s;
          this.list[this.indices.get(s.id)!].shape = s;
          bus.dispatch('update-shape', s);
        }
        break;
      }
      default:
        s: null;
        break;
    }
    if (s && updateSelection && this.currentTool === 'select') {
      this.selected = s.id;
    }
  }

  layerById(id: string): Layer | null {
    return this.map.get(id || '') || null;
  }

  get toolType(): ToolType {
    return this.currentTool;
  }

  set toolType(v: ToolType) {
    if (this.currentTool !== v) {
      this.currentTool = v;
      this.selected = null;
      bus.dispatch('tool-select', { type: v });
    }
  }

  get selected(): string | null {
    return this.selectionId;
  }

  set selected(id: string | null) {
    if (this.selectionId !== id) {
      if (this.selectionId && this.map.has(this.selectionId)) {
        this.map.get(this.selectionId)!.selected = false;
      }
      if (id && this.map.has(id)) {
        this.selectionId = id;
      } else {
        this.selectionId = null;
      }
      if (this.selectionId) {
        this.map.get(this.selectionId)!.selected = true;
      }
      bus.dispatch('select', {
        id: this.selectionId,
        layer: this.selectionId && this.map.get(this.selectionId)
      });
    }
  }
}

export const model = new VectorModel();