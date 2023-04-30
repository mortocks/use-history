export const enum ActionType {
  Undo = 'UNDO',
  Redo = 'REDO',
  Set = 'SET',
  Reset = 'RESET',
}
export interface UndoActions<T> {
  readonly set: (newPresent: T, checkpoint?: boolean) => void;
  readonly setDebounced: (newPresent: T, checkpoint?: boolean) => void;
  readonly reset: (newPresent: T) => void;
  readonly undo: () => void;
  readonly redo: () => void;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
}
export interface Action<T> {
  readonly type: ActionType;
  readonly historyCheckpoint?: boolean;
  readonly newPresent?: T;
}

export type UndoOptions = {
  useCheckpoints?: boolean;
  maxHistory: number | undefined;
  debounceTime: number;
};
export interface State<T> {
  readonly past: readonly (T | undefined)[];
  readonly present: T | undefined;
  readonly future: readonly (T | undefined)[];
  readonly options: UndoOptions;
}
