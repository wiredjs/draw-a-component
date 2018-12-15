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

export interface ShapeProps {
  stroke: string;
  fill: string;
  strokeWidth: number;
}

export interface Shape {
  id: string;
  type: ToolType;
  points: Point[];
  props: ShapeProps;
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
  private currentProps: ShapeProps = {
    fill: 'transparent',
    stroke: '#000000',
    strokeWidth: 1
  };

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
        const index = this.indices.get(sid);
        if (typeof index !== 'undefined') {
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
      switch (v) {
        case 'line':
        case 'pencil':
          this.fill = 'transparent';
          if (this.stroke === 'transparent' || this.stroke === 'rgba(0,0,0,0)') {
            this.stroke = '#000000';
          }
          break;
        default:
          break;
      }
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

  get fill(): string {
    return this.currentProps.fill;
  }

  set fill(v: string) {
    if (this.currentProps.fill !== v) {
      this.currentProps.fill = v;
      this.onStylePropsChange();
    }
  }

  get stroke(): string {
    return this.currentProps.stroke;
  }

  set stroke(v: string) {
    if (this.currentProps.stroke !== v) {
      this.currentProps.stroke = v;
      this.onStylePropsChange();
    }
  }

  get strokeWidth(): number {
    return this.currentProps.strokeWidth;
  }

  set strokeWidth(v: number) {
    if (this.currentProps.strokeWidth !== v) {
      this.currentProps.strokeWidth = v;
      this.onStylePropsChange();
    }
  }

  private onStylePropsChange() {
    bus.dispatch('style-props');
  }

  currentSketchProps(): ShapeProps {
    return {
      fill: this.fill,
      stroke: this.stroke,
      strokeWidth: this.currentProps.strokeWidth
    };
  }
}

export const model = new VectorModel();