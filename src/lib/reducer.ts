import { type Action, ActionType, type State } from '../types/example';

export const createDataFetchReducer =
  <T>() =>
  (state: State<T>, action: Action<T>): State<T> => {
    const { past, present, future, options } = state;

    switch (action.type) {
      case ActionType.Undo: {
        if (past.length === 0) {
          return state;
        }

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        return {
          ...state,
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      }

      case ActionType.Redo: {
        if (future.length === 0) {
          return state;
        }
        const next = future[0];
        const newFuture = future.slice(1);

        return {
          ...state,
          past: [...past, present],
          present: next,
          future: newFuture,
        };
      }

      case ActionType.Set: {
        const { newPresent } = action;
        //console.log('SET', options);

        if (newPresent === present) {
          return state;
        }

        //console.log('Pre', past, present, newPresent);

        // Limit history length if maxHistory is set
        const newPast =
          options.maxHistory && past.length >= options.maxHistory
            ? [
                ...past.slice(
                  past.length - (options.maxHistory - 1),
                  options.maxHistory + 1
                ),
                present,
              ]
            : [...past, present];

        return {
          ...state,
          past: newPast,
          present: newPresent,
          future: [],
        };
      }

      case ActionType.Reset: {
        const { newPresent } = action;

        return {
          ...state,
          past: [],
          present: newPresent,
          future: [],
        };
      }

      default:
        return state;
    }
  };
