import { readDirectory } from '@modular-rocks/traverse-files';
import runPipeline from './pipeline';

import type { FileContainerType, WorkspaceOpts } from '../types';

export default class Workspace {
  opts: WorkspaceOpts;

  constructor(opts: WorkspaceOpts) {
    this.defaultLoader(opts);
    this.opts = opts;
  }

  defaultLoader(opts: WorkspaceOpts) {
    if (!opts.files) {
      opts.files = readDirectory(opts);
    }
  }

  async pipeline(files: FileContainerType[], pipeline: Function[] | undefined, opts: WorkspaceOpts) {
    return runPipeline(files, pipeline, opts, this);
  }
}
