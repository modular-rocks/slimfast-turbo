import { readDirectory } from '@modular-rocks/traverse-files';
import runPipeline from './pipeline';

import type { WorkspaceOpts } from '../types';
import type FileContainer from './codebase/file';

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

  async pipeline(files: FileContainer[], pipeline: Function[] | undefined, opts: WorkspaceOpts) {
    return runPipeline(files, pipeline, opts, this);
  }
}
