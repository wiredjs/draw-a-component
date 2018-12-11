import { Point } from './geometry';
import { bus } from './bus';

export type ToolType = 'select' | 'pencil' | 'rectangle' | 'ellipse' | 'line';
export type OpType = 'add' | 'update' | 'delete' | 'visibility';

export interface Op {
  type: OpType;
  shapeId: string;
  data?: Shape | boolean;
}

export interface UndoableOp {
  do: Op;
  undo: Op;
}

export type PropType = 'string' | 'number' | 'boolean';
export type PropValueType = string | number | boolean;

export interface Prop {
  name: string;
  type: PropType;
  defaultValue: PropValueType;
  value?: PropValueType;
  css?: string;
}

export interface Shape {
  id: string;
  type: ToolType;
  points: Point[];
  properties?: Prop[];
}

export interface Layer {
  shape: Shape;
  visible: boolean;
  selected: boolean;
}

export function propValue<T extends PropType>(prop: Prop): T {
  if (typeof prop.value === 'undefined') {
    return prop.defaultValue as T;
  } else {
    return prop.value as T;
  }
}

export class VectorModel {
  private list: Layer[] = [];
  private map: Map<string, Layer> = new Map();
  private indices: Map<string, number> = new Map();
  private selectionId: string | null = null;
  private currentTool: ToolType = 'pencil';

  get layers(): Layer[] {
    return this.list;
  }

  op(o: Op, updateSelection: boolean) {
    let sid: string | null = o.shapeId;
    const data = o.data;
    switch (o.type) {
      case 'add': {
        const l: Layer = {
          selected: false,
          shape: data as Shape,
          visible: true
        };
        this.list.push(l);
        this.map.set(sid, l);
        this.indices.set(sid, this.list.length - 1);
        bus.dispatch('new-shape', l);
        break;
      }
      case 'delete': {
        this.selected = null;
        this.map.delete(sid);
        const index = this.indices.get('s.id');
        if (typeof index !== undefined) {
          this.indices.delete(sid);
          this.list.splice(index!, 1);
        }
        bus.dispatch('delete-shape', sid);
        sid = null;
        break;
      }
      case 'update': {
        if (this.map.has(sid)) {
          const s = data as Shape;
          this.map.get(sid)!.shape = s;
          this.list[this.indices.get(s.id)!].shape = s;
          bus.dispatch('update-shape', s);
        }
        break;
      }
      case 'visibility': {
        if (this.map.has(sid)) {
          const l = this.map.get(sid)!;
          l.visible = data as boolean;
          sid = null;
          this.selected = null;
          bus.dispatch('layer-visibility', l);
        }
        break;
      }
      default:
        s: null;
        break;
    }
    if (sid && updateSelection && this.currentTool === 'select') {
      this.selected = sid;
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