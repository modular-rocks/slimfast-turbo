import type { State } from '../../types.js';

type Opts = {
  delay?: number;
  queued?: boolean;
};

/**
 * Waits for a specified amount of time before resolving the promise.
 *
 * @param ms The number of milliseconds to wait before resolving the promise.
 * @returns A promise that resolves after the specified amount of time.
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Processes a queue of functions sequentially, applying optional delays between executions.
 * Each function is executed with the provided arguments and removed from the queue once processed.
 *
 * @param queue Array of functions to process.
 * @param remove Function to remove a completed function from the queue.
 * @param opts Configuration options for queue processing (e.g., delay).
 * @param resolve Callback to signal completion of processing.
 * @param args Additional arguments to pass to each function.
 */
const promise = async (
  queue: Function[],
  remove: Function,
  opts: Opts,
  resolve: Function,
  ...args: any[]
) => {
  const state: State = {};

  for (let index = 0; index < queue.length; index++) {
    const func = queue[index];
    if (typeof func === 'function') {
      await func(...[...args, state]);
      if (opts.delay) await wait(opts.delay);
      index = remove(index);
    }
  }
  resolve();
};

/**
 * Manages a queue of asynchronous functions, allowing dynamic additions and sequential execution.
 *
 * @param queuedFunctions Initial set of functions to include in the queue. Defaults to an empty array.
 * @param opts Configuration options for processing, such as delay between function executions.
 * @param args Additional arguments passed to each function in the queue.
 * @returns An object with methods to manage and execute the queue.
 */
export const queue = async (
  queuedFunctions: Function[],
  opts: Opts,
  ...args: any[]
) => {
  let running = false;

  const add = (func: Function) => {
    queuedFunctions.push(func);
    return queue;
  };

  const remove = (index: number) => {
    queuedFunctions.splice(index, 1);
    return index - 1;
  };

  const run = async () => {
    if (running) return false; // Prevent simultaneous runs
    if (queuedFunctions.length === 0) return false; // Handle empty queue

    running = true;
    try {
      await new Promise(async (resolve, reject) => {
        try {
          await promise(queuedFunctions, remove, opts, resolve, ...args);
        } catch (error) {
          reject(error);
        }
      });
    } finally {
      running = false;
    }
    return running;
  };

  return {
    queue: queuedFunctions,
    add,
    run,
  };
};
