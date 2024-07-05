import type { State, WorkspaceOpts, WorkspaceType } from '../../types.js';
import type { FileContainer } from '../codebase/file/index.js';

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
function wait(
  func: Function,
  file: FileContainer,
  state: State,
  opts: WorkspaceOpts,
  workspace: WorkspaceType
) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await func(file, state, opts, workspace);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Executes the provided asynchronous function concurrently for each file in the list.
 * It waits for all invocations to complete and returns their combined results.
 *
 * @param func The function to execute asynchronously on each file.
 * @param files Array of file containers to be processed.
 * @param state The current state during processing.
 * @param opts The options provided for the workspace.
 * @param workspace The current workspace context.
 * @returns A promise that resolves with an array of results from each function invocation.
 */
const invoke = async (
  func: Function,
  files: FileContainer[],
  state: State,
  opts: WorkspaceOpts,
  workspace: WorkspaceType
) => {
  const promises = files.map((file: FileContainer) =>
    wait(func, file, state, opts, workspace)
  );
  return Promise.all(promises);
};

/**
 * Sequentially processes each function in the pipeline for all the provided files.
 * This function iterates over each function in the pipeline and invokes it on the
 * provided files, accumulating results into the state object. The pipeline processing
 * completes when all functions have been invoked for all files.
 *
 * @param files Array of file containers to be processed.
 * @param pipeline Array of functions that form the processing pipeline.
 * @param opts The options provided for the workspace.
 * @param workspace The current workspace context.
 * @param resolve Callback function to signal the completion of processing.
 */
const promise = async (
  files: FileContainer[],
  pipeline: Function[],
  opts: WorkspaceOpts,
  workspace: WorkspaceType,
  resolve: Function
) => {
  const state: State = {};

  for (const func of pipeline) {
    const isFunction = typeof func === 'function';
    if (isFunction) {
      await invoke(func, files, state, opts, workspace);
    }
  }
  resolve();
};

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
  pipelineFunctions: Function[] | undefined,
  opts: WorkspaceOpts,
  workspace: WorkspaceType
) => {
  if (!pipelineFunctions || pipelineFunctions.length === 0) return false;

  return new Promise(async (resolve, reject) => {
    try {
      await promise(files, pipelineFunctions, opts, workspace, resolve);
    } catch (error) {
      reject(error);
    }
  });
};
