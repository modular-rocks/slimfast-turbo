import { readJSONFile } from '@modular-rocks/traverse-files';
import { Workspace as WorkspaceBase } from '@modular-rocks/workspace';

import type { WorkspaceOpts } from '../types';

export class Workspace extends WorkspaceBase {
  constructor(opts: WorkspaceOpts) {
    super(opts);
  }

  defaultLoader(opts: WorkspaceOpts) {
    super.defaultLoader(opts);
    if (!opts.packageContents && opts.packagePath) {
      opts.packageContents = readJSONFile(opts.packagePath);
    }
  }
}
