import { act, renderHook } from '@testing-library/react-hooks/native';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import useUndo from './use-undo';

beforeEach(async () => {
  vi.useFakeTimers();
});

afterEach(async () => {
  vi.clearAllTimers();
});

describe('useUndo basic functions', () => {
  test('initial value should set the present', () => {
    const { result } = renderHook(() => useUndo<number>(10));
    expect(result.current[0].present).toBe(10);
    expect(result.current[0].past).toStrictEqual([]);
    expect(result.current[0].future).toStrictEqual([]);
  });

  test('No initial value should be undefined', () => {
    const { result } = renderHook(() => useUndo<number>());
    expect(result.current[0].present).toStrictEqual(undefined);
  });

  test('set function should update present value', () => {
    const { result } = renderHook(() => useUndo<number>(5));
    act(() => {
      result.current[1].set(1);
    });
    expect(result.current[0].present).toBe(1);
  });

  test('multiple set function should update present value', () => {
    const { result } = renderHook(() => useUndo<number>(5));
    act(() => {
      result.current[1].set(1);
      result.current[1].set(2);
      result.current[1].set(3);
      vi.advanceTimersToNextTimer();
    });
    expect(result.current[0].present).toBe(3);
  });

  test('undo function should update past, present and future', () => {
    const { result } = renderHook(() => useUndo<number>(5));
    expect(result.current[1].canUndo).toBe(false);

    act(() => {
      result.current[1].set(100);
      result.current[1].set(200);
      result.current[1].set(300);
      vi.advanceTimersToNextTimer();
      vi.advanceTimersToNextTimer();
      vi.advanceTimersToNextTimer();
    });

    expect(result.current[1].canUndo).toBe(true);

    act(() => {
      result.current[1].undo();
    });
    expect(result.current[0].past).toStrictEqual([5, 100]);
    expect(result.current[0].present).toBe(200);
    expect(result.current[0].future).toStrictEqual([300]);
  });

  test('redo function should update present value', () => {
    const { result } = renderHook(() => useUndo<number>(5));
    expect(result.current[1].canRedo).toBe(false);

    act(() => {
      result.current[1].set(100);
      result.current[1].set(200);
      result.current[1].set(300);
      vi.advanceTimersToNextTimer();
    });
    act(() => {
      result.current[1].undo();
    });

    expect(result.current[1].canRedo).toBe(true);

    act(() => {
      result.current[1].redo();
    });

    expect(result.current[0].present).toBe(300);
  });

  test('limiting history should limit size of past', () => {
    const MAX = 5;
    const { result } = renderHook(() =>
      useUndo<number>(100, { maxHistory: MAX, debounceTime: 0 })
    );

    act(() => {
      result.current[1].set(1);
      result.current[1].set(2);
      result.current[1].set(3);
      result.current[1].set(4);
      result.current[1].set(5);
      result.current[1].set(6);
      result.current[1].set(7);
      result.current[1].set(8);
      result.current[1].set(9);
      result.current[1].set(10);
    });

    expect(result.current[0].present).toBe(10);
    expect(result.current[0].past.length).toBe(MAX);
    expect(result.current[0].past).toStrictEqual([5, 6, 7, 8, 9]);
  });

  test('resetting the history should clear past and future', () => {
    const { result } = renderHook(() => useUndo<number>(100));

    act(() => {
      result.current[1].set(1);
      result.current[1].set(2);
      result.current[1].set(3);
      result.current[1].set(4);
      result.current[1].set(5);
      result.current[1].set(6);
      result.current[1].set(7);
      result.current[1].set(8);
      result.current[1].set(9);
      result.current[1].set(10);
    });

    act(() => {
      result.current[1].reset(50);
    });

    expect(result.current[0].present).toBe(50);
    expect(result.current[0].past).toStrictEqual([]);
    expect(result.current[0].future).toStrictEqual([]);
  });
});

describe('useUndo basic debounce functions', () => {
  test('debounced set should be called after duration', () => {
    const { result } = renderHook(() =>
      useUndo<number>(100, { debounceTime: 1000 })
    );

    act(() => {
      result.current[1].setDebounced(50);
      result.current[1].setDebounced(50);
      result.current[1].setDebounced(50);
      expect(vi.getTimerCount()).toBe(1);
      expect(result.current[0].present).toBe(100);
    });
    vi.advanceTimersByTime(1000);

    expect(result.current[0].present).toBe(50);
  });
});
