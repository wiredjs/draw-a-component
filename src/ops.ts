import { Shape } from './designer/design-tool';

export type OpType = 'add' | 'update' | 'delete';

export interface Op {
  type: OpType;
  shape: Shape;
}

export interface UndoableOp {
  do: Op;
  undo: Op;
}