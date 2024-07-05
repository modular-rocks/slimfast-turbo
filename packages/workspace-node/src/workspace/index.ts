import { readJSONFile } from '@modular-rocks/traverse-files';
import { Workspace as WorkspaceBase } from '@modular-rocks/workspace';

import type { WorkspaceOpts } from '../types.js';

export class Workspace extends WorkspaceBase {
  constructor(opts: WorkspaceOpts) {
    super(opts);
  }

  async defaultLoader(opts: WorkspaceOpts) {
    await super.defaultLoader(opts);
    if (!opts.packageContents && opts.packagePath) {
      opts.packageContents = await readJSONFile(opts.packagePath);
    }
  }
}
