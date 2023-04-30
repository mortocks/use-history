import { debounce } from 'lodash';
import { useCallback, useReducer } from 'react';

import {
  ActionType,
  type State,
  type UndoActions,
  type UndoOptions,
} from '../types/example';

import { createDataFetchReducer } from './reducer';

const defaultOpts: UndoOptions = {
  maxHistory: undefined,
  debounceTime: 0,
};

const useUndo = <T>(
  initialPresent?: T,
  opts: Partial<UndoOptions> = {}
): [State<T>, UndoActions<T>] => {
  const options = {
    ...defaultOpts,
    ...opts,
  };

  const initialState: State<T> = {
    past: [],
    present: initialPresent,
    future: [],
    options,
  };

  const [state, dispatch] = useReducer(createDataFetchReducer<T>(), {
    ...initialState,
  });

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const undo = useCallback(() => {
    if (canUndo) {
      dispatch({ type: ActionType.Undo });
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      dispatch({ type: ActionType.Redo });
    }
  }, [canRedo]);

  const set = useCallback((newPresent: T, checkpoint = false) => {
    dispatch({
      type: ActionType.Set,
      newPresent,
      historyCheckpoint: checkpoint,
    });
  }, []);

  const setDebounced = useCallback(
    debounce((newPresent: T, checkpoint = false) => {
      dispatch({
        type: ActionType.Set,
        newPresent,
        historyCheckpoint: checkpoint,
      });
    }, 1000),
    []
  );

  const reset = useCallback(
    (newPresent: T) => dispatch({ type: ActionType.Reset, newPresent }),
    []
  );

  return [state, { set, setDebounced, reset, undo, redo, canUndo, canRedo }];
};

export default useUndo;
