import { BaseElement, element } from '../base-element.js';
import UndoRedo from 'udrd';
import { Op, UndoableOp } from '../ops.js';

@element('undo-redo')
export class UndoRedoElement extends BaseElement {
  private readonly undoRedo = new UndoRedo<Op>();
  private canRedo = false;
  private canUndo = false;

  push(uop: UndoableOp) {
    this.undoRedo.push(uop.do, uop.undo);
    this.refreshCans();
  }

  undo() {
    const op = this.undoRedo.undo();
    if (op) {
      this.fireEvent('do-op', op);
      this.refreshCans();
    }
  }

  redo() {
    const op = this.undoRedo.redo();
    if (op) {
      this.fireEvent('do-op', op);
      this.refreshCans();
    }
  }

  private refreshCans() {
    let fire = false;
    if (this.canRedo !== this.undoRedo.canRedo()) {
      this.canRedo = !this.canRedo;
      fire = true;
    }
    if (this.canUndo !== this.undoRedo.canUndo()) {
      this.canUndo = !this.canUndo;
      fire = true;
    }
    if (fire) {
      this.fireEvent('undo-state-change', {
        canRedo: this.canRedo,
        canUndo: this.canUndo
      });
    }
  }
}