import type { State, WorkspaceOpts, WorkspaceType } from '../../types';
import type { FileContainer } from '../codebase/file';

function wait(func: Function, file: FileContainer, state: State, opts: WorkspaceOpts, workspace: WorkspaceType) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await func(file, state, opts, workspace);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

const invoke = async (
  func: Function,
  files: FileContainer[],
  state: State,
  opts: WorkspaceOpts,
  workspace: WorkspaceType
) => {
  const promises = files.map((file: FileContainer) => wait(func, file, state, opts, workspace));
  return Promise.all(promises);
};

const promise = async (
  files: FileContainer[],
  pipeline: Function[],
  opts: WorkspaceOpts,
  workspace: WorkspaceType,
  resolve: Function
) => {
  const state: State = {};

  for (const func of pipeline) {
    const isNotFunction = typeof func === 'function';
    if (isNotFunction) {
      await invoke(func, files, state, opts, workspace);
    }
  }
  resolve();
};

export const pipeline = async (
  files: FileContainer[],
  pipelineFunctions: Function[] | undefined,
  opts: WorkspaceOpts,
  workspace: WorkspaceType
) => {
  if (!pipelineFunctions) return false;

  return new Promise((resolve) => {
    promise(files, pipelineFunctions, opts, workspace, resolve);
  });
};
