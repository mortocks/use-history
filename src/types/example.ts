/**
 * If you import a dependency which does not include its own type definitions,
 * TypeScript will try to find a definition for it by following the `typeRoots`
 * compiler option in tsconfig.json. For this project, we've configured it to
 * fall back to this folder if nothing is found in node_modules/@types.
 *
 * Often, you can install the DefinitelyTyped
 * (https://github.com/DefinitelyTyped/DefinitelyTyped) type definition for the
 * dependency in question. However, if no one has yet contributed definitions
 * for the package, you may want to declare your own. (If you're using the
 * `noImplicitAny` compiler options, you'll be required to declare it.)
 *
 * This is an example type definition which allows import from `module-name`,
 * e.g.:
 * ```ts
 * import something from 'module-name';
 * something();
 * ```
 */

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
  maxHistory: number;
  debounceTime: number;
};

export interface State<T> {
  readonly past: readonly T[];
  readonly present: T;
  readonly future: readonly T[];
  readonly options: UndoOptions;
}
