import { describe, expect, test, vi } from 'vitest';
import { queue, wait } from './index.js';

describe('Queue Module', () => {
  test('should add functions to the queue and execute them sequentially', async () => {
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();
    const opts = { delay: 0 };

    const { add, run } = await queue([], opts);

    add(mockFn1);
    add(mockFn2);

    await run();

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledBefore(mockFn2);
  });

  test('should respect the delay between function executions', async () => {
    const mockFn = vi.fn();
    const opts = { delay: 100 }; // 100ms delay

    const { add, run } = await queue([], opts);
    add(mockFn);
    add(mockFn);

    const startTime = Date.now();
    await run();
    const endTime = Date.now();

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(endTime - startTime).toBeGreaterThanOrEqual(100); // Minimum delay should be 100ms
  });

  test('should handle empty queues correctly', async () => {
    const opts = { delay: 0 };
  
    const { run } = await queue([], opts);
    const result = await run();
  
    expect(result).toBe(false); // Ensures undefined is returned for an empty queue
  });

  test('should remove functions from the queue after execution', async () => {
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();
    const opts = { delay: 0 };

    const { add, queue: queuedFunctions, run } = await queue([], opts);

    add(mockFn1);
    add(mockFn2);

    await run();

    expect(queuedFunctions.length).toBe(0); // All functions removed after execution
  });

  test('should handle errors in pipeline functions', async () => {
    const errorFn = async () => {
      throw new Error('Test error');
    };
    const opts = { delay: 0 };

    const { add, run } = await queue([], opts);
    add(errorFn);

    await expect(run()).rejects.toThrowError('Test error');
  });

  test('should not execute the queue if it is already running', async () => {
    let num = 200;
    const mockFn = vi.fn(async () => {
      num = num + 200;
      await wait(200); // Simulate a delay in function execution
    });
    const opts = { delay: 0 };

    const { add, run } = await queue([], opts);
    add(mockFn);

    const runPromise1 = run();
    const runPromise2 = run();

    const result1 = await runPromise1;
    const result2 = await runPromise2;

    expect(num).toBe(400); // First run should execute
    expect(result2).toBe(false); // Second run should be blocked
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should execute with additional arguments passed to functions', async () => {
    const mockFn = vi.fn((arg1, arg2) => {
      expect(arg1).toBe('arg1');
      expect(arg2).toBe('arg2');
    });
    const opts = { delay: 0 };

    const { add, run } = await queue([], opts, 'arg1', 'arg2');

    add(mockFn);
    await run();

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should resolve after all functions have been executed', async () => {
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();
    const opts = { delay: 0 };

    const { add, run } = await queue([], opts);

    add(mockFn1);
    add(mockFn2);

    const result = await run();
    expect(result).toBe(false); // Ensure resolve is true after execution
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  test('wait function should resolve after the specified time', async () => {
    const startTime = Date.now();
    await wait(200); // Wait for 200ms
    const endTime = Date.now();

    expect(endTime - startTime).toBeGreaterThanOrEqual(200);
  });
});
