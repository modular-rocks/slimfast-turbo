import { Codebase, Workspace } from '@modular-rocks/workspace';

import type { Codebase as CodebaseType } from '@modular-rocks/workspace';
import type {
  CodebaseOpts,
  Options,
} from '@modular-rocks/workspace/dist/types/types';

export class SlimFast extends Workspace {
  original: CodebaseType;

  refactored: CodebaseType;

  constructor(opts: CodebaseOpts) {
    super(opts);
    this.original = this.newCodeBase(opts);
    this.refactored = this.newCodeBase(opts);
  }

  newCodeBase(opts: CodebaseOpts) {
    return new Codebase(opts);
  }

  defaultOptions(opts: Options) {
    const pipeline: Function[] = opts.pipeline || [];
    this.opts = {
      ...opts,
      pipeline,
    };
    return this.opts;
  }

  async run() {
    const opts = this.defaultOptions(this.opts);
    const files = this.refactored.extractFiles();
    await this.pipeline(files, opts.pipeline, opts);
  }

  async save() {
    await this.refactored.save();
  }
}
