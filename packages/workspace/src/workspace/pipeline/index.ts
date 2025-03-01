import type {
  PossiblyAsyncFunc,
  State,
  WorkspaceOpts,
  WorkspaceType,
} from '../../types.js';
import type { FileContainer } from '../codebase/file/index.js';
import { queue } from '../queue/index.js';

// TODO: add examples to the jsdoc comments

/**
 * Wraps a provided asynchronous function in a promise, ensuring that the function's
 * execution can be awaited. If the function throws an error during its execution,
 * the error is passed to the promise's rejection handler.
 *
 * @param func The function to execute asynchronously.
 * @param file The file container being processed.
 * @param state The current state during processing.
 * @param opts The options provided for the workspace.
 * @param workspace The current workspace context.
 * @returns A promise that resolves with the result of the function or rejects with an error.
 */
async function callAsyncFunction<T>(
  func: PossiblyAsyncFunc<T>,
  file: FileContainer,
  state: State,
  opts: WorkspaceOpts,
  workspace: WorkspaceType
): Promise<T> {
  return func(file, state, opts, workspace);
}

/**
 * Initiates the processing of a given set of files through a defined pipeline of functions.
 * If the pipeline functions are not provided, the function returns false immediately.
 * Otherwise, it processes the files through the pipeline, ensuring all pipeline functions
 * are executed for each file. The function returns a promise which resolves once all the
 * pipeline functions have been executed for all the files.
 *
 * @param files Array of file containers to be processed.
 * @param pipelineFunctions Array of functions that form the processing pipeline. If undefined, the function returns false.
 * @param opts Configuration options for the workspace.
 * @param workspace The current workspace context in which the files are being processed.
 * @returns A promise that resolves once the files have been processed or false if pipelineFunctions is undefined.
 */
export const pipeline = async (
  files: FileContainer[],
  pipelineFunctions: PossiblyAsyncFunc<unknown>[],
  opts: WorkspaceOpts,
  workspace: WorkspaceType
): Promise<{ isRunning: boolean }> => {
  const funcs = pipelineFunctions.map((func: PossiblyAsyncFunc<unknown>) => {
    return async (
      files: FileContainer[],
      opts: WorkspaceOpts,
      workspace: WorkspaceType,
      state: State
    ) => {
      return Promise.all(
        files.map((file) =>
          callAsyncFunction(func, file, state, opts, workspace)
        )
      );
    };
  });

  return new Promise(async (resolve, reject) => {
    try {
      const { run } = await queue(funcs, {}, files, opts, workspace);
      const { isRunning } = await run();
      resolve({ isRunning });
    } catch (error) {
      reject(error);
    }
  });
};
